const devs = require("../../../config.js");

module.exports = {
  dev: true,
  name: "eval-send",
  type: "button",
  execute: async (client, interaction) => {
    const description = (interaction.message.embeds[1].data.description)
      .replace(/`/g, `\`${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`);
    interaction.reply({
      content: `\`\`\`\n${description}\n\`\`\``
    });
  },
};
