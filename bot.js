const tmi = require('tmi.js');

// Define configuration options
const opts = {
  identity: {
    username: "twitchplaymusic",
    password: "329ap2jupn5ouukq7b6l8vq4cu2be5"
  },
  channels: [
    "twitchplaymusic"
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

const spawn = require("child_process").spawn;

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  var args = commandName.split(" ");
  if(args.length == 2) {
    const pythonProcess = spawn('python3',["player.py", Number(args[0]), Number([args[1]])]);
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
