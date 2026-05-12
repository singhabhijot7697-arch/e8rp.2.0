require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials
} = require('discord.js');

const fs = require('fs');
const path = require('path');

// ✅ EXPRESS (Render 24/7)
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
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction
  ]
});

client.commands = new Collection();


// ✅ LOAD COMMANDS
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


// ✅ LOAD EVENTS (AUDIT LOGS)
const eventPath = path.join(__dirname, 'events/audit');

if (fs.existsSync(eventPath)) {
  const eventFiles = fs.readdirSync(eventPath);

  for (const file of eventFiles) {
    const event = require(`./events/audit/${file}`);
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}


// ✅ AUTOMOD
const { runAutomod } = require('./utils/automod');

client.on('messageCreate', async message => {
  runAutomod(message);
});


// ✅ INTERACTIONS
client.on('interactionCreate', async interaction => {

  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);

  } catch (err) {
    console.error(err);

    if (interaction.replied || interaction.deferred) {
      interaction.followUp({
        content: '❌ Error executing command',
        ephemeral: true
      });
    } else {
      interaction.reply({
        content: '❌ Error executing command',
        ephemeral: true
      });
    }
  }
});


// ✅ READY
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});


// ✅ LOGIN
client.login(process.env.TOKEN);