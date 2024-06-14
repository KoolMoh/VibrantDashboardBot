module.exports = {
  dev: false,
  name: "8ball",
  category: "fun & util",
  guildOnly: true,
  description: "ask the bot a question",
  options: [
    {
      name: "question",
      type: "STRING",
      required: true,
      description: "the question you want to ask",
    },
  ],
  code: async (client, interaction) => {
    const question = interaction.options.getString("question");
    const answers = [
      "As I see it, yes.",
      "Ask again later.",
      "Better not tell you now.",
      "Cannot predict now.",
      "Concentrate and ask again.",
      "Don’t count on it.",
      "It is certain.",
      "It is decidedly so.",
      "Most likely.",
      "My reply is no.",
      "My sources say no.",
      "Outlook not so good.",
      "Outlook good.",
      "Reply hazy, try again.",
      "Signs point to yes.",
      "Very doubtful.",
      "Without a doubt.",
      "Yes.",
      "Yes – definitely.",
      "You may rely on it.",
    ];
    const answer = answers[Math.floor(Math.random() * answers.length)];
    return interaction.reply({
      ephemeral: true,
      content: `${answer}`,
      allowedMentions: {
        repliedUser: false,
      },
    });
  },
};
