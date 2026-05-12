const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'guildMemberAdd',
    execute(member, client) {

        let data = {};
        if (fs.existsSync('./data/logs.json')) {
            data = JSON.parse(fs.readFileSync('./data/logs.json'));
        }

        const channelId = data[member.guild.id]?.audit;
        if (!channelId) return;

        const logChannel = member.guild.channels.cache.get(channelId);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setColor('#57F287')
            .setAuthor({
                name: member.user.tag,
                iconURL: member.user.displayAvatarURL()
            })
            .setTitle('**Member Joined**')
            .addFields(
                {
                    name: 'Account Created',
                    value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`
                },
                {
                    name: 'Member Count',
                    value: `${member.guild.memberCount}`
                }
            )
            .setFooter({ text: `ID: ${member.user.id}` })
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
};