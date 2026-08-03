import type { StorybookConfig } from '@storybook/nextjs-vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    '../components/foundations/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../components/primitives/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../components/compositions/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../components/patterns/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../components/showcase/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../components/integrations/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../public'],
  viteFinal: async (config) => {
    const { default: svgr } = await import('vite-plugin-svgr');
    config.plugins = config.plugins || [];
    config.plugins.push(svgr());
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '~': path.resolve(__dirname, '..'),
    };
    return config;
  },
};
export default config;