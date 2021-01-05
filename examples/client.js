const path = require('path')
const qrcode = require('qrcode-terminal')
const { WappermelonClient, CommandHandler } = require('wappermelon')

class ExampleClient extends WappermelonClient {
  constructor (options) {
    super(options)

    this.commandHandler = new CommandHandler(this)
    this.commandHandler.loadAll(path.join(__dirname, 'commands/'))
  }
}

client = new ExampleClient({ session: 'session.json', options: { puppeteer: { headless: true } } })
client.initialize()

client.on('qr', qr => {
  qrcode.generate(qr, { small: true }, qr => {
    console.log(`Scan the following QR Code as you would to login to WhatsApp Web:\n${qr}`)
  })
})

client.on('auth-failure', console.log)

client.on('ready', () => {
  console.log(`Connected as ${client.info.pushname} (+${client.info.me.user}).\nDone in ${process.uptime().toFixed(1)} seconds.`)
})
