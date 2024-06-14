const fs = require('fs');

module.exports = {
  dev: true,
  name: "reload",
  description: "Reload a slash command",
  category: 'developer',
  guildOnly: false,
  //userPerms: ["ADMINISTRATOR"],
  //botPerms: ["ADMINISTRATOR"],
  options: [
    {
      name: "command",
      description: "The command to reload",
      type: 3,
      required: true,
    }
  ],
  code: async (client, interaction) => {
    const commandName = interaction.options.getString('command', true).toLowerCase();
    const command = client.slashCommands.get(commandName);

    if (!command) 
      return interaction.reply(`There is no command with name \`${commandName}\`!`);
    
    if (!command.category)
      return interaction.reply(`Unable to locate and update command!\nCommand category is undefined.`);

    delete require.cache[require.resolve(`../${command.category}/${command.name}`)];

    
    try {
      const newCommand = require(`../${command.category}/${command.name}.js`) || null;

      if (!newCommand) 
        return interaction.reply(`Unable to locate and update command!\nCommand category does not exist.`);

      client.slashCommands.set(newCommand.name, newCommand);
      await interaction.reply(`Command \`${newCommand.name}\` was reloaded!`);
    } catch (error) {
      console.error(error);
      await interaction.reply(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
    }
  },
};