module.exports = {
  dev: false,
  name: "help",
  guildOnly: false,
  description:
    "sends a menu of all commands/shows how to use a specific command",
  category: 'utils',
  options: [
    {
      name: "command",
      required: false,
      description: "displays information about specific command",
      type: "STRING",
      choices: [
        {
          name: "help",
          value: "helpCommand",
        },
        {
          name: "avatar",
          value: "avatarCommand",
        },
      ],
    },
  ],
  code: async (client, interaction) => {
    const command = interaction.options.getString("command") || null;
    if (command) {
      let title, fields;
      if (command == "help") {
        title = ``;
      } else if (command == "avatar") {
        title = ``;
      } else if (command == "user") {
        title = ``;
      } else if (command == "") {
        title = ``;
      } else if (command == "warn") {
        title = ``;
      } else if (command == "kick") {
        title = ``;
      } else if (command == "timeout") {
        title = ``;
      } else if (command == "ban") {
        title = ``;
      } else if (command == "") {
        title = ``;
      } else if (command == "balance") {
        title = ``;
      } else if (command == "work") {
        title = ``;
      } else if (command == "deposit") {
        title = ``;
      } else if (command == "withdraw") {
        title = ``;
      } else if (command == "pay") {
        title = ``;
      } else if (command == "") {
        title = ``;
      } else if (command == "support") {
        title = ``;
      } else if (command == "invite") {
        title = ``;
      } else if (command == "") {
        title = ``;
      } else if (command == "") {
        title = ``;
      } else if (command == "") {
        title = ``;
      } else if (command == "") {
        title = ``;
      }

      return interaction.reply({
        embeds: [
          {
            title,
            color: parseInt('277ECD', 16),
            fields,
          },
        ],
      });
    } else {
      return interaction.reply({
        embeds: [
          {
            title: ":mailbox_with_mail: MegaBot Commands List",
            color: parseInt('277ECD', 16),
            fields: [
              {
                name: ":earth_africa: Public Commands",
                value: "/help, /avatar, /user",
                inline: true,
              },
              {
                name: "<:admin:913024113071759392> Admin Commands",
                value:
                  "/warn add, /warn remove, /warn list, /warn clear, /kick, /timeout add, /timeout remove, /ban add, /ban remove",
                inline: true,
              },
              {
                name: "<:games:913024039855980595> Games & Fun Commands",
                value: "/tictactoe",
                inline: true,
              },
              {
                name: ":coin: Economy System",
                value: "/balance, /work, /deposit, /withdraw, /pay",
                inline: true,
              },
              {
                name: "<:RPG:913024216679456779> RPG",
                value: "soon™",
                inline: true,
              },
              {
                name: ":tickets: Ticket Commands",
                value:
                  "/ticket create, /ticket delete, /ticket add, /ticket remove, /ticket setup",
                inline: true,
              },
              {
                name: "<:others:821205261602652201> Other Commands",
                value: "/support, /invite",
                inline: true,
              },
            ],
            footer: {
              text: `Requested By ${interaction.user.username}`,
              iconURL: interaction.user.avatarURL(),
            },
          },
        ],
        allowedMentions: {
          repliedUser: false,
        },
      });
    }
  },
};
