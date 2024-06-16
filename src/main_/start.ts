import { Client, ClientEvents, Collection, IntentsBitField } from "discord.js";
import customClient from "../constants_/custom_client";
import { token } from "../constants_/priv_data.json";
import { commandHandlers } from "../constants_/command_handlers"
import { eventHandler, eventHandlers } from "../constants_/event_handlers";

const bot = new customClient({
    intents: IntentsBitField.Flags.Guilds
})

commandHandlers.forEach(handler => {
    bot.commmands.set(handler.name, handler);
})

eventHandlers.forEach((handler) => {
    // error here, I might change how events work completely
    bot[handler.type](handler.name, (data) => handler.execute(bot, data))
})

bot.login(token)
