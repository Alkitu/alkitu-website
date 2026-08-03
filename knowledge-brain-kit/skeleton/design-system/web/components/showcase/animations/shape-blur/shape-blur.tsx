import { useRef, useEffect } from "react";
import * as THREE from "three";
import { cn } from "~/lib/utils";

const vertexShader = /* glsl */ `
varying vec2 v_texcoord;
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    v_texcoord = uv;
}
`;

const fragmentShader = /* glsl */ `
varying vec2 v_texcoord;

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_pixelRatio;

uniform float u_shapeSize;
uniform float u_roundness;
uniform float u_borderSize;
uniform float u_circleSize;
uniform float u_circleEdge;

#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif
#ifndef TWO_PI
#define TWO_PI 6.2831853071795864769252867665590
#endif

#ifndef VAR
#define VAR 0
#endif

#ifndef FNC_COORD
#define FNC_COORD
vec2 coord(in vec2 p) {
    p = p / u_resolution.xy;
    if (u_resolution.x > u_resolution.y) {
        p.x *= u_resolution.x / u_resolution.y;
        p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
    } else {
        p.y *= u_resolution.y / u_resolution.x;
        p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
    }
    p -= 0.5;
    p *= vec2(-1.0, 1.0);
    return p;
}
#endif

#define st0 coord(gl_FragCoord.xy)
#define mx coord(u_mouse * u_pixelRatio)

float sdRoundRect(vec2 p, vec2 b, float r) {
    vec2 d = abs(p - 0.5) * 4.2 - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}
float sdCircle(in vec2 st, in vec2 center) {
    return length(st - center) * 2.0;
}
float sdPoly(in vec2 p, in float w, in int sides) {
    float a = atan(p.x, p.y) + PI;
    float r = TWO_PI / float(sides);
    float d = cos(floor(0.5 + a / r) * r - a) * length(max(abs(p) * 1.0, 0.0));
    return d * 2.0 - w;
}

float aastep(float threshold, float value) {
    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
    return smoothstep(threshold - afwidth, threshold + afwidth, value);
}
float fill(in float x) { return 1.0 - aastep(0.0, x); }
float fill(float x, float size, float edge) {
    return 1.0 - smoothstep(size - edge, size + edge, x);
}
float stroke(in float d, in float t) { return (1.0 - aastep(t, abs(d))); }
float stroke(float x, float size, float w, float edge) {
    float d = smoothstep(size - edge, size + edge, x + w * 0.5) - smoothstep(size - edge, size + edge, x - w * 0.5);
    return clamp(d, 0.0, 1.0);
}

float strokeAA(float x, float size, float w, float edge) {
    float afwidth = length(vec2(dFdx(x), dFdy(x))) * 0.70710678;
    float d = smoothstep(size - edge - afwidth, size + edge + afwidth, x + w * 0.5)
            - smoothstep(size - edge - afwidth, size + edge + afwidth, x - w * 0.5);
    return clamp(d, 0.0, 1.0);
}

void main() {
    vec2 st = st0 + 0.5;
    vec2 posMouse = mx * vec2(1., -1.) + 0.5;

    float size = u_shapeSize;
    float roundness = u_roundness;
    float borderSize = u_borderSize;
    float circleSize = u_circleSize;
    float circleEdge = u_circleEdge;

    // Inverse logic: we make the blurred overlay solid outside and transparent where mouse circle is.
    // The original logic outputs alpha based on sdf.
    // Wait, the original user code uses mix-blend-mode or backdrop-filter implicitly?
    // No, it just generates a mask with transparency, relying on external backdrop-filter to blur it?
    // Let's look at the usage: <ShapeBlur variation={0} />. 
    // It says "Shape Blur".
    
    float sdfCircle = fill(
        sdCircle(st, posMouse),
        circleSize,
        circleEdge
    );

    float sdf;
    if (VAR == 0) {
        sdf = sdRoundRect(st, vec2(size), roundness);
        sdf = strokeAA(sdf, 0.0, borderSize, sdfCircle) * 4.0;
    } else if (VAR == 1) {
        sdf = sdCircle(st, vec2(0.5));
        sdf = fill(sdf, 0.6, sdfCircle) * 1.2;
    } else if (VAR == 2) {
        sdf = sdCircle(st, vec2(0.5));
        sdf = strokeAA(sdf, 0.58, 0.02, sdfCircle) * 4.0;
    } else if (VAR == 3) {
        sdf = sdPoly(st - vec2(0.5, 0.45), 0.3, 3);
        sdf = fill(sdf, 0.05, sdfCircle) * 1.4;
    }

    vec3 color = vec3(1.0); // The user code hardcodes white color. We might want to pass it as uniform.
    float alpha = sdf;
    gl_FragColor = vec4(color.rgb, alpha);
}
`;

