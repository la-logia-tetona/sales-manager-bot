const Database = require("@replit/database");
const validUrl = require('valid-url');

const { Client, Intents, MessageEmbed } = require('discord.js');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
 });

//const client = new Discord.Client({ disableMentions: 'everyone' });
// https://www.npmjs.com/package/@replit/database
const db = new Database();
const channelId = '950442338671554624'

// const keep_alive = require('./keep_alive.js')

let channel

// https://gist.github.com/koad/316b265a91d933fd1b62dddfcc3ff584

client.once('ready', async () => {
  console.log("Hello! I'm alive! I'm logged in as " + client.user.tag);
  channel = await client.channels.fetch(channelId)
});

// https://discord.com/developers/docs/interactions/application-commands#slash-commands
// https://discordjs.guide/creating-your-bot/creating-commands.html#command-deployment-script
client.on('interactionCreate', async (interaction) => {
  let author = interaction.member

  if (!interaction.isCommand()) return;
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
      reason: `${description}`,
      thread_metadata: {
        invitable: false
      }
    })

    if (thread) {
      // await thread.send({
      //   content: `Here you are, ${author}`
      // })

      console.log(interaction)
    
      await interaction.reply({
        content: `Thank you for sharing, ${author}! Your thread **${threadName}** was created.`
      })
      
      console.log("reply")      
      console.log(interaction)
    } else {
    }
  }
})

client.on('messageReactionAdd', async (reaction, user) => {  
  console.log(reaction)
  // const message = reaction.message
  // const threadId = await db.get(message.id)
  // const thread = channel.threads.cache.find(t => t.id === threadId)

  // if (thread) {
  //   let alreadyMember = await thread.members.resolveId(user.id)

  //   if (!alreadyMember) {
  //     thread.send(`mirate este oferton ${user}`)      
  //   }
  // } else {
  //   console.log(`thread related to message id ${message.id} not found`)
  // }
});

// client.on('messageCreate', async (message) => {
//   if (message.author.bot) return;
//   if (!enabledChannels.includes(message.channel.id))
//   if (!message.content.startsWith("!")) return;  

//   console.log("Hello there!")
// })

//   var tag = message.content.slice(1).split(" ");
  
//   if (tag[0] == "oferta") {
//     // HACK We add the message id to the thread name because we
//     // cannot add metadata to threads. This is the only way we found
//     // to relate a message, its reactions and a private thread.
//     let threadName = tag.slice(1).join(" ") || 'threadName'
//     threadName = `${threadName} ${message.id}`
    
//     console.log("i'm going to created a thread...")
    
//     const thread = await channel.threads.create({
//       name: threadName,
//       autoArchiveDuration: 10080,
//       type: 'GUILD_PRIVATE_THREAD',
//       invitable: false,
//       reason: 'Needed a separate thread for food',
//       thread_metadata: {
//         invitable: false
//       }
//     });

//     // FIXME We can do this with some thread property on creation but we
//     // must read all the API documentation first. xD
//     thread.send(`Bienvenido a tu thread de oferta, ${message.author}. ¡No te olvides de copiar el link!`)
    
//     console.log(`thread ${thread.name} created!`)
//   } else if (tag[0] == "createSale") {
//     let author = message.author
//     let link = tag[1]
//     console.log(isValidUrl(link))
//     let description = tag.slice(2).join(" ")
//     let threadName = description.substring(0, 32) + '...'

//     await message.delete()

//     let newMessage = await channel.send(`**¡Nueva oferta!** ${threadName}. ¡Gracias por compartir ${author}!`)
        
//     console.log("i'm going to created a thread...")
    
//     const thread = await channel.threads.create({
//       name: threadName,
//       autoArchiveDuration: 10080,
//       type: 'GUILD_PRIVATE_THREAD',
//       invitable: false,
//       reason: 'Needed a separate thread for food',
//       thread_metadata: {
//         invitable: false
//       }
//     });

//     await db.set(newMessage.id, thread.id)

//     // FIXME We can do this with some thread property on creation but we
//     // must read all the API documentation first. xD
//     thread.send(`¡Muchas gracias por compartir esta oferta, ${author}!. ${link} / ${description}`)
    
//     console.log(`thread ${thread.name} created!`)    
//   } else if (tag[0] == "clearDb") {
//     await db.empty()
//   } else {
//     channel.send(`¡No te entiendo, ${message.author}`)
//   }
// });

// client.on("messageReactionAdd", async (reaction, user) => {
//   console.log("new reaction detected!")
  
//   const message = reaction.message
//   const threadId = await db.get(message.id)
//   const thread = channel.threads.cache.find(t => t.id === threadId)

//   if (thread) {
//     let alreadyMember = await thread.members.resolveId(user.id)

//     if (!alreadyMember) {
//       thread.send(`mirate este oferton ${user}`)      
//     }
//   } else {
//     console.log(`thread related to message id ${message.id} not found`)
//   }
// });

client.login(process.env.token);