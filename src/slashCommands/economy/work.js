const { users: userDoc, Gcooldown: cooldownDoc } = require("../../schema");

module.exports = {
  dev: false,
  name: "work",
  category: "economy",
  guildOnly: true,
  description: "work a random job to earn some money",
  code: async (client, interaction) => {
    let cooldown;
    try {
      cooldown = await cooldownDoc.findOne({
        userId: interaction.user.id,
        command: "work",
      });
      if (!cooldown)
        cooldown = await cooldownDoc.create({
          userId: interaction.user.id,
          command: "work",
          time: Date.now(),
        });
    } catch (e) {
      console.log(e);
    }
    if (cooldown.time > Date.now())
      return interaction.reply({
        content: `<:no:914527497352257557> you can't work for the next ${require("pretty-ms")(
          Number(cooldown.time) - Date.now()
        )}`,
        allowedMentions: {
          repliedUser: false,
        },
      });
    let user;
    try {
      user = await user.findOne({ userId: interaction.user.id });
      if (!user)
        user = await user.create({
          userId: interaction.user.id,
          username: interaction.user.username,
        });
    } catch (e) {
      console.log(e);
    }
    const amount = Math.floor(Math.random() * (3000 - 500) + 500);
    let jobs = [
      `you shared your research with nasa and got paid ${amount} :coin:`,
      `you published a great project and someone bought it for ${amount} :coin:`,
      `you washed the neighbors car and got ${amount} :coin:`,
      `you did the house chores and your mom gave you ${amount} :coin:`,
      `you worked at a pizza place for a day and got ${amount} :coin:`,
      `you begged on the streets all day and got ${amount} :coin:`,
      `you cleaned the garage and your father gave you ${amount} :coin:`,
      `you worked as a teacher for a day and got ${amount} :coin:`,
      `you worked at a fancy resturant for a day and got ${amount} :coin:`,
      `you worked as an engineer for a day and got ${amount} :coin:`,
      `you uploaded a video on YouTube and got ${amount} :coin:`,
      `you solved a mystery murder case and got ${amount} :coin:`,
      `you streamed all day and got ${amount} :coin: from donations and subs`,
      `you worked for extra hours and your bose rewarded you with ${amount} :coin:`,
      `you worked for a big company and got ${amount} :coin:`,
      `you worked as a pizza delivery and got ${amount} :coin:`,
      `you cleaned your neighbors creepy basement and got ${amount} :coin:`,
      `you worked as a photographer for celebrities and got ${amount} :coin:`,
      `you worked as a bodyguard for a famous actor and got ${amount} :coin:`,
      `you sold a discord bot on fiver and got ${amount} :coin:`,
      `you built a web page for a business man and got ${amount} :coin:`,
      `you worked at a supermarket for a day and got ${amount} :coin:`,
      `you worked at a mining company and got ${amount} :coin:`,
      `you made a book about life and sold it for ${amount} :coin:`,
    ];
    let j = Math.floor(Math.random() * jobs.length);

    user.coins += Number(amount);
    user.save();
    cooldown.time = Date.now() + 86400000;
    cooldown.save();
    return interaction.reply({
      allowedMentions: {
        repliedUser: false,
      },
      embeds: [
        {
          color: parseInt('277ECD', 16),
          author: {
            name: interaction.user.username,
            iconURL: interaction.user.avatarURL(),
          },
          description: jobs[j],
        },
      ],
    });
  },
};
