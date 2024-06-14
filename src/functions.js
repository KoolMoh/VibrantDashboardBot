const fs = require('fs');
const path = require('path');

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.remove = function (index) {
  if (index < 0) throw `Index can't be less than 0`;
  if (index >= this.length) return this;

  this.splice(index, 1);
  return this;
};

Array.prototype.findArray = function (array) {
  const set = new Set(this);
  for (let i of array) {
    if (!set.has(i)) {
      return false;
    }
  }
  return true;
};

const ms = (time) => {
  if (!time) return 'provide time in ms';
  if (typeof time != 'string') return -1;

  let result = time
    .trim()
    .split(/ +/)
    .map(x => `(${x})`)
    .join(' + ')
    .replace(/(?<=\d)s/g, ' * 1000')
    .replace(/(?<=\d)sec/g, ' * 1000')
    .replace(/(?<=\d)second/g, ' * 1000')
    .replace(/(?<=\d)seconds/g, ' * 1000')

    .replace(/(?<=\d)m/g, ' * 1000 * 60')
    .replace(/(?<=\d)min/g, ' * 1000 * 60')
    .replace(/(?<=\d)minute/g, ' * 1000 * 60')
    .replace(/(?<=\d)minutes/g, ' * 1000 * 60')

    .replace(/(?<=\d)h/g, ' * 1000 * 3600')
    .replace(/(?<=\d)hr/g, ' * 1000 * 3600')
    .replace(/(?<=\d)hour/g, ' * 1000 * 3600')
    .replace(/(?<=\d)hours/g, ' * 1000 * 3600')

    .replace(/(?<=\d)d/g, ' * 1000 * 3600 * 24')
    .replace(/(?<=\d)day/g, ' * 1000 * 3600 * 24')
    .replace(/(?<=\d)days/g, ' * 1000 * 3600 * 24')

    .replace(/(?<=\d)w/g, ' * 1000 * 3600 * 24 * 7')
    .replace(/(?<=\d)week/g, ' * 1000 * 3600 * 24 * 7')
    .replace(/(?<=\d)weeks/g, ' * 1000 * 3600 * 24 * 7')

    .replace(/(?<=\d)mon/g, ' * 1000 * 3600 * 24 * 7 * 4')
    .replace(/(?<=\d)month/g, ' * 1000 * 3600 * 24 * 7 * 4')
    .replace(/(?<=\d)months/g, ' * 1000 * 3600 * 24 * 7 * 4')

    .replace(/(?<=\d)y/g, ' * 1000 * 3600 * 24 * 7 * 4 * 12')
    .replace(/(?<=\d)yr/g, ' * 1000 * 3600 * 24 * 7 * 4 * 12')
    .replace(/(?<=\d)year/g, ' * 1000 * 3600 * 24 * 7 * 4 * 12')
    .replace(/(?<=\d)years/g, ' * 1000 * 3600 * 24 * 7 * 4 * 12');

  return eval(result);
}

const randomValue = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getFilesInDir = (dir, blacklisted, fileList = []) => {
  let files;
  try {
    files = fs.readdirSync(dir);
  } catch (err) {
    console.error(`Failed to read directory ${dir}: ${err}`);
    return fileList;
  }

  files.forEach(file => {
    const filePath = path.join(dir, file);

    let stats;
    try {
      stats = fs.statSync(filePath);
    } catch (err) {
      console.error(`Failed to get stats for file ${filePath}: ${err}`);
      return;
    }

    if (fs.statSync(filePath).isDirectory() && !blacklisted.includes(file)) {
      getFilesInDir(filePath, blacklisted, fileList);
    } else if (path.extname(file) === '.js') {
      fileList.push(filePath);
    }
  });

  return fileList;
}

const setupSlashcommands = async (client, dir, blacklisted, updates = []) => {
  client.slashCommands.clear();
  // loads slash commands to client.slashCommands
  const commands = getFilesInDir(dir, blacklisted);

  const commandPromises = commands.map(async cmdPath => {
    const modulePath = path.join(__dirname, cmdPath);
    delete require.cache[require.resolve(modulePath)];
    const command = require(modulePath);

    if (command.name == null) {
      return updates.push({ cmdPath, status: 'LoadCommandFailure', message: 'Failed to load command!\n   No \`name\` property set!' });
    }

    if (command.description == null) {
      return updates.push({ cmdPath, status: 'LoadCommandFailure', message: 'Failed to load command!\n   No \`description\` property set!' });
    }

    if (command.code == null) {
      return updates.push({ cmdPath, status: 'LoadCommandFailure', message: 'Failed to load command!\n   No \`code\` method set!' });
    }

    if (command.category == null) {
      updates.push({ cmdPath, status: 'LoadCommandWarning', message: `\`/${command.name}\` was loaded with no \`category\` property set!\n   Some functionalities might break!` });
    } else {
      updates.push({ cmdPath, status: 'LoadCommand', message: `\`/${command.name}\` was loaded successfully!` });
    }

    await client.slashCommands.set(command.name, command);
  });

  await Promise.all(commandPromises);

  return updates;
}

