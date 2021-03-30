const ora = require('ora'); // Terminal pinner lib
const { TextChannel, Message } = require('discord.js'); // Discord SDK
const fs = require('fs');

/**
 * Scan the channel a return all the message with attachement(s)
 * @param {TextChannel} channel The channel to scan
 * @returns {Promise<Array>} All messages with attachment(s)
 */
module.exports = (channel, scanBotMessages) => new Promise(async (resolve, reject) => {
  const date = new Date();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const fileName = `output/links-${channel.name}.txt`
  
  const messageFetchingSpinner = ora('Fetching messages ...').start();

  try {
    /**
     * All messages with atachement
     */
    const allMessages = [];
    let numberOfAllMessagesFetched = 0;

    const firstFetchMessages = await channel.messages.fetch({ limit: 100 });
    firstFetchMessages.forEach((m) => {
      if (m.attachments.size !== 0) {
        const date = new Date(m.createdAt);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const messageDate = `${year}/${month}/${day} ${hours}:${minutes}`
        allMessages.push({
          id: m.id,
          content: m.content,
          author: m.author,
          isAuthorBot: m.author.bot,
          createdAt: m.createdAt,
          url: m.url,
          attachments: [],
        });
        m.attachments.forEach((attachment) => {
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
          fs.appendFileSync(fileName, `[${messageDate}] - (${m.content}) ${attachment.name} ${attachment.size} ${attachment.url}\n`);
        });
      }
    });
    numberOfAllMessagesFetched += firstFetchMessages.size;
    messageFetchingSpinner.text = `Fetching messages ... [${numberOfAllMessagesFetched}]`;
    let lastMessageId = channel.messages.cache.last().id;
    let numberOfMessagesFetched = 0;
    do {
      const newMessages = await channel.messages.fetch({ before: lastMessageId, limit: 100 });
      newMessages.forEach((m) => {
        if (m.attachments.size !== 0) {
          const date = new Date(m.createdAt);
          const year = date.getFullYear();
          const month = date.getMonth();
          const day = date.getDate();
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const messageDate = `${year}/${month}/${day} ${hours}:${minutes}`
          allMessages.push({
            id: m.id,
            content: m.content,
            author: m.author,
            isAuthorBot: m.author.bot,
            createdAt: m.createdAt,
            url: m.url,
            attachments: [],
          });
          m.attachments.forEach((attachment) => {
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
            fs.appendFileSync(fileName, `[${messageDate}] - (${m.content}) ${attachment.name} ${attachment.size} ${attachment.url}\n`);
          });
        }
      });
      lastMessageId = channel.messages.cache.last().id;
      numberOfAllMessagesFetched += newMessages.size;
      messageFetchingSpinner.text = `Fetching messages ... [${numberOfAllMessagesFetched}]`;
      numberOfMessagesFetched = newMessages.size;
    } while (numberOfMessagesFetched !== 0);
    messageFetchingSpinner.succeed(`${numberOfAllMessagesFetched} messages fetched, ${allMessages.length} shared file founded !`);
    resolve(allMessages);
  } catch (error) {
    messageFetchingSpinner.fail('Error');
    console.log(error);
    
    return;
  }
});

