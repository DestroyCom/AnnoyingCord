require("dotenv").config();
const Discord = require("discord.js");

const token = process.env.TOKEN || null;
const userIdToTrack = process.env.USER_ID_TO_TRACK || null;

if (!token || !userIdToTrack) {
  console.error("Missing TOKEN or USER_ID_TO_TRACK in .env file");
  process.exit(1);
} else {
  console.log("TOKEN and USER_ID_TO_TRACK are set in .env file");
  console.log("TOKEN: ", token);
  console.log("USER_ID_TO_TRACK: ", userIdToTrack);
}

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once(Discord.Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Discord.Events.MessageCreate, (message) => {
  if (message.author.bot) return;

  if (message.author.id === userIdToTrack) {
    message.channel.send(message.content);
  }
});

client.on("voiceStateUpdate", (oldState, newState) => {
  if (newState.channel) {
    if (newState.member.id !== userIdToTrack) return;
    newState.member.voice.disconnect();
  }
});

client.login(token);
