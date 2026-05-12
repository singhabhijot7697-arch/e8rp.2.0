const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { isOwner } = require('../../utils/ownerOnly');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wlmod')
    .setDescription('Whitelist role for moderation')
    .addRoleOption(o =>
      o.setName('role')
        .setDescription('Role')
        .setRequired(true)
    ),

  async execute(interaction) {

    if (!isOwner(interaction.user.id)) {
      return interaction.reply({ content: '❌ Owner only', ephemeral: true });
    }

    const role = interaction.options.getRole('role');

    let data = JSON.parse(fs.readFileSync('./data/whitelist.json') || '{}');

    if (!data[interaction.guild.id]) {
      data[interaction.guild.id] = { roles: [], users: [], modRoles: [], linkBypassRoles: [] };
    }

    data[interaction.guild.id].modRoles.push(role.id);

    fs.writeFileSync('./data/whitelist.json', JSON.stringify(data, null, 2));

    interaction.reply(`✅ ${role.name} added to mod whitelist`);
  }
};