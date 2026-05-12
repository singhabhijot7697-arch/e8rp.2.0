const fs = require('fs');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Check warnings')

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

    const warnings = data[user.id] || [];

    interaction.reply(
      warnings.length
        ? warnings.map((w, i) => `${i + 1}. ${w}`).join('\n')
        : 'No warnings'
    );
  }
};