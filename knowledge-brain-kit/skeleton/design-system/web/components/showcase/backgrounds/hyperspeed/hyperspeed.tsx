'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BloomEffect, EffectComposer, EffectPass, RenderPass, SMAAEffect, SMAAPreset } from 'postprocessing';
import './hyperspeed.css';

/* ───────────────────────── default options ──────────────────────── */

const DEFAULT_EFFECT_OPTIONS = {
    onSpeedUp: () => { },
    onSlowDown: () => { },
    distortion: 'turbulentDistortion' as string,
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 4,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5] as [number, number],
    lightStickHeight: [1.3, 1.7] as [number, number],
    movingAwaySpeed: [60, 80] as [number, number],
    movingCloserSpeed: [-120, -160] as [number, number],
    carLightsLength: [400 * 0.03, 400 * 0.2] as [number, number],
    carLightsRadius: [0.05, 0.14] as [number, number],
    carWidthPercentage: [0.3, 0.5] as [number, number],
    carShiftX: [-0.8, 0.8] as [number, number],
    carFloorSeparation: [0, 5] as [number, number],
    colors: {
        roadColor: 0x080808,
        islandColor: 0x0a0a0a,
        background: 0x000000,
        shoulderLines: 0xffffff,
        brokenLines: 0xffffff,
        leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
        rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
        sticks: 0x03b3c3 as number | number[]
    }
};

export type HyperspeedOptions = typeof DEFAULT_EFFECT_OPTIONS;

/* ───────────────────── helper functions ──────────────────────── */

const random = (base: number | [number, number]): number => {
    if (Array.isArray(base)) return Math.random() * (base[1] - base[0]) + base[0];
    return Math.random() * base;
};

const pickRandom = (arr: any): any => {
    if (Array.isArray(arr)) return arr[Math.floor(Math.random() * arr.length)];
    return arr;
};

function lerp(current: number, target: number, speed = 0.1, limit = 0.001) {
    let change = (target - current) * speed;
    if (Math.abs(change) < limit) change = target - current;
    return change;
}

function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer, setSize: (w: number, h: number, b: boolean) => void) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) setSize(width, height, false);
    return needResize;
}

const nsin = (val: number) => Math.sin(val) * 0.5 + 0.5;

/* ────────────────────────── distortions ──────────────────────── */

