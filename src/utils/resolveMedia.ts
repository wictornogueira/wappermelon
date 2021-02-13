import axios from "axios"
import { Message, MessageMedia } from "whatsapp-web.js"
import { getMime } from "./getMime"

export type MediaResolvable = MessageMedia | Message | string

function fromURL (url: string) {
  return new Promise<MessageMedia | undefined>(resolve => {
    axios.get(url, { responseType: 'arraybuffer', maxContentLength: 533504 })
      .then(response => {
        const data = response.data.toString('base64')
        const mime = getMime(data)

        resolve(data && mime ? new MessageMedia(mime, data) : undefined)
      })
      .catch(() => { resolve(undefined) })
  })
}

async function fromMessage (message: Message): Promise<MessageMedia | undefined> {
  if (message.hasMedia) {
    return await message.downloadMedia()
  }

  const match = message.body.match(/https?:\/\/\S*/)
  if (match) {
    return await fromURL(match[0])
  }

  if (message.hasQuotedMsg) {
    const quoted = await message.getQuotedMessage()
    return await fromMessage(quoted)
  }
}

export async function resolveMedia (media: MediaResolvable): Promise<MessageMedia | undefined> {
  if (typeof media === 'string') {
    return await fromURL(media)
  }

  if ('mimetype' in media && 'data' in media) {
    return media as MessageMedia
  }

  return await fromMessage(media)
}
