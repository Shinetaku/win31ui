// Copies the tokens package (stylesheet + fonts + bitmaps) into the react
// build output so @win31ui/react ships as a single npm package.
import { cp, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const tokensDir = join(here, '..', '..', 'win31-tokens')
const outDir = join(here, '..', 'dist')

await mkdir(outDir, { recursive: true })
await cp(join(tokensDir, 'win31.css'), join(outDir, 'win31.css'))
await cp(join(tokensDir, 'assets'), join(outDir, 'assets'), { recursive: true })
console.log('tokens copied into dist/ (win31.css + assets)')
