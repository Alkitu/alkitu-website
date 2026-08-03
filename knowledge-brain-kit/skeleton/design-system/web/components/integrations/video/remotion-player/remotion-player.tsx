'use client';

import React, { useMemo, useState } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { Download } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Button } from '~/components/primitives/button';
import { Spinner } from '~/components/primitives/spinner';
import { FeaturePromo, featurePromoSchema } from '~/remotion/templates/FeaturePromo';
import { QuoteReel, quoteReelSchema } from '~/remotion/templates/QuoteReel';

type TemplatePropsMap = {
    FeaturePromo: React.ComponentProps<typeof FeaturePromo>;
    QuoteReel: React.ComponentProps<typeof QuoteReel>;
};

export interface RemotionPlayerProps<T extends keyof TemplatePropsMap> {
    /** The ID of the template to render */
    templateId: T;
    /** The props to pass to the selected template */
    inputProps: TemplatePropsMap[T];
    /** CSS width of the player */
    width?: string | number;
    /** Whether the video should autoplay */
    autoPlay?: boolean;
    /** Whether to show player controls */
    controls?: boolean;
    /** Whether the video should loop */
    loop?: boolean;
    /** Optional class name for the wrapper */
    className?: string;
}

/**
 * A wrapper around @remotion/player that handles template selection and schema mapping.
 * Used to embed video generation capabilities directly in the UI.
 */
export const RemotionPlayer = React.forwardRef<PlayerRef, RemotionPlayerProps<keyof TemplatePropsMap>>(
    ({ templateId, inputProps, width = '100%', autoPlay = true, controls = true, loop = true, className }, ref) => {
        const [isDownloading, setIsDownloading] = useState(false);

        // Map template IDs to their React Component, duration, framerate, native size, and schema.
        const config = useMemo(() => {
            switch (templateId) {
                case 'FeaturePromo':
                    return {
                        component: FeaturePromo,
                        schema: featurePromoSchema,
                        durationInFrames: 300,
                        fps: 30,
                        compositionWidth: 1920,
                        compositionHeight: 1080,
                    };
                case 'QuoteReel':
                    return {
                        component: QuoteReel,
                        schema: quoteReelSchema,
                        durationInFrames: 150,
                        fps: 30,
                        compositionWidth: 1080,
                        compositionHeight: 1920,
                    };
                default:
                    throw new Error(`Unknown Remotion template: ${templateId}`);
            }
        }, [templateId]);

        const handleDownload = async () => {
            setIsDownloading(true);
            try {
                const res = await fetch('/api/video/render', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ templateId, inputProps }),
                });

                if (!res.ok) throw new Error('Failed to generate video');

                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${templateId}.mp4`;
                a.click();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Download error:', error);
                alert('MP4 export failed. Make sure the Next.js dev server is running (npm run dev) to process the API request.');
            } finally {
                setIsDownloading(false);
            }
        };

        return (
            <div className={cn('flex flex-col gap-4', className)} style={{ width }}>
                <div className="rounded-lg overflow-hidden w-full">
                    <Player
                        ref={ref}
                        component={config.component as any}
                        inputProps={inputProps}
                        durationInFrames={config.durationInFrames}
                        fps={config.fps}
                        compositionWidth={config.compositionWidth}
                        compositionHeight={config.compositionHeight}
                        style={{ width: '100%', aspectRatio: `${config.compositionWidth} / ${config.compositionHeight}` }}
                        controls={controls}
                        autoPlay={autoPlay}
                        loop={loop}
                    />
                </div>

                <Button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    loading={isDownloading}
                    fullWidth
                    iconLeft={!isDownloading ? <Download size={16} /> : undefined}
                >
                    {isDownloading ? 'Rendering MP4 (Takes ~10s)...' : 'Download as MP4'}
                </Button>
            </div>
        );
    }
);

RemotionPlayer.displayName = 'RemotionPlayer';
