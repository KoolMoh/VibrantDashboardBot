import fs from 'fs';
import path from 'path';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { token } from './config.js';
import { setupSlashcommands } from './functions.js';

// registering slash commands
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.slashCommands = new Collection();
client.commandButtons = new Collection();
client.commandAutocomplete = new Collection();

// handler: event handler
const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, ...args));
  } else {
    client.on(event.name, (...args) => event.execute(client, ...args));
  }
}


// handler: slash commands handler
(async () => {
  const dir = './slashCommands';
  const ignoredFolders = ['economy', 'fun'];
  const result = await setupSlashcommands(client, dir, ignoredFolders);
  result.forEach(update => {
    const { filePath, status, message } = update;

    console.log(`Command: ${filePath}`);

    const output = (status === 'LoadCommandFailure' ? '🔴 ' : (status === 'LoadCommandWarning' ? '🟡 ' : '🟢 ' )) + message;
    console.log(output);
  });
})();


// handler: buttons handler
function getDirectories(source) {
  return fs.readdirSync(source).filter(file => fs.statSync(path.join(source, file)).isDirectory());
}
const buttonFolder = getDirectories('./events/buttons');
for (const folder of buttonFolder) {
  const buttonFiles = fs.readdirSync(`./events/buttons/${folder}`).filter((file) => file.endsWith('.js'));
  for (const file of buttonFiles) {
    const button = require(`./events/buttons/${folder}/${file}`);
    client.commandButtons.set(button.name, button);
  }
}
// */

try {
  client.login(token);
} catch (err) {
  console.error('Internal Server Error: ' + err.message);
}