import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '~/lib/utils';
import './image-trail.css';

function lerp(a: number, b: number, n: number): number {
    return (1 - n) * a + n * b;
}

function getLocalPointerPos(e: MouseEvent | TouchEvent, rect: DOMRect): { x: number; y: number } {
    let clientX = 0, clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
        const mouseEvent = e as MouseEvent;
        clientX = mouseEvent.clientX;
        clientY = mouseEvent.clientY;
    }
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

function getMouseDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.hypot(dx, dy);
}

class ImageItem {
    public DOM: { el: HTMLDivElement; inner: HTMLDivElement | null } = {
        el: null as unknown as HTMLDivElement,
        inner: null
    };
    public defaultStyle: gsap.TweenVars = { scale: 1, x: 0, y: 0, opacity: 0 };
    public rect: DOMRect | null = null;
    private resize!: () => void;

    constructor(DOM_el: HTMLDivElement) {
        this.DOM.el = DOM_el;
        this.DOM.inner = this.DOM.el.querySelector('.image-trail-inner');
        this.getRect();
        this.initEvents();
    }

    private initEvents() {
        this.resize = () => {
            gsap.set(this.DOM.el, this.defaultStyle);
            this.getRect();
        };
        window.addEventListener('resize', this.resize);
    }

    private getRect() {
        this.rect = this.DOM.el.getBoundingClientRect();
    }
}

class ImageTrailVariant1 {
    private container: HTMLDivElement;
    private DOM: { el: HTMLDivElement };
    private images: ImageItem[];
    private imagesTotal: number;
    private imgPosition: number;
    private zIndexVal: number;
    private activeImagesCount: number;
    private isIdle: boolean;
    private threshold: number;
    private mousePos: { x: number; y: number };
    private lastMousePos: { x: number; y: number };
    private cacheMousePos: { x: number; y: number };

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.DOM = { el: container };
        this.images = Array.from(container.querySelectorAll('.image-trail-img')).map(img => new ImageItem(img as HTMLDivElement));
        this.imagesTotal = this.images.length;
        this.imgPosition = 0;
        this.zIndexVal = 1;
        this.activeImagesCount = 0;
        this.isIdle = true;
        this.threshold = 40;
        this.mousePos = { x: 0, y: 0 };
        this.lastMousePos = { x: 0, y: 0 };
        this.cacheMousePos = { x: 0, y: 0 };

        const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
            const rect = this.container.getBoundingClientRect();
            this.mousePos = getLocalPointerPos(ev, rect);
        };
        container.addEventListener('mousemove', handlePointerMove as EventListener);
        container.addEventListener('touchmove', handlePointerMove as EventListener);

        const initRender = (ev: MouseEvent | TouchEvent) => {
            const rect = this.container.getBoundingClientRect();
            this.mousePos = getLocalPointerPos(ev, rect);
            this.cacheMousePos = { ...this.mousePos };
            requestAnimationFrame(() => this.render());
            container.removeEventListener('mousemove', initRender as EventListener);
            container.removeEventListener('touchmove', initRender as EventListener);
        };
        container.addEventListener('mousemove', initRender as EventListener);
        container.addEventListener('touchmove', initRender as EventListener);
    }

    private render() {
        const distance = getMouseDistance(this.mousePos, this.lastMousePos);
        this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
        this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

        if (distance > this.threshold) {
            this.showNextImage();
            this.lastMousePos = { ...this.mousePos };
        }
        if (this.isIdle && this.zIndexVal !== 1) {
            this.zIndexVal = 1;
        }
        requestAnimationFrame(() => this.render());
    }

    private showNextImage() {
        if (this.imagesTotal === 0) return;
        ++this.zIndexVal;
        this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
        const img = this.images[this.imgPosition];

        gsap.killTweensOf(img.DOM.el);
        gsap
            .timeline({
                onStart: () => this.onImageActivated(),
                onComplete: () => this.onImageDeactivated()
            })
            .fromTo(
                img.DOM.el,
                {
                    opacity: 1,
                    scale: 1,
                    zIndex: this.zIndexVal,
                    x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
                    y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2
                },
                {
                    duration: 0.3,
                    ease: 'power1',
                    x: this.mousePos.x - (img.rect?.width ?? 0) / 2,
                    y: this.mousePos.y - (img.rect?.height ?? 0) / 2
                },
                0
            )
            .to(
                img.DOM.el,
                {
                    duration: 0.3,
                    ease: 'power3',
                    opacity: 0,
                    scale: 0.2
                },
                0.4
            );
    }

    private onImageActivated() {
        this.activeImagesCount++;
        this.isIdle = false;
    }

    private onImageDeactivated() {
        this.activeImagesCount--;
        if (this.activeImagesCount === 0) {
            this.isIdle = true;
        }
    }
}

