module.exports = {
  dev: false,
  name: "search",
  guildOnly: true,
  description: "search for anything in YouTube or Google",
  category: 'utils',
  options: [
    {
      name: "platform",
      type: "STRING",
      required: true,
      description: "the platform you want to search on",
      choices: [
        {
          name: "YouTube",
          value: "youtube",
        },
        {
          name: "Google",
          value: "google",
        },
      ],
    },
    {
      name: "item",
      type: "STRING",
      required: true,
      description: "the item you want to search about",
    },
  ],
  code: (client, interaction) => {
    const platform = interaction.options.getString("platform");
    const item = interaction.options.getString("item");
    let result;
    if (platform == "youtube") {
      result = `https://www.youtube.com/results?search_query=${item
        .trim()
        .replaceAll(" ", "+")}`;
    } else {
      result = `https://www.google.com/search?q=${item
        .trim()
        .replaceAll(" ", "+")}`;
    }

    return interaction.reply({
      ephemeral: true,
      content: `your result was found! [Click me](${result})`,
    });
  },
};
