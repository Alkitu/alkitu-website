'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect } from 'react';
import {
    Clock, PerspectiveCamera, Scene, WebGLRenderer,
    WebGLRendererParameters, SRGBColorSpace, MathUtils,
    Vector2, Vector3, MeshPhysicalMaterial, ShaderChunk,
    Color, Object3D, InstancedMesh, PMREMGenerator,
    SphereGeometry, AmbientLight, PointLight,
    ACESFilmicToneMapping, Raycaster, Plane
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { cn } from '~/lib/utils';
import './ballpit.css';

/* ═══════════════════════════════════════════════════════════ */
/*  ThreeApp — Core rendering pipeline                        */
/* ═══════════════════════════════════════════════════════════ */

interface ThreeAppConfig {
    canvas?: HTMLCanvasElement;
    id?: string;
    rendererOptions?: Partial<WebGLRendererParameters>;
    size?: 'parent' | { width: number; height: number };
}

interface SizeData {
    width: number; height: number;
    wWidth: number; wHeight: number;
    ratio: number; pixelRatio: number;
}

class ThreeApp {
    #config: ThreeAppConfig;
    #resizeObserver?: ResizeObserver;
    #intersectionObserver?: IntersectionObserver;
    #resizeTimer?: number;
    #animId = 0;
    #clock = new Clock();
    #time = { elapsed: 0, delta: 0 };
    #running = false;
    #visible = false;

    canvas!: HTMLCanvasElement;
    camera!: PerspectiveCamera;
    cameraFov!: number;
    cameraMaxAspect?: number;
    scene!: Scene;
    renderer!: WebGLRenderer;
    size: SizeData = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };

    onBeforeRender: (t: { elapsed: number; delta: number }) => void = () => { };
    onAfterResize: (s: SizeData) => void = () => { };
    isDisposed = false;

    constructor(config: ThreeAppConfig) {
        this.#config = { ...config };
        this.camera = new PerspectiveCamera();
        this.cameraFov = this.camera.fov;
        this.scene = new Scene();

        if (config.canvas) {
            this.canvas = config.canvas;
        } else if (config.id) {
            const el = document.getElementById(config.id);
            if (el instanceof HTMLCanvasElement) this.canvas = el;
        }
        this.canvas.style.display = 'block';

        this.renderer = new WebGLRenderer({
            canvas: this.canvas,
            powerPreference: 'high-performance',
            ...(config.rendererOptions ?? {})
        });
        this.renderer.outputColorSpace = SRGBColorSpace;
        this.resize();
        this.#initObservers();
    }

    #initObservers() {
        const cfg = this.#config;
        if (!(cfg.size instanceof Object)) {
            window.addEventListener('resize', this.#onResize);
            if (cfg.size === 'parent' && this.canvas.parentNode) {
                this.#resizeObserver = new ResizeObserver(this.#onResize);
                this.#resizeObserver.observe(this.canvas.parentNode as Element);
            }
        }
        this.#intersectionObserver = new IntersectionObserver(entries => {
            const vis = entries[0].isIntersecting;
            vis ? this.#start() : this.#stop();
        }, { threshold: 0 });
        this.#intersectionObserver.observe(this.canvas);
        document.addEventListener('visibilitychange', this.#onVisibility);
    }

    #onResize = () => {
        if (this.#resizeTimer) clearTimeout(this.#resizeTimer);
        this.#resizeTimer = window.setTimeout(() => this.resize(), 100) as unknown as number;
    };

    #onVisibility = () => {
        if (this.#visible) { document.hidden ? this.#stop() : this.#start(); }
    };

    resize() {
        const cfg = this.#config;
        let w: number, h: number;
        if (cfg.size instanceof Object) { w = cfg.size.width; h = cfg.size.height; }
        else if (cfg.size === 'parent' && this.canvas.parentNode) {
            w = (this.canvas.parentNode as HTMLElement).offsetWidth;
            h = (this.canvas.parentNode as HTMLElement).offsetHeight;
        } else { w = window.innerWidth; h = window.innerHeight; }

        this.size.width = w; this.size.height = h; this.size.ratio = w / h;
        this.camera.aspect = w / h;

        if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) {
            const t = Math.tan(MathUtils.degToRad(this.cameraFov / 2)) / (this.camera.aspect / this.cameraMaxAspect);
            this.camera.fov = 2 * MathUtils.radToDeg(Math.atan(t));
        } else { this.camera.fov = this.cameraFov; }

        this.camera.updateProjectionMatrix();
        this.updateWorldSize();
        this.renderer.setSize(w, h);
        let pr = window.devicePixelRatio;
        if (pr > 2) pr = 2;
        this.renderer.setPixelRatio(pr);
        this.size.pixelRatio = pr;
        this.onAfterResize(this.size);
    }

    updateWorldSize() {
        const fov = (this.camera.fov * Math.PI) / 180;
        this.size.wHeight = 2 * Math.tan(fov / 2) * this.camera.position.length();
        this.size.wWidth = this.size.wHeight * this.camera.aspect;
    }

    #start() {
        if (this.#running) return;
        this.#running = true;
        this.#visible = true;
        this.#clock.start();
        const loop = () => {
            this.#animId = requestAnimationFrame(loop);
            this.#time.delta = this.#clock.getDelta();
            this.#time.elapsed += this.#time.delta;
            this.onBeforeRender(this.#time);
            this.renderer.render(this.scene, this.camera);
        };
        loop();
    }

    #stop() {
        if (this.#running) {
            cancelAnimationFrame(this.#animId);
            this.#running = false;
            this.#visible = false;
            this.#clock.stop();
        }
    }

    clear() {
        this.scene.traverse((o: any) => {
            if (o.isMesh && o.material) {
                if (typeof o.material === 'object') {
                    Object.keys(o.material).forEach((k: string) => {
                        const v = o.material[k];
                        if (v && typeof v === 'object' && typeof v.dispose === 'function') v.dispose();
                    });
                }
                o.material.dispose?.();
                o.geometry.dispose?.();
            }
        });
        this.scene.clear();
    }

    dispose() {
        window.removeEventListener('resize', this.#onResize);
        this.#resizeObserver?.disconnect();
        this.#intersectionObserver?.disconnect();
        document.removeEventListener('visibilitychange', this.#onVisibility);
        this.#stop();
        this.clear();
        this.renderer.dispose();
        this.isDisposed = true;
    }
}

/* ═══════════════════════════════════════════════════════════ */
/*  Pointer system                                            */
/* ═══════════════════════════════════════════════════════════ */

interface PointerData {
    position: Vector2; nPosition: Vector2;
    hover: boolean; touching: boolean;
    onMove: (d: PointerData) => void;
    onLeave: (d: PointerData) => void;
    dispose?: () => void;
}

let ptrActive = false;
const ptrPos = new Vector2();
const ptrMap = new Map<HTMLElement, PointerData>();

function createPointer(opts: { domElement: HTMLElement; onMove: (d: PointerData) => void; onLeave: (d: PointerData) => void }): PointerData {
    const data: PointerData = {
        position: new Vector2(), nPosition: new Vector2(),
        hover: false, touching: false,
        onMove: opts.onMove, onLeave: opts.onLeave
    };
    ptrMap.set(opts.domElement, data);

    if (!ptrActive) {
        const onPM = (e: PointerEvent) => { ptrPos.set(e.clientX, e.clientY); processPtr(); };
        const onPL = () => { for (const d of ptrMap.values()) { if (d.hover) { d.hover = false; d.onLeave(d); } } };
        const onTS = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                e.preventDefault();
                ptrPos.set(e.touches[0].clientX, e.touches[0].clientY);
                for (const [el, d] of ptrMap) {
                    const r = el.getBoundingClientRect();
                    if (inside(r)) { d.touching = true; updatePD(d, r); if (!d.hover) d.hover = true; d.onMove(d); }
                }
            }
        };
        const onTM = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                e.preventDefault();
                ptrPos.set(e.touches[0].clientX, e.touches[0].clientY);
                for (const [el, d] of ptrMap) {
                    const r = el.getBoundingClientRect();
                    updatePD(d, r);
                    if (inside(r)) { if (!d.hover) { d.hover = true; d.touching = true; } d.onMove(d); }
                    else if (d.hover && d.touching) { d.onMove(d); }
                }
            }
        };
        const onTE = () => { for (const d of ptrMap.values()) { if (d.touching) { d.touching = false; if (d.hover) { d.hover = false; d.onLeave(d); } } } };

        document.body.addEventListener('pointermove', onPM as any);
        document.body.addEventListener('pointerleave', onPL as any);
        document.body.addEventListener('touchstart', onTS as any, { passive: false });
        document.body.addEventListener('touchmove', onTM as any, { passive: false });
        document.body.addEventListener('touchend', onTE as any);
        document.body.addEventListener('touchcancel', onTE as any);
        ptrActive = true;
    }

    data.dispose = () => { ptrMap.delete(opts.domElement); };
    return data;
}

