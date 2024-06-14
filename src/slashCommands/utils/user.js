module.exports = {
  dev: false,
  name: "user",
  guildOnly: true,
  description: "shows information about a user",
  category: 'utils',
  options: [
    {
      name: "user",
      type: "USER",
      required: false,
      description: "the user to display thier info",
    },
  ],
  code: async (client, interaction) => {
    const author = interaction.user;
    const user = interaction.options.getUser("user") || author;
    const member = interaction.guild.members.cache.get(user.id);

    const badges = {
      house_bravery: "<:HouseBravery:875446276391567451>",
      house_brilliance: "<:HouseBrilliance:875446147160891493>",
      house_balance: "<:HouseBalance:875445989035606037>",
      hypesquad_events: "<:HypesquadEvents:917533452927115324>",
      discord_certified_moderator:
        "<:DiscordCertifiedModerator:875453196758302720>",
      early_supporter: "<:EarlySupporter:875453141431255041>",
      discord_employee: "<:DiscordEmployee:875450011348000778>",
      bughunter_level_2: "<:BugHunterLvl2:875449916862906419>",
      early_verified_bot_developer:
        "<:EarlyVerifiedBotDeveloper:875447272266170368>",
      discord_partner: "<:Partner:875447360912781342>",
      bughunter_level_1: "<:BugHunterLvl1:875449843705860146>",
      verified_bot: "<:Bot1:917551582428688444><:Bot2:917551617363034113>",
    };

    let badge;
    if (user.flags)
      badge = user.flags
        .toArray()
        .map((badgee) => badges[badgee.toLowerCase()])
        .join(" ");

    const nickname = interaction.guild.members.cache.get(user.id).nickname;

    return interaction.reply({
      allowedMentions: {
        repliedUser: false,
      },
      embeds: [
        {
          color:
            interaction.guild.members.cache
              .get(user.id)
              .roles.highest.color.toString(16) == 0
              ? parseInt('277ECD', 16)
              : interaction.guild.members.cache
                  .get(user.id)
                  .roles.highest.color.toString(16),
          author: {
            name: `${user.tag}`,
            iconURL: `${user.avatarURL({ size: 1024, dynamic: true })}`,
          },
          thumbnail: {
            url: user.avatarURL({ size: 1024, dynamic: true }),
          },
          description: `${user.username} ${
            !badge && user.bot ? "<:Bot:917733463942127616>" : badge
          }`,
          fields: [
            {
              name: "User ID",
              value: `${user.id}`,
              inline: true,
            },
            {
              name: `Bot?`,
              value: user.bot ? "yes" : "no",
              inline: true,
            },
            {
              name: `Creation Date`,
              value: `​​<t:${Math.floor(author.createdTimestamp / 1000)}:F>`,
              inline: false,
            },
            {
              name: `Join Date`,
              value: `​​<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`,
              inline: true,
            },
            {
              name: `User Roles`,
              value: interaction.guild.members.cache
                .get(user.id)
                .roles.cache.map((role) => "<@&" + role.id + ">")
                .join(", "),
              inline: false,
            },
          ],
        },
      ],
    });
  },
};
