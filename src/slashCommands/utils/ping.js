module.exports = {
  dev: false,
  name: "ping",
  guildOnly: true,
  description: "pong",
  category: 'utils',
  code: async (client, interaction) => {
    const message = await interaction.reply({
      ephemeral: true,
      content: "pong!",
      fetchReply: true,
    });

    await interaction.editReply({
      content: "pong!",
      embeds: [
        {
          color: parseInt('277ECD', 16),
          fields: [
            {
              name: `Bot Latency`,
              value: `${
                message.createdTimestamp - interaction.createdTimestamp
              }ms`,
            },
            {
              name: `Websocket Latency`,
              value: `${client.ws.ping}ms`,
            },
          ],
        },
      ],
    });
  },
};
