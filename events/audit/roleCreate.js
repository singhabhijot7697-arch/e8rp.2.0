const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'roleCreate',
  execute(role) {

    let data = JSON.parse(fs.readFileSync('./data/logs.json'));
    const ch = role.guild.channels.cache.get(data[role.guild.id]?.audit);
    if (!ch) return;

    const embed = new EmbedBuilder()
      .setColor(role.color || 0x5865F2)
      .setDescription(
`**New role created**

**Name:** ${role.name}
**Color:** ${role.hexColor}
**Mentionable:** ${role.mentionable ? 'True' : 'False'}
**Displayed separately:** ${role.hoist ? 'True' : 'False'}

Role ID: ${role.id} • ${new Date().toLocaleString()}`
      );

    ch.send({ embeds: [embed] });
  }
};