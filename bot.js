const tmi = require('tmi.js');
var ks = require('node-key-sender');
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
const defaultDuration = '2';
const playerscript = "pyAudioPlayer.py";
const python = 'python';

const spawn = require("child_process").spawn;

var notesList = [];

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
  // if(args.length == 2 && !isNaN(args[0]) && !isNaN(args[1])) {
  //   const pythonProcess = spawn(python3,[playerscript, Number(args[0]), Number([args[1]])]);
  // }

  var noteCode = "A1";
  var noteLength = 0;
  // Note input
  if (noteTrans.hasOwnProperty(args[0])) {
    if (args.length == 2 && !isNaN(args[1])) {
      if (args[1] <= 10 && args[1] > 0) {
        noteCode = args[0];
        noteLength = args[1];
        console.log("note " + noteCode + " of length " + noteLength + " added");
        const pythonProcess = spawn(python, [playerscript, noteTrans[noteCode], Number(noteLength)]);
        ks.sendKey(args[0].substring(0,1));
        notesList.push({ noteCode, noteLength });
        console.log(notesList, { 'maxArrayLength': null });
      }
    } else {
      noteCode = args[0];
      noteLength = defaultDuration;
      console.log("note " + args[0] + " of default length " + noteLength + " added"); noteCode = args[0];
      const pythonProcess = spawn(python, [playerscript, noteTrans[args[0]], noteLength]);
      ks.sendKey(args[0].substring(0, 1));
      notesList.push({ noteCode, noteLength });
      console.log(notesList, { 'maxArrayLength': null });
    }
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
