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
    localeService.translate(
      "Hello! I'm alive! I'm logged in as %s",
      client.user.tag
    )
  );
  channel = await client.channels.fetch(channelId);
});

// https://discord.js.org/#/docs/discord.js/stable/class/ButtonInteraction
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  let author = interaction.member;
  let threadId = interaction.customId;
  // let's check if we can find the thread
  let thread = interaction.channel.threads.cache.find(
    (th, id) => id === threadId
  );
  let saleName = `Sale#${threadId}`;

  if (thread) {
    // we don't want to bother users if they're already members of the thread
    let isAlreadyMember = await thread.members.resolveId(author);

    // but if they are not members yet we must notify them
    if (!isAlreadyMember) {
      console.log(
        localeService.translate(
          "Hello! I'm alive! I'm logged in as %s",
          client.user.tag
        )
      );
      // await thread.send(`Check out this sale, ${interaction.member}!`)
      await thread.send(
        localeService.translate("Check out this sale, %s!", interaction.member)
      );

      await interaction.reply({
        // content: `You have been granted access to ${saleName}`,
        content: localeService.translate(
          "You have been granted access to %s",
          saleName
        ),
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: localeService.translate(
          "You are already suscribed to %s",
          saleName
        ),
        ephemeral: true,
      });
    }
  } else {
    // TODO: add datetime
    console.log(localeService.translate(
      "ERROR: %s not found!",
      saleName
    ));

    await interaction.reply({
      content: localeService.translate(
        "%s not found. Please contact the guild's administrators",
        saleName
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

  if (interaction.channel.isThread()) {
    await interaction.reply(
      localeService.translate(
        "Sorry %s, I'm not allowed to listen to threads",
        author
      )
    );
    return;
  }

  let { commandName, options } = interaction;

  if (commandName === "sale") {
    // TODO: can we limit the description length?
    let description = options.getString("description");
    let link = options.getString("link");

    // if (link && !validUrl.isWebUri(link)) {
    //   await interaction.reply({
    //     content: 'Please, if you want to submit a link check out it is a valid web URI. For example, <https://discord.com> is a valid web URI.',
    //   })

    //   return
    // }

    let threadName =
      description.length <= 48
        ? description
        : description.substring(0, 45) + "...";

    let thread = await channel.threads.create({
      name: threadName,
      autoArchiveDuration: process.env.autoArchiveDuration || 60,
      type: process.env.threadType || "GUILD_PUBLIC_THREAD",
      reason: `${description}`,
      invitable: false,
    });

    if (thread) {
      await thread.send(`${description} ${link}`);

      let firstRow = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId(thread.id)
          .setLabel(localeService.translate("View Sale"))
          .setStyle("PRIMARY")
      );

      await interaction.reply({
        content: localeService.translate("**%s**. Thank you %s for sharing!", threadName, author),
        components: [firstRow],
      });
    } else {
    }
  }
});

client.login(process.env.token);
