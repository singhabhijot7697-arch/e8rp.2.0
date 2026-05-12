const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Join your voice channel'),

  async execute(interaction) {

    const channel = interaction.member.voice.channel;

    if (!channel) {
      return interaction.reply({ content: '❌ You must be in a voice channel', ephemeral: true });
    }

    joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator
    });

    interaction.reply(`✅ Joined ${channel}`);
  }
};