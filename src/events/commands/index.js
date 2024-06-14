const { devs } = require('../../config.js');

const handleCommandInteraction = async (client, interaction) => {
  if (interaction.user.bot) return;

  const command = client.slashCommands.get(interaction.commandName);

  if (!command) return;

  if (command.dev && !devs.includes(interaction.user.id)) {
    return interaction.reply({
      allowedMentions: { 
        repliedUser: false
      },
      content: `<:no:914527497352257557> This is a developer only command!`,
      ephemeral: true,
    });
  }

  // probably uselsee
  //* check for guildOnly
  if (command.guildOnly && interaction.channel.type == "DM") {
    return interaction.reply({
      allowedMentions: { 
        repliedUser: false
      },
      content: `<:no:914527497352257557> This command can't be used in DM channel`,
      ephemeral: true,
    });
  }
  // */

  //* check bot permission
  if (command.botPerms && !interaction.appPermissions.toArray().findArray(command.botPerms)) {
    return interaction.reply({
      allowedMentions: { 
        repliedUser: false
      },
      content: `<:no:914527497352257557> I don't have the following permissions: \`${command.botPerms.join('`, `').toLowerCase()}\``,
      ephemeral: true,
    });
  }
  //*/ 

  // checks user permission
  const userPerms = interaction.channel.permissionsFor(interaction.user);
  if (command.userPerms && !userPerms.toArray().findArray(command.userPerms)) {
    return interaction.reply({
      allowedMentions: { 
        repliedUser: false
      },
      content: `<:no:914527497352257557> you don't have the following permissions: \`${command.userPerms.join('`, `').toLowerCase()}\``,
      ephemeral: true,
    });
  }

  try {
    await command.code(client, interaction);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content:
        `${error}`.length > 4000
          ? "There was an error while executing this command!"
          : `${error}`,
      ephemeral: false,
    });
  }
}

module.exports = handleCommandInteraction