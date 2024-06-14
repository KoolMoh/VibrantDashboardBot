module.exports = {
  dev: false,
  name: "support",
  guildOnly: false,
  description: "sends an invitation of MegaBot support server",
  category: 'others',
  code: (client, interaction) => {
    return interaction.reply({
      allowedMentions: {
        repliedUser: false,
      },
      embeds: [
        {
          title: "<:server:802800832038043688> Support Server",
          color: parseInt('277ECD', 16),
          description: `[click here](https://discord.gg/AvWun4urNV) to join MegaBot support server`,
        },
      ],
    });
  },
};
