require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.GuildMembers,
    ]
});

client.login(process.env.BOT_TOKEN)

// bot structure

// function getRequest(url, expectedResponseCode)
// function scheduleRequest(url, expectedResponseCode, timeInterval) -> CRON

// function listScheduledRequests -> returns all of the scheduled requests with identification numbers (indexes)
// function removeScheduledRequest -> delete scheduled request by identification number (index)

client.on("messageCreate", (message) => {
    console.log(message)
    if (message.content === "requestah") {
        message.reply(`Hello Lord ${message.author}`)
    }
})