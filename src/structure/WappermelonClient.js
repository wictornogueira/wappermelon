const fs = require('fs')
const path = require('path')
const { Client } = require('whatsapp-web.js')

class WappermelonClient extends Client {
  constructor ({ session, staff, options }) {
    super(options)
    this.options.session = this._resolveSession(session)
    this.staff = staff
  }

  _resolveSession (session) {
    if (typeof session === 'object') {
      this.sessionPath = (session.path) ? session.path : require.resolve(session)
      return session
    }

    if (typeof session !== 'string') { throw new Error('Could not resolve session') }

    this.sessionPath = path.resolve(session)
    if (fs.existsSync(this.sessionPath)) {
      return JSON.parse(fs.readFileSync(this.sessionPath))
    }
  }

  initialize () {
    this.on('authenticated', session => {
      if (this.sessionPath) {
        fs.writeFileSync(this.sessionPath, JSON.stringify(session))
      }
    })

    return super.initialize() 
  }

  isStaff (id) {
    return this.staff === id || (Array.isArray(this.staff) && this.staff.includes(id))
  }
}

module.exports = WappermelonClient
