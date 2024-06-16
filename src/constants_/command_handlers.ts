import { Interaction, User } from "discord.js";
import customClient from "./custom_client";
import { client_info } from "../constants_/priv_data.json";

export enum permissionLvl {
    Owner,
    User
}

export const getPermissionLvl = (user: User) => {
    if(user.id == client_info.owner_id_) return permissionLvl.Owner;
    else return permissionLvl.User;
}

export const commandHandlers: commandHandler[] = [{
    name: "test",
    execute: (client, interaction) => {
        return `Alright, ${interaction.user.username}. ${interaction.guild?.id} is this sever's id. ${interaction.guild?.name} is the name.`
    },
    permissionLvl: permissionLvl.Owner
}]

export type commandHandler = {
    name: string;
    execute: (client: customClient, interaction: Interaction) => string;
    permissionLvl: permissionLvl;
}