const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { isOwner } = require('../../utils/ownerOnly');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wluser')
    .setDescription('Whitelist user (full access)')
    .addUserOption(o =>
      o.setName('user')
        .setDescription('User to whitelist')
        .setRequired(true)
    ),

  async execute(interaction) {

    if (!isOwner(interaction.user.id)) {
      return interaction.reply({ content: '❌ Owner only', ephemeral: true });
    }

    const user = interaction.options.getUser('user');

    let data = {};
    if (fs.existsSync('./data/whitelist.json')) {
      data = JSON.parse(fs.readFileSync('./data/whitelist.json'));
    }

    if (!data[interaction.guild.id]) {
      data[interaction.guild.id] = { roles: [], users: [], modRoles: [], linkBypassRoles: [] };
    }

    data[interaction.guild.id].users.push(user.id);

    fs.writeFileSync('./data/whitelist.json', JSON.stringify(data, null, 2));

    interaction.reply(`✅ ${user.tag} has full access`);
  }
};