function processPtr() {
    for (const [el, d] of ptrMap) {
        const r = el.getBoundingClientRect();
        updatePD(d, r);
        if (inside(r)) { if (!d.hover) d.hover = true; d.onMove(d); }
        else if (d.hover && !d.touching) { d.hover = false; d.onLeave(d); }
    }
}

function updatePD(d: PointerData, r: DOMRect) {
    d.position.set(ptrPos.x - r.left, ptrPos.y - r.top);
    d.nPosition.set((d.position.x / r.width) * 2 - 1, (-d.position.y / r.height) * 2 + 1);
}

function inside(r: DOMRect) {
    return ptrPos.x >= r.left && ptrPos.x <= r.left + r.width && ptrPos.y >= r.top && ptrPos.y <= r.top + r.height;
}

/* ═══════════════════════════════════════════════════════════ */
/*  Physics                                                   */
/* ═══════════════════════════════════════════════════════════ */

interface PhysicsConfig {
    count: number; maxX: number; maxY: number; maxZ: number;
    maxSize: number; minSize: number; size0: number;
    gravity: number; friction: number; wallBounce: number; maxVelocity: number;
    controlSphere0?: boolean;
}

class BallPhysics {
    config: PhysicsConfig;
    positionData: Float32Array;
    velocityData: Float32Array;
    sizeData: Float32Array;
    center = new Vector3();

