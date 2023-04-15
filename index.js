/**
 * SalesManager Discord Bot
 * version: 0.5.0
 * authors: la-logia-tetona
 * last update: 2022-04-09T21:00:00-03:00
 */

const VERSION = "v0.5.0";

const { Client, Intents, Util } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
const _string = require("underscore.string");

// https://www.npmjs.com/package/i18n
const i18n = require("./i18n.config.js");
const LocaleService = require("./services/localeService");

const AccessLog = require("./helpers/AccessLog");
const Clock = require("./helpers/Clock");
const AccessManager = require("./access-manager/AccessManager");

const localeService = new LocaleService(i18n);
localeService.setLocale(process.env.locale || "en");

// FIXME this needs to be refactored
const t = (string, args = undefined) => {
  return localeService.translate(string, args);
};

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

//const client = new Discord.Client({ disableMentions: 'everyone' });
// https://www.npmjs.com/package/@replit/database
// const db = new Database();
const channelId = process.env.channelId;

// const keep_alive = require('./keep_alive.js')

let channel;

const http = require('http');

// https://gist.github.com/koad/316b265a91d933fd1b62dddfcc3ff584

client.once("ready", async () => {
  console.log(`Hello! I'm alive! I'm logged in as ${client.user.tag}`);

  channel = await client.channels.fetch(channelId);
});

// https://discord.js.org/#/docs/discord.js/stable/class/ButtonInteraction
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  let author = interaction.member;
  let authorMention = `\<@${author.user.id}\>`;

  // let's check if we can find the thread
  // let threadId = interaction.customId;
  let [version, threadId, accessLogMessageId] = parseCustomId(
    interaction.customId
  );

  let thread = await interaction.channel.threads.fetch(threadId, {cache:true,force:true})
  if (thread.archived){
    thread.setArchived(false,"new member");
  }

  let threadName = `Sale#${threadId}`;

  if (thread) {
    // we don't want to bother users if they're already members of the thread
    let isAlreadyMember = await thread.members.resolveId(author);

    // but if they are not members yet we must notify them
    if (!isAlreadyMember) {
      await interaction.deferReply({ephemeral:true});
      tryAccess(thread, accessLogMessageId, threadId, interaction, author);
    } else {
      await interaction.reply({
        content: t("You are already suscribed to <#{{threadId}}>", {
          threadId: threadId,
        }),
        ephemeral: true,
      });
    }
  } else {
    console.log(`[${Clock.now()}] ERROR: ${threadName} not found!`);

    await interaction.reply({
      content: t(
        "{{threadName}} not found. Please contact the guild's administrators",
        { threadName: threadName }
      ),
      ephemeral: true,
    });
  }
});

const unlock = () => {
  http.get('http://concurrency:7007/unlock', async resp => {
    try {
      let body = '';
      resp.setEncoding('utf-8');
      for await (const chunk of resp) {
          body += chunk;
      }
      if (JSON.parse(body)['Message'] !== 'unlocked'){
        await interaction.editReply({
          content: t("notUnlocked"),
          ephemeral: true,
        });
      }
    } catch (e) {
      await interaction.editReply({
        content: t("notUnlocked"),
        ephemeral: true,
      });
      console.log('ERROR', e);
    }
  });
}

const tryAccess = (thread, accessLogMessageId, threadId, interaction, author) => {
  http.get('http://concurrency:7007/lock', async resp => {
    try {
      let body = '';
      resp.setEncoding('utf-8');
      for await (const chunk of resp) {
          body += chunk;
      }
      result = JSON.parse(body)['Message'] === 'available';

      if (result){
        const minutesToAccess = await AccessManager.canAccess(thread, accessLogMessageId, interaction);
        if (minutesToAccess < 0){
            await interaction.editReply({
              content: t("cantAccess"),
              ephemeral: true,
            });
          }
        else if (minutesToAccess > 0) {
          await interaction.editReply({
            content: t("retryIn", {
              remainingMinutes: minutesToAccess,
            }),
            ephemeral: true,
          }); 
        }
        else {
          const accessLog = await AccessLog.for(thread, {
            messageId: accessLogMessageId,
          });
    
          let couldAddMember = await accessLog.log(author.user);
    
          let message = couldAddMember
            ? t("You have been granted access to <#{{threadId}}>", {
                threadId: threadId,
              })
            : t(
                "Sorry, an error has occured. Please notify your guild's administrators."
              );
    
          await interaction.editReply({
            content: message,
            ephemeral: true,
          });
        }
        unlock();
      } else {
        await interaction.editReply({
          content: t("fasterTeton"),
          ephemeral: true,
        });
      }
    } catch (e) {
      console.log('ERROR', e);
    }
  });
}

// https://discord.com/developers/docs/interactions/application-commands#slash-commands
// https://discordjs.guide/creating-your-bot/creating-commands.html#command-deployment-script
// https://discordjs.guide/interactions/buttons.html#building-and-sending-buttons
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  let author = interaction.member;
  let authorMention = `\<@${author.user.id}\>`;

  if (interaction.channel.isThread()) {
    await interaction.reply(
      t("Sorry {{{user}}}, I'm not allowed to listen to threads", {
        user: authorMention,
      })
    );
    return;
  }

  let { commandName, options } = interaction;

  if (commandName === t("com.sale.name")) {
    let public = Util.cleanContent(
      options.getString(t("com.sale.options.public.name")),
      interaction.channel
    );
    let private = options.getString(t("com.sale.options.private.name"));

    // validate content length
    if (public + private > 2000) {
      await interaction.reply({
        content: t(
          "Your content exceeds the limit of 2000 characters. Please, check it out and try again."
        ),
        ephemeral: true,
      });

      return;
    }

    // https://gabceb.github.io/underscore.string.site/#truncate
    let threadName = _string.truncate(public, 61, "...");

    let thread = await channel.threads.create({
      name: threadName,
      autoArchiveDuration: process.env.autoArchiveDuration || 4320,
      type: process.env.threadType || "GUILD_PUBLIC_THREAD",
      reason: `${public}`,
      invitable: false,
    });

    if (thread) {
      let firstMessage = `${public}`;

      if (private) {
        firstMessage += `\r\n${private}`;
      }

      await thread.send(firstMessage);

      const accessLog = await AccessLog.for(thread);

      await accessLog.log(author.user);

      let customId = `${VERSION}#${thread.id}#${accessLog.id()}`;

      let firstRow = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId(customId)
          .setLabel(t("View Sale"))
          .setStyle("PRIMARY")
      );

      // https://stackoverflow.com/questions/70131112/how-to-send-a-message-without-replying-to-a-slash-command
      interaction.deferReply();
      interaction.deleteReply();

      const channelMessage = await interaction.channel.send({
        content: t("**{{text}}**. Thank you {{{user}}}!", {
          text: threadName,
          user: authorMention,
        }),
        components: [firstRow],
      });

      const compre = await channelMessage.guild.emojis.fetch('911372357099225168',{cache:true,force:true});
      await channelMessage.react(compre);

    } else {
    }
  }
});

const parseCustomId = (customId) => {
  let shards = customId.split("#");

  if (shards.length > 2) return shards;

  return ["v0.4.0", shards[0], shards[1]];
};

client.login(process.env.token);
