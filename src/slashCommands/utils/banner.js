module.exports = {
  dev: false,
  name: "banner",
  guildOnly: true,
  description: "sends the banner of the target/author",
  category: "utils",
  options: [
    {
      name: "target",
      description: "the user to display their banner",
      required: false,
      type: 6,
    },
  ],
  code: async (client, interaction) => {
    const user = interaction.options.getUser("target") || interaction.user;

    const data = await client.users.fetch(user.id, { force: true });

    if (!data.banner) {
      const message = user.id === interaction.user.id ? 'You don\'t have a banner!' : user.username + ' does not have a banner!';
      return interaction.reply({
        allowedMentions: {
          repliedUser: false,
        },
        ephemeral: true,
        content: message
      });
    }

    return interaction.reply({
      allowedMentions: {
        repliedUser: false,
      },
      embeds: [
        {
          author: {
            name: `${user.tag}`,
            iconURL: `${data.displayAvatarURL({ size: 1024, dynamic: true })}`,
          },
          color: parseInt("277ECD", 16),
          footer: {
            text: `Requested by ${interaction.user.username}`,
            iconURL: `${interaction.user.displayAvatarURL({
              size: 1024,
              dynamic: true,
            })}`,
          },
          image: {
            url: `${data.bannerURL({ size: 1024, dynamic: true })}`,
          },
          description: `Download\n[1024](${data.bannerURL({
            size: 1024,
            dynamic: true,
          })}) | [2048](${data.bannerURL({
            size: 2048,
            dynamic: true,
          })}) | [4096](${data.bannerURL({
            size: 4096,
            dynamic: true,
          })})`,
        },
      ],
    });
  },
};
