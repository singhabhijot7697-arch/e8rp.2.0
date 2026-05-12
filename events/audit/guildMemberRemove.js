const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'guildBanRemove',
  async execute(ban) {

    let data = {};
    if (fs.existsSync('./data/logs.json')) {
      data = JSON.parse(fs.readFileSync('./data/logs.json'));
    }

    const ch = ban.guild.channels.cache.get(data[ban.guild.id]?.audit);
    if (!ch) return;

    const logs = await ban.guild.fetchAuditLogs({
      type: AuditLogEvent.MemberBanRemove,
      limit: 1
    });

    const entry = logs.entries.first();

    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setAuthor({
        name: ban.user.username,
        iconURL: ban.user.displayAvatarURL()
      })
      .setDescription(
`**User unbanned**

**Moderator:** ${entry?.executor?.tag || "Unknown"}

ID: ${ban.user.id} • ${new Date().toLocaleString()}`
      );

    ch.send({ embeds: [embed] });
  }
};