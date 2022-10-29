require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.MessageContent,
    ]
});

client.login(process.env.BOT_TOKEN)