function buildDistortions() {
    const mountainUniforms = { uFreq: { value: new THREE.Vector3(3, 6, 10) }, uAmp: { value: new THREE.Vector3(30, 30, 20) } };
    const xyUniforms = { uFreq: { value: new THREE.Vector2(5, 2) }, uAmp: { value: new THREE.Vector2(25, 15) } };
    const LongRaceUniforms = { uFreq: { value: new THREE.Vector2(2, 3) }, uAmp: { value: new THREE.Vector2(35, 10) } };
    const turbulentUniforms = { uFreq: { value: new THREE.Vector4(4, 8, 8, 1) }, uAmp: { value: new THREE.Vector4(25, 5, 10, 10) } };
    const deepUniforms = { uFreq: { value: new THREE.Vector2(4, 8) }, uAmp: { value: new THREE.Vector2(10, 20) }, uPowY: { value: new THREE.Vector2(20, 2) } };

    return {
        mountainDistortion: {
            uniforms: mountainUniforms,
            getDistortion: `uniform vec3 uAmp;uniform vec3 uFreq;
#define PI 3.14159265358979
float nsin(float val){return sin(val)*0.5+0.5;}
vec3 getDistortion(float progress){float movementProgressFix=0.02;return vec3(cos(progress*PI*uFreq.x+uTime)*uAmp.x-cos(movementProgressFix*PI*uFreq.x+uTime)*uAmp.x,nsin(progress*PI*uFreq.y+uTime)*uAmp.y-nsin(movementProgressFix*PI*uFreq.y+uTime)*uAmp.y,nsin(progress*PI*uFreq.z+uTime)*uAmp.z-nsin(movementProgressFix*PI*uFreq.z+uTime)*uAmp.z);}`,
            getJS: (progress: number, time: number) => {
                const uF = mountainUniforms.uFreq.value, uA = mountainUniforms.uAmp.value;
                const fix = 0.02;
                return new THREE.Vector3(
                    Math.cos(progress * Math.PI * uF.x + time) * uA.x - Math.cos(fix * Math.PI * uF.x + time) * uA.x,
                    nsin(progress * Math.PI * uF.y + time) * uA.y - nsin(fix * Math.PI * uF.y + time) * uA.y,
                    nsin(progress * Math.PI * uF.z + time) * uA.z - nsin(fix * Math.PI * uF.z + time) * uA.z
                ).multiply(new THREE.Vector3(2, 2, 2)).add(new THREE.Vector3(0, 0, -5));
            }
        },
        xyDistortion: {
            uniforms: xyUniforms,
            getDistortion: `uniform vec2 uFreq;uniform vec2 uAmp;
#define PI 3.14159265358979
vec3 getDistortion(float progress){float movementProgressFix=0.02;return vec3(cos(progress*PI*uFreq.x+uTime)*uAmp.x-cos(movementProgressFix*PI*uFreq.x+uTime)*uAmp.x,sin(progress*PI*uFreq.y+PI/2.+uTime)*uAmp.y-sin(movementProgressFix*PI*uFreq.y+PI/2.+uTime)*uAmp.y,0.);}`,
            getJS: (progress: number, time: number) => {
                const uF = xyUniforms.uFreq.value, uA = xyUniforms.uAmp.value, fix = 0.02;
                return new THREE.Vector3(
                    Math.cos(progress * Math.PI * uF.x + time) * uA.x - Math.cos(fix * Math.PI * uF.x + time) * uA.x,
                    Math.sin(progress * Math.PI * uF.y + time + Math.PI / 2) * uA.y - Math.sin(fix * Math.PI * uF.y + time + Math.PI / 2) * uA.y,
                    0
                ).multiply(new THREE.Vector3(2, 0.4, 1)).add(new THREE.Vector3(0, 0, -3));
            }
        },
        LongRaceDistortion: {
            uniforms: LongRaceUniforms,
            getDistortion: `uniform vec2 uFreq;uniform vec2 uAmp;
#define PI 3.14159265358979
vec3 getDistortion(float progress){float camProgress=0.0125;return vec3(sin(progress*PI*uFreq.x+uTime)*uAmp.x-sin(camProgress*PI*uFreq.x+uTime)*uAmp.x,sin(progress*PI*uFreq.y+uTime)*uAmp.y-sin(camProgress*PI*uFreq.y+uTime)*uAmp.y,0.);}`,
            getJS: (progress: number, time: number) => {
                const uF = LongRaceUniforms.uFreq.value, uA = LongRaceUniforms.uAmp.value, cp = 0.0125;
                return new THREE.Vector3(
                    Math.sin(progress * Math.PI * uF.x + time) * uA.x - Math.sin(cp * Math.PI * uF.x + time) * uA.x,
                    Math.sin(progress * Math.PI * uF.y + time) * uA.y - Math.sin(cp * Math.PI * uF.y + time) * uA.y,
                    0
                ).multiply(new THREE.Vector3(1, 1, 0)).add(new THREE.Vector3(0, 0, -5));
            }
        },
        turbulentDistortion: {
            uniforms: turbulentUniforms,
            getDistortion: `uniform vec4 uFreq;uniform vec4 uAmp;
float nsin(float val){return sin(val)*0.5+0.5;}
#define PI 3.14159265358979
float getDistortionX(float progress){return(cos(PI*progress*uFreq.r+uTime)*uAmp.r+pow(cos(PI*progress*uFreq.g+uTime*(uFreq.g/uFreq.r)),2.)*uAmp.g);}
float getDistortionY(float progress){return(-nsin(PI*progress*uFreq.b+uTime)*uAmp.b-pow(nsin(PI*progress*uFreq.a+uTime/(uFreq.b/uFreq.a)),5.)*uAmp.a);}
vec3 getDistortion(float progress){return vec3(getDistortionX(progress)-getDistortionX(0.0125),getDistortionY(progress)-getDistortionY(0.0125),0.);}`,
            getJS: (progress: number, time: number) => {
                const uF = turbulentUniforms.uFreq.value, uA = turbulentUniforms.uAmp.value;
                const getX = (p: number) => Math.cos(Math.PI * p * uF.x + time) * uA.x + Math.pow(Math.cos(Math.PI * p * uF.y + time * (uF.y / uF.x)), 2) * uA.y;
                const getY = (p: number) => -nsin(Math.PI * p * uF.z + time) * uA.z - Math.pow(nsin(Math.PI * p * uF.w + time / (uF.z / uF.w)), 5) * uA.w;
                return new THREE.Vector3(getX(progress) - getX(progress + 0.007), getY(progress) - getY(progress + 0.007), 0).multiply(new THREE.Vector3(-2, -5, 0)).add(new THREE.Vector3(0, 0, -10));
            }
        },
        deepDistortion: {
            uniforms: deepUniforms,
            getDistortion: `uniform vec4 uFreq;uniform vec4 uAmp;uniform vec2 uPowY;
float nsin(float val){return sin(val)*0.5+0.5;}
#define PI 3.14159265358979
float getDistortionX(float progress){return(sin(progress*PI*uFreq.x+uTime)*uAmp.x);}
float getDistortionY(float progress){return(pow(abs(progress*uPowY.x),uPowY.y)+sin(progress*PI*uFreq.y+uTime)*uAmp.y);}
vec3 getDistortion(float progress){return vec3(getDistortionX(progress)-getDistortionX(0.02),getDistortionY(progress)-getDistortionY(0.02),0.);}`,
            getJS: (progress: number, time: number) => {
                const uF = deepUniforms.uFreq.value, uA = deepUniforms.uAmp.value, uP = deepUniforms.uPowY.value;
                const getX = (p: number) => Math.sin(p * Math.PI * uF.x + time) * uA.x;
                const getY = (p: number) => Math.pow(p * uP.x, uP.y) + Math.sin(p * Math.PI * uF.y + time) * uA.y;
                return new THREE.Vector3(getX(progress) - getX(progress + 0.01), getY(progress) - getY(progress + 0.01), 0).multiply(new THREE.Vector3(-2, -4, 0)).add(new THREE.Vector3(0, 0, -10));
            }
        }
    };
}

