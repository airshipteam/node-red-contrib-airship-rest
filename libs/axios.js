const axios = require('axios');
const Agent = require("agentkeepalive");
const HttpsAgent = require("agentkeepalive").HttpsAgent;

const keepAliveAgent = new Agent({
    keepAlive: true,
    maxSockets: 2, // or 10 / os.cpus().length if running node across multiple CPUs
    maxFreeSockets: 4, // or 10 / os.cpus().length if running node across multiple CPUs
    timeout: 3000, // active socket keepalive for 60 seconds
    freeSocketTimeout: 15000, // free socket keepalive for 30 seconds
});

const httpsKeepAliveAgent = new HttpsAgent({
    keepAlive: true,
    maxSockets: 2, // or 10 / os.cpus().length if running node across multiple CPUs
    maxFreeSockets: 4, // or 10 / os.cpus().length if running node across multiple CPUs
    timeout: 3000, // active socket keepalive for 30 seconds
    freeSocketTimeout: 15000, // free socket keepalive for 30 seconds
});


/**
 * Makes a rest call
 * @param  {[string]} url         [url to call]
 * @param  {[string]} httpMethod  [REST http method]
 * @param  {[json]}   payload     [payload]
 * @return {[promise]}        
 */
function call(url, httpMethod, payload){

return new Promise((resolve, reject) => {
    
        if ((payload.contact || payload.body) && payload.token) {
            try {
               axios({
                    httpAgent: keepAliveAgent,
                    httpsAgent: httpsKeepAliveAgent,
                    method: httpMethod,
                    url: url,
                    responseType: 'json',
                    headers: {
                        'Authorization': 'Bearer ' + payload.token,
                        'content-type': 'application/json' 
                    },
                    data: payload.contact ? payload.contact : payload.body
                })
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err.response);
                });

            } catch (err) {
                return reject("Request error: " + err);
            }
        } else {
            return reject("No payload info to make the request");
        }
    });
}

module.exports.call = call;
