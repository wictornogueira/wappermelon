const WappermelonHandler = require('../WappermelonHandler')

class CommandHandler extends WappermelonHandler {
  constructor (client, prefix = '.') {
    super(client)

    this.prefix = prefix
    this.init()
  }

  get (id) {
    return this.modules.get(id) || this.find(command => command.aliases.includes(id))
  }

  init () {
    this.client.on('message', (message) => {
      if (!message.body.startsWith(this.prefix)) { return }

      const args = message.body.split(' ')
      const command = args.shift().substr(this.prefix.length)

      return this.run(message, command, args)
    })
  }

  async run (message, command, args) {
    const commandModule = this.get(command)
    if (!commandModule) { return }

    return commandModule.execute(message, args)
  }
}

module.exports = CommandHandler