/* ────────────────────────── shaders ──────────────────────── */

const carLightsFragment = `
#define USE_FOG;
${THREE.ShaderChunk['fog_pars_fragment']}
varying vec3 vColor;
varying vec2 vUv;
uniform vec2 uFade;
void main(){
  vec3 color=vec3(vColor);
  float alpha=smoothstep(uFade.x,uFade.y,vUv.x);
  gl_FragColor=vec4(color,alpha);
  if(gl_FragColor.a<0.0001)discard;
  ${THREE.ShaderChunk['fog_fragment']}
}`;

const carLightsVertex = `
#define USE_FOG;
${THREE.ShaderChunk['fog_pars_vertex']}
attribute vec3 aOffset;
attribute vec3 aMetrics;
attribute vec3 aColor;
uniform float uTravelLength;
uniform float uTime;
varying vec2 vUv;
varying vec3 vColor;
#include <getDistortion_vertex>
void main(){
  vec3 transformed=position.xyz;
  float radius=aMetrics.r;float myLength=aMetrics.g;float speed=aMetrics.b;
  transformed.xy*=radius;transformed.z*=myLength;
  transformed.z+=myLength-mod(uTime*speed+aOffset.z,uTravelLength);
  transformed.xy+=aOffset.xy;
  float progress=abs(transformed.z/uTravelLength);
  transformed.xyz+=getDistortion(progress);
  vec4 mvPosition=modelViewMatrix*vec4(transformed,1.);
  gl_Position=projectionMatrix*mvPosition;
  vUv=uv;vColor=aColor;
  ${THREE.ShaderChunk['fog_vertex']}
}`;