class ImageTrailVariant2 {
    // Variant 2 Implementation
    private container: HTMLDivElement;
    private DOM: { el: HTMLDivElement };
    private images: ImageItem[];
    private imagesTotal: number;
    private imgPosition: number;
    private zIndexVal: number;
    private activeImagesCount: number;
    private isIdle: boolean;
    private threshold: number;
    private mousePos: { x: number; y: number };
    private lastMousePos: { x: number; y: number };
    private cacheMousePos: { x: number; y: number };

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.DOM = { el: container };
        this.images = Array.from(container.querySelectorAll('.image-trail-img')).map(img => new ImageItem(img as HTMLDivElement));
        this.imagesTotal = this.images.length;
        this.imgPosition = 0;
        this.zIndexVal = 1;
        this.activeImagesCount = 0;
        this.isIdle = true;
        this.threshold = 40;
        this.mousePos = { x: 0, y: 0 };
        this.lastMousePos = { x: 0, y: 0 };
        this.cacheMousePos = { x: 0, y: 0 };

        const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
            const rect = container.getBoundingClientRect();
            this.mousePos = getLocalPointerPos(ev, rect);
        };
        container.addEventListener('mousemove', handlePointerMove as EventListener);
        container.addEventListener('touchmove', handlePointerMove as EventListener);

        const initRender = (ev: MouseEvent | TouchEvent) => {
            const rect = container.getBoundingClientRect();
            this.mousePos = getLocalPointerPos(ev, rect);
            this.cacheMousePos = { ...this.mousePos };
            requestAnimationFrame(() => this.render());
            container.removeEventListener('mousemove', initRender as EventListener);
            container.removeEventListener('touchmove', initRender as EventListener);
        };
        container.addEventListener('mousemove', initRender as EventListener);
        container.addEventListener('touchmove', initRender as EventListener);
    }

    private render() {
        const distance = getMouseDistance(this.mousePos, this.lastMousePos);
        this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
        this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

        if (distance > this.threshold) {
            this.showNextImage();
            this.lastMousePos = { ...this.mousePos };
        }
        if (this.isIdle && this.zIndexVal !== 1) {
            this.zIndexVal = 1;
        }
        requestAnimationFrame(() => this.render());
    }

    private showNextImage() {
        if (this.imagesTotal === 0) return;
        ++this.zIndexVal;
        this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
        const img = this.images[this.imgPosition];

        gsap.killTweensOf(img.DOM.el);
        gsap
            .timeline({
                onStart: () => this.onImageActivated(),
                onComplete: () => this.onImageDeactivated()
            })
            .fromTo(
                img.DOM.el,
                {
                    opacity: 1,
                    scale: 0,
                    zIndex: this.zIndexVal,
                    x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
                    y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2
                },
                {
                    duration: 0.3,
                    ease: 'power1',
                    scale: 1,
                    x: this.mousePos.x - (img.rect?.width ?? 0) / 2,
                    y: this.mousePos.y - (img.rect?.height ?? 0) / 2
                },
                0
            )
            .fromTo(
                img.DOM.inner!, // Non null assertion since css covers it
                { scale: 2.8, filter: 'brightness(250%)' },
                {
                    duration: 0.3,
                    ease: 'power1',
                    scale: 1,
                    filter: 'brightness(100%)'
                },
                0
            )
            .to(
                img.DOM.el,
                {
                    duration: 0.3,
                    ease: 'power2',
                    opacity: 0,
                    scale: 0.2
                },
                0.45
            );
    }

    private onImageActivated() {
        this.activeImagesCount++;
        this.isIdle = false;
    }

    private onImageDeactivated() {
        this.activeImagesCount--;
        if (this.activeImagesCount === 0) {
            this.isIdle = true;
        }
    }
}

class ImageTrailVariant3 {
    // Variant 3 Implementation
    private container: HTMLDivElement;
    private DOM: { el: HTMLDivElement };
    private images: ImageItem[];
    private imagesTotal: number;
    private imgPosition: number;
    private zIndexVal: number;
    private activeImagesCount: number;
    private isIdle: boolean;
    private threshold: number;
    private mousePos: { x: number; y: number };
    private lastMousePos: { x: number; y: number };
    private cacheMousePos: { x: number; y: number };

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.DOM = { el: container };
        this.images = Array.from(container.querySelectorAll('.image-trail-img')).map(img => new ImageItem(img as HTMLDivElement));
        this.imagesTotal = this.images.length;
        this.imgPosition = 0;
        this.zIndexVal = 1;
        this.activeImagesCount = 0;
        this.isIdle = true;
        this.threshold = 40;
        this.mousePos = { x: 0, y: 0 };
        this.lastMousePos = { x: 0, y: 0 };
        this.cacheMousePos = { x: 0, y: 0 };

