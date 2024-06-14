const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  dev: false,
  name: "buttons",
  guildOnly: true,
  category: "fun & games",
  description: "minesweeper like game",
  options: [],
  code: async (client, interaction) => {
    const styles = ["PRIMARY", "SECONDARY", "SUCCESS", "DANGER"];
    let y = 0;
    const rows = new Array(5)
      .fill(new MessageActionRow())
      .map((c) => new MessageActionRow())
      .map((c) =>
        c.addComponents(
          new Array(5)
            .fill(new MessageButton())
            .map((d) => new MessageButton())
            .map((x) => {
              const st = styles[Math.floor(Math.random() * styles.length)];
              return x
                .setCustomId(`rnd_button_WIN_${y++}_${interaction.user.id}`)
                .setLabel(y.toString())
                .setStyle(st);
            })
        )
      );
    const btn =
      rows[Math.floor(Math.random() * rows.length)].components[
        Math.floor(Math.random() * 5)
      ];
    btn.setCustomId(btn.customId.replace(`WIN`, "FAIL"));
    interaction.reply({
      content: `24 safe buttons, 1 bomb.`,
      components: rows,
    });
  },
};
