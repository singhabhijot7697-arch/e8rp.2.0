const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all bot commands'),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setAuthor({
        name: 'Eight Role-Play Bot',
        iconURL: interaction.client.user.displayAvatarURL()
      })
      .setDescription(
`Welcome to **Eight Role-Play Bot** 🎭

**Management**
• /say — Send message as bot  
• /dm — Send private message  
• /embed — Create custom embed  
• /setstatus — Set rotating bot status  
• /setauditlog — Set audit log channel  

**Moderation**
• /ban — Ban user  
• /kick — Kick user  
• /timeout — Timeout user  
• /untimeout — Remove timeout  
• /warn — Warn user  
• /unwarn — Remove warning  
• /warnings — View warnings  
• /purge — Delete messages  
• /role — Manage roles  

**Whitelist**
• /wlrole — Full access role  
• /wluser — Full access user  
• /wlmod — Mod access role  
• /wlam — Link bypass role  
• /wlist — View whitelist  

**Utility**
• /avatar — Show avatar  
• /userinfo — Advanced user info  
• /banner — Show banner  
• /roles — Server roles  
• /inviteinfo — Invite info  
• /remind — Set reminder  

━━━━━━━━━━━━━━━
**System Features**
• Advanced Automod ⚡  
• Audit Logs 📊  
• Whitelist System 🔐  
• Embed Builder 🎨  

**Bot:** Eight Role-Play Bot`
      )
      .setFooter({
        text: `Requested by ${interaction.user.tag}`
      })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  }
};