import { RESTPostAPIApplicationCommandsJSONBody } from "discord.js"
const commands: RESTPostAPIApplicationCommandsJSONBody[] = [{
    name: "test",
    type: 1,
    description: "A test command."
}]

export default commands;