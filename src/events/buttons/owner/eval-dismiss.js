const devs = require("../../../config.js");

module.exports = {
  dev: true,
  name: "eval-dismiss",
  type: "button",
  execute: async (client, interaction) => {
    interaction.message.delete();
  },
};
