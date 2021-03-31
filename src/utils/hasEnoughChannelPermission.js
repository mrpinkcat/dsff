const Discord = require('discord.js');

/**
 * Checks if the bot has the required permission level to run.
 * @param {Discord.UserResolvable} botUser The guild in question
 * @param {Discord.GuildResolvable} guild The guild in question
 * @param {Discord.ChannelResolvable} channel The channel in question
 * @returns {Promise<boolean>} `true` if the bot has the required permission level to run.
 */
module.exports = (botUser, guild, channel) => {
  const member = guild.member(botUser);
  const channelPermission = member.permissionsIn(channel);
  return channelPermission.has('VIEW_CHANNEL') && channelPermission.has('READ_MESSAGE_HISTORY');
};
