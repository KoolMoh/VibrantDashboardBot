const {
  User,
	WelcomeLeave,
	Warning,
	WarnSys,
	Ticket,
	TicketSys,
	Suggestion,
	SuggestionSys
} = require("../../schema.js");
const { mongoURI, token } = require("../../config.js");
const { ms, randomValue, syncSlashcommands } = require("../../functions.js");
const fs = require("fs");
const os = require("os");
const util = require("util");
const mongoose = require("mongoose");

module.exports = {
  dev: true,
  name: "eval",
  description: "Evaluate a JavaScript code",
  category: 'developer',
  guildOnly: false,
  //userPerms: ["ADMINISTRATOR"],
  //botPerms: ["ADMINISTRATOR"],
  options: [
    {
      name: "code",
      description: "The code to evaluate",
      type: 3,
      required: true,
    },
    {
      name: "depth",
      type: 10,
      required: false,
      description: `the depth of inspection`,
    },
    {
      name: "async",
      type: 5,
      required: false,
      description: "whether to eval asynchronous or not",
    },
  ],
  code: async (client, interaction) => {
    const asynchronous = interaction.options.getBoolean("async") || false;
    const depth = interaction.options.getNumber("depth") || 0;

    await interaction.deferReply();

    try {
      let result = interaction.options.getString("code");
      if (asynchronous) result = "(async () => { " + result + " })()";

      let evaled = await eval(result);
      let outputType = typeof evaled;

      // convert evaled into a JSON String if it is a js Object
      if (outputType === "object") evaled = util.inspect(evaled, { depth });
      result = result
        .replace(/`/g, `\`${String.fromCharCode(8203)}`)
        .replace(/@/g, `@${String.fromCharCode(8203)}`);
      evaled = String(evaled)
        .replaceAll(`${token}`, "[CENSORED: Token]")
        .replaceAll(`${mongoURI}`, "[CENSORED: MongoDB_URI]");

      if (String(evaled).length > 4096)
        return await interaction.editReply({
          embeds: [
            {
              footer: {
                text: `Executed in ${
                  Date.now() - interaction.createdTimestamp
                }ms`,
              },
              color: parseInt('277ECD', 16),
              author: {
                name: "Eval result",
                iconURL: interaction.user.avatarURL(),
              },
              description: `**Input**\n\`\`\`js\n${result}\`\`\`\n**Type**\n\`\`\`js\n${outputType}\`\`\``,
            }
          ],
          files: [
            {
              attachment: Buffer.from(String(evaled)),
              name: "Eval-result.txt",
            },
          ],
          components: [
            {
              type: 1, // action row or something
              components: [
                {
                  type: 2, // button
                  label: "Dismiss",
                  custom_id: "eval-dismiss",
                  style: 4, // danger
                },
              ],
            },
          ],
        });

      return await interaction.editReply({
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
            color: parseInt('277ECD', 16),
            author: {
              name: "Evaluation Profile",
              iconURL: interaction.user.avatarURL(),
            },
            description: `**Input**\n\`\`\`js\n${result}\`\`\`\n**Type**\n\`\`\`js\n${outputType}\`\`\``,
          }, {
            color: parseInt('277ECD', 16),
            author: {
              name: "Output",
            },
            description: `${evaled}`,
          }
        ],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: "Send Result",
                custom_id: "eval-send",
                style: 3, // blue
              },
              {
                type: 2,
                label: "Dismiss",
                custom_id: "eval-dismiss",
                style: 4, // danger
              },
            ],
          },
        ],
      });
    } catch (e) {
      return await interaction.editReply({
        ephemeral: false,
        content: `\`\`\`\n${e.stack}\`\`\``,
        allowedMentions: {
          repliedUser: false,
        },
      });
    }
  },
};
