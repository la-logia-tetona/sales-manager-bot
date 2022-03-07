# Sales Manager Bot

## About this file
If you want to edit this file, please follow up the recommendations from this [Markdown Cheat Sheet](https://www.markdownguide.org/cheat-sheet/). And if you want to commit or collaborate with this project, please add good git commit messages [following this guide](https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/).

## Secrets
| key | description | required? |
| --- | ----------- | --------- |
| token | The key to control your bot, please check *Useful Links / How to get a Discord Bot Token*. | yes |
| clientId | The ID to identify your bot, please check *Useful Links / How to get a Discord Bot Token*. | yes |
| guildId | The ID to identify your server, you can get it from your Discord app. | yes |
| channelId | The ID of the channel where you want the bot to work, you can get it from your Discord app. | yes |

## Scopes and Permissions
You must configure some scopes and permissions to make this bot work. In your *Discord Developer Portal / OAuth2 / URL Generator* you need to at least enable the **bot** and **applications.commands** scopes.

## Useful links
* [Discord Developer Portal](https://discord.com/developers/applications)
* [How to get a Discord Bot Token](https://www.writebots.com/discord-bot-token/)
* [discord.js / Create your bot](https://discordjs.guide/creating-your-bot/#creating-configuration-files)
