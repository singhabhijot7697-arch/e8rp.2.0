require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials
} = require('discord.js');

const fs = require('fs');
const path = require('path');

console.log("TOKEN:", process.env.TOKEN ? "✅ Loaded" : "❌ Missing");

// ✅ EXPRESS
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot is running ✅');
});

app.listen(3000, () => {
  console.log('🌐 Web server ready');
});


// ✅ CLIENT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [
    Partials.Message,
    Partials.Channel
  ]
});

client.commands = new Collection();


// ✅ LOAD COMMANDS (SAFE)
try {
  const foldersPath = path.join(__dirname, 'commands');
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const folderPath = path.join(foldersPath, folder);
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));

    for (const file of files) {
      const command = require(path.join(folderPath, file));

      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
      }
    }
  }

  console.log("✅ Commands loaded");

} catch (err) {
  console.error("❌ Command load error:", err);
}


// ✅ INTERACTIONS
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (err) {
    console.error("❌ Command error:", err);
  }
});


// ✅ READY
client.once('clientReady', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});


// ✅ LOGIN (IMPORTANT)
(async () => {
  try {
    await client.login(process.env.TOKEN);
    console.log("✅ Login success");
  } catch (err) {
    console.error("❌ Login failed:", err);
  }
})();