const sideSticksVertex = `
#define USE_FOG;
${THREE.ShaderChunk['fog_pars_vertex']}
attribute float aOffset;
attribute vec3 aColor;
attribute vec2 aMetrics;
uniform float uTravelLength;
uniform float uTime;
varying vec3 vColor;
mat4 rotationY(in float angle){return mat4(cos(angle),0,sin(angle),0,0,1.0,0,0,-sin(angle),0,cos(angle),0,0,0,0,1);}
#include <getDistortion_vertex>
void main(){
  vec3 transformed=position.xyz;
  float width=aMetrics.x;float height=aMetrics.y;
  transformed.xy*=vec2(width,height);
  float time=mod(uTime*60.*2.+aOffset,uTravelLength);
  transformed=(rotationY(3.14/2.)*vec4(transformed,1.)).xyz;
  transformed.z+=-uTravelLength+time;
  float progress=abs(transformed.z/uTravelLength);
  transformed.xyz+=getDistortion(progress);
  transformed.y+=height/2.;transformed.x+=-width/2.;
  vec4 mvPosition=modelViewMatrix*vec4(transformed,1.);
  gl_Position=projectionMatrix*mvPosition;
  vColor=aColor;
  ${THREE.ShaderChunk['fog_vertex']}
}`;

const sideSticksFragment = `
#define USE_FOG;
${THREE.ShaderChunk['fog_pars_fragment']}
varying vec3 vColor;
void main(){vec3 color=vec3(vColor);gl_FragColor=vec4(color,1.);${THREE.ShaderChunk['fog_fragment']}}`;

const roadMarkings_vars = `
uniform float uLanes;
uniform vec3 uBrokenLinesColor;uniform vec3 uShoulderLinesColor;
uniform float uShoulderLinesWidthPercentage;
uniform float uBrokenLinesWidthPercentage;
uniform float uBrokenLinesLengthPercentage;
highp float random(vec2 co){highp float a=12.9898;highp float b=78.233;highp float c=43758.5453;highp float dt=dot(co.xy,vec2(a,b));highp float sn=mod(dt,3.14);return fract(sin(sn)*c);}`;

const roadMarkings_fragment = `
uv.y=mod(uv.y+uTime*0.05,1.);
float laneWidth=1.0/uLanes;
float brokenLineWidth=laneWidth*uBrokenLinesWidthPercentage;
float laneEmptySpace=1.-uBrokenLinesLengthPercentage;
float brokenLines=step(1.0-brokenLineWidth,fract(uv.x*2.0))*step(laneEmptySpace,fract(uv.y*10.0));
float sideLines=step(1.0-brokenLineWidth,fract((uv.x-laneWidth*(uLanes-1.0))*2.0))+step(brokenLineWidth,uv.x);
brokenLines=mix(brokenLines,sideLines,uv.x);`;

const roadBaseFragment = `
#define USE_FOG;
varying vec2 vUv;uniform vec3 uColor;uniform float uTime;
#include <roadMarkings_vars>
${THREE.ShaderChunk['fog_pars_fragment']}
void main(){vec2 uv=vUv;vec3 color=vec3(uColor);
#include <roadMarkings_fragment>
gl_FragColor=vec4(color,1.);${THREE.ShaderChunk['fog_fragment']}}`;

const islandFragment = roadBaseFragment.replace('#include <roadMarkings_fragment>', '').replace('#include <roadMarkings_vars>', '');
const roadFragment = roadBaseFragment.replace('#include <roadMarkings_fragment>', roadMarkings_fragment).replace('#include <roadMarkings_vars>', roadMarkings_vars);

