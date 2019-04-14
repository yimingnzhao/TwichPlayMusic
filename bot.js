const tmi = require('tmi.js');
const fs = require('fs');

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

var noteTrans = require('./notefreq.json');
var std = "";
var notes = ["A", "B", "C", "D", "E", "F", "G"];

// Create a client with our options
const client = new tmi.client(opts);
const defaultDuration = 2.0;
const playerscript = "player.py";
const python3 = 'python3';
const maxDuration = 5.0;

const spawn = require("child_process").spawn;

var notesList = [];

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  // Remove whitespace from chat message
  const commandName = msg.trim().toUpperCase();
  console.log(commandName);

  // If the command is known, let's execute it
  var args = commandName.split(" ");

  var duration = defaultDuration;
  var frequency = 0;
  // Duration input
  if(args.length == 2 && !isNaN(args[1])) {
    duration = Math.max(maxDuration, Number([args[1]]));
  }
  // Frequency input
  if(!isNaN(args[0])) {
    frequency = Number(args[0]);
  }
  // Note input
  if(noteTrans.hasOwnProperty(args[0] + "4")) {
    frequency = noteTrans[args[0] + "4"];
  }
  if(noteTrans.hasOwnProperty(args[0])) {
    frequency = noteTrans[args[0]];
  } 
    
  const pythonProcess = spawn(python3,[playerscript, frequency, duration]); 
  std += frequency + " " + duration;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

function step() {
  if(std != "") {
    fs.writeFile("tmp", std, function(err) {
        if(err) {
            return console.log(err);
        }
    }); 
    std = ""
  }
  // animator.stdin.end();
}

// step();
setInterval(step, .4);