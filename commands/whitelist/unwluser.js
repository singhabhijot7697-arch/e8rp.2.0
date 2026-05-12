const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { isOwner } = require('../../utils/ownerOnly');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unwluser')
    .setDescription('Remove user whitelist')
    .addUserOption(o =>
      o.setName('user')
        .setDescription('User')
        .setRequired(true)
    ),

  async execute(interaction) {

    if (!isOwner(interaction.user.id)) {
      return interaction.reply({ content: '❌ Owner only', ephemeral: true });
    }

    const user = interaction.options.getUser('user');

    let data = JSON.parse(fs.readFileSync('./data/whitelist.json'));

    data[interaction.guild.id].users =
      data[interaction.guild.id].users.filter(u => u !== user.id);

    fs.writeFileSync('./data/whitelist.json', JSON.stringify(data, null, 2));

    interaction.reply(`✅ Removed ${user.tag}`);
  }
};