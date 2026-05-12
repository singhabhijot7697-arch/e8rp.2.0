const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const { hasFullAccess } = require('../../utils/whitelist');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setauditlog')
        .setDescription('Set audit log channel')
        .addChannelOption(o =>
            o.setName('channel')
                .setDescription('Select channel')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        if (!hasFullAccess(interaction.member)) {
            return interaction.reply({
                content: '❌ No permission',
                ephemeral: true
            });
        }

        const channel = interaction.options.getChannel('channel');

        let data = {};
        if (fs.existsSync('./data/logs.json')) {
            data = JSON.parse(fs.readFileSync('./data/logs.json'));
        }

        if (!data[interaction.guild.id]) data[interaction.guild.id] = {};

        data[interaction.guild.id].audit = channel.id;

        fs.writeFileSync('./data/logs.json', JSON.stringify(data, null, 2));

        await interaction.reply(`✅ Audit logs set to ${channel}`);
    }
};