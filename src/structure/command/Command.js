const WappermelonModule = require('../WappermelonModule')

class Command extends WappermelonModule {
  constructor ({ id, aliases }) {
    super(id)
    this.aliases = aliases
  }

  async execute (message, args) { throw new Error('Not implemented') }
}

module.exports = Command
