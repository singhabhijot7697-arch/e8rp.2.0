const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { isOwner } = require('../../utils/ownerOnly');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wlrole')
    .setDescription('Whitelist role (full access)')
    .addRoleOption(o =>
      o.setName('role')
        .setDescription('Role to whitelist')
        .setRequired(true)
    ),

  async execute(interaction) {

    if (!isOwner(interaction.user.id)) {
      return interaction.reply({ content: '❌ Owner only', ephemeral: true });
    }

    const role = interaction.options.getRole('role');

    let data = {};
    if (fs.existsSync('./data/whitelist.json')) {
      data = JSON.parse(fs.readFileSync('./data/whitelist.json'));
    }

    if (!data[interaction.guild.id]) {
      data[interaction.guild.id] = { roles: [], users: [], modRoles: [], linkBypassRoles: [] };
    }

    data[interaction.guild.id].roles.push(role.id);

    fs.writeFileSync('./data/whitelist.json', JSON.stringify(data, null, 2));

    interaction.reply(`✅ ${role.name} has full access`);
  }
};