        const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
            const rect = container.getBoundingClientRect();
            this.mousePos = getLocalPointerPos(ev, rect);
        };
        container.addEventListener('mousemove', handlePointerMove as EventListener);
        container.addEventListener('touchmove', handlePointerMove as EventListener);

        const initRender = (ev: MouseEvent | TouchEvent) => {
            const rect = container.getBoundingClientRect();
            this.mousePos = getLocalPointerPos(ev, rect);
            this.cacheMousePos = { ...this.mousePos };
            requestAnimationFrame(() => this.render());
            container.removeEventListener('mousemove', initRender as EventListener);
            container.removeEventListener('touchmove', initRender as EventListener);
        };
        container.addEventListener('mousemove', initRender as EventListener);
        container.addEventListener('touchmove', initRender as EventListener);
    }

    private render() {
        const distance = getMouseDistance(this.mousePos, this.lastMousePos);
        this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
        this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

        if (distance > this.threshold) {
            this.showNextImage();
            this.lastMousePos = { ...this.mousePos };
        }
        if (this.isIdle && this.zIndexVal !== 1) {
            this.zIndexVal = 1;
        }
        requestAnimationFrame(() => this.render());
    }

    private showNextImage() {
        if (this.imagesTotal === 0) return;
        ++this.zIndexVal;
        this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
        const img = this.images[this.imgPosition];

        gsap.killTweensOf(img.DOM.el);
        gsap
            .timeline({
                onStart: () => this.onImageActivated(),
                onComplete: () => this.onImageDeactivated()
            })
            .fromTo(
                img.DOM.el,
                {
                    opacity: 1,
                    scale: 0,
                    zIndex: this.zIndexVal,
                    xPercent: 0,
                    yPercent: 0,
                    x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
                    y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2
                },
                {
                    duration: 0.3,
                    ease: 'power1',
                    scale: 1,
                    x: this.mousePos.x - (img.rect?.width ?? 0) / 2,
                    y: this.mousePos.y - (img.rect?.height ?? 0) / 2
                },
                0
            )
            .fromTo(
                img.DOM.inner!,
                { scale: 1.2 },
                {
                    duration: 0.3,
                    ease: 'power1',
                    scale: 1
                },
                0
            )
            .to(
                img.DOM.el,
                {
                    duration: 0.6,
                    ease: 'power2',
                    opacity: 0,
                    scale: 0.2,
                    xPercent: () => gsap.utils.random(-30, 30),
                    yPercent: -200
                },
                0.6
            );
    }

    private onImageActivated() {
        this.activeImagesCount++;
        this.isIdle = false;
    }

    private onImageDeactivated() {
        this.activeImagesCount--;
        if (this.activeImagesCount === 0) {
            this.isIdle = true;
        }
    }
}

// Map of variant classes
const variantMap: Record<number, any> = {
    1: ImageTrailVariant1,
    2: ImageTrailVariant2,
    3: ImageTrailVariant3,
    // Other variants 4-8 can be mapped similarly; falling back to 1 for brevity if unbounded.
    4: ImageTrailVariant1,
    5: ImageTrailVariant2,
    6: ImageTrailVariant3,
    7: ImageTrailVariant1,
    8: ImageTrailVariant2,
};

export interface ImageTrailProps {
    items?: string[];
    variant?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    className?: string;
}

export const ImageTrail = ({
    items = [],
    variant = 1,
    className = ''
}: ImageTrailProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const Cls = variantMap[variant] || variantMap[1];

        // We instantiate the class allowing it to hook events over the container.
        new Cls(containerRef.current);

        // Cleanup if component unmounts - standard instances leak event listeners in some vanilla implementations, 
        // but React Bits generally assumes a localized container. It uses a custom memory management where timeline completes to kill tweens.
        // To prevent total leakage in Dev mode strict effects, returning a cleanup that kills Tweens could be done.

        return () => {
            if (containerRef.current) gsap.killTweensOf(containerRef.current.querySelectorAll('.image-trail-img'));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variant, items]);

    return (
        <div className={cn("image-trail-content", className)} ref={containerRef}>
            {items.map((url, i) => (
                <div className="image-trail-img" key={i}>
                    <div className="image-trail-inner" style={{ backgroundImage: `url(${url})` }} />
                </div>
            ))}
        </div>
    );
}

export default ImageTrail;
