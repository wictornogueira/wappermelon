const path = require('path')
const { WappermelonClient, CommandHandler } = require('wappermelon')

class ExampleClient extends WappermelonClient {
  constructor ({ puppeteer, session }) {
    super({ puppeteer, session })

    this.commandHandler = new CommandHandler(this)
    this.commandHandler.loadAll(path.join(__dirname, 'commands/'))
  }
}

client = new ExampleClient({ session: 'session.json' })
client.initialize()

client.on('ready', () => {
  console.log('I\' ready!')
})
