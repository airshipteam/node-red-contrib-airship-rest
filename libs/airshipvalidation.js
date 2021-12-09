/**
 * Validates the contact payload
 * @param  {[object]} contact   [contact object]
 * @return {[promise]}        
 */


function validate(contact) {

    return new Promise((resolve, reject) => {
        try {

            var discard_invalid_data = false;
            if (contact.rules) {
                discard_invalid_data = contact.rules.filter(rule => rule.rule_name == "discard_invalid_data").length > 0 ? true : false;
            } 
            var emailValid      = true;
            var mobileValid     = true;
            let invalidFields = [];
            let errPayload = {
                "error": "Invalid field"
            }

            if (contact.email) {
                const emailRegex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

                if (!contact.email.match(emailRegex)) {
                    emailValid = false;
                    invalidFields.push({ "email": contact.email });
                    errPayload.invalidFields = invalidFields;
                    
                    if (discard_invalid_data === false) reject(errPayload);
                }
                
            }
            else {
                emailValid = false;
            }

            if (contact.mobile_number) {
                const mobileRegex = new RegExp('(?:[0-9]●?){6,14}[0-9]$');

                if (!contact.mobile_number.toString().match (mobileRegex)) {
                    mobileValid = false;
                    invalidFields.push({ "mobile_number": contact.mobile_number });
                    errPayload.invalidFields = invalidFields;
                    
                    if (discard_invalid_data === false) reject(errPayload);
                }
            }
            else {
                mobileValid = false;
            }
            console.log('emailValid', emailValid, 'mobileValid', mobileValid);
            if (!emailValid && !mobileValid) {
                errPayload.error = "No useful data to create the contact";
                errPayload.invalidFields = invalidFields;
                
                reject(errPayload);
            }

            resolve(invalidFields);
    
        } catch (err) {
            return reject("Validation error : " + err );
        }
    });
}

module.exports.validate = validate;