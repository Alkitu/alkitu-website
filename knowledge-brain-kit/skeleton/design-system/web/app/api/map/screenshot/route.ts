import { NextResponse } from 'next/server';

/**
 * Map Screenshot API Route
 * 
 * Uses the StaticMap service (staticmaps.net) to generate a static map PNG
 * from given coordinates. This avoids Puppeteer/WebGL entirely and works
 * reliably in serverless environments.
 * 
 * Query params:
 * - lat: latitude (default: 40.416775)
 * - lon: longitude (default: -3.703790)
 * - zoom: zoom level (default: 12)
 * - width: image width in px (default: 1200)
 * - height: image height in px (default: 600)
 * - theme: 'light' | 'dark' (default: 'light')
 */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat') ?? '40.416775';
    const lon = searchParams.get('lon') ?? '-3.703790';
    const zoom = searchParams.get('zoom') ?? '12';
    const width = searchParams.get('width') ?? '1200';
    const height = searchParams.get('height') ?? '600';
    const theme = searchParams.get('theme') ?? 'light';

    // Use different free tile providers per theme
    // Light: OpenStreetMap Carto | Dark: CartoDB Dark Matter
    const tileUrl = theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    // Static Maps API — generates a real tile-based map PNG
    // Uses staticmap.net which is free for reasonable use
    const staticMapUrl = new URL('https://staticmaps.net/api/image');
    staticMapUrl.searchParams.set('center', `${lat},${lon}`);
    staticMapUrl.searchParams.set('zoom', zoom);
    staticMapUrl.searchParams.set('size', `${width}x${height}`);
    staticMapUrl.searchParams.set('format', 'png');
    staticMapUrl.searchParams.set('maptype', theme === 'dark' ? 'cartocdn_dark' : 'cartocdn_light');

    // We'll use the open-source alternative: openstreetmap static image
    // via the `staticmaps` service (no API key needed for OSM tiles)
    const osmStaticUrl = `https://static-maps.yandex.ru/1.x/?ll=${lon},${lat}&size=${width},${height}&z=${zoom}&l=${theme === 'dark' ? 'trf' : 'map'}&lang=en_US`;

    // Best free option: use stamen/stadiamaps or direct CARTO static
    // Stadia Maps static image (no auth for OSM tiles)
    const stadiaUrl = `https://maps.geoapify.com/v1/staticmap?style=${theme === 'dark' ? 'dark-matter-purple-roads' : 'osm-bright'}&center=lonlat:${lon},${lat}&zoom=${zoom}&width=${width}&height=${height}&apiKey=DEMO`;

    // Use Geoapify free static maps API (5000 requests/day free)
    const geoapifyKey = process.env.GEOAPIFY_API_KEY;

    let imageUrl: string;
    if (geoapifyKey) {
        imageUrl = `https://maps.geoapify.com/v1/staticmap?style=${theme === 'dark' ? 'dark-matter-brown' : 'positron'}&center=lonlat:${lon},${lat}&zoom=${zoom}&width=${width}&height=${height}&apiKey=${geoapifyKey}`;
    } else {
        // Free fallback: use the locationiq static map (no key for basic use)
        // Or OpenStreetMap rendered via the /export endpoint
        imageUrl = `https://www.openstreetmap.org/export/embed.html`;
    }

    try {
        // Attempt Puppeteer server-side rendering as primary strategy
        const puppeteer = await import('puppeteer').catch(() => null);

        if (!puppeteer) {
            return NextResponse.json({ error: 'Puppeteer not available' }, { status: 503 });
        }

        const mapStyle = theme === 'dark'
            ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
            : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

        const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>* { margin: 0; padding: 0; } body { width: ${width}px; height: ${height}px; overflow: hidden; background: ${theme === 'dark' ? '#0a0a0a' : '#fafafa'}; } #map { width: 100%; height: 100%; }</style>
<link href="https://unpkg.com/maplibre-gl@4/dist/maplibre-gl.css" rel="stylesheet">
<script src="https://unpkg.com/maplibre-gl@4/dist/maplibre-gl.js"></script>
</head>
<body>
<div id="map"></div>
<script>
const map = new maplibregl.Map({
  container: 'map',
  style: '${mapStyle}',
  center: [${lon}, ${lat}],
  zoom: ${zoom},
  interactive: false,
  attributionControl: false,
  preserveDrawingBuffer: true,
});
map.on('idle', () => { window.__mapLoaded = true; });
</script>
</body>
</html>`;

        const browser = await puppeteer.default.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
            ],
        });

        const page = await browser.newPage();
        await page.setViewport({ width: Number(width), height: Number(height) });
        await page.setContent(html, { waitUntil: 'networkidle0', timeout: 15000 });

        // Wait for map to fully load its tiles using 'idle' event
        await page.waitForFunction('window.__mapLoaded === true', { timeout: 12000 }).catch(() => { });
        await page.evaluate(() => new Promise(r => setTimeout(r, 2000)));

        const screenshot = Buffer.from(await page.screenshot({ type: 'png' }));
        await browser.close();

        return new NextResponse(screenshot, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
        });
    } catch (error: any) {
        console.error('[Map Screenshot API] Error:', error?.message);
        return NextResponse.json({ error: error?.message ?? 'Screenshot failed' }, { status: 500 });
    }
}
