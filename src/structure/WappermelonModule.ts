import { WappermelonClient } from "./WappermelonClient";
import { WappermelonHandler } from "./WappermelonHandler";

export interface ModuleOptions {
  id: string
  category?: string
}

export class WappermelonModule {
  client: WappermelonClient
  handler: WappermelonHandler
  path: string

  id: string
  category: string

  constructor (options: ModuleOptions) {
    this.id = options.id
    this.category = options.category || 'default'
  }

  unload () {
    return this.handler.unload(this.id)
  }

  reload () {
    return this.handler.reload(this.id)
  }
}
