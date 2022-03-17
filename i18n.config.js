// https://phrase.com/blog/posts/node-js-i18n-guide/

const i18n = require("i18n");
const path = require("path");

i18n.configure({
  locales: ["en", "es"],
  defaultLocale: "en",
  queryParameter: "lang",
  directory: path.join("./", "locales")
});

module.exports = i18n;
