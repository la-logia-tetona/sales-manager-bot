/**
 * SalesManager Discord Bot
 * version: 0.2.0
 * authors: la-logia-tetona
 * last update: 20220317150000
 */

const Database = require("@replit/database");
const validUrl = require("valid-url");

const { Client, Intents, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");

// https://www.npmjs.com/package/i18n
const i18n = require("./i18n.config.js");
const LocaleService = require("./services/localeService");

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
const db = new Database();
const channelId = process.env.channelId;

// const keep_alive = require('./keep_alive.js')

let channel;

// https://gist.github.com/koad/316b265a91d933fd1b62dddfcc3ff584

client.once("ready", async () => {
  console.log(
    t("Hello! I'm alive! I'm logged in as {{name}}", { name: client.user.tag })
  );
  channel = await client.channels.fetch(channelId);
});

// https://discord.js.org/#/docs/discord.js/stable/class/ButtonInteraction
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  let author = interaction.member;
  let authorMention = `\<@${author.user.id}\>`;

  // let's check if we can find the thread
  let threadId = interaction.customId;
  let thread = interaction.channel.threads.cache.find(
    (th, id) => id === threadId
  );
  
  let saleName = `Sale#${threadId}`;

  if (thread) {
    // we don't want to bother users if they're already members of the thread
    let isAlreadyMember = await thread.members.resolveId(author);

    // but if they are not members yet we must notify them
    if (!isAlreadyMember) {
      await thread.send(
        t("Check out this sale, {{{user}}}!", { user: authorMention })
      );

      await interaction.reply({
        content: t("You have been granted access to {{threadName}}", {
          threadName: saleName,
        }),
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: t("You are already suscribed to {{threadName}}", {
          threadName: saleName,
        }),
        ephemeral: true,
      });
    }
  } else {
    // TODO: add datetime
    console.log(
      t("ERROR: {{threadName}} not found!", { threadName: saleName })
    );

    await interaction.reply({
      content: t(
        "{{threadName}} not found. Please contact the guild's administrators",
        { threadName: saleName }
      ),
      ephemeral: true,
    });
  }
});

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
    // TODO: can we limit the description length?
    let public = options.getString(t("com.sale.options.public.name"));
    let private = options.getString(t("com.sale.options.private.name"));

    // if (link && !validUrl.isWebUri(link)) {
    //   await interaction.reply({
    //     content: 'Please, if you want to submit a link check out it is a valid web URI. For example, <https://discord.com> is a valid web URI.',
    //   })

    //   return
    // }

    let threadName =
      public.length <= 48 ? public : public.substring(0, 45) + "...";

    let thread = await channel.threads.create({
      name: threadName,
      autoArchiveDuration: process.env.autoArchiveDuration || 60,
      type: process.env.threadType || "GUILD_PUBLIC_THREAD",
      reason: `${public}`,
      invitable: false,
    });

    if (thread) {
      await thread.send(`${public}\r\n${private}`);

      let firstRow = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId(thread.id)
          .setLabel(t("View Sale"))
          .setStyle("PRIMARY")
      );

      await interaction.reply({
        content: t("**{{text}}**. Thank you {{{user}}} for sharing!", {
          text: threadName,
          user: authorMention,
        }),
        components: [firstRow],
      });
    } else {
    }
  }
});

client.login(process.env.token);
