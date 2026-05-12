const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'voiceStateUpdate',
  execute(oldState, newState) {

    let data = JSON.parse(fs.readFileSync('./data/logs.json'));
    const ch = newState.guild.channels.cache.get(data[newState.guild.id]?.audit);
    if (!ch) return;

    const user = newState.member.user;

    // ✅ JOIN
    if (!oldState.channel && newState.channel) {

      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setAuthor({
          name: user.username,
          iconURL: user.displayAvatarURL()
        })
        .setDescription(
`**Member joined voice channel**

**${user.username}** joined ${newState.channel}

ID: ${user.id} • ${new Date().toLocaleString()}`
        );

      return ch.send({ embeds: [embed] });
    }

    // ✅ LEAVE
    if (oldState.channel && !newState.channel) {

      const embed = new EmbedBuilder()
        .setColor(0xED4245)
        .setAuthor({
          name: user.username,
          iconURL: user.displayAvatarURL()
        })
        .setDescription(
`**Member left voice channel**

**${user.username}** left ${oldState.channel}

ID: ${user.id} • ${new Date().toLocaleString()}`
        );

      return ch.send({ embeds: [embed] });
    }
  }
};