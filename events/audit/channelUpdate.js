const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');

function permIcon(val) {
  if (val === true) return '✅';
  if (val === false) return '❌';
  return '⬜';
}

// ✅ format permission name nicely
function formatPerm(perm) {
  return perm
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}

module.exports = {
  name: 'channelUpdate',
  async execute(oldCh, newCh) {

    if (!oldCh.guild) return;

    let data = {};
    if (fs.existsSync('./data/logs.json')) {
      data = JSON.parse(fs.readFileSync('./data/logs.json'));
    }

    const logChannel = newCh.guild.channels.cache.get(data[newCh.guild.id]?.audit);
    if (!logChannel) return;

    const allPerms = Object.keys(PermissionsBitField.Flags);

    let logs = [];

    // ✅ loop through ALL overwrites
    newCh.permissionOverwrites.cache.forEach(newPerm => {

      const oldPerm = oldCh.permissionOverwrites.cache.get(newPerm.id);

      // ✅ detect target (role or user)
      let target = null;
      if (newPerm.type === 0) {
        target = `<@&${newPerm.id}>`; // role
      } else {
        target = `<@${newPerm.id}>`; // user
      }

      let changes = [];

      allPerms.forEach(perm => {

        const before = oldPerm
          ? oldPerm.allow.has(perm) ? true :
            oldPerm.deny.has(perm) ? false : null
          : null;

        const after = newPerm.allow.has(perm) ? true :
                      newPerm.deny.has(perm) ? false : null;

        if (before !== after) {
          changes.push(
`${formatPerm(perm)}: ${permIcon(before)} ➜ ${permIcon(after)}`
          );
        }
      });

      if (changes.length) {
        logs.push(
`Overwrites for ${target} in ${newCh}\n\n${changes.join('\n')}`
        );
      }
    });

    // ✅ also detect REMOVED overwrites
    oldCh.permissionOverwrites.cache.forEach(oldPerm => {

      if (!newCh.permissionOverwrites.cache.has(oldPerm.id)) {

        let target = oldPerm.type === 0
          ? `<@&${oldPerm.id}>`
          : `<@${oldPerm.id}>`;

        logs.push(
`Overwrites removed for ${target} in ${newCh}`
        );
      }
    });

    if (!logs.length) return;

    const embed = new EmbedBuilder()
      .setColor(0xFEE75C)
      .setDescription(
`**Text channel updated**

${logs.join('\n\n')}

Channel ID: ${newCh.id} • ${new Date().toLocaleString()}`
      );

    logChannel.send({ embeds: [embed] });
  }
};