export interface ShapeBlurProps {
    className?: string;
    variation?: 0 | 1 | 2 | 3;
    pixelRatioProp?: number;
    shapeSize?: number;
    roundness?: number;
    borderSize?: number;
    circleSize?: number;
    circleEdge?: number;
}

export const ShapeBlur = ({
    className = "",
    variation = 0,
    pixelRatioProp = 2,
    shapeSize = 1.2,
    roundness = 0.4,
    borderSize = 0.05,
    circleSize = 0.3,
    circleEdge = 0.5,
}: ShapeBlurProps) => {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const mount = mountRef.current;
        let animationFrameId: number;
        let time = 0,
            lastTime = 0;

        const vMouse = new THREE.Vector2();
        const vMouseDamp = new THREE.Vector2();
        const vResolution = new THREE.Vector2();

        let w = 1, h = 1;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera();
        camera.position.z = 1;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setClearColor(0x000000, 0); // Transparent background

        // CSS properties to achieve the backdrop-blur effect on the webgl canvas itself (if needed)
        // Usually, the shape blur masks the backdrop blur, so we need to set the canvas style.
        // Wait, the WebGL is drawing a white shape. It doesn't blur stuff behind it by itself unless it uses backdrop-filter.
        // Actually, often in these components, they set CSS backdrop-filter and use the WebGL canvas as a mask (mask-image) 
        // or the webgl draws over a blurred background and acts like a cut-out... wait, gl_FragColor is vec4(1.0, 1.0, 1.0, alpha).
        // If we want it to actually blur shapes behind it, the component container usually has `backdrop-filter: blur(x)` and the canvas is used as a `mask-image`. Let's test standard React Bits behavior in the story.

        if (!mount) return;
        mount.appendChild(renderer.domElement);

        const geo = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                u_mouse: { value: vMouseDamp },
                u_resolution: { value: vResolution },
                u_pixelRatio: { value: pixelRatioProp },
                u_shapeSize: { value: shapeSize },
                u_roundness: { value: roundness },
                u_borderSize: { value: borderSize },
                u_circleSize: { value: circleSize },
                u_circleEdge: { value: circleEdge },
            },
            defines: { VAR: variation },
            transparent: true,
        });

        const quad = new THREE.Mesh(geo, material);
        scene.add(quad);

        const onPointerMove = (e: PointerEvent | MouseEvent) => {
            if (!mount) return;
            const rect = mount.getBoundingClientRect();
            vMouse.set(e.clientX - rect.left, e.clientY - rect.top);
        };

        const targetEl = mount.parentElement || document;

        targetEl.addEventListener("mousemove", onPointerMove as EventListener);
        targetEl.addEventListener("pointermove", onPointerMove as EventListener);

        const resize = () => {
            const container = mountRef.current;
            if (!container) return;
            w = container.clientWidth;
            h = container.clientHeight;
            const dpr = Math.min(window.devicePixelRatio, pixelRatioProp);

            renderer.setSize(w, h);
            renderer.setPixelRatio(dpr);

            camera.left = -w / 2;
            camera.right = w / 2;
            camera.top = h / 2;
            camera.bottom = -h / 2;
            camera.updateProjectionMatrix();

            quad.scale.set(w, h, 1);
            vResolution.set(w, h).multiplyScalar(dpr);
            material.uniforms.u_pixelRatio.value = dpr;
        };

        resize();
        window.addEventListener("resize", resize);

        const ro = new ResizeObserver(() => resize());
        if (mountRef.current) ro.observe(mountRef.current);

        const update = () => {
            time = performance.now() * 0.001;
            const dt = time - lastTime;
            lastTime = time;
            vMouseDamp.x = THREE.MathUtils.damp(vMouseDamp.x, vMouse.x, 8, dt);
            vMouseDamp.y = THREE.MathUtils.damp(vMouseDamp.y, vMouse.y, 8, dt);

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(update);
        };
        update();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resize);
            if (ro) ro.disconnect();
            targetEl.removeEventListener("mousemove", onPointerMove as EventListener);
            targetEl.removeEventListener("pointermove", onPointerMove as EventListener);
            if (mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [
        variation,
        pixelRatioProp,
        shapeSize,
        roundness,
        borderSize,
        circleSize,
        circleEdge,
    ]);

    return (
        <div
            className={cn("w-full h-full relative isolate", className)}
            ref={mountRef}
        />
    );
};

export default ShapeBlur;
