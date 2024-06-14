const emoji = require("discord-emoji-convert");

module.exports = {
  dev: false,
  name: "emojify",
  guildOnly: true,
  description: "turns your test into emojis",
  options: [
    {
      name: "message",
      required: true,
      type: "STRING",
      description: "the message to turn into emojis",
    },
  ],
  code: (client, interaction) => {
    const message = interaction.options.getString("message");
    const result = emoji.convert(message);
    return interaction.reply({
      content: result,
      allowedMentions: {
        repliedUser: false,
      },
    });
  },
};
