const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

function getChannel(guildId) {
  if (!fs.existsSync('./data/logs.json')) return null;

  const data = JSON.parse(fs.readFileSync('./data/logs.json'));
  return data[guildId]?.modlog;
}

async function sendModLog(client, guild, embed) {
  const id = getChannel(guild.id);
  if (!id) return;

  const ch = guild.channels.cache.get(id);
  if (!ch) return;

  ch.send({ embeds: [embed] }).catch(()=>{});
}

function createModEmbed(action, user, moderator, reason) {
  return new EmbedBuilder()
    .setColor(0xED4245)
    .setDescription(
`**${action}**

**User:** ${user.tag}
**Moderator:** ${moderator.tag}
**Reason:** ${reason || 'No reason'}

ID: ${user.id}`
    )
    .setTimestamp();
}

module.exports = { sendModLog, createModEmbed };