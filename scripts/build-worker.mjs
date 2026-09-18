import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const project = process.cwd()
const pnpmRoot = path.join(project, 'node_modules', '.pnpm')

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
} finally {
  fs.writeFileSync(sharpBinding, originalSharp)
  fs.writeFileSync(copyTracedFiles, originalCopyTracedFiles)
}
