const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { isOwner } = require('../../utils/ownerOnly');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unwlrole')
    .setDescription('Remove role whitelist')
    .addRoleOption(o =>
      o.setName('role')
        .setDescription('Role')
        .setRequired(true)
    ),

  async execute(interaction) {

    if (!isOwner(interaction.user.id)) {
      return interaction.reply({ content: '❌ Owner only', ephemeral: true });
    }

    const role = interaction.options.getRole('role');

    let data = JSON.parse(fs.readFileSync('./data/whitelist.json'));

    data[interaction.guild.id].roles =
      data[interaction.guild.id].roles.filter(r => r !== role.id);

    fs.writeFileSync('./data/whitelist.json', JSON.stringify(data, null, 2));

    interaction.reply(`✅ Removed ${role.name}`);
  }
};