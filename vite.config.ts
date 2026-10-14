import { defineConfig } from 'vite';
import {
  sallaBuildPlugin,
  sallaDemoPlugin,
  sallaTransformPlugin,
} from '@salla.sa/twilight-bundles/vite-plugins';

export default defineConfig({
  plugins: [
    sallaTransformPlugin(),
    sallaBuildPlugin(),
    sallaDemoPlugin({
      components: ['habka-marquee', 'habka-image-banner'],
      grid: {
        columns: 'minmax(0, 1fr)',
        gap: '1rem',
        minWidth: '320px',
      },
      css: `
        body {
          margin: 0;
          background: #f7f7f8;
        }

        .component-card {
          overflow: hidden;
        }
      `,
    }),
  ],
});
