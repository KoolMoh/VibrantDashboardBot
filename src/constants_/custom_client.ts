import { Client, Collection } from "discord.js";
import { commandHandler } from "./command_handlers";

export default class customClient extends Client {
    commmands = new Collection<string, commandHandler>();
}