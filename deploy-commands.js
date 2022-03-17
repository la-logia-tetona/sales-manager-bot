const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

// https://www.npmjs.com/package/i18n
const i18n = require("./i18n.config.js");
const LocaleService = require("./services/localeService");
const localeService = new LocaleService(i18n);
localeService.setLocale(process.env.locale || "en");

const t = (string) => {
  return localeService.translate(string);
};

const commands = [
  new SlashCommandBuilder()
    .setName(t("com.sale.name"))
    .setDescription(t("com.sale.desc"))
    .addStringOption((option) =>
      option
        .setName(t("com.sale.options.public.name"))
        .setDescription(t("com.sale.options.public.desc"))
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName(t("com.sale.options.private.name"))
        .setDescription(t("com.sale.options.private.desc"))
        .setRequired(true)
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(process.env.token);

rest
  .put(
    Routes.applicationGuildCommands(process.env.clientId, process.env.guildId),
    { body: commands }
  )
  .then(() => console.log(t("Successfully registered application commands")))
  .catch(console.error);
