const handleCommandInteraction = require('./commands/index.js');
const handleButtonInteraction = require('./buttons/index.js');
const handleAutoCompleteInteraction = require('./autocomplete/index.js');

module.exports = {
  name: "interactionCreate",
  execute: async (client, interaction) => {
    if (interaction.isCommand()) {
      handleCommandInteraction(client, interaction);
    } else if (interaction.isButton()) {
      handleButtonInteraction(client, interaction);
    } else if (interaction.isAutocomplete()) {
      handleAutoCompleteInteraction(client, interaction);
    }
  },
};
