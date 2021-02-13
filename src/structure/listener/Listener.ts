import { NotImplementedError } from "../error/NotImplementedError";
import { ModuleOptions, WappermelonModule } from "../WappermelonModule";

interface ListenerOptions extends ModuleOptions {
  event: string
}

export class Listener extends WappermelonModule {
  event: string

  constructor (options: ListenerOptions) {
    super(options)
    this.event = options.event
  }

  execute (...args: any[]): any { throw new NotImplementedError() }
}
