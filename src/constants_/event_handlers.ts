import { ClientEvents, InteractionType } from "discord.js";
import customClient from "./custom_client";
import { getPermissionLvl } from "./command_handlers";

const readyEvent: eventHandler<"ready"> = {
    name: "ready",
    type: "once",
    execute(client){
        console.log(`${client.user?.username} is ready to go!`)
    }
}

const interactionEvent: eventHandler<"interactionCreate"> = {
    name: "interactionCreate",
    type: "on",
    execute: (client, interaction) => {
        if(interaction.type == InteractionType.ApplicationCommand){
            try {
                const command = client.commmands.get(interaction.commandName)
                if(getPermissionLvl(interaction.user) == command?.permissionLvl){
                    interaction.reply(command.execute(client, interaction));
                } else {
                    interaction.reply(`Unable to execute the command. The command requires permission level ${command?.permissionLvl}.`)
                }
            } catch(err){
                console.log("something happened. " + err)
                interaction.reply("something went wrong :(")
            }
        }
    } 
}

export const eventHandlers = [ interactionEvent, readyEvent ]

export type eventHandler<Event extends keyof ClientEvents> = {
    name: Event;
    type: "on" | "once";
    execute: (client: customClient, ...data: ClientEvents[Event]) => any;
}