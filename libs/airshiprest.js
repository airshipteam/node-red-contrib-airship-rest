const axios = require('axios');

/**
 * Makes a rest call
 * @param  {[string]} url    [url to call]
 * @param  {[string]} httpMethod  [REST httpMethod]
 * @param  {[json]} payload [payload]
 * @return {[promise]}        
 */


function call(url, httpMethod, payload){

return new Promise((resolve, reject) => {
        try {

            axios({
                method: httpMethod,
                url: url,
                responseType: 'json',
                headers: {  
                    'Authorization': 'Bearer ' + payload.token,
                    'content-type': 'application/json' 
                },
                data: payload.body ? payload.body : ""
            })
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {
                reject(err.response);
            });

        } catch (err) {
            return reject("Error : "+err);
        }
    });
}

module.exports.call = call;