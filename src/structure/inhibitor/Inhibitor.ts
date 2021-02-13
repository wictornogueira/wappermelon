import { Message } from "whatsapp-web.js";
import { Command } from "../command/Command";
import { NotImplementedError } from "../error/NotImplementedError";
import { WappermelonModule } from "../WappermelonModule";

export class Inhibitor extends WappermelonModule {
  execute (message: Message, command: Command): boolean | Promise<boolean> { throw new NotImplementedError() }
}
