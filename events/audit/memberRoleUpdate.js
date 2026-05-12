const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'guildMemberUpdate',
  execute(oldM, newM) {

    let data = JSON.parse(fs.readFileSync('./data/logs.json'));
    const ch = newM.guild.channels.cache.get(data[newM.guild.id]?.audit);
    if (!ch) return;

    const added = newM.roles.cache.filter(r => !oldM.roles.cache.has(r.id));
    const removed = oldM.roles.cache.filter(r => !newM.roles.cache.has(r.id));

    // ✅ ROLE ADDED
    added.forEach(role => {

      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setAuthor({
          name: newM.user.username,
          iconURL: newM.user.displayAvatarURL()
        })
        .setDescription(
`**Role added**

${role}

ID: ${newM.user.id} • ${new Date().toLocaleString()}`
        );

      ch.send({ embeds: [embed] });
    });

    // ✅ ROLE REMOVED
    removed.forEach(role => {

      const embed = new EmbedBuilder()
        .setColor(0xED4245)
        .setAuthor({
          name: newM.user.username,
          iconURL: newM.user.displayAvatarURL()
        })
        .setDescription(
`**Role removed**

${role}

ID: ${newM.user.id} • ${new Date().toLocaleString()}`
        );

      ch.send({ embeds: [embed] });
    });
  }
};