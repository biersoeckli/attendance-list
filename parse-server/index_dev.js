const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const FSFilesAdapter = require('@parse/fs-files-adapter');

const fsAdapter = new FSFilesAdapter({});

const api = new ParseServer({
  databaseURI: 'mongodb://localhost:27017/attendancelist',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'attendance-list',
  masterKey: process.env.MASTER_KEY || '12345678',
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
  filesAdapter: fsAdapter,
  liveQuery: {
    classNames: [Parse.User, 'attendence_status', 'User', '_User']
  }
});
const app = express();

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.');
});

const ParseDashboard = require('parse-dashboard');

const dashboard = new ParseDashboard({
  "apps": [
    {
      "serverURL": "http://localhost:1337/parse",
      "appId": "attendence-list",
      "masterKey": "12345678",
      "appName": "Attendance List LOCAL",
      production: true,
    }
  ],
  "users": [
    {
      "user":"ikp",
      "pass":"ikp"
    },
  ], useEncryptedPasswords: false
});

app.use("/dashboard", dashboard);
const port = process.env.PORT || 1337;
const httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
  console.log('parse-dashboard running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
