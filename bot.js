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

var noteTrans = require('./notefreq.json')

// Create a client with our options
const client = new tmi.client(opts);
const defaultDuration = 2.0;
const playerscript = "player.py";
const python3 = 'python3';
const maxDuration = 5.0;

const spawn = require("child_process").spawn;

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim().toUpperCase();

  // If the command is known, let's execute it
  var args = commandName.split(" ");
  // Frequency input
  if(args.length == 2 && !isNaN(args[0]) && !isNaN(args[1])) {
    const pythonProcess = spawn(python3,[playerscript, Number(args[0]), Math.max(maxDuration, Number([args[1]]))]);
  }
  // Note input
  if(noteTrans.hasOwnProperty(args[0])) {
    if(args.length == 2 && !isNaN(args[1])) {
      const pythonProcess = spawn(python3,[playerscript, noteTrans[args[0]], Math.max(maxDuration, Number([args[1]]))]); 
    } else {
      const pythonProcess = spawn(python3,[playerscript, noteTrans[args[0]], defaultDuration]); 
    }
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
