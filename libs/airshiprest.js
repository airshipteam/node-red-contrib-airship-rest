const axios = require('axios');

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