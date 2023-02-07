const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const FSFilesAdapter = require('@parse/fs-files-adapter');
const ParseDashboard = require('parse-dashboard');
const fs = require('fs');



const databaseUri = process.env.DATABASE_URI || console.log('DATABASE_URI is not set');
const fullDatabaseUrl = databaseUri;
const masterKey = process.env.MASTER_KEY || console.log('MASTER_KEY is not set');
const serverUrl = process.env.SERVER_URL || console.log('SERVER_URL is not set');
const appId = process.env.APP_ID || console.log('APP_ID is not set');
const parseDashboardUser = process.env.DASHBOARD_USER || 'ikp';
const parseDashboardPasswort = process.env.DASHBOARD_PASSWORT || console.log('DASHBOARD_PASSWORT is not set');
const SMS_SERVICE_URL = process.env.SMS_SERVICE_URL || console.log('SMS_SERVICE_URL is not set');
const INFOMANIAK_DNS_PING_URL = process.env.INFOMANIAK_DNS_PING_URL || console.log('INFOMANIAK_DNS_PING_URL is not set');
const parseMountPath = '/parse';
const port = process.env.PORT || 1337;

const fsAdapter = new FSFilesAdapter({
});

const api = new ParseServer({
  databaseURI: fullDatabaseUrl,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: appId,
  masterKey: masterKey,
  serverURL: `${serverUrl}${parseMountPath}`,
  filesAdapter: fsAdapter,
  liveQuery: {
    classNames: [Parse.User, 'attendence_status', 'User', '_User'],
  },
});

const dashboard = new ParseDashboard({
  apps: [
    {
      serverURL: `${serverUrl}${parseMountPath}`,
      appId: appId,
      masterKey: masterKey,
      appName: 'Attendance List HOSTED',
      production: true,
    },
  ],
  users: [
    {
      user: parseDashboardUser,
      pass: parseDashboardPasswort,
    },
  ],
  useEncryptedPasswords: false,
}, {
  allowInsecureHTTP: true
});

const app = express();

// Serve the Parse API on the /parse URL prefix
app.use(parseMountPath, api);
app.use('/dashboard', dashboard);

const httpServer = require('http').createServer(app);
httpServer.listen(port, function () {
  console.log('attendance list server running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);

/**** CRON JOBS CONFIG ****/
const cron = require('node-cron');

// Job 2 am
cron.schedule('15 2 * * *', async () => {
  console.log(new Date() + ' running 2 am cron task');

  console.log(new Date() + ' finished 2 am cron task');
});
