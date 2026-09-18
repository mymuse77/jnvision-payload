const sharpUnavailable = () => {
  throw new Error('Image transforms are unavailable in the Cloudflare Worker runtime.')
}

export default sharpUnavailable
