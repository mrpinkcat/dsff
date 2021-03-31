const ora = require('ora'); // Terminal spinner lib
const prompts = require('prompts'); // Terminal prompts lib
const Discord = require('discord.js'); // Discord SDK
const dotenv = require('dotenv');

const guildSelection = require('./guildSelection');
const channelSelection = require('./channelSelection');
const messageFetcher = require('./messageFetcher');
const client = new Discord.Client();

// Load environement variable
dotenv.config();

const startingSpinner = ora('Connecting to discord').start();

client.on('ready', async () => {
  startingSpinner.succeed(`Logged in as ${client.user.tag}!`);
  
  const selectedGuild = await guildSelection(client);
  const selectedChannel = await channelSelection(client, selectedGuild);
  /**
   * @type {{scanBotMessages: boolean}}
   */
  const { scanBotMessages } = await prompts({
    type: 'confirm',
    name: 'scanBotMessages',
    message: 'Do you want to scan the bot messages?',
    initial: false,
  });
  const allMessage = await messageFetcher(selectedChannel, scanBotMessages);
  
});

client.login(process.env.DISCORD_TOKEN);
