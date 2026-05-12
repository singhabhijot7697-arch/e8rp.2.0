const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'roleDelete',
  execute(role) {

    let data = JSON.parse(fs.readFileSync('./data/logs.json'));
    const ch = role.guild.channels.cache.get(data[role.guild.id]?.audit);
    if (!ch) return;

    const createdAgo = `<t:${Math.floor(role.createdTimestamp / 1000)}:R>`;

    const embed = new EmbedBuilder()
      .setColor(0xED4245)
      .setDescription(
`**Role "${role.name}" removed**

**Name:** ${role.name}
**Color:** ${role.hexColor}
**Mentionable:** ${role.mentionable ? 'True' : 'False'}
**Displayed separately:** ${role.hoist ? 'True' : 'False'}
**Position:** ${role.position}
**Created:** ${createdAgo}

Role ID: ${role.id} • ${new Date().toLocaleString()}`
      );

    ch.send({ embeds: [embed] });
  }
};