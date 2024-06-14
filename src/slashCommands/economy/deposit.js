const { users: schema } = require("./../../schema");

module.exports = {
  dev: false,
  name: "deposit",
  category: "economy",
  guildOnly: true,
  description: "deposit some coins to your bank account",
  options: [
    {
      name: "amount",
      type: "STRING",
      required: true,
      description: `the amount you want to deposit`,
    },
  ],
  code: async (client, interaction) => {
    const author = interaction.user;
    const amount = interaction.options.getString("amount");
    let data;
    try {
      data = await schema.findOne({ userId: author.id });
      if (!data)
        data = await schema.create({
          username: author.username,
          userId: author.id,
        });
    } catch (e) {
      console.log(e);
    }

    // dep all/Number
    if (amount == "all") {
      if (data.coins < 1)
        return interaction.reply({
          allowedMentions: {
            repliedUser: false,
          },
          content: `<:no:914527497352257557> you don't have any coins to deposit`,
          ephemeral: true,
        });
      // update db
      let smth = data.coins;
      data.bank += smth;
      data.coins = 0;
      data.save();

      // sends a confirmation message
      return interaction.reply({
        allowedMentions: {
          repliedUser: false,
        },
        embeds: [
          {
            color: "#277ECD",
            description: `<:yes:914527497574567966> you have successfully deposited ${smth} :coin:`,
            author: {
              name: author.username,
              iconURL: author.avatarURL(),
            },
          },
        ],
      });
    } else {
      // is it a number?
      if (`${Number(amount)}` !== `NaN`) {
        // yes -> positive?
        if (Number(amount) > 0) {
          // yes -> can afford it?
          if (Number(amount) <= data.coins) {
            // yes -> deposit it

            // save it in tue db
            data.bank += Number(amount);
            data.coins -= Number(amount);
            data.save();

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
                  description: `<:yes:914527497574567966> you have successfully deposited ${Number(
                    amount
                  )} :coin:`,
                  color: "#277ECD",
                },
              ],
            });
          } else {
            // can't afford it
            return interaction.reply({
              ephemeral: true,
              content:
                "<:no:914527497352257557> you don't have enough coins to deposit",
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
          content: `<:no:914527497352257557> incorrect usage, was expecting <Number | all>, and got \`${amount}\``,
          allowedMentions: {
            repliedUser: false,
          },
        });
      }
    }
  },
};
