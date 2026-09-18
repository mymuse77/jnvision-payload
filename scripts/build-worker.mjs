import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const project = process.cwd()
const pnpmRoot = path.join(project, 'node_modules', '.pnpm')
const sitesWorker = path.join(project, '.sites-worker')

const workerAssets = [
  { filename: 'yoga.wasm', sourceSuffix: '?module', outputSuffix: '' },
  { filename: 'resvg.wasm', sourceSuffix: '?module', outputSuffix: '' },
  { filename: 'Geist-Regular.ttf.bin', sourceSuffix: '', outputSuffix: '' },
]

function run(command) {
  const result = spawnSync(command, {
    cwd: project,
    env: process.env,
    shell: true,
    stdio: 'inherit',
  })
  if (result.status !== 0) throw new Error(`${command} failed with exit code ${result.status ?? 1}.`)
}

function findPackageFile(prefix, relativePath) {
  const matches = fs
    .readdirSync(pnpmRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(prefix))
    .map((entry) => path.join(pnpmRoot, entry.name, relativePath))
    .filter((filename) => fs.existsSync(filename))
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))

  if (!matches[0]) throw new Error(`Unable to locate ${prefix} in node_modules.`)
  return matches[0]
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function makeWorkerBundlePortable() {
  const handlerDirectory = path.join(project, '.open-next', 'server-functions', 'default')
  const handlerPath = path.join(handlerDirectory, 'handler.mjs')
  const nextOgDirectory = path.join(
    project,
    'node_modules',
    'next',
    'dist',
    'compiled',
    '@vercel',
    'og',
  )
  let handler = fs.readFileSync(handlerPath, 'utf8')

  for (const { filename, sourceSuffix, outputSuffix } of workerAssets) {
    const absoluteImport = new RegExp(
      `(["'])[A-Za-z]:/[^"'\\r\\n]*?/next/dist/compiled/@vercel/og/${escapeRegExp(filename)}${escapeRegExp(sourceSuffix)}\\1`,
      'g',
    )
    let replacements = 0
    handler = handler.replace(absoluteImport, (_match, quote) => {
      replacements += 1
      return `${quote}./${filename}${outputSuffix}${quote}`
    })
    if (replacements === 0) {
      throw new Error(`OpenNext did not emit the expected ${filename} import.`)
    }
    fs.copyFileSync(path.join(nextOgDirectory, filename), path.join(handlerDirectory, filename))
  }

  const middlewareManifestLoader =
    'getMiddlewareManifest(){return this.minimalMode?null:require(this.middlewareManifestPath)}'
  const bundledMiddlewareManifest =
    'getMiddlewareManifest(){return this.minimalMode?null:{version:3,middleware:{},functions:{},sortedMiddleware:[]}}'
  if (!handler.includes(middlewareManifestLoader)) {
    throw new Error('OpenNext did not emit the expected middleware manifest loader.')
  }
  handler = handler.replace(middlewareManifestLoader, bundledMiddlewareManifest)

  fs.writeFileSync(handlerPath, handler)

  if (/["'][A-Za-z]:\/[^"'\r\n]+["']/.test(handler)) {
    throw new Error('OpenNext emitted another absolute Windows import in handler.mjs.')
  }
}

process.env.NEXT_PRIVATE_STANDALONE = 'true'
process.env.NEXT_PRIVATE_OUTPUT_TRACE_ROOT = project
run('pnpm build')

const sharpBinding = findPackageFile('sharp@', path.join('node_modules', 'sharp', 'dist', 'sharp.cjs'))
const copyTracedFiles = findPackageFile(
  '@opennextjs+aws@',
  path.join('node_modules', '@opennextjs', 'aws', 'dist', 'build', 'copyTracedFiles.js'),
)
const originalSharp = fs.readFileSync(sharpBinding, 'utf8')
const originalCopyTracedFiles = fs.readFileSync(copyTracedFiles, 'utf8')

try {
  fs.writeFileSync(
    sharpBinding,
    "module.exports = function sharpUnavailable() { throw new Error('Image transforms are unavailable in the Cloudflare Worker runtime.'); };\n",
  )

  if (process.platform === 'win32' && !originalCopyTracedFiles.includes('"junction"')) {
    const patched = originalCopyTracedFiles.replace(
      'symlinkSync(symlink, to);',
      'symlinkSync(path.resolve(path.dirname(from), symlink), to, "junction");',
    )
    if (patched === originalCopyTracedFiles) {
      throw new Error('OpenNext Windows link patch could not be applied.')
    }
    fs.writeFileSync(copyTracedFiles, patched)
  }

  process.env.SITES_REUSE_NEXT_BUILD = '1'
  run('pnpm exec opennextjs-cloudflare build')
  makeWorkerBundlePortable()

  fs.rmSync(sitesWorker, { recursive: true, force: true })
  process.env.CI = '1'
  run('pnpm exec wrangler deploy --dry-run --outdir .sites-worker')
  if (!fs.existsSync(path.join(sitesWorker, 'worker.js'))) {
    throw new Error('Wrangler did not emit the final Sites Worker bundle.')
  }
} finally {
  fs.writeFileSync(sharpBinding, originalSharp)
  fs.writeFileSync(copyTracedFiles, originalCopyTracedFiles)
}
