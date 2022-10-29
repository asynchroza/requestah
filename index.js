require('dotenv').config()
const axios = require('axios')

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

const CHANNEL_ID = "1036019427478622279"

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
    else if (message.content === "check") {
        request("https://hubconf.thehub-aubg.com", "get", 200)
    }
})

async function request(url, requestType, expectedStatusCode) {
    const res = await axios({
        method: requestType,
        url: url,
    })

    const channel = await client.channels.fetch(CHANNEL_ID)
    channel.send(`${requestType} request to ${url} exited with code ${res.status}`)
}
