const { users: schema } = require("../../schema");

module.exports = {
  dev: false,
  name: "balance",
  category: "economy",
  guildOnly: true,
  description: "shows the amount of coins you/target have",
  options: [
    {
      name: "user",
      type: "USER",
      required: false,
      description: `the user to display their balance`,
    },
  ],
  code: async (client, interaction) => {
    const user = interaction.options.getUser("user") || interaction.user;

    if (user.bot)
      return interaction.reply({
        allowedMentions: {
          repliedUser: false,
        },
        ephemeral: true,
        content: `<:no:914527497352257557> bots can't have a bank account`,
      });
    
    
    let data;
    try {
      data = await schema.findOne({ userId: user.id });
      if (!data)
        data = await schema.create({
          username: user.username,
          userId: user.id,
        });
    } catch (e) {
      console.log(e);
    }

    return interaction.reply({
      embeds: [
        {
          author: {
            name: `${user.username}'s Balance Card`,
            iconURL: user.avatarURL(),
          },
          color: "#277ECD",
          footer: {
            text: `Requested by ${interaction.user.username}`,
            iconURL: interaction.user.avatarURL(),
          },
          fields: [
            {
              name: ":coin: Coins",
              value: `${data.coins}`,
              inline: true,
            },
            {
              name: ":bank: Bank",
              value: `${data.bank}`,
              inline: true,
            },
            {
              name: ":moneybag: Total",
              value: `${data.coins + data.bank}`,
              inline: true,
            },
          ],
        },
      ],
      allowedMentions: {
        repliedUser: false,
      },
    });
  },
};
