import { Message } from "whatsapp-web.js";
import { InhibitorHandler } from "../inhibitor/InhibitorHandler";
import { WappermelonClient } from "../WappermelonClient";
import { WappermelonHandler, WappermelonHandlerOptions } from "../WappermelonHandler";
import { Command } from './Command'

interface CommandHandlerOptions extends WappermelonHandlerOptions {
  prefix: string
}

export class CommandHandler extends WappermelonHandler {
  prefix: string
  inhibitorHandler: InhibitorHandler
  getAll: () => Command[]

  constructor (client: WappermelonClient, options: CommandHandlerOptions) {
    super(client, options)
    this.prefix = options.prefix

    this.init()
  }

  get (id: string): Command {
    return this.find((module: Command) => module.aliases.includes(id)) as Command
  }

  private init (): void {
    this.client.on('message', message => {
      if (message.body.startsWith(this.prefix)) {
        const args = message.body.split(' ')
        const cmd = args.shift().substr(this.prefix.length)

        return this.execute(message, cmd, args)
      }
    })
  }

  useInhibitor (inhibitorHandler: InhibitorHandler) {
    this.inhibitorHandler = inhibitorHandler
  }

  async execute (message: Message, cmd: string, args: string[]) {
    const command = this.get(cmd)

    if (!command) { return }
    if (this.inhibitorHandler && await this.inhibitorHandler.executeAll(message, command)) { return }

    return command.execute(message, args)
  }
}
