const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member, client) {

        const guild = member.guild;

        let data = {};
        if (fs.existsSync('./data/logs.json')) {
            data = JSON.parse(fs.readFileSync('./data/logs.json'));
        }

        const channelId = data[guild.id]?.audit;
        if (!channelId) return;

        const logChannel = guild.channels.cache.get(channelId);

        const logs = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick, limit: 1 });
        const entry = logs.entries.first();

        if (!entry || entry.target.id !== member.id) return;

        const embed = new EmbedBuilder()
            .setColor('#ED4245')
            .setTitle('**User Kicked**')
            .setAuthor({
                name: member.user.tag,
                iconURL: member.user.displayAvatarURL()
            })
            .addFields(
                { name: 'Moderator', value: entry.executor.tag },
                { name: 'Reason', value: entry.reason || 'No reason' }
            )
            .setFooter({ text: `ID: ${member.id}` })
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
};