const syncSlashcommands = async (client, type, guildId) => {
  let issues = 0;
  const updates = [];
  const clientCommands = client.slashCommands;
  if (type == "global") {
    const globalCommands = await client.application.commands.fetch();

    // two things we want to make:
    // add or update globalCommands to match clientCommands
    clientCommands.forEach((cmd, cmdObj, collection) => {
      const command = globalCommands.get(cmd);
      if (!command) {
        // make it
        try {
          client.application.commands.create({
            name: cmd,
            description: cmdObj.description,
            options: cmdObj.options ? cmdObj.options : [],
          });
  
          updates.push({ 'CreateCommand': `\`/${cmd}\` created successfully` });
        } catch (e) {
          issues++;
          updates.push({ 'CreateCommandFailure': `Couldn't create \`/${cmd}\`: \`${e.message}\`` });
        }
      } else {
        if (command != cmdObj) {
          // update diff commands
          try {
            client.application.commands.edit(cmd.id, {
              name: cmd,
              description: cmdObj.description,
              options: cmdObj.options ? cmdObj.options : [],
            });
    
            updates.push({ 'UpdateCommand': `\`/${cmd}\` updated successfully` });
          } catch (e) {
            issues++;
            updates.push({ 'UpdateCommandFailure': `Couldn't update \`/${cmd}\`: \`${e.message}\`` });
          }
        }
      }
    });
    
    // remove globalCommands that are no longer in clientCommands if any
    const depricatedCommands = globalCommands.difference(clientCommands);
    depricatedCommands.forEach((cmd, cmdObj, map) => {
      try {
        client.application.commands.delete(cmdObj.id);
  
        updates.push({ 'DeleteCommand': `\`/${cmd}\` deleted successfully` });
      } catch (e) {
        issues++;
        updates.push({ 'DeleteCommandFailure': `Couldn't delete \`/${cmd}\`: \`${e.message}\`` });
      }
    });
  } else if (type == "local") {
    if (!guildId) return "Invalid guild id";
    const guild = client.guilds.cache.get(guildId);
    if (!guild) return "Couldn't find the guild";
    
    const guildCommands = await guild.commands.fetch();

    // two things we want to make:
    // add or update guildCommands to match clientCommands
    clientCommands.forEach((cmd, cmdObj, collection) => {
      const command = guildCommands.get(cmd);
      if (!command) {
        // make it
        try {
          guild.commands.create({
            name: cmd,
            description: cmdObj.description,
            options: cmdObj.options ? cmdObj.options : [],
          });
    
          updates.push({ 'CreateCommand': `\`/${cmd}\` created successfully` });
        } catch (e) {
          issues++;
          updates.push({ 'CreateCommandFailure': `Couldn't create \`/${cmd}\`: \`${e.message}\`` });
        }
      } else {
        if (command != cmdObj) {
          // update diff commands
          try {
            guild.commands.edit(cmd.id, {
              name: cmd,
              description: cmdObj.description,
              options: cmdObj.options ? cmdObj.options : [],
            });
    
            updates.push({ 'UpdateCommand': `\`/${cmd}\` updated successfully` });
          } catch (e) {
            issues++;
            updates.push({ 'UpdateCommandFailure': `Couldn't update \`/${cmd}\`: \`${e.message}\`` });
          }
        }
      }
    });
    
    // remove guildCommands that are no longer in clientCommands if any
    const depricatedCommands = guildCommands.difference(clientCommands);
    depricatedCommands.forEach((cmd, cmdObj, map) => {
      try {
        guild.commands.delete(cmdObj.id);
  
        updates.push({ 'DeleteCommand': `\`/${cmd}\` deleted successfully` });
      } catch (e) {
        issues++;
        updates.push({ 'DeleteCommandFailure': `Couldn't delete \`/${cmd}\`: \`${e.message}\`` });
      }
    });

    return { issues, updates }
  } else {
    return `\`${type}\` is not an option!\n- Valid options are: [ \`global\`, \`local\` ]`;
  }
}


module.exports = {
  ms,
  randomValue,
  setupSlashcommands,
  syncSlashcommands,
};
