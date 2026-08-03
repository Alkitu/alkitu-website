import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import { NextResponse } from 'next/server';
import os from 'os';
import fs from 'fs';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { templateId, inputProps } = body;

        // 1. Bundle the Remotion project (entry point)
        // Note: For production, you'd want to cache the bundle location.
        const bundleLocation = await bundle({
            entryPoint: path.resolve('./remotion/Root.tsx'),
            webpackOverride: (config) => config,
        });

        // 2. Select the specific composition requested
        const composition = await selectComposition({
            serveUrl: bundleLocation,
            id: templateId,
            inputProps,
        });

        // 3. Render the media locally to a temp file
        const outputLocation = path.join(os.tmpdir(), `remotion-render-${Date.now()}.mp4`);
        await renderMedia({
            composition,
            serveUrl: bundleLocation,
            codec: 'h264',
            outputLocation,
            inputProps,
            imageFormat: 'jpeg',
            logLevel: 'info',
        });

        // 4. Read the file into a buffer and return as download response
        const buffer = fs.readFileSync(outputLocation);

        // Clean up the temporary video file
        try {
            fs.unlinkSync(outputLocation);
        } catch (e) {
            console.warn('Failed to clean up temp video file:', e);
        }

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'video/mp4',
                'Content-Disposition': `attachment; filename="${templateId}.mp4"`,
            },
        });
    } catch (error: any) {
        console.error('Remotion Render Error:', error);
        return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
    }
}
