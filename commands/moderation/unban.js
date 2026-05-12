const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { hasModAccess } = require('../../utils/whitelist');
const { success, error } = require('../../utils/embed');
const { sendModLog, createModEmbed } = require('../../utils/modlog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban user')
        .addStringOption(o =>
            o.setName('userid')
                .setDescription('User ID')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {

        if (!hasModAccess(interaction.member)) {
            return interaction.reply(error('No permission'));
        }

        const id = interaction.options.getString('userid');

        try {
            await interaction.guild.members.unban(id);
        } catch {
            return interaction.reply(error('User not banned'));
        }

        await interaction.reply(success(`Unbanned user (${id})`));

        const log = createModEmbed('Unban', { tag: id, id }, interaction.user, 'No reason');
        await sendModLog(interaction.client, interaction.guild, log);
    }
};