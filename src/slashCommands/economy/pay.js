const { users } = require("./../../schema.js");

module.exports = {
  dev: false,
  name: "pay",
  category: "economy",
  guildOnly: true,
  description: "transfer some money to a user",
  options: [
    {
      name: "user",
      type: "USER",
      required: true,
      description: "the user to transfer money to",
    },
    {
      name: "amount",
      type: "STRING",
      required: true,
      description: "the amount you want to transfer",
    },
  ],
  code: async (client, interaction) => {
    const author = interaction.user;
    const user = interaction.options.getUser("user");
    const amount = interaction.options.getString("amount");

    // check if user is a bot
    if (user.bot) {
      // if yes, return
      return interaction.reply({
        content:
          "<:no:914527497352257557> you can't give bots money, bots can't have a bank account",
        ephemeral: true,
      });
    } else {
      // check if the target == author
      if (author.id == user.id) {
        // if yes, return
        return interaction.reply({
          content:
            "<:no:914527497352257557> what is the point of paying your self",
          ephemeral: true,
        });
      } else {
        // prepare db
        let authorData;
        let userData;
        try {
          authorData = await users.findOne({ userId: author.id });
          userData = await users.findOne({ userId: user.id });
          if (!authorData)
            authorData = await users.create({
              username: author.username,
              userId: author.id,
            });
          if (!userData)
            userData = await users.create({
              username: user.username,
              userId: user.id,
            });
        } catch (e) {
          console.log(e);
        }

        // elss check if amount is 'all'
        if (amount == "all") {
          // if yes, check if author has money
          if (authorData.coins > 0) {
            // if yes, transfer & return

            let coins = authorData.coins;
            userData.coins += coins;
            authorData.coins = 0;

            authorData.save();
            userData.save();

            return interaction.reply({
              allowedMentions: {
                repliedUser: false,
              },
              embeds: [
                {
                  color: parseInt('277ECD', 16),
                  description: `<:yes:914527497574567966> successfully transferred ${coins} :coin: to ${user.username} `,
                  author: {
                    name: author.username,
                    iconURL: author.avatarURL(),
                  },
                },
              ],
            });
          } else {
            // else, return
            return interaction.reply({
              ephemeral: true,
              content: `<:no:914527497352257557> it looks like you don't have any coins to transfer${
                authorData.bank > 0
                  ? ", withdraw some money then try again"
                  : ""
              }`,
            });
          }
        } else {
          // else, check if amount is a number
          if (`${Number(amount)}` !== `NaN`) {
            // yes -> positive?
            if (Number(amount) > 0) {
              // yes -> can afford it?
              if (Number(amount) <= authorData.coins) {
                // yes -> transfer it
                userData.coins += Number(amount);
                authorData.coins -= Number(amount);

                userData.save();
                authorData.save();

                // sends a confirmation message
                return interaction.reply({
                  allowedMentions: {
                    repliedUser: false,
                  },
                  embeds: [
                    {
                      author: {
                        name: author.username,
                        iconURL: author.avatarURL(),
                      },
                      description: `<:yes:914527497574567966> you have successfully transferred ${Number(
                        amount
                      )} :coin: to ${user.username}`,
                      color: "#277ECD",
                    },
                  ],
                });
              } else {
                // can't afford it
                return interaction.reply({
                  ephemeral: true,
                  content:
                    "<:no:914527497352257557> you don't have that many coins in your hand",
                  allowedMentions: {
                    repliedUser: false,
                  },
                });
              }
            } else {
              // less than 0
              return interaction.reply({
                ephemeral: true,
                content: "<:no:914527497352257557> amount can't be less than 0",
                allowedMentions: {
                  repliedUser: false,
                },
              });
            }
          } else {
            // not a number
            return interaction.reply({
              ephemeral: true,
              content:
                "<:no:914527497352257557> Wrong usage!```\n/pay <user> <amount|all>```",
              allowedMentions: {
                repliedUser: false,
              },
            });
          }
        }
      }
    }
  },
};
