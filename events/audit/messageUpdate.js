const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMsg, newMsg) {

    if (!oldMsg.guild || !oldMsg.author || oldMsg.author.bot) return;
    if (oldMsg.content === newMsg.content) return;

    let data = {};
    if (fs.existsSync('./data/logs.json')) {
      data = JSON.parse(fs.readFileSync('./data/logs.json'));
    }

    const ch = oldMsg.guild.channels.cache.get(data[oldMsg.guild.id]?.audit);
    if (!ch) return;

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setAuthor({
        name: oldMsg.author.username,
        iconURL: oldMsg.author.displayAvatarURL()
      })
      .setDescription(
`**Message edited in ${oldMsg.channel}**

**Before:** ${oldMsg.content || "None"}
**After:** ${newMsg.content || "None"}

ID: ${oldMsg.author.id} • ${new Date().toLocaleString()}`
      );

    ch.send({ embeds: [embed] });
  }
};