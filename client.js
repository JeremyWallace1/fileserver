const net = require("net");
const port = 8009;
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let fileName = "";
const connectionConfig = { // doing it this way provides some self documentation...
  port: port,
  host: 'localhost' // dns server will return 127.0.0.1 (same computer you're on now) when you're ready to split client and server, then you can update to a host on a server elsewhere.
};

const client = net.createConnection(connectionConfig); // factory function creates a client

client.setEncoding('utf8');

client.on('connect', () => {
  console.log(`client is connected to the fileserver`);
});

rl.question(`What file are you looking for?\n`, (input) => {
  client.write(input);
  fileName = input;
  rl.close();
});

client.on('data', data => {
  // request(URL, (error, response, message) => {
  //   // edge case 3: url is invalid
  //   if (error) {
  //     if (error.code === 'ENOTFOUND') {
  //       console.log(`${URL} is not a valid URL.`);
  //       process.exit();
  //     } else {
  //       console.log(error);
  //     }
  const arrayOfStrings = data.split(":");
  const fileName = arrayOfStrings[0];
  const bodyOfFile = arrayOfStrings[1]
  console.log(fileName);
  console.log(bodyOfFile); 
  if (fs.existsSync("./"+fileName)) {   // edge case 1: file already exists
    rl.question(`File already exists. Would you like to override ${fileName}?\n Press 'Y' then enter to confirm or enter to exit.\n`, (input) => {
      if (input === 'Y') {
        writeTheFile("./"+fileName, bodyOfFile);
      } else {
        rl.close();
      }
    });
  } else { // file doesn't already exist so okay to write
    writeTheFile("./"+fileName, bodyOfFile);
  }
});

  // const writeTheFile = function(fileName, body) {
  //   fs.writeFile(fileName, body, 'utf8', (err) => {
  //     if (err) {
  //       // edge case 2: file path is invalid
  //       if (err.code === 'ENOENT') {
  //         console.log("File path is invalid.");
  //         process.exit();
  //       } else {
  //         console.log(err);
  //         process.exit();
  //       }
  //     } else {
  //       fs.stat(fileName, (err, stats) => {
  //         console.log(`Downloaded and saved ${stats.size} bytes to ${fileName}`);
  //         process.exit();
  //       });
  //     }
  //   });
  // };

});

// Clients can connect to the server via TCP and send a request for a file (by filename)