const roadVertex = `
#define USE_FOG;
uniform float uTime;
${THREE.ShaderChunk['fog_pars_vertex']}
uniform float uTravelLength;varying vec2 vUv;
#include <getDistortion_vertex>
void main(){
  vec3 transformed=position.xyz;
  vec3 distortion=getDistortion((transformed.y+uTravelLength/2.)/uTravelLength);
  transformed.x+=distortion.x;transformed.z+=distortion.y;transformed.y+=-1.*distortion.z;
  vec4 mvPosition=modelViewMatrix*vec4(transformed,1.);
  gl_Position=projectionMatrix*mvPosition;vUv=uv;
  ${THREE.ShaderChunk['fog_vertex']}
}`;

/* ──────────────── internal classes ───────────────── */

class CarLights {
    webgl: any; options: any; colors: any; speed: any; fade: any; mesh!: THREE.Mesh;
    constructor(webgl: any, options: any, colors: any, speed: any, fade: any) {
        this.webgl = webgl; this.options = options; this.colors = colors; this.speed = speed; this.fade = fade;
    }
    init() {
        const options = this.options;
        const curve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1));
        const geometry = new THREE.TubeGeometry(curve, 40, 1, 8, false);
        const instanced = new THREE.InstancedBufferGeometry().copy(geometry as unknown as THREE.InstancedBufferGeometry);
        instanced.instanceCount = options.lightPairsPerRoadWay * 2;
        const laneWidth = options.roadWidth / options.lanesPerRoad;
        const aOffset: number[] = [], aMetrics: number[] = [], aColor: number[] = [];
        let colors = this.colors;
        colors = Array.isArray(colors) ? colors.map((c: number) => new THREE.Color(c)) : new THREE.Color(colors);
        for (let i = 0; i < options.lightPairsPerRoadWay; i++) {
            const radius = random(options.carLightsRadius), length = random(options.carLightsLength), speed = random(this.speed);
            let laneX = (i % options.lanesPerRoad) * laneWidth - options.roadWidth / 2 + laneWidth / 2;
            const carWidth = random(options.carWidthPercentage) * laneWidth;
            laneX += random(options.carShiftX) * laneWidth;
            const offsetY = random(options.carFloorSeparation) + radius * 1.3, offsetZ = -random(options.length);
            aOffset.push(laneX - carWidth / 2, offsetY, offsetZ, laneX + carWidth / 2, offsetY, offsetZ);
            aMetrics.push(radius, length, speed, radius, length, speed);
            const color = pickRandom(colors);
            aColor.push(color.r, color.g, color.b, color.r, color.g, color.b);
        }
        instanced.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3, false));
        instanced.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 3, false));
        instanced.setAttribute('aColor', new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false));
        const material = new THREE.ShaderMaterial({
            fragmentShader: carLightsFragment, vertexShader: carLightsVertex, transparent: true,
            uniforms: Object.assign({ uTime: { value: 0 }, uTravelLength: { value: options.length }, uFade: { value: this.fade } }, this.webgl.fogUniforms, options.distortion.uniforms)
        });
        material.onBeforeCompile = (shader: any) => { shader.vertexShader = shader.vertexShader.replace('#include <getDistortion_vertex>', options.distortion.getDistortion); };
        const mesh = new THREE.Mesh(instanced, material);
        mesh.frustumCulled = false;
        this.webgl.scene.add(mesh);
        this.mesh = mesh;
    }
    update(time: number) { (this.mesh.material as THREE.ShaderMaterial).uniforms.uTime.value = time; }
}

