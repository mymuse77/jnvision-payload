// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from '@opennextjs/cloudflare/config'

const cloudflareConfig = defineCloudflareConfig({})

export default {
  ...cloudflareConfig,
  ...(process.env.SITES_REUSE_NEXT_BUILD === '1'
    ? { buildCommand: 'node -e "console.log(\'Using existing Next.js build\')"' }
    : {}),
}
