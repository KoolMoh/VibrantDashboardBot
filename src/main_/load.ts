import { REST, Routes } from "discord.js";
import { token, client_info } from "../constants_/locked_data.json"
import commands_ from "../constants_/slash_commands"

const restClient = new REST().setToken(token);

(async () => {
    const result = await restClient.put(
        Routes.applicationGuildCommands(client_info.id_, client_info.server_),
        {
            body: commands_
        }
    )
    console.log(`YO!!!!! ${(result as any).toString()} <-`);
})();