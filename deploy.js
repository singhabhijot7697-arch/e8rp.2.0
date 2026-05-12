require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];

// ✅ load commands
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const folderPath = path.join(foldersPath, folder);
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));

  for (const file of files) {
    const command = require(path.join(folderPath, file));

    if (command.data) {
      commands.push(command.data.toJSON());
    }
  }
}

// ✅ deploy globally (ALL SERVERS)
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`🚀 Deploying ${commands.length} commands globally...`);

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('✅ Commands deployed globally');

  } catch (error) {
    console.error(error);
  }
})();