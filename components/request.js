const request = require('request');

function doRequest(options) {
  return new Promise(function (resolve, reject) {
    request(options, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

async function get(url, args = {}) {
  const options = {
    url: url,
    method: 'GET',
    json: true,
    headers: {
    },
    qs: args
  };
  const res = await doRequest(options);
  return res;
}

export { get };