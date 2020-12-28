const { Command } = require('wappermelon')

class PingCommand extends Command {
  constructor () {
    super({
      id: 'ping',
      aliases: ['ping', 'test']
    })
  }

  execute (message) {
    return message.reply('Pong!')
  }
}

module.exports = PingCommand
