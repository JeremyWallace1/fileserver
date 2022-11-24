const net = require('net');
const port = 8009;
const fs = require('fs');
const fileDir = '../async/cats/data';
const files = fs.readdirSync(fileDir);
const server = net.createServer(); // factory function creates the server

const connectedClients = [];
console.log(files);

server.on('connection', (client) => {
  connectedClients.push (client);
  console.log(`Connection has been made by client.`);
  client.setEncoding('utf8');

  client.write('Welcome to my awesome file server! 🥰\n');
  client.write('What file are you looking for?\n');
  //client.write(`${files}`);

  client.on('data', (fileToSearchFor) => {
    fileToSearchFor.replace(/^\s\n+|\s\n+$/g,'');
    client.write(`Searching for 123${fileToSearchFor}123`);
    client.write(`In directory: ${fileDir} which contains ${files}\n`);

    for (const file of files) {
      console.log("does", fileToSearchFor, "===", file, "?", fileToSearchFor === file);
      console.log(typeof(file), typeof(fileToSearchFor));
      //client.write(file, "\n");//, "in", files, "?", "\n");
      if (file == fileToSearchFor) {
        console.log(`File: ${fileToSearchFor} was found!\n`);
        client.write(`File: ${fileToSearchFor} was found!\n`)
        break;
      } 
    }
    
    client.write(`File: ${fileToSearchFor} was not found...\n`)
    console.log('now what?\n');
  });
});

server.listen(port, function (){
  console.log(`Server is listening on port=${port}`);
});

// The server looks for requested files locally and sends back the data