const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

function getBadges(user) {
  const flags = user.flags?.toArray() || [];

  const map = {
    Staff: '🛠️ Staff',
    Partner: '🤝 Partner',
    Hypesquad: '🎉 HypeSquad',
    BugHunterLevel1: '🐛 Bug Hunter',
    BugHunterLevel2: '🐛 Bug Hunter+',
    PremiumEarlySupporter: '💎 Early Supporter',
    ActiveDeveloper: '👨‍💻 Dev'
  };

  return flags.map(f => map[f] || f).join(', ') || 'None';
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Ultimate user info')
    .addUserOption(o =>
      o.setName('user').setDescription('Select user')
    ),

  async execute(interaction, client) {

    const user = interaction.options.getUser('user') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);
    const fetched = await client.users.fetch(user.id, { force: true });

    // ✅ mutual servers
    const mutual = client.guilds.cache.filter(g =>
      g.members.cache.has(user.id)
    ).size;

    // ✅ join position
    const sorted = interaction.guild.members.cache
      .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);

    const position = sorted.map(m => m.id).indexOf(user.id) + 1;

    // ✅ roles
    const roles = member.roles.cache
      .filter(r => r.id !== interaction.guild.id)
      .map(r => `<@&${r.id}>`)
      .join(', ') || 'None';

    // ✅ base embed
    const mainEmbed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setAuthor({
        name: user.tag,
        iconURL: user.displayAvatarURL()
      })
      .setThumbnail(user.displayAvatarURL())
      .setDescription(
`**User Information**

**ID:** ${user.id}
**Badges:** ${getBadges(fetched)}

**Mutual Servers:** ${mutual}
**Join Position:** #${position}

**Account Created:** <t:${Math.floor(user.createdTimestamp / 1000)}:F>
**Joined Server:** <t:${Math.floor(member.joinedTimestamp / 1000)}:F>

**Roles [${member.roles.cache.size - 1}]:**
${roles}`
      )
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    // ✅ buttons
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('avatar')
        .setLabel('Avatar')
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId('banner')
        .setLabel('Banner')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({
      embeds: [mainEmbed],
      components: [row]
    });

    // ✅ collector
    const msg = await interaction.fetchReply();

    const collector = msg.createMessageComponentCollector({
      time: 60000
    });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: 'Not your interaction', ephemeral: true });
      }

      if (i.customId === 'avatar') {
        const avatarEmbed = new EmbedBuilder()
          .setColor(0x5865F2)
          .setTitle(`${user.tag}'s Avatar`)
          .setImage(user.displayAvatarURL({ size: 1024 }));

        await i.update({ embeds: [avatarEmbed], components: [row] });
      }

      if (i.customId === 'banner') {
        const banner = fetched.bannerURL({ size: 1024 });

        if (!banner) {
          return i.reply({ content: 'No banner', ephemeral: true });
        }

        const bannerEmbed = new EmbedBuilder()
          .setColor(0x5865F2)
          .setTitle(`${user.tag}'s Banner`)
          .setImage(banner);

        await i.update({ embeds: [bannerEmbed], components: [row] });
      }
    });
  }
};