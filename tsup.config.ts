import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/parser.ts'],
  sourcemap: true,
  clean: true,
  dts: true,
  treeshake: true,
  minify: true,
  format: ['esm', 'cjs'],
});
