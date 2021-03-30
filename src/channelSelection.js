const prompts = require('prompts'); // Terminal prompts lib
const { Guild, TextChannel, Client } = require('discord.js'); // Discord SDK
const { hasEnoughChannelPermission } = require('./utils');

/**
 * Ask for a channel selection
 * @param {Client} client Discord client
 * @param {Guild} guild Guild where the channel slection are made
 * @returns {Promise<TextChannel>} Selected channel
 */
module.exports = (client, guild) => new Promise(async (resolve, reject) => {
  const guildSelectionPrompt = {
    type: 'select',
    name: 'channelSelection',
    message: 'Select a channel',
    choices: [],
  };

  guild.channels.cache.sort((c, cc) => c.rawPosition - cc.rawPosition).forEach(async (channel) => {
    if (channel.type === 'text') {
      const date = new Date(channel.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const creationDate = `${month}/${day}/${year}`;

      guildSelectionPrompt.choices.push({
        title: '#' + channel.name,
        description: `${channel.nsfw ? 'nsfw | ' : ''}created at ${creationDate} | id ${channel.id}`,
        value: channel,
        disabled: !hasEnoughChannelPermission(client.user, guild, channel),
      });
    }
  });

  const response = await prompts(guildSelectionPrompt);

  resolve(response.channelSelection);
});