    constructor(config: PhysicsConfig) {
        this.config = config;
        this.positionData = new Float32Array(3 * config.count).fill(0);
        this.velocityData = new Float32Array(3 * config.count).fill(0);
        this.sizeData = new Float32Array(config.count).fill(1);
        this.center.toArray(this.positionData, 0);
        for (let i = 1; i < config.count; i++) {
            const s = 3 * i;
            this.positionData[s] = MathUtils.randFloatSpread(2 * config.maxX);
            this.positionData[s + 1] = MathUtils.randFloatSpread(2 * config.maxY);
            this.positionData[s + 2] = MathUtils.randFloatSpread(2 * config.maxZ);
        }
        this.setSizes();
    }

    setSizes() {
        this.sizeData[0] = this.config.size0;
        for (let i = 1; i < this.config.count; i++)
            this.sizeData[i] = MathUtils.randFloat(this.config.minSize, this.config.maxSize);
    }

    update(dt: { delta: number }) {
        const { config, center, positionData: pos, sizeData: sz, velocityData: vel } = this;
        let start = 0;
        if (config.controlSphere0) {
            start = 1;
            const v = new Vector3().fromArray(pos, 0);
            v.lerp(center, 0.1).toArray(pos, 0);
            new Vector3(0, 0, 0).toArray(vel, 0);
        }
        for (let i = start; i < config.count; i++) {
            const b = 3 * i;
            const p = new Vector3().fromArray(pos, b);
            const v = new Vector3().fromArray(vel, b);
            v.y -= dt.delta * config.gravity * sz[i];
            v.multiplyScalar(config.friction);
            v.clampLength(0, config.maxVelocity);
            p.add(v);
            p.toArray(pos, b); v.toArray(vel, b);
        }
        for (let i = start; i < config.count; i++) {
            const b = 3 * i;
            const p = new Vector3().fromArray(pos, b);
            const v = new Vector3().fromArray(vel, b);
            const r = sz[i];
            for (let j = i + 1; j < config.count; j++) {
                const ob = 3 * j;
                const op = new Vector3().fromArray(pos, ob);
                const ov = new Vector3().fromArray(vel, ob);
                const diff = new Vector3().copy(op).sub(p);
                const dist = diff.length(), sumR = r + sz[j];
                if (dist < sumR) {
                    const correction = diff.normalize().multiplyScalar(0.5 * (sumR - dist));
                    const vc = correction.clone().multiplyScalar(Math.max(v.length(), 1));
                    p.sub(correction); v.sub(vc);
                    p.toArray(pos, b); v.toArray(vel, b);
                    op.add(correction); ov.add(correction.clone().multiplyScalar(Math.max(ov.length(), 1)));
                    op.toArray(pos, ob); ov.toArray(vel, ob);
                }
            }
            if (config.controlSphere0) {
                const diff = new Vector3().copy(new Vector3().fromArray(pos, 0)).sub(p);
                const d = diff.length(), sr0 = r + sz[0];
                if (d < sr0) {
                    const c = diff.normalize().multiplyScalar(sr0 - d);
                    p.sub(c); v.sub(c.clone().multiplyScalar(Math.max(v.length(), 2)));
                }
            }
            if (Math.abs(p.x) + r > config.maxX) { p.x = Math.sign(p.x) * (config.maxX - r); v.x = -v.x * config.wallBounce; }
            if (config.gravity === 0) {
                if (Math.abs(p.y) + r > config.maxY) { p.y = Math.sign(p.y) * (config.maxY - r); v.y = -v.y * config.wallBounce; }
            } else if (p.y - r < -config.maxY) { p.y = -config.maxY + r; v.y = -v.y * config.wallBounce; }
            const maxB = Math.max(config.maxZ, config.maxSize);
            if (Math.abs(p.z) + r > maxB) { p.z = Math.sign(p.z) * (config.maxZ - r); v.z = -v.z * config.wallBounce; }
            p.toArray(pos, b); v.toArray(vel, b);
        }
    }
}

