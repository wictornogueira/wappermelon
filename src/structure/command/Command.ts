import { Message } from "whatsapp-web.js"
import { NotImplementedError } from "../error/NotImplementedError"
import { ModuleOptions, WappermelonModule } from "../WappermelonModule"

interface ArgOptions {
  id: string
  type?: 'string' | 'number' | 'boolean' | 'media'
  required?: boolean
}

interface CommandOptions extends ModuleOptions {
  aliases: string[]
  ownerOnly?: boolean
  allowGroup?: boolean
  allowDM?: boolean
  args?: ArgOptions[]
  description?: string
  usage?: string[]
}

export class Command extends WappermelonModule {
  aliases: string[]
  ownerOnly: boolean
  allowGroup: boolean
  allowDM: boolean
  args: ArgOptions[]
  description: string
  usage: string[]

  constructor (options: CommandOptions) {
    super(options)

    this.aliases = options.aliases
    this.allowDM = 'allowDM' in options ? options.allowDM : true
    this.allowGroup = 'allowGroup' in options ? options.allowGroup : true
    this.ownerOnly = 'ownerOnly' in options ? options.ownerOnly : false
    this.args = options.args || []
    this.description = options.description || ''
    this.usage = options.usage || []
  }

  execute (message: Message, args?: any): any { throw new NotImplementedError() }
}
