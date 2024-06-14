const mongoose = require("mongoose");
const fs = require("fs");
const { mongoURI } = require("./../config.js");

module.exports = {
  name: "ready",
  execute: (client) => {
    client.user.setActivity('with my slash commands',{ type:'PLAYING' });
    console.log(`Ready on ${client.user.tag}`);
    // mongoose.connect(mongoURI);

    /*
    client.guilds.cache.get("1070964000143179830").commands.create({
      name: "eval",
      description: "evaluates a JavaScript code",
      options: [
        {
          name: "code",
          description: "the code to evaluate",
          type: 3,
          required: true,
        },
        {
          name: "depth",
          type: 4,
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
    });
    // */
  },
};
