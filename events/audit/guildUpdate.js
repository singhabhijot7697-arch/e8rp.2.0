const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'guildUpdate',
    execute(oldG, newG) {

        if (oldG.name === newG.name && oldG.icon === newG.icon) return;

        let data = {};
        if (fs.existsSync('./data/logs.json')) {
            data = JSON.parse(fs.readFileSync('./data/logs.json'));
        }

        const channelId = data[newG.id]?.audit;
        if (!channelId) return;

        const ch = newG.channels.cache.get(channelId);

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('**Server Updated**')
            .addFields(
                { name: 'Before Name', value: oldG.name },
                { name: 'After Name', value: newG.name }
            )
            .setTimestamp();

        ch.send({ embeds: [embed] });
    }
};