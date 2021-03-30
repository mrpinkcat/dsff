const prompts = require('prompts'); // Terminal prompts lib
const { Guild, Client } = require('discord.js'); // Discord SDK

/**
 * Ask for a guid selection
 * @param {Client} client Discord client
 * @returns {Promise<Guild>} Selected guild
 */
module.exports = (client) => new Promise(async (resolve, reject) => {
  const guildSelectionPrompt = {
    type: 'select',
    name: 'guildSelection',
    message: 'Select a guild',
    choices: [],
  };

  client.guilds.cache.forEach((guild) => {
    const date = new Date(guild.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const creationDate = `${month}/${day}/${year}`
    guildSelectionPrompt.choices.push({
      title: guild.name,
      description: `${guild.memberCount} members | created at ${creationDate} | id ${guild.id}`,
      value: guild,
    });
  });

  const response = await prompts(guildSelectionPrompt);

  resolve(response.guildSelection);
});
