import fetch from 'node-fetch'
import { Message, MessageMedia } from "whatsapp-web.js"
import { getMime } from "./getMime"

export type MediaResolvable = MessageMedia | Message | string

function fromURL (url: string, downloadLimit: number) {
  return new Promise<MessageMedia | undefined>(resolve => {
    fetch(url, { size: downloadLimit, timeout: 5000, headers: { accept: 'image/* video/*' } })
      .then(async response => {
        const buf = await response.buffer()
        const data = buf.toString('base64')
        const mime = response.headers.get('Content-Type') || getMime(data)

        resolve(data && mime ? new MessageMedia(mime, data) : null)
      })
      .catch(() => { resolve(null) })
  })
}

async function fromMessage (message: Message, downloadLimit: number): Promise<MessageMedia | null> {
  switch (true) {
    case message.hasMedia:
      return await message.downloadMedia()
    case message.links.length > 0:
      return await fromURL(message.links[0], downloadLimit)
    case message.hasQuotedMsg:
      return await fromMessage(await message.getQuotedMessage(), downloadLimit)
  }
}

export async function resolveMedia (media: MediaResolvable, downloadLimit: number = 533504): Promise<MessageMedia | null> {
  if (typeof media === 'string') {
    return await fromURL(media, downloadLimit)
  }

  if ('mimetype' in media && 'data' in media) {
    return media as MessageMedia
  }

  return await fromMessage(media, downloadLimit)
}
