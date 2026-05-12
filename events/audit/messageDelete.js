const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'messageDelete',
  async execute(message) {

    try {
      if (!message.guild) return;

      // ✅ fetch partial message
      if (message.partial) {
        try { await message.fetch(); } catch { return; }
      }

      if (!message.author || message.author.bot) return;

      let data = {};
      if (fs.existsSync('./data/logs.json')) {
        data = JSON.parse(fs.readFileSync('./data/logs.json'));
      }

      const ch = message.guild.channels.cache.get(data[message.guild.id]?.audit);
      if (!ch) return;

      const content = message.content?.trim()
        ? message.content
        : (message.attachments.size ? 'Attachment(s)' : 'No content');

      const embed = new EmbedBuilder()
        .setColor(0xED4245)
        .setAuthor({
          name: message.author.username,
          iconURL: message.author.displayAvatarURL()
        })
        .setDescription(
`**Message deleted in ${message.channel}**

**Content:** ${content}

ID: ${message.author.id} • ${new Date().toLocaleString()}`
        );

      ch.send({ embeds: [embed] });

    } catch (err) {
      console.error('Delete log error:', err);
    }
  }
};