require("dotenv").config();
const axios = require("axios");
const cron = require("node-cron");
const Discord = require("discord.js");
const { schedule } = require("node-cron");

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Discord.Collection();

client.login(process.env.BOT_TOKEN);

const CHANNEL_ID = "1035257919471624226"; // general channel

let scheduledRequests = {};

client.on(Discord.Events.InteractionCreate, async (interaction) => {
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
      url = interaction.options["_hoistedOptions"][0]["value"];
      type = interaction.options["_hoistedOptions"][1]["value"];
      msg = await request(url, type, true);
      if (msg === 0) {
        interaction.reply("Timeout");
      } else {
        interaction.reply(msg);
      }
    } catch (error) {
      // await
      interaction.reply({
        content: `Request failed with the following exception: ${error}`,
      });
    }
  } else if (interaction.commandName === "schedule") {
    try {
      interval = interaction.options["_hoistedOptions"][0]["value"];
      url = interaction.options["_hoistedOptions"][1]["value"];
      type = interaction.options["_hoistedOptions"][2]["value"];
      status = interaction.options["_hoistedOptions"][3]["value"];

      scheduleRequest(interval, url, type, status);
      interaction.reply("Scheduled!");
    } catch (error) {
      interaction.reply(error);
    }
  } else if (interaction.commandName === "listscheduled") {
    if (Object.keys(scheduledRequests).length === 0) {
      interaction.reply({ content: "No requests are scheduled" });
    } else {
      interaction.reply({ content: beautify(scheduledRequests) });
    }
  } else if (interaction.commandName === "unschedule") {
    try {
      stopScheduledJob(interaction.options["_hoistedOptions"][0]["value"]);
      interaction.reply({ content: "Job has been stopped" });
    } catch (error) {
      interaction.reply({ content: "Something went wrong stopping the job!" });
    }
  }
});

function beautify(obj) {
  let str = "";
  for ([key, val] of Object.entries(obj)) {
    str += `${key}: {\n`;
    for ([innerKey, innerVal] of Object.entries(val)) {
      str += `\t${innerKey}: ${innerVal}\n`;
    }
    str += `}\n`;
  }
  return str;
}

function stopScheduledJob(jobName) {
  cron.getTasks().get(jobName).stop();
  delete scheduledRequests[jobName];
}

function signifyFailure(requestType, url, reason) {
  client.channels.cache.get(CHANNEL_ID).send(`@here, \n
    ⚠️ ${requestType.toUpperCase()} request to ${url} ${reason} ⚠️\n
    Scheduled job has been stopped. Schedule a new one when you resolve the issue!`);
}

function getNameOfJob(interval, url, requestType, expectedStatusCode) {
  function getKeyByValue() {
    for (const [key, value] of Object.entries(scheduledRequests)) {
      if (
        value.cronInterval == interval &&
        value.url == url &&
        value.requestType == requestType &&
        value.expectedStatus == expectedStatusCode
      ) {
        return key;
      }
    }
  }

  return getKeyByValue();
}

function scheduleRequest(interval, url, requestType, expectedStatusCode) {
  console.log("A job has been scheduled!");

  const job = cron.schedule(interval, async function () {
    console.log("SCHEDULED JOB IS RUNNING");

    let req;
    try {
      req = await request(url, requestType, false);
    } catch (error) {
      signifyFailure(requestType, url, `failed due to ${error}`);

      stopScheduledJob(
        getNameOfJob(interval, url, requestType, expectedStatusCode)
      );
    }
    if (req === 0) {
      signifyFailure(requestType, url, "failed due to TIMEOUT");

      stopScheduledJob(
        getNameOfJob(interval, url, requestType, expectedStatusCode)
      );
    } else if (req !== expectedStatusCode) {
      console.log("A scheduled request failed!");
      signifyFailure(requestType, url, "FAILED");

      stopScheduledJob(
        getNameOfJob(interval, url, requestType, expectedStatusCode)
      );
    }
  });

  scheduledRequests[job.options.name] = {
    cronInterval: interval,
    url: url,
    requestType: requestType,
    expectedStatus: expectedStatusCode,
  };
}

// Make a HTTP request
async function request(url, requestType, isCommand) {
  try {
    const res = await axios({
      method: requestType,
      url: url,
      timeout: 5000,
    });

    if (isCommand) {
      return `${requestType} request to ${url} exited with code ${res.status}`;
    }

    return res.status;
  } catch (error) {
    if (error.response !== undefined) {
      return isCommand
        ? `${requestType} request to ${url} exited with code ${error.response.status}`
        : error.response.status;
    }

    return error;
  }
}
