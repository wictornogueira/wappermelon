const { Command } = require('wappermelon')

class ReverseCommand extends Command {
  constructor () {
    super({
      id: 'reverse',
      aliases: ['reverse']
    })
  }

  execute (message, args) {
    return message.reply(args.join(' ').split('').reverse().join(''))
  }
}

module.exports = ReverseCommand
