const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

function formatPerm(p) {
  return p.replace(/_/g, ' ').toLowerCase();
}

module.exports = {
  name: 'roleUpdate',
  execute(oldRole, newRole) {

    let data = JSON.parse(fs.readFileSync('./data/logs.json'));
    const ch = newRole.guild.channels.cache.get(data[newRole.guild.id]?.audit);
    if (!ch) return;
// ✅ COLOR CHANGE
if (oldRole.color !== newRole.color) {

  const embed = new EmbedBuilder()
    .setColor(0xFEE75C)
    .setDescription(
`**Role "${newRole.name}" updated**

**Before**
Color: ${oldRole.hexColor}

**After**
Color: ${newRole.hexColor}

Role ID: ${newRole.id} • ${new Date().toLocaleString()}`
    );

  return ch.send({ embeds: [embed] });
}
    // ✅ PERMISSION CHANGE
    if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {

      const oldPerms = oldRole.permissions.toArray();
      const newPerms = newRole.permissions.toArray();

      const added = newPerms.filter(p => !oldPerms.includes(p));
      const removed = oldPerms.filter(p => !newPerms.includes(p));

      if (!added.length && !removed.length) return;

      let text = `**Role "${newRole.name}" updated**\n\n**New permissions**\n`;

      if (added.length) {
        text += `**Added:** ${added.map(formatPerm).join(', ')}\n`;
      }

      if (removed.length) {
        text += `**Removed:** ${removed.map(formatPerm).join(', ')}\n`;
      }

      text += `\nRole ID: ${newRole.id} • ${new Date().toLocaleString()}`;

      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setDescription(text);

      ch.send({ embeds: [embed] });
    }
  }
};