/* ═══════════════════════════════════════════════════════════ */
/*  SSS Material                                              */
/* ═══════════════════════════════════════════════════════════ */

class SSSMaterial extends MeshPhysicalMaterial {
    uniforms: Record<string, { value: number }> = {
        thicknessDistortion: { value: 0.1 }, thicknessAmbient: { value: 0 },
        thicknessAttenuation: { value: 0.1 }, thicknessPower: { value: 2 }, thicknessScale: { value: 10 }
    };
    onBeforeCompile2?: (s: any) => void;

    constructor(params: any) {
        super(params);
        this.defines = { USE_UV: '' };
        this.onBeforeCompile = (shader: any) => {
            Object.assign(shader.uniforms, this.uniforms);
            shader.fragmentShader = `
        uniform float thicknessPower;
        uniform float thicknessScale;
        uniform float thicknessDistortion;
        uniform float thicknessAmbient;
        uniform float thicknessAttenuation;
      ` + shader.fragmentShader;
            shader.fragmentShader = shader.fragmentShader.replace(
                'void main() {',
                `void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {
          vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));
          float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;
          #ifdef USE_COLOR
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * vColor.rgb;
          #else
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * diffuse;
          #endif
          reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;
        }
        void main() {`
            );
            const modified = ShaderChunk.lights_fragment_begin.replaceAll(
                'RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );',
                `RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
          RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);`
            );
            shader.fragmentShader = shader.fragmentShader.replace('#include <lights_fragment_begin>', modified);
            this.onBeforeCompile2?.(shader);
        };
    }
}

/* ═══════════════════════════════════════════════════════════ */
/*  BallpitMesh (InstancedMesh subclass)                      */
/* ═══════════════════════════════════════════════════════════ */

const dummy = new Object3D();

const DEFAULT_CONFIG = {
    count: 200, colors: [0, 0, 0] as number[],
    ambientColor: 0xffffff, ambientIntensity: 1, lightIntensity: 200,
    materialParams: { metalness: 0.5, roughness: 0.5, clearcoat: 1, clearcoatRoughness: 0.15 },
    minSize: 0.5, maxSize: 1, size0: 1,
    gravity: 0.5, friction: 0.9975, wallBounce: 0.95, maxVelocity: 0.15,
    maxX: 5, maxY: 5, maxZ: 2,
    controlSphere0: false, followCursor: true
};

class BallpitMesh extends InstancedMesh {
    config: typeof DEFAULT_CONFIG;
    physics: BallPhysics;
    ambientLight: AmbientLight;
    light: PointLight;

    constructor(renderer: WebGLRenderer, opts: Partial<typeof DEFAULT_CONFIG> = {}) {
        const cfg = { ...DEFAULT_CONFIG, ...opts };
        const roomEnv = new RoomEnvironment();
        const pmrem = new PMREMGenerator(renderer);
        const envTexture = pmrem.fromScene(roomEnv).texture;
        const geo = new SphereGeometry();
        const mat = new SSSMaterial({ envMap: envTexture, ...cfg.materialParams });
        mat.envMapRotation.x = -Math.PI / 2;
        super(geo, mat, cfg.count);
        this.config = cfg;
        this.physics = new BallPhysics(cfg);
        this.ambientLight = new AmbientLight(cfg.ambientColor, cfg.ambientIntensity);
        this.add(this.ambientLight);
        this.light = new PointLight(cfg.colors[0], cfg.lightIntensity);
        this.add(this.light);
        this.setColors(cfg.colors);
    }

