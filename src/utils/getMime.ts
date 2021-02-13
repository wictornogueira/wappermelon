const mimeList = [
  {
    prefix: 'iVBORw0KGgo',
    mime: 'image/png'
  },
  {
    prefix: '/9j/',
    mime: 'image/jpeg'
  },
  {
    prefix: 'R0lGOD',
    mime: 'image/gif'
  },
  {
    prefix: 'UklGRg',
    mime: 'image/webp'
  },
  {
    prefix: 'AAAAIGZ0eXBpc29t',
    mime: 'video/mp4'
  }
]

export function getMime (data: string): string | undefined {
  for (const { prefix, mime } of mimeList) {
    if (data.startsWith(prefix)) { return mime }
  }
}
