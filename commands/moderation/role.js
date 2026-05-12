const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { modDM } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Manage role')

    .addUserOption(o =>
      o.setName('user')
        .setDescription('User')
        .setRequired(true)
    )
    .addRoleOption(o =>
      o.setName('role')
        .setDescription('Role')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('action')
        .setDescription('Add or remove')
        .setRequired(true)
        .addChoices(
          { name: 'add', value: 'add' },
          { name: 'remove', value: 'remove' }
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {

    const user = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');
    const action = interaction.options.getString('action');

    const member = await interaction.guild.members.fetch(user.id);

    if (action === 'add') {
      await member.roles.add(role);
    } else {
      await member.roles.remove(role);
    }

    interaction.reply('✅ Done');
  }
};