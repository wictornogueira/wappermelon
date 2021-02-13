import { readFileSync } from 'fs'
import { resolve } from 'path'
import { ClientSession } from 'whatsapp-web.js'

export type SessionResolvable = ClientSession | string

export function resolveSession (session: SessionResolvable): ClientSession | undefined {
  if (typeof session === 'string') {
    try {
      session = JSON.parse(readFileSync(resolve(session), { encoding: 'utf-8' })) as ClientSession
    } catch { return }
  }

  return session
}