    setColors(colors: number[]) {
        if (!Array.isArray(colors) || colors.length <= 1) return;
        const cols = colors.map(c => new Color(c));
        for (let i = 0; i < this.count; i++) {
            const ratio = Math.max(0, Math.min(1, i / this.count));
            const scaled = ratio * (cols.length - 1);
            const idx = Math.floor(scaled);
            const start = cols[idx];
            if (idx >= cols.length - 1) { this.setColorAt(i, start); }
            else {
                const a = scaled - idx;
                const end = cols[idx + 1];
                const out = new Color(
                    start.r + a * (end.r - start.r),
                    start.g + a * (end.g - start.g),
                    start.b + a * (end.b - start.b)
                );
                this.setColorAt(i, out);
            }
            if (i === 0) this.light.color.copy(cols[0]);
        }
        if (this.instanceColor) this.instanceColor.needsUpdate = true;
    }

    update(dt: { delta: number }) {
        this.physics.update(dt);
        for (let i = 0; i < this.count; i++) {
            dummy.position.fromArray(this.physics.positionData, 3 * i);
            if (i === 0 && this.config.followCursor === false) dummy.scale.setScalar(0);
            else dummy.scale.setScalar(this.physics.sizeData[i]);
            dummy.updateMatrix();
            this.setMatrixAt(i, dummy.matrix);
            if (i === 0) this.light.position.copy(dummy.position);
        }
        this.instanceMatrix.needsUpdate = true;
    }
}

/* ═══════════════════════════════════════════════════════════ */
/*  createBallpit factory                                     */
/* ═══════════════════════════════════════════════════════════ */

function createBallpit(canvas: HTMLCanvasElement, config: any = {}) {
    const app = new ThreeApp({ canvas, size: 'parent', rendererOptions: { antialias: true, alpha: true } });
    let spheres: BallpitMesh;
    app.renderer.toneMapping = ACESFilmicToneMapping;
    app.camera.position.set(0, 0, 20);
    app.camera.lookAt(0, 0, 0);
    app.cameraMaxAspect = 1.5;
    app.resize();

    function initialize(cfg: any) {
        if (spheres) { app.clear(); app.scene.remove(spheres); }
        spheres = new BallpitMesh(app.renderer, cfg);
        app.scene.add(spheres);
    }
    initialize(config);

    const raycaster = new Raycaster();
    const plane = new Plane(new Vector3(0, 0, 1), 0);
    const point = new Vector3();

    canvas.style.touchAction = 'none';
    canvas.style.userSelect = 'none';
    (canvas.style as any).webkitUserSelect = 'none';

    const pointer = createPointer({
        domElement: canvas,
        onMove() {
            raycaster.setFromCamera(pointer.nPosition, app.camera);
            app.camera.getWorldDirection(plane.normal);
            raycaster.ray.intersectPlane(plane, point);
            spheres.physics.center.copy(point);
            spheres.config.controlSphere0 = true;
        },
        onLeave() { spheres.config.controlSphere0 = false; }
    });

    app.onBeforeRender = dt => { spheres.update(dt); };
    app.onAfterResize = size => {
        spheres.config.maxX = size.wWidth / 2;
        spheres.config.maxY = size.wHeight / 2;
    };

    return {
        three: app,
        get spheres() { return spheres; },
        dispose() { pointer.dispose?.(); app.dispose(); }
    };
}

/* ═══════════════════════════════════════════════════════════ */
/*  React component                                           */
/* ═══════════════════════════════════════════════════════════ */

interface BallpitProps {
    className?: string;
    followCursor?: boolean;
    count?: number;
    colors?: number[];
    gravity?: number;
    friction?: number;
    wallBounce?: number;
    maxVelocity?: number;
    minSize?: number;
    maxSize?: number;
    size0?: number;
    materialParams?: { metalness?: number; roughness?: number; clearcoat?: number; clearcoatRoughness?: number };
    [key: string]: any;
}

const Ballpit: React.FC<BallpitProps> = ({ className = '', followCursor = true, ...props }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const instanceRef = useRef<ReturnType<typeof createBallpit> | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        instanceRef.current = createBallpit(canvas, { followCursor, ...props });
        return () => { instanceRef.current?.dispose(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <canvas className={cn('ballpit-canvas', className)} ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default Ballpit;
