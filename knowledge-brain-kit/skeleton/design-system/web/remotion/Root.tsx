import { Composition } from 'remotion';
import { FeaturePromo, featurePromoSchema } from './templates/FeaturePromo';
import { QuoteReel, quoteReelSchema } from './templates/QuoteReel';
import '../app/globals.css';

/**
 * The Remotion Root component.
 * Registers all video compositions so they can be rendered by the Studio or Player.
 */
export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="FeaturePromo"
                component={FeaturePromo}
                durationInFrames={300} // 10 seconds @ 30fps
                fps={30}
                width={1920}
                height={1080}
                schema={featurePromoSchema}
                defaultProps={{
                    title: 'Introducing new features',
                    subtitle: 'Built for speed and scale.',
                    features: ['Design Tokens', 'Tailwind v4', 'React Bits'],
                    primaryColor: '#171717',
                    brandName: '[Brand] DS',
                }}
            />

            <Composition
                id="QuoteReel"
                component={QuoteReel}
                durationInFrames={150} // 5 seconds @ 30fps
                fps={30}
                width={1080}
                height={1920}
                schema={quoteReelSchema}
                defaultProps={{
                    quote: 'Design is intelligence made visible.',
                    author: 'Alina Wheeler',
                    accentColor: '#3b82f6',
                }}
            />
        </>
    );
};
