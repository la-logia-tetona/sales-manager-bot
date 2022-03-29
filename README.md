# Sales Manager Bot

## Quick reference
* **Maintained by** [daniffig](https://github.com/daniffig/)
* **Where to get help?** You can [submit your ticket](https://github.com/la-logia-tetona/sales-manager-bot/issues) as an issue.

## What is Sales Manager Bot?
Sales Manager Bot is a Discord bot that allows you to manage and secure contents shared by the users of your guild on certain channels. It was developed by requirement of La Logia Tetona to provide a solution to leakage of sales' information. You may fork and modify this project to suit your needs.

## About this file
If you want to edit this file, please follow up the recommendations from this [Markdown Cheat Sheet](https://www.markdownguide.org/cheat-sheet/). And if you want to commit or collaborate with this project, please add good git commit messages [following this guide](https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/).

## How to setup this application

## Secrets / Environment variables
| key | description | required? |
| --- | ----------- | --------- |
| token | The key to control your bot, please check *Useful Links / How to get a Discord Bot Token*. | yes |
| clientId | The ID to identify your bot, please check *Useful Links / How to get a Discord Bot Token*. | yes |
| guildId | The ID to identify your server, you can get it from your Discord app. | yes |
| channelId | The ID of the channel where you want the bot to work, you can get it from your Discord app. | yes |
| autoArchiveDuration | The time in minutes that the thread will be keep active. *Default value: 60* | no |
| threadType | The type of thread that will be created. You can set *GUILD_PRIVATE_THREAD* if your guild is boosted. *Default value: GUILD_PUBLIC_THREAD* | no |
| locale | The locale you want to use for your bot's messages. Available locales: [en, es]. *Default value: en* | no |

## Scopes and Permissions
You must configure some scopes and permissions to make this bot work. In your *Discord Developer Portal / OAuth2 / URL Generator* you need to at least enable the **bot** and **applications.commands** scopes.

### Docker
```bash
#!/bin/sh

docker run --env-file production.env ghcr.io/la-logia-tetona/sales-manager-bot
```

### Docker Compose
```yaml
# docker-compose.yml

version: '3'
services:
  node:
    image: ghcr.io/la-logia-tetona/sales-manager-bot:latest
    env_file: production.env
```

In both cases we make use of a *production.env* file. Here you must set the env variables described in the ***Secrets*** section of this document. To ease this step we provide you with the template below.

```
# production.env

token=
clientId=
guildId=
channelId=
autoArchiveDuration=
threadType=
locale=
```

## Useful links
* [Discord Developer Portal](https://discord.com/developers/applications)
* [How to get a Discord Bot Token](https://www.writebots.com/discord-bot-token/)
* [discord.js / Create your bot](https://discordjs.guide/creating-your-bot/#creating-configuration-files)
