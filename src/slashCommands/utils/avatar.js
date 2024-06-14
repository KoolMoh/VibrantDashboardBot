module.exports = {
  dev: false,
  name: "avatar",
  guildOnly: true,
  description: "sends the avatar of the target/author",
  category: 'utils',
  options: [
    {
      name: "target",
      description: "the user to display their avatar",
      required: false,
      type: "USER",
    },
  ],
  code: async (client, interaction) => {
    const user = interaction.options.getUser("target") || interaction.user;

    return interaction.reply({
      allowedMentions: {
        repliedUser: false,
      },
      embeds: [
        {
          author: {
            name: `${user.tag}`,
            iconURL: `${user.displayAvatarURL({ size: 1024, dynamic: true })}`,
          },
          color: parseInt('277ECD', 16),
          footer: {
            text: `Requested by ${interaction.user.username}`,
            iconURL: `${interaction.user.displayAvatarURL({
              size: 1024,
              dynamic: true,
            })}`,
          },
          image: {
            url: `${user.displayAvatarURL({ size: 4096, dynamic: true })}`,
          },
          description: `Download\n[1024](${user.displayAvatarURL({
            size: 1024,
            dynamic: true,
          })}) | [2048](${user.avatarURL({
            size: 2048,
            dynamic: true,
          })}) | [4096](${user.avatarURL({ size: 4096, dynamic: true })})`,
        },
      ],
    });
  },
};
