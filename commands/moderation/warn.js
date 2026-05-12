const { hasModAccess } = require('../../utils/whitelist');
const { modDM, success, error } = require('../../utils/embed');
const { sendModLog, createModEmbed } = require('../../utils/modlog');

const fs = require('fs');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn user')

    .addUserOption(o =>
      o.setName('user')
        .setDescription('User to warn')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('reason')
        .setDescription('Reason')
    ),

  async execute(interaction) {

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason';

    let data = {};
    if (fs.existsSync('./data/warnings.json')) {
      data = JSON.parse(fs.readFileSync('./data/warnings.json'));
    }

    if (!data[user.id]) data[user.id] = [];
    data[user.id].push(reason);

    fs.writeFileSync('./data/warnings.json', JSON.stringify(data, null, 2));

    interaction.reply(`✅ Warned ${user.tag}`);
  }
};