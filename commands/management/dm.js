const { SlashCommandBuilder } = require('discord.js');
const { hasFullAccess } = require('../../utils/whitelist');
const { sendOwnerLog } = require('../../utils/ownerLog');
const { success, error } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Send DM')

    .addUserOption(o =>
      o.setName('user')
        .setDescription('Target user')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('message')
        .setDescription('Message content')
        .setRequired(true)
    ),

  async execute(interaction) {

    const user = interaction.options.getUser('user');
    const msg = interaction.options.getString('message');

    await user.send(msg).catch(() => {});

    await interaction.reply({ content: '✅ Sent', ephemeral: true });
  }
};