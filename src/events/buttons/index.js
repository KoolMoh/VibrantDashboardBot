const { devs } = require('../../config.js');

const handleButtonInteraction = async (client, interaction) => {
  if (interaction.user.bot) return;

  const button = client.commandButtons.find(
    btn => btn.name == interaction.customId && btn.type == "button"
  );

  if (!button) {
    return interaction.reply({
      allowedMentions: { repliedUser: false },
      content: `This button currently has no use`,
      ephemiral: true
    });
  }

  if (button.dev) {
    if (!devs.includes(interaction.user.id)) {
      return interaction.reply({
        allowedMentions: { repliedUser: false },
        content:
          "<:no:914527497352257557> This is a developer only command!",
      });
    }
  }

  /*/ checks user permission
  if (button.permissions) {
    const authorPerms = interaction.channel.permissionsFor(
      interaction.user
    );
    if (
      !authorPerms ||
      !authorPerms.toArray().findArray(button.permissions)
    ) {
      return interaction.reply(
        `<:no:914527497352257557> you don't have ${button.permissions} permission(s)!`
      );
    }
  }*/

  try {
    await button.execute(client, interaction);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content:
        `${error}`.length > 4000
          ? "There was an error while executing this command!"
          : `${error}`,
      ephemeral: true,
    });
  }
}

module.exports = handleButtonInteraction