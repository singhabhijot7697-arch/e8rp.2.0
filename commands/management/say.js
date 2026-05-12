const { SlashCommandBuilder } = require('discord.js');
const { hasFullAccess } = require('../../utils/whitelist');
const { sendOwnerLog } = require('../../utils/ownerLog');
const { success, error } = require('../../utils/embed');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Send message')

    .addStringOption(o =>
      o.setName('message')
        .setDescription('Message to send')
        .setRequired(true)
    ),

  async execute(interaction) {

    const msg = interaction.options.getString('message');

    await interaction.reply({ content: '✅ Sent', ephemeral: true });
    interaction.channel.send(msg);
  }
};