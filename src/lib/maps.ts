function getMapQuery(url: string): string | null {
  try {
    const parsed = new URL(url)
    const query =
      parsed.searchParams.get('daddr') ??
      parsed.searchParams.get('query') ??
      parsed.searchParams.get('q')
    return query?.trim() || null
  } catch {
    return null
  }
}

function isAppleDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  const platform = navigator.platform.toLowerCase()
  const userAgent = navigator.userAgent.toLowerCase()
  return /iphone|ipad|ipod|mac/.test(platform) || /iphone|ipad|ipod|macintosh/.test(userAgent)
}

function isAndroidDevice(): boolean {
  return typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent)
}

export function resolveMapUrl(url: string): string {
  const query = getMapQuery(url)
  if (!query) return url

  const encoded = encodeURIComponent(query)
  if (isAndroidDevice()) return `geo:0,0?q=${encoded}`
  if (isAppleDevice()) return `https://maps.apple.com/?daddr=${encoded}`

  return `https://maps.apple.com/?daddr=${encoded}`
}
