const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'guildMemberUpdate',
    execute(oldM, newM) {

        if (oldM.nickname === newM.nickname) return;

        let data = {};
        if (fs.existsSync('./data/logs.json')) {
            data = JSON.parse(fs.readFileSync('./data/logs.json'));
        }

        const channelId = data[newM.guild.id]?.audit;
        if (!channelId) return;

        const ch = newM.guild.channels.cache.get(channelId);

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('**Nickname Changed**')
            .setAuthor({
                name: newM.user.tag,
                iconURL: newM.user.displayAvatarURL()
            })
            .addFields(
                { name: 'Before', value: oldM.nickname || 'None' },
                { name: 'After', value: newM.nickname || 'None' }
            )
            .setTimestamp();

        ch.send({ embeds: [embed] });
    }
};