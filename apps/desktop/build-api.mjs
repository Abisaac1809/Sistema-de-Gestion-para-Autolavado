import { build } from 'esbuild'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const apiSrc = path.join(__dirname, '../api/src')
const outDir = path.join(__dirname, 'resources')

fs.mkdirSync(outDir, { recursive: true })

console.log('Bundling API server...')
await build({
  entryPoints: [path.join(apiSrc, 'server.ts')],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  outfile: path.join(outDir, 'server.js'),
  // Native .node addons can't be bundled — Prisma finds them via PRISMA_QUERY_ENGINE_LIBRARY
  external: ['*.node'],
})

// Copy the Prisma query engine binary alongside server.js
const prismaDir = path.join(apiSrc, 'generated/prisma')
const engineFiles = fs.readdirSync(prismaDir).filter(f => f.endsWith('.node'))
for (const file of engineFiles) {
  fs.copyFileSync(path.join(prismaDir, file), path.join(outDir, file))
  console.log(`Copied engine: ${file}`)
}

console.log('API bundled → resources/server.js')
