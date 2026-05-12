const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'guildBanRemove',
    async execute(ban, client) {

        const guild = ban.guild;

        let data = {};
        if (fs.existsSync('./data/logs.json')) {
            data = JSON.parse(fs.readFileSync('./data/logs.json'));
        }

        const channelId = data[guild.id]?.audit;
        if (!channelId) return;

        const logChannel = guild.channels.cache.get(channelId);

        const logs = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanRemove, limit: 1 });
        const entry = logs.entries.first();

        const embed = new EmbedBuilder()
            .setColor('#57F287')
            .setTitle('**User Unbanned**')
            .setAuthor({
                name: ban.user.tag,
                iconURL: ban.user.displayAvatarURL()
            })
            .addFields({
                name: 'Moderator',
                value: entry?.executor?.tag || 'Unknown'
            })
            .setFooter({ text: `ID: ${ban.user.id}` })
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
};