const Database = require("@replit/database");
const validUrl = require('valid-url');

const { Client, Intents, MessageEmbed } = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

//const client = new Discord.Client({ disableMentions: 'everyone' });
// https://www.npmjs.com/package/@replit/database
const db = new Database();
const channelId = process.env.channelId

// const keep_alive = require('./keep_alive.js')

let channel

// https://gist.github.com/koad/316b265a91d933fd1b62dddfcc3ff584

client.once('ready', async () => {
  console.log("Hello! I'm alive! I'm logged in as " + client.user.tag);
  channel = await client.channels.fetch(channelId)
});

// https://discord.js.org/#/docs/discord.js/stable/class/ButtonInteraction
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  
  let author = interaction.member
  let threadId = interaction.customId
  let thread = interaction.channel.threads.cache.find((th, id) => id === threadId )
  let saleName = `Sale#${threadId}`

  if (thread) {
    let isAlreadyMember = await thread.members.resolveId(author)

    if (!isAlreadyMember) {
      await thread.send(`Check out this sale, ${interaction.member}!`)

      await interaction.reply({
        content: `You have been granted access to ${saleName}`,
        ephemeral: true
      })
    } else {
      await interaction.reply({
        content: `You are already suscribed to #${saleName}`,
        ephemeral: true
      })
    }
  } else {
    console.log(`ERROR: ${saleName} not found!`)

    await interaction.reply({
      content: `${saleName} not found. Please contact the guild's administrators.`,
      ephemeral: true
    })
  }
})

// https://discord.com/developers/docs/interactions/application-commands#slash-commands
// https://discordjs.guide/creating-your-bot/creating-commands.html#command-deployment-script
// https://discordjs.guide/interactions/buttons.html#building-and-sending-buttons
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  let author = interaction.member

  if (interaction.channel.isThread()) {
    await interaction.reply(`Sorry ${author}, I'm not allowed to listen to threads.`)
    return
  }

  let { commandName, options } = interaction

  if (commandName === 'sale') {    
    let description = options.getString('description')
    let link = options.getString('link')
  
    // if (link && !validUrl.isWebUri(link)) {
    //   await interaction.reply({
    //     content: 'Please, if you want to submit a link check out it is a valid web URI. For example, <https://discord.com> is a valid web URI.',
    //   })
      
    //   return
    // }

    let threadName = description.length <= 48 ? description : description.substring(0, 45) + '...'

    let thread = await channel.threads.create({
      name: threadName,
      autoArchiveDuration: 60,
      // type: 'GUILD_PRIVATE_THREAD',
      type: 'GUILD_PUBLIC_THREAD',
      reason: `${description}`,
      thread_metadata: {
        invitable: false
      },
    })

    if (thread) {
      await thread.send(`${description} ${link}`)

      let firstRow = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId(thread.id)
          .setLabel('View Sale')
          .setStyle('PRIMARY'),
      )

      await interaction.reply({
        content: `**New SALE!** Please, click *View Sale* to join thread **${threadName}**. Thank you ${author} for sharing!`,
        components: [firstRow],
      });
    } else {
    }
  }
})

client.login(process.env.token);