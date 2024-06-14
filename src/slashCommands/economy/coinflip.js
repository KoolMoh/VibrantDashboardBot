const { users: schema } = require("./../../schema");
const randmoizer = require("@ronin_jjj/randomize");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  dev: false,
  name: "coinflip",
  category: "economy",
  guildOnly: true,
  description: "bet your coins on a coin flip",
  options: [
    {
      name: "face",
      type: "STRING",
      required: true,
      description: `the face to bet on`,
      choices: [
        {
          name: "head",
          value: "head",
        },
        {
          name: "tail",
          value: "tail",
        },
      ],
    }, {
      name: "amount",
      type: "STRING",
      required: true,
      description: "the amount of coins you want to bet",
    },
  ],
  code: async (client, interaction) => {
    const author = interaction.user;
    const face = interaction.options.getString("face");
    const amount = interaction.options.getString("amount");
    const random = `${randmoizer({
      head: 50,
      tail: 50,
    })}`;
    const emoji = `%${random}%`
      .replace("%head%", "<:coin_head:799341374444929025>")
      .replace("%tail%", "<:coin_tail:799334295206101012>");
    
    
    let data;
    try {
      data = await schema.findOne({ userId: author.id });
      if (!data)
        data = await schema.create({
          userId: author.id,
        });
    } catch (e) {
      console.log(e);
    }

    if (amount == "all") {
      if (data.coins < 1)
        return interaction.reply({
          allowedMentions: {
            repliedUser: false,
          },
          content: `<:no:914527497352257557> you don't have any coins to bet on`,
          ephemeral: true,
        });

      await interaction.reply({
        // coin flip animation
        content: `<a:coinflip:799424497009819648> you flipped a coin on ${data.coins} and...`,
      });

      // wait 3.5 sec
      await wait(3500);

      // update db
      if (face == random) {
        // win
        await interaction.editReply({
          content: `${emoji} you flipped a coin on ${data.coins} and won ${
            data.coins * 2
          }`,
        });

        data.coins *= 2;
        data.save();
        return;
      }
      
      // lose
      await interaction.editReply({
        content: `${emoji} you flipped a coin on ${data.coins} and lost them all ._.`,
      });

      data.coins = 0;
      data.save();
    } else if (`${Number(amount)}` !== `NaN`) { // is it a number?
      // yes -> positive?
      if (Number(amount) < 1) 
        // less than 1
        return interaction.reply({
          ephemeral: true,
          content: "<:no:914527497352257557> amount can't be less than 0",
          allowedMentions: {
            repliedUser: false,
          },
        });

      // yes -> can afford it?
      if (Number(amount) <= data.coins)
        // can't afford it
        return interaction.reply({
          ephemeral: true,
          content:
            "<:no:914527497352257557> you don't have enough coins to bet on",
          allowedMentions: {
            repliedUser: false,
          },
        });
      

      // yes -> flip it
      await interaction.reply({
        // coin flip animation
        content: `<a:coinflip:799424497009819648> you flipped a coin on ${Number(
          amount
        )} and...`,
      });

      // wait 3.5 sec
      await wait(3500);

      // update db
      if (face == random) {
        // win
        await interaction.editReply({
          content: `${emoji} you flipped a coin on ${Number(
            amount
          )} and won ${Number(amount) * 2}`,
        });

        data.coins += Number(amount) * 2;
        data.save();
        return;
      }
      // lose
      await interaction.editReply({
        content: `${emoji} you flipped a coin on ${Number(
          amount
        )} and lost them all ._.`,
      });

      data.coins -= Number(amount);
      data.save();
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
  },
};
