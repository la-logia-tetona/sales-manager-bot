const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [
	new SlashCommandBuilder().setName('sale').setDescription('Adds a new sale to the server!')
  	.addStringOption(option =>
  		option.setName('description')
  			.setDescription('The description for the thread')
  			.setRequired(true))  
  	.addStringOption(option =>
  		option.setName('link')
  			.setDescription('The link for the thread')
  			.setRequired(false)),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.token);

rest.put(Routes.applicationGuildCommands(process.env.clientId, process.env.guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);