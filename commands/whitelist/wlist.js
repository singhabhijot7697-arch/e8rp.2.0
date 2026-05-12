const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { isOwner } = require('../../utils/ownerOnly');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wlist')
    .setDescription('View whitelist'),

  async execute(interaction) {

    if (!isOwner(interaction.user.id)) {
      return interaction.reply({ content: '❌ Owner only', ephemeral: true });
    }

    let data = JSON.parse(fs.readFileSync('./data/whitelist.json'));

    const guild = data[interaction.guild.id] || {
      roles: [], users: [], modRoles: [], linkBypassRoles: []
    };

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Whitelist')
      .setDescription(
`**Full Roles:** ${guild.roles.map(r => `<@&${r}>`).join(', ') || 'None'}
**Full Users:** ${guild.users.map(u => `<@${u}>`).join(', ') || 'None'}
**Mod Roles:** ${guild.modRoles.map(r => `<@&${r}>`).join(', ') || 'None'}
**Link Bypass:** ${guild.linkBypassRoles.map(r => `<@&${r}>`).join(', ') || 'None'}`
      );

    interaction.reply({ embeds: [embed] });
  }
};