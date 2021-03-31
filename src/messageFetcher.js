const ora = require('ora'); // Terminal spinner lib
const { TextChannel, User, Message } = require('discord.js'); // Discord SDK
const fs = require('fs');

/**
 * Scan the channel a return all the message with attachement(s)
 * @param {TextChannel} channel The channel to scan
 * @param {boolean} scanBotMessages Is the bot is going to scan the other bot messages
 * @returns {Promise<{
 *   id: string,
 *   content: string,
 *   author: User,
 *   isAuthorBot: boolean,
 *   createdAt: Date,
 *   url: string,
 *   attachments: {
 *     id: string,
 *     name: string,
 *     size: !number,
 *     spoiler: boolean,
 *     url: string,
 *     with: number,
 *     height: number,
 *   }[]
 * }[]>} All messages with attachment(s)
 */
module.exports = (channel, scanBotMessages) => new Promise(async (resolve, reject) => {
  const fileName = `output/links-${channel.name}.txt`

  // Launch the fetching spinner
  const messageFetchingSpinner = ora(
    `Fetching messages on #${channel.name}...`
  ).start();

  try {
    /**
     * All messages with atachement
     * @type {{
     *   id: string,
     *   content: string,
     *   author: User,
     *   isAuthorBot: boolean,
     *   createdAt: Date,
     *   url: string,
     *   attachments: {
     *     id: string,
     *     name: string,
     *     size: !number,
     *     spoiler: boolean,
     *     url: string,
     *     with: number,
     *     height: number,
     *   }[]
     * }[]}
     */
    const allMessages = [];
    /**
     * Number of all message fetched by the bot
     */
    let numberOfAllMessagesFetched = 0;
    /**
     * Number of the last messages fetched by the bot.
     * Usefull for knowing when the bot have scan all the messages in the channel
     */
    let numberOfLastMessagesFetched = 0;
    /**
     * Id of the older message fetched
     * @type {?string}
     */
    let lastMessageId = null;
    // Change the spinner text
    messageFetchingSpinner.text = `Fetching messages on #${channel.name}... [${allMessages.length}/${numberOfAllMessagesFetched}]`;
    do {
      /**
       * Fetch options use in the discord.js fetch
       * @type {{
       *   before: string|undefined,
       *   limit: number,
       * }}
       */
      let fetchOptions = { limit: 100 };
      if (lastMessageId) {
        fetchOptions.before = lastMessageId;
      }
      /**
       * Store the message in array and in the file
       * @param {Message} message Message to be stored
       */
      const messageStorer = (message) => {
        const date = new Date(message.createdAt);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const messageDate = `${year}/${month}/${day} ${hours}:${minutes}`
        allMessages.push({
          id: message.id,
          content: message.content,
          author: message.author,
          isAuthorBot: message.author.bot,
          createdAt: message.createdAt,
          url: message.url,
          attachments: [],
        });
        message.attachments.forEach((attachment) => {
          const index = allMessages.length - 1;
          allMessages[index].attachments.push({
            id: attachment.id,
            name: attachment.name,
            size: attachment.size,
            spoiler: attachment.spoiler,
            url: attachment.url,
            with: attachment.width,
            height: attachment.width,
          })
          fs.appendFileSync(fileName, `[${messageDate}] - (${message.author.tag} ${message.content}) ${attachment.name} ${attachment.size} ${attachment.url}\n`);
        });
      }
      // Fetch last 100 message
      const newMessages = await channel.messages.fetch(fetchOptions);
      newMessages.forEach((m) => {
        if (m.attachments.size !== 0) {
          if (m.author.bot && scanBotMessages) {
            messageStorer(m);
          } else if (!m.author.bot) {
            messageStorer(m);
          }
        }
      });
      lastMessageId = channel.messages.cache.last().id;
      numberOfAllMessagesFetched += newMessages.size;
      numberOfLastMessagesFetched = newMessages.size;
      messageFetchingSpinner.text = `Fetching messages on #${channel.name}... [${allMessages.length}/${numberOfAllMessagesFetched}]`;
    } while (numberOfLastMessagesFetched !== 0);
    messageFetchingSpinner.succeed(`${numberOfAllMessagesFetched} messages fetched, ${allMessages.length} shared file founded !`);
    ora(`Outputed in ${fileName}`).info();
    resolve(allMessages);
  } catch (error) {
    messageFetchingSpinner.fail('Error');
    reject(error);
  }
});
