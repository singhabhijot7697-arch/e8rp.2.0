const { SlashCommandBuilder, ActivityType } = require("discord.js");

let interval;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setstatus")
    .setDescription("Set rotating bot status")

    .addIntegerOption(o =>
      o.setName("type1")
        .setDescription("0=Playing, 1=Streaming, 2=Listening, 3=Watching")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("text1")
        .setDescription("First status text")
        .setRequired(true)
    )

    .addIntegerOption(o =>
      o.setName("type2")
        .setDescription("0=Playing, 1=Streaming, 2=Listening, 3=Watching")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("text2")
        .setDescription("Second status text")
        .setRequired(true)
    ),

  async execute(interaction, client) {

    await interaction.deferReply({ ephemeral: true }); // ✅ FIX

    const type1 = interaction.options.getInteger("type1");
    const text1 = interaction.options.getString("text1");

    const type2 = interaction.options.getInteger("type2");
    const text2 = interaction.options.getString("text2");

    const statuses = [
      { type: type1, text: text1 },
      { type: type2, text: text2 }
    ];

    if (interval) clearInterval(interval);

    let i = 0;

    interval = setInterval(() => {

      const current = statuses[i % statuses.length];

      let type = ActivityType.Playing;

      if (current.type === 0) type = ActivityType.Playing;
      if (current.type === 1) type = ActivityType.Streaming;
      if (current.type === 2) type = ActivityType.Listening;
      if (current.type === 3) type = ActivityType.Watching;

      client.user.setActivity(current.text, {
        type,
        url: type === ActivityType.Streaming
          ? "https://twitch.tv/discord"
          : undefined
      });

      i++;

    }, 30000);

    // ✅ instant apply
    client.user.setActivity(text1, {
      type: ActivityType[type1] || ActivityType.Playing
    });

    interaction.editReply("✅ Bot status rotation set (30s)");
  }
};