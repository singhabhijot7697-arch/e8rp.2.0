const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { hasModAccess } = require('../../utils/whitelist');
const { modDM, success, error } = require('../../utils/embed');
const { sendModLog, createModEmbed } = require('../../utils/modlog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban user')

    .addUserOption(o =>
      o.setName('user')
        .setDescription('User to ban')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('reason')
        .setDescription('Reason')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason';

    const member = await interaction.guild.members.fetch(user.id);

    await member.ban({ reason });

    interaction.reply(`✅ Banned ${user.tag}`);
  }
};