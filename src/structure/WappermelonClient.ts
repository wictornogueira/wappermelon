import { writeFileSync } from 'fs'
import { Client, ClientOptions } from 'whatsapp-web.js'
import { resolveSession } from '../utils'

interface WappermelonClientOptions {
  clientOptions?: ClientOptions
  sessionPath?: string
  owner?: string | string[]
}


export class WappermelonClient extends Client {
  owner: string | string[]
  sessionPath: string
  options: ClientOptions

  constructor (options: WappermelonClientOptions = {}) {
    super(options.clientOptions)

    this.owner = options.owner || []
    this.sessionPath = options.sessionPath
  }

  initialize () {
    this.options.session = resolveSession(this.sessionPath)
    this.on('authenticated', session => {
      if (this.sessionPath) { writeFileSync(this.sessionPath, JSON.stringify(session, null, 2)) }
    })

    return super.initialize()
  }

  isOwner (id: string): boolean {
    return Array.isArray(this.owner) ? this.owner.includes(id) : this.owner === id
  }
}
