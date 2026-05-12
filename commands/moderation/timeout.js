const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { hasModAccess } = require('../../utils/whitelist');
const { modDM, success, error } = require('../../utils/embed');
const { sendModLog, createModEmbed } = require('../../utils/modlog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout user')

    .addUserOption(o =>
      o.setName('user')
        .setDescription('User')
        .setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName('minutes')
        .setDescription('Minutes')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('reason')
        .setDescription('Reason')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {

    const user = interaction.options.getUser('user');
    const minutes = interaction.options.getInteger('minutes');

    const member = await interaction.guild.members.fetch(user.id);

    await member.timeout(minutes * 60000);

    interaction.reply(`✅ Timeout ${user.tag}`);
  }
};