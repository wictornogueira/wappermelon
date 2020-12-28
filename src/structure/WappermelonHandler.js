const fs = require('fs')
const path = require('path')
const EventEmitter = require('events')
const WappermelonModule = require('./WappermelonModule')

class WappermelonHandler extends EventEmitter {
  constructor (client) {
    super()
    this.client = client
    this.modules = new Map()
  }

  get (id) {
    return this.modules.get(id)
  }

  find (filter) {
    return Array.from(this.modules.values()).find(filter)
  }

  register (module, modulePath) {
    module.path = modulePath
    module.handler = this
    module.client = this.client

    this.modules.set(module.id, module)
    return module
  }

  unregister (module) {
    delete require.cache[module.path]
    return this.modules.delete(module.id)
  }

  load (module) {
    let moduleClass

    try {
      moduleClass = (typeof module === 'function') ? module : require(module)
    } catch (e) { return }

    if (!(moduleClass.prototype instanceof WappermelonModule)) {
      if (typeof module === 'string') {
        delete require.cache[require.resolve(moduleClass)]
      }

      return 
    }

    const moduleObject = new moduleClass()
    const modulePath = (typeof module === 'string') ? module : undefined

    if (!moduleObject.id || this.modules.has(moduleObject.id)) {
      throw new Error(`Module ${this.moduleObject.id} already loaded`)
    }

    return this.register(moduleObject, modulePath)
  }

  loadAll (directory, filter = () => true) {
    const filePaths = fs.readdirSync(directory)
      // .filter(filePath => path.extname(filePath) === '.js')
      .map(filePath => path.resolve(path.join(directory, filePath)))

    for (const filePath of filePaths) {
      if (filter(filePath)) { this.load(filePath) }
    }

    return this
  }

  unload (module) {
    if (typeof module === 'string') {
      module = this.get(module)
    }

    if (!module) { return }

    return this.unregister(module)
  }

  unloadAll (filter = () => true) {
    for (const mod of Array.from(this.modules.values()).filter(filter)) {
      this.unload(mod)
    }

    return this
  }

}

module.exports = WappermelonHandler
