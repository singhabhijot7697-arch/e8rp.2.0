const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { hasModAccess } = require('../../utils/whitelist');
const { modDM, success, error } = require('../../utils/embed');
const { sendModLog, createModEmbed } = require('../../utils/modlog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Remove timeout')

    .addUserOption(o =>
      o.setName('user')
        .setDescription('User')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('reason')
        .setDescription('Reason')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {

    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(user.id);

    await member.timeout(null);

    interaction.reply(`✅ Removed timeout from ${user.tag}`);
  }
};