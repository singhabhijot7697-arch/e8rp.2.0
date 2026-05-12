const { EmbedBuilder } = require('discord.js');

async function sendOwnerLog(client, title, fields) {
    try {
        const app = await client.application.fetch();
        const owner = await client.users.fetch(app.owner.id);

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(title)
            .addFields(fields)
            .setTimestamp();

        await owner.send({ embeds: [embed] });
    } catch (err) {
        console.error('Owner DM failed:', err);
    }
}

module.exports = { sendOwnerLog };