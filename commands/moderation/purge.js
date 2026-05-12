const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete messages')

    .addIntegerOption(o =>
      o.setName('amount')
        .setDescription('Number of messages')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {

    const amount = interaction.options.getInteger('amount');

    await interaction.channel.bulkDelete(amount, true);

    interaction.reply({ content: `✅ Deleted ${amount}`, ephemeral: true });
  }
};