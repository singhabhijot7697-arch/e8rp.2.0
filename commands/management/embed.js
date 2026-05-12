const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Create embed')

    // ✅ REQUIRED FIRST
    .addStringOption(o =>
      o.setName('description')
        .setDescription('Embed description')
        .setRequired(true)
    )

    // ✅ OPTIONAL AFTER
    .addStringOption(o =>
      o.setName('title')
        .setDescription('Title')
    )
    .addStringOption(o =>
      o.setName('color')
        .setDescription('Color')
    )
    .addAttachmentOption(o =>
      o.setName('image')
        .setDescription('Image')
    )
    .addAttachmentOption(o =>
      o.setName('thumbnail')
        .setDescription('Thumbnail')
    ),

  async execute(interaction) {

    const desc = interaction.options.getString('description');
    const title = interaction.options.getString('title');

    const embed = new EmbedBuilder()
      .setDescription(desc);

    if (title) embed.setTitle(title);

    await interaction.reply({ embeds: [embed] });
  }
};