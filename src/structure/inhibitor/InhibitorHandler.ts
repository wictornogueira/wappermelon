import { Message } from "whatsapp-web.js";
import { Command } from "../command/Command";
import { WappermelonHandler } from "../WappermelonHandler";
import { Inhibitor } from "./Inhibitor";

export class InhibitorHandler extends WappermelonHandler {
  async executeAll (message: Message, command: Command) {
    return await this.executeBuiltIn(message, command) || await this.executeCustom(message, command)
  }

  async executeBuiltIn (message: Message, command: Command) {
    const chat = await message.getChat()
    const contact = await message.getContact()

    return (!command.allowGroup && chat.isGroup) ||
      (!command.allowDM && !chat.isGroup ) ||
      (command.ownerOnly && !this.client.isOwner(contact.number))
  }

  async executeCustom (message: Message, command: Command) {
    for (const module of this.getAll() as Inhibitor[]) {
      if (await module.execute(message, command)) { return true }
    }
  }
}
