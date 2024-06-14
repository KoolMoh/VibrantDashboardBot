module.exports = {
  dev: false,
  name: "invite",
  guildOnly: false,
  description: "sends a link to invite MegaBot to your server",
  category: 'others',
  code: (client, interaction) => {
    return interaction.reply({
      allowedMentions: {
        repliedUser: false,
      },
      embeds: [
        {
          color: "#277ECD",
          title: "<:Bot:684308931534651430> Invite Link",
          description: `[click here](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=295212280950) to invite MegaBot!`,
        },
      ],
    });
  },
};
