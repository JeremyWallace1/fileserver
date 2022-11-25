const net = require('net');
const port = 8009;
const fs = require('fs');
const fileDir = '../async/cats/data';
const files = fs.readdirSync(fileDir);
const server = net.createServer(); // factory function creates the server

const connectedClients = [];
//console.log(files);

server.on('connection', (client) => {
  let found = false;
  connectedClients.push (client);
  console.log(`Connection has been made by client.`);
  client.setEncoding('utf8');

  client.write('Welcome to my awesome file server! 🥰\n');
  client.write('What file are you looking for?\n');

  client.on('data', (fileToSearchFor) => {
    fileToSearchFor = fileToSearchFor.replace(/\s+/g, ' ').trim();
    client.write(`Searching for ${fileToSearchFor}...`);
    client.write(`In directory: ${fileDir} which contains ${files}\n`);

    for (const file of files) {
      if (file === fileToSearchFor) {
        client.write(`File: ${fileToSearchFor} was found!\n`)
        found = true;
        console.log(fileDir+"/"+file);
        fs.readFile(fileDir+"/"+file, 'utf8', function (err, file) {
          if (err) {
            console.log(err);
          }
          console.log(`reading file...`);
          client.write("$$$$"+file);
          console.log(`sent file contents`);
        });

      } 
    }
    if (!found) {
      client.write(`Sorry, the file: ${fileToSearchFor} was not found...\n`)
    }
  });
});

server.listen(port, function (){
  console.log(`Server is listening on port=${port}`);
});