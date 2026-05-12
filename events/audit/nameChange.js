const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'guildMemberUpdate',
    execute(oldM, newM, client) {

        if (oldM.user.username === newM.user.username) return;

        let data = {};
        if (fs.existsSync('./data/logs.json')) {
            data = JSON.parse(fs.readFileSync('./data/logs.json'));
        }

        const channelId = data[newM.guild.id]?.audit;
        if (!channelId) return;

        const logChannel = newM.guild.channels.cache.get(channelId);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setAuthor({
                name: newM.user.tag,
                iconURL: newM.user.displayAvatarURL()
            })
            .setTitle('**Name Change**')
            .addFields(
                { name: 'Before', value: oldM.user.username },
                { name: 'After', value: newM.user.username }
            )
            .setFooter({ text: `ID: ${newM.user.id}` })
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
};