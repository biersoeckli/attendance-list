const https = require('https');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const phoneNumberRegex = /(\b(0041)|\B\+41)(\s?\(0\))?(\s)?[1-9]{2}(\s)?[0-9]{3}(\s)?[0-9]{2}(\s)?[0-9]{2}\b/;

async function httpPostRequest(hostname, path, jsonBody) {
  console.log(`HTTP POST Request "${hostname}${path}"`);
  return await new Promise((resolve, reject) => {
    const data = JSON.stringify(jsonBody);
    const options = {
      hostname: hostname,
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = https.request(options, res => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          resolve(body);
        } catch (ex) {
          console.error(ex);
          reject(ex);
        }
      });
    });

    req.on('error', error => {
      console.error(error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function httpGetRequest(requestUrl) {
  return await new Promise((resolve, reject) => {
    const url = encodeURI(requestUrl);
    https.get(url, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          if (res.headers['content-type'] === 'application/json') {
            resolve(JSON.parse(body));
          } else {
            resolve(body);
          }
        } catch (ex) {
          console.error(ex);
          reject(ex);
        }
      });
    }).on('error', (e) => {
      console.error(e);
      reject(e);
    });
  });
}


async function sendSms(phoneNumber, text) {
  if (!phoneNumber || !text) {
    throw 'Error: Phone number or sms text not provided.';
  }

  if (!phoneNumberRegex.test(phoneNumber)) {
    throw 'The phone field does not match the criteria for a swiss phone number: ' + phoneNumber;
  }

  const body = {
    "token": process.env.SMS_SERVICE_TOKEN,
    "data": {
      "text": text,
      "recipient": phoneNumber
    }
  };

  try {
    const response = await fetch(process.env.SMS_SERVICE_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    await response.json();
  } catch (ex) {
    console.error('Error while sending sms for notifications', ex);
  }
}

async function updateInfomaniakPingDns() {
  return; // disabled
  await fetch(process.env.INFOMANIAK_DNS_PING_URL, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
}

async function wait(seconds) {
  return await new Promise((resolve) => setTimeout(() => resolve(), 1000 * seconds));
}


exports.httpGetRequest = httpGetRequest;
exports.httpPostRequest = httpPostRequest;
exports.wait = wait;
exports.updateInfomaniakPingDns = updateInfomaniakPingDns;
exports.sendSms = sendSms;
