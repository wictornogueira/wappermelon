import { readDirRecursively } from "../utils"
import { WappermelonClient } from "./WappermelonClient"
import { WappermelonModule } from "./WappermelonModule"

export interface WappermelonHandlerOptions {
  defaultDir?: string
}

export class WappermelonHandler {
  modules: Map<string, WappermelonModule>
  defaultDir?: string

  constructor (public client: WappermelonClient, options: WappermelonHandlerOptions = {}) {
    this.modules = new Map()
    this.defaultDir = options.defaultDir
  }

  get (id: string): WappermelonModule {
    return this.modules.get(id)
  }

  getAll (): WappermelonModule[] {
    return Array.from(this.modules.values())
  }

  filter (filter: (module: WappermelonModule) => boolean = () => true): WappermelonModule[] {
    return this.getAll().filter(filter)
  }

  find (filter: (module: WappermelonModule) => boolean = () => true): WappermelonModule {
    return this.getAll().find(filter)
  }

  register (module: WappermelonModule, path?: string): WappermelonModule {
    module.path = path
    module.handler = this
    module.client = this.client

    this.modules.set(module.id, module)
    return module
  }

  unregister (module: WappermelonModule): boolean {
    delete require.cache[module.path]
    return this.modules.delete(module.id)
  }

  // TO BE CLEANED
  load (module: WappermelonModule | string): WappermelonModule {
    let moduleClass

    try {
      moduleClass = (typeof module === 'string') ? require(module) : module
      if ('default' in moduleClass) { moduleClass = moduleClass.default }
    } catch { return }

    if (!(moduleClass.prototype instanceof WappermelonModule)) {
      if (typeof module === 'string') {
        delete require.cache[require.resolve(module)]
      }

      return 
    }

    const moduleObject = new moduleClass()
    const modulePath = (typeof module === 'string') ? module : undefined

    if (this.modules.has(moduleObject.id)) {
      throw new Error(`Module ${moduleObject.id} already loaded`)
    }

    return this.register(moduleObject, modulePath)
  }

  loadAll (directory: string = this.defaultDir): void {
    for (const module of readDirRecursively(directory)) {
      this.load(module)
    }
  }

  unload (module: WappermelonModule | string) {
    if (typeof module === 'string') {
      module = this.modules.get(module)
    }

    if (module) { return this.unregister(module) }
  }

  unloadAll (): void {
    for (const module of this.modules.values()) {
      this.unload(module)
    }
  }

  reload (module) {
    if (this.unload(module)) { this.load(module) }
  }

  reloadAll (): void {
    for (const module of this.modules.values()) {
      this.reload(module)
    }
  }
}