class LightsSticks {
    webgl: any; options: any; mesh!: THREE.Mesh;
    constructor(webgl: any, options: any) { this.webgl = webgl; this.options = options; }
    init() {
        const options = this.options;
        const geometry = new THREE.PlaneGeometry(1, 1);
        const instanced = new THREE.InstancedBufferGeometry().copy(geometry as unknown as THREE.InstancedBufferGeometry);
        const totalSticks = options.totalSideLightSticks;
        instanced.instanceCount = totalSticks;
        const stickoffset = options.length / (totalSticks - 1);
        const aOffset: number[] = [], aColor: number[] = [], aMetrics: number[] = [];
        let colors = options.colors.sticks;
        colors = Array.isArray(colors) ? colors.map((c: number) => new THREE.Color(c)) : new THREE.Color(colors);
        for (let i = 0; i < totalSticks; i++) {
            aOffset.push((i - 1) * stickoffset * 2 + stickoffset * Math.random());
            const color = pickRandom(colors);
            aColor.push(color.r, color.g, color.b);
            aMetrics.push(random(options.lightStickWidth), random(options.lightStickHeight));
        }
        instanced.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 1, false));
        instanced.setAttribute('aColor', new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false));
        instanced.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 2, false));
        const material = new THREE.ShaderMaterial({
            fragmentShader: sideSticksFragment, vertexShader: sideSticksVertex, side: THREE.DoubleSide,
            uniforms: Object.assign({ uTravelLength: { value: options.length }, uTime: { value: 0 } }, this.webgl.fogUniforms, options.distortion.uniforms)
        });
        material.onBeforeCompile = (shader: any) => { shader.vertexShader = shader.vertexShader.replace('#include <getDistortion_vertex>', options.distortion.getDistortion); };
        const mesh = new THREE.Mesh(instanced, material);
        mesh.frustumCulled = false;
        this.webgl.scene.add(mesh);
        this.mesh = mesh;
    }
    update(time: number) { (this.mesh.material as THREE.ShaderMaterial).uniforms.uTime.value = time; }
}

class Road {
    webgl: any; options: any; uTime: { value: number };
    leftRoadWay!: THREE.Mesh; rightRoadWay!: THREE.Mesh; island!: THREE.Mesh;
    constructor(webgl: any, options: any) { this.webgl = webgl; this.options = options; this.uTime = { value: 0 }; }
    createPlane(side: number, _width: number, isRoad: boolean) {
        const options = this.options;
        const geometry = new THREE.PlaneGeometry(isRoad ? options.roadWidth : options.islandWidth, options.length, 20, 100);
        let uniforms: any = { uTravelLength: { value: options.length }, uColor: { value: new THREE.Color(isRoad ? options.colors.roadColor : options.colors.islandColor) }, uTime: this.uTime };
        if (isRoad) {
            uniforms = Object.assign(uniforms, {
                uLanes: { value: options.lanesPerRoad }, uBrokenLinesColor: { value: new THREE.Color(options.colors.brokenLines) },
                uShoulderLinesColor: { value: new THREE.Color(options.colors.shoulderLines) },
                uShoulderLinesWidthPercentage: { value: options.shoulderLinesWidthPercentage },
                uBrokenLinesLengthPercentage: { value: options.brokenLinesLengthPercentage },
                uBrokenLinesWidthPercentage: { value: options.brokenLinesWidthPercentage }
            });
        }
        const material = new THREE.ShaderMaterial({
            fragmentShader: isRoad ? roadFragment : islandFragment, vertexShader: roadVertex, side: THREE.DoubleSide,
            uniforms: Object.assign(uniforms, this.webgl.fogUniforms, options.distortion.uniforms)
        });
        material.onBeforeCompile = (shader: any) => { shader.vertexShader = shader.vertexShader.replace('#include <getDistortion_vertex>', options.distortion.getDistortion); };
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.z = -options.length / 2;
        mesh.position.x += (options.islandWidth / 2 + options.roadWidth / 2) * side;
        this.webgl.scene.add(mesh);
        return mesh;
    }
    init() {
        this.leftRoadWay = this.createPlane(-1, this.options.roadWidth, true);
        this.rightRoadWay = this.createPlane(1, this.options.roadWidth, true);
        this.island = this.createPlane(0, this.options.islandWidth, false);
    }
    update(time: number) { this.uTime.value = time; }
}

