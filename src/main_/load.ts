import { REST, Routes } from "discord.js";
import { token, client_info } from "../constants_/priv_data.json"
import commands_ from "../constants_/slash_commands"

const restClient = new REST().setToken(token);

(async () => {
    await restClient.put(
        Routes.applicationGuildCommands(client_info.id_, client_info.server_),
        {
            body: commands_
        }
    )
    console.log(`Finished loaading.`)
})();