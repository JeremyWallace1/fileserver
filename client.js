const net = require("net");
const port = 8009;
const fs = require('fs');
// const readline = require('readline');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

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

// process.stdin.setEncoding("ascii");
let input = "";
process.stdin.on("data", (input) => {
  client.write(input)
});

client.on('data', message => {
  console.log('server sent:', message);
  fs.writeFile(input, message, 'utf8', (err) => {
    console.log(input);
    if (err) {
      // edge case 2: file path is invalid
      if (err.code === 'ENOENT') {
        console.log("File path", input, "is invalid.");
        process.exit();
      } else {
        console.log(err);
        process.exit();
      }
    } else {
      fs.stat(fileName, (err, stats) => {
        console.log(`Downloaded and saved ${stats.size} bytes to ${fileName}`);
        process.exit();
      });
    }
  });
});

