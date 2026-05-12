const { EmbedBuilder } = require('discord.js');

function modDM(action, reason, guild) {
    return new EmbedBuilder()
        .setColor('#ff4d4d')
        .setAuthor({ name: guild.name })
        .setTitle(`⚠️ ${action}`)
        .setDescription(`You have been **${action.toLowerCase()}**`)
        .addFields({ name: 'Reason', value: reason || 'No reason provided' })
        .setTimestamp();
}

function success(msg) {
    return {
        embeds: [
            new EmbedBuilder()
                .setColor('#57F287')
                .setDescription(`✅ ${msg}`)
        ]
    };
}

function error(msg) {
    return {
        embeds: [
            new EmbedBuilder()
                .setColor('#ED4245')
                .setDescription(`❌ ${msg}`)
        ],
        ephemeral: true
    };
}

module.exports = { modDM, success, error };