const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ownerLog = require('../../utils/ownerLog'); // ✅ FIXED IMPORT
const { hasFullAccess } = require("../../utils/whitelist");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription("Send maintenance announcement")

    // ✅ REQUIRED OPTIONS FIRST
    .addStringOption(o =>
      o.setName("date")
        .setDescription("Maintenance date & time")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("servers")
        .setDescription("Affected servers")
        .setRequired(true)
    )
    .addRoleOption(o =>
      o.setName("role")
        .setDescription("Role to ping")
        .setRequired(true)
    )

    // ✅ OPTIONAL OPTIONS AFTER
    .addStringOption(o =>
      o.setName("infra_emoji")
        .setDescription("Emoji for title")
    )
    .addStringOption(o =>
      o.setName("date_emoji")
        .setDescription("Emoji for date")
    )
    .addStringOption(o =>
      o.setName("server_emoji")
        .setDescription("Emoji for servers")
    )
    .addAttachmentOption(o =>
      o.setName("thumbnail")
        .setDescription("Top right image")
    )
    .addAttachmentOption(o =>
      o.setName("image")
        .setDescription("Bottom image (banner)")
    ),

  async execute(interaction, client) {

    await interaction.deferReply({ ephemeral: true });

    // ✅ PERMISSION CHECK
    if (!hasFullAccess(interaction.member)) {
      return interaction.editReply("❌ You are not allowed to use this command");
    }

    const date = interaction.options.getString("date");
    const servers = interaction.options.getString("servers");
    const role = interaction.options.getRole("role");

    const e1 = interaction.options.getString("infra_emoji") || "⚠️";
    const e2 = interaction.options.getString("date_emoji") || "📅";
    const e3 = interaction.options.getString("server_emoji") || "🖥️";

    const thumbnail = interaction.options.getAttachment("thumbnail");
    const image = interaction.options.getAttachment("image");

    const embed = new EmbedBuilder()
      .setColor("#00b9ff")
      .setTitle(`${e1} Infrastructure Maintenance`)
      .setDescription(
        `Scheduled maintenance will be carried out on the hosting side. During this time, brief interruptions in service may occur.\n\n` +
        `${e2} **Maintenance Date**\n${date}\n\n` +
        `${e3} **Affected Servers**\n${servers}`
      )
      .setFooter({ text: "Thanks for your understanding!" })
      .setTimestamp();

    if (thumbnail) embed.setThumbnail(thumbnail.url);
    if (image) embed.setImage(image.url);

    await interaction.channel.send({
      content: `||<@&${role.id}>||`,
      embeds: [embed],
      allowedMentions: { roles: [role.id] }
    });

    // ✅ OWNER LOG FIXED CALL
    ownerLog(client, {
      user: interaction.user,
      command: "/announce",
      guild: interaction.guild,
      details: `${date} | ${servers}`
    });

    await interaction.editReply("✅ Announcement sent");
  }
};