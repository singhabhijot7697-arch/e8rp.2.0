const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'guildMemberAdd',
  execute(member) {

    let data = {};
    if (fs.existsSync('./data/logs.json')) {
      data = JSON.parse(fs.readFileSync('./data/logs.json'));
    }

    const ch = member.guild.channels.cache.get(data[member.guild.id]?.audit);
    if (!ch) return;

    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setAuthor({
        name: member.user.username,
        iconURL: member.user.displayAvatarURL()
      })
      .setDescription(
`**Member joined**

**Account Created:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>
**Member Count:** ${member.guild.memberCount}

ID: ${member.user.id} • ${new Date().toLocaleString()}`
      );

    ch.send({ embeds: [embed] });
  }
};