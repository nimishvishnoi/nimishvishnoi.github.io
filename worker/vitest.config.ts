import { defineConfig } from 'vitest/config';
import fs from 'node:fs/promises';

export default defineConfig({
  plugins: [
    {
      name: 'raw-markdown',
      enforce: 'pre',
      async load(id) {
        if (!id.endsWith('.md')) return;
        return `export default ${JSON.stringify(await fs.readFile(id, 'utf8'))};`;
      },
    },
  ],
  test: {
    environment: 'node',
  },
});
