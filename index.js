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

client.commands = new Discord.Collection();

client.login(process.env.BOT_TOKEN)

const CHANNEL_ID = "1036019427478622279" // programming channel 

// bot structure

// function scheduleRequest(url, expectedResponseCode, timeInterval) -> CRON

// function listScheduledRequests -> returns all of the scheduled requests with identification numbers (indexes)
// function removeScheduledRequest -> delete scheduled request by identification number (index)

// Listen for commands

client.on(Discord.Events.InteractionCreate, async interaction => {

    console.log(interaction.options)

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "request") {

        /*
        CommandInteractionOptionResolver {
        _group: null,
        _subcommand: null,
        _hoistedOptions: [
            { name: 'url', type: 3, value: 'facebook.com' },
            { name: 'type', type: 3, value: 'get' },
            { name: 'status', type: 4, value: 200 }
        ]
        */

        try {

            url = interaction.options["_hoistedOptions"][0]["value"],
                type = interaction.options["_hoistedOptions"][1]["value"],
                status = interaction.options["_hoistedOptions"][2]["value"]

            interaction.reply(await request(url, type, status))
        }

        catch (error) {
            // await
            interaction.reply({content: `Request failed with the following exception: ${error}`})
        }
    }

})


// Make a HTTP request
async function request(url, requestType, expectedStatusCode) {
    const res = await axios({
        method: requestType,
        url: url,
    })

    const channel = await client.channels.fetch(CHANNEL_ID)
    // Come up with a better message
    return `${requestType} request to ${url} exited with code ${res.status}`
}


