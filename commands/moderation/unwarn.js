const fs = require('fs');
const { SlashCommandBuilder } = require('discord.js');
const { hasModAccess } = require('../../utils/whitelist');
const { success, error } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unwarn')
    .setDescription('Remove last warning')

    .addUserOption(o =>
      o.setName('user')
        .setDescription('User')
        .setRequired(true)
    ),

  async execute(interaction) {

    const user = interaction.options.getUser('user');

    let data = {};
    if (fs.existsSync('./data/warnings.json')) {
      data = JSON.parse(fs.readFileSync('./data/warnings.json'));
    }

    if (!data[user.id] || data[user.id].length === 0) {
      return interaction.reply('No warnings');
    }

    data[user.id].pop();

    fs.writeFileSync('./data/warnings.json', JSON.stringify(data, null, 2));

    interaction.reply(`✅ Removed warning from ${user.tag}`);
  }
};