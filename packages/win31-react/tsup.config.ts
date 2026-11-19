import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: { resolve: true },
  sourcemap: true,
  clean: true,
  // treeshake would strip the "use client" banner directive.
  treeshake: false,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.js' }
  },
  // Marks the whole library as a client boundary for Next.js.
  banner: { js: '"use client";' },
  // Ship the Win31 tokens (CSS, fonts, bitmaps) inside this package so a
  // single dependency provides both components and styles.
  onSuccess: 'node scripts/copy-tokens.mjs'
})
