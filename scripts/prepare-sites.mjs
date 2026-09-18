import fs from 'node:fs'
import path from 'node:path'

const project = process.cwd()
const openNext = path.join(project, '.open-next')
const sitesWorker = path.join(project, '.sites-worker')
const dist = path.join(project, 'dist')
const server = path.join(dist, 'server')
const client = path.join(dist, 'client')
const metadata = path.join(dist, '.openai')
const drizzle = path.join(project, 'drizzle')

if (!fs.existsSync(path.join(sitesWorker, 'worker.js'))) {
  throw new Error('Run pnpm build:worker before staging the Sites package.')
}

fs.rmSync(dist, { recursive: true, force: true })
fs.mkdirSync(server, { recursive: true })
fs.copyFileSync(path.join(sitesWorker, 'worker.js'), path.join(server, 'index.js'))
for (const entry of fs.readdirSync(sitesWorker, { withFileTypes: true })) {
  if (
    entry.isFile() &&
    !['worker.js', 'worker.js.map', 'README.md'].includes(entry.name)
  ) {
    fs.copyFileSync(path.join(sitesWorker, entry.name), path.join(server, entry.name))
  }
}
fs.cpSync(path.join(openNext, 'assets'), client, { recursive: true, dereference: true })

fs.mkdirSync(metadata, { recursive: true })
fs.copyFileSync(path.join(project, '.openai', 'hosting.json'), path.join(metadata, 'hosting.json'))

fs.rmSync(drizzle, { recursive: true, force: true })
fs.mkdirSync(drizzle, { recursive: true })

const migrationFiles = fs
  .readdirSync(path.join(project, 'src', 'migrations'))
  .filter((name) => /^\d+.*\.ts$/.test(name))
  .sort()

for (const [index, migrationFile] of migrationFiles.entries()) {
  const source = fs.readFileSync(path.join(project, 'src', 'migrations', migrationFile), 'utf8')
  const up = source.split('export async function down')[0]
  const statements = [...up.matchAll(/sql`((?:\\`|[^`])*)`/g)].map((match) =>
    match[1].replaceAll('\\`', '`').trim(),
  )
  if (statements.length === 0) throw new Error(`No SQL found in ${migrationFile}`)
  const filename = `${String(index).padStart(4, '0')}_${path.basename(migrationFile, '.ts')}.sql`
  fs.writeFileSync(path.join(drizzle, filename), `${statements.join('\n\n')}\n`)
}

fs.cpSync(drizzle, path.join(metadata, 'drizzle'), { recursive: true })

console.log(`Staged ${migrationFiles.length} database migrations and the Worker build in dist/.`)
