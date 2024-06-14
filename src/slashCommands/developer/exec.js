const node = require("child_process");

module.exports = {
  dev: true,
  name: "exec",
  description: "Execute a shell command",
  category: 'developer',
  guildOnly: true,
  // userPerms: ["ADMINESTRATION"],
  // botPerms: ["ADMINESTRATION"],
  options: [
    {
      name: "command",
      type: 3,
      required: true,
      description: "The command to run in the shell",
    },
  ],
  code: async (client, interaction) => {
    await interaction.deferReply();

    const command = interaction.options.getString("command");
    try {
      let output = await node.execSync(command);
      output = output.toString();

      if (output.length > 4000)
        return interaction.editReply({
          files: [
            {
              attachment: Buffer.from(String(output)),
              name: "Exec-result.txt",
            },
          ],
          components: [
            {
              type: 1, // action row or something
              components: [
                {
                  type: 2, // button
                  label: "Dismiss",
                  custom_id: "exec-dismiss",
                  style: 4, // danger
                },
              ],
            },
          ],
        });

      await interaction.editReply({
        allowedMentions: {
          repliedUser: false,
        },
        embeds: [
          {
            footer: {
              text: `Executed in ${
                Date.now() - interaction.createdTimestamp
              }ms`,
            },
            color: parseInt('000000', 16),
            author: {
              name: "Exec result",
              iconURL: interaction.user.avatarURL(),
            },
            description: `**Input**\n\`\`\`\n${command}\`\`\`\n**Output**\`\`\`js\n${output}\`\`\``,
          },
        ],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: "Send Result",
                custom_id: "exec-send",
                style: 3, // blue
              },
              {
                type: 2,
                label: "Dismiss",
                custom_id: "exec-dismiss",
                style: 4, // danger
              },
            ],
          },
        ],
      });
    } catch (e) {
      await interaction.editReply({
        content: `\`\`\`\n${e.message}\`\`\``,
      });
    }
  },
};