class HyperspeedApp {
    options: any; container: HTMLElement; renderer: THREE.WebGLRenderer; composer: EffectComposer;
    camera: THREE.PerspectiveCamera; scene: THREE.Scene; fogUniforms: any; clock: THREE.Clock;
    road: Road; leftCarLights: CarLights; rightCarLights: CarLights; leftSticks: LightsSticks;
    fovTarget: number; speedUpTarget: number; speedUp: number; timeOffset: number;
    disposed: boolean; assets: any;
    private boundResize: () => void;

    constructor(container: HTMLElement, options: any) {
        this.options = options; this.container = container; this.disposed = false; this.assets = {};
        this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
        this.renderer.setSize(container.offsetWidth, container.offsetHeight, false);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.composer = new EffectComposer(this.renderer);
        container.append(this.renderer.domElement);
        this.camera = new THREE.PerspectiveCamera(options.fov, container.offsetWidth / container.offsetHeight, 0.1, 10000);
        this.camera.position.set(0, 8, -5);
        this.scene = new THREE.Scene();
        this.scene.background = null;
        const fog = new THREE.Fog(options.colors.background, options.length * 0.2, options.length * 500);
        this.scene.fog = fog;
        this.fogUniforms = { fogColor: { value: fog.color }, fogNear: { value: fog.near }, fogFar: { value: fog.far } };
        this.clock = new THREE.Clock();
        this.road = new Road(this, options);
        this.leftCarLights = new CarLights(this, options, options.colors.leftCars, options.movingAwaySpeed, new THREE.Vector2(0, 1 - options.carLightsFade));
        this.rightCarLights = new CarLights(this, options, options.colors.rightCars, options.movingCloserSpeed, new THREE.Vector2(1, 0 + options.carLightsFade));
        this.leftSticks = new LightsSticks(this, options);
        this.fovTarget = options.fov; this.speedUpTarget = 0; this.speedUp = 0; this.timeOffset = 0;
        this.boundResize = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.boundResize);
    }

    onWindowResize() {
        const w = this.container.offsetWidth, h = this.container.offsetHeight;
        this.renderer.setSize(w, h); this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); this.composer.setSize(w, h);
    }

    initPasses() {
        const renderPass = new RenderPass(this.scene, this.camera);
        const bloomPass = new EffectPass(this.camera, new BloomEffect({ luminanceThreshold: 0.2, luminanceSmoothing: 0, resolutionScale: 1 }));
        const smaaPass = new EffectPass(this.camera, new SMAAEffect({ preset: SMAAPreset.MEDIUM }));
        this.composer.addPass(renderPass);
        this.composer.addPass(bloomPass);
        this.composer.addPass(smaaPass);
    }

    loadAssets() {
        return new Promise<void>(resolve => {
            const manager = new THREE.LoadingManager(resolve);
            const searchImage = new Image(), areaImage = new Image();
            this.assets.smaa = {};
            searchImage.addEventListener('load', function () { manager.itemEnd('smaa-search'); });
            areaImage.addEventListener('load', function () { manager.itemEnd('smaa-area'); });
            manager.itemStart('smaa-search'); manager.itemStart('smaa-area');
            searchImage.src = SMAAEffect.searchImageDataURL; areaImage.src = SMAAEffect.areaImageDataURL;
        });
    }

    init() {
        this.initPasses();
        const opts = this.options;
        this.road.init();
        this.leftCarLights.init(); this.leftCarLights.mesh.position.setX(-opts.roadWidth / 2 - opts.islandWidth / 2);
        this.rightCarLights.init(); this.rightCarLights.mesh.position.setX(opts.roadWidth / 2 + opts.islandWidth / 2);
        this.leftSticks.init(); this.leftSticks.mesh.position.setX(-(opts.roadWidth + opts.islandWidth / 2));
        this.container.addEventListener('mousedown', this.onMouseDown);
        this.container.addEventListener('mouseup', this.onMouseUp);
        this.container.addEventListener('mouseout', this.onMouseUp);
        this.container.addEventListener('touchstart', this.onTouchStart, { passive: true });
        this.container.addEventListener('touchend', this.onTouchEnd, { passive: true });
        this.container.addEventListener('touchcancel', this.onTouchEnd, { passive: true });
        this.tick();
    }

    onMouseDown = () => { this.options.onSpeedUp?.(); this.fovTarget = this.options.fovSpeedUp; this.speedUpTarget = this.options.speedUp; };
    onMouseUp = () => { this.options.onSlowDown?.(); this.fovTarget = this.options.fov; this.speedUpTarget = 0; };
    onTouchStart = () => { this.options.onSpeedUp?.(); this.fovTarget = this.options.fovSpeedUp; this.speedUpTarget = this.options.speedUp; };
    onTouchEnd = () => { this.options.onSlowDown?.(); this.fovTarget = this.options.fov; this.speedUpTarget = 0; };

    update(delta: number) {
        const lp = Math.exp(-(-60 * Math.log2(1 - 0.1)) * delta);
        this.speedUp += lerp(this.speedUp, this.speedUpTarget, lp, 0.00001);
        this.timeOffset += this.speedUp * delta;
        const time = this.clock.elapsedTime + this.timeOffset;
        this.rightCarLights.update(time); this.leftCarLights.update(time); this.leftSticks.update(time); this.road.update(time);
        let updateCam = false;
        const fovChange = lerp(this.camera.fov, this.fovTarget, lp);
        if (fovChange !== 0) { this.camera.fov += fovChange * delta * 6; updateCam = true; }
        if (this.options.distortion.getJS) {
            const d = this.options.distortion.getJS(0.025, time);
            this.camera.lookAt(new THREE.Vector3(this.camera.position.x + d.x, this.camera.position.y + d.y, this.camera.position.z + d.z));
            updateCam = true;
        }
        if (updateCam) this.camera.updateProjectionMatrix();
    }

    render(delta: number) { this.composer.render(delta); }

    dispose() {
        this.disposed = true;
        this.renderer?.dispose(); this.composer?.dispose(); this.scene?.clear();
        window.removeEventListener('resize', this.boundResize);
        this.container?.removeEventListener('mousedown', this.onMouseDown);
        this.container?.removeEventListener('mouseup', this.onMouseUp);
        this.container?.removeEventListener('mouseout', this.onMouseUp);
        this.container?.removeEventListener('touchstart', this.onTouchStart);
        this.container?.removeEventListener('touchend', this.onTouchEnd);
        this.container?.removeEventListener('touchcancel', this.onTouchEnd);
    }

    setSize = (width: number, height: number, updateStyles: boolean) => { this.composer.setSize(width, height, updateStyles); };

    tick = () => {
        if (this.disposed) return;
        if (resizeRendererToDisplaySize(this.renderer, this.setSize)) {
            const canvas = this.renderer.domElement;
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
        }
        const delta = this.clock.getDelta();
        this.render(delta); this.update(delta);
        requestAnimationFrame(this.tick);
    };
}

/* ───────────────────── React component ───────────────────── */

export interface HyperspeedProps {
    effectOptions?: Partial<HyperspeedOptions>;
}

export default function Hyperspeed({ effectOptions = {} }: HyperspeedProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<HyperspeedApp | null>(null);

    useEffect(() => {
        if (appRef.current) { appRef.current.dispose(); }
        const container = containerRef.current;
        if (!container) return;
        while (container.firstChild) container.removeChild(container.firstChild);

        const distortions = buildDistortions();
        const merged = { ...DEFAULT_EFFECT_OPTIONS, ...effectOptions, colors: { ...DEFAULT_EFFECT_OPTIONS.colors, ...effectOptions.colors } } as any;
        if (typeof merged.distortion === 'string') merged.distortion = (distortions as any)[merged.distortion] || distortions.turbulentDistortion;

        const app = new HyperspeedApp(container, merged);
        appRef.current = app;
        app.loadAssets().then(() => app.init());

        return () => { app.dispose(); };
    }, [effectOptions]);

    return <div id="lights" ref={containerRef} className="hyperspeed-container" />;
}
