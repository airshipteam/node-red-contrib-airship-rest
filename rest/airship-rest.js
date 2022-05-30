module.exports = function (RED) {

    const airshiprest       = require('../libs/airshiprest');
    const airshipvalidation = require('../libs/airshipvalidation');

    function RestCall(n) {

        RED.nodes.createNode(this, n);
        
		this.method  = n.method;
		this.payload = n.payload;
        this.version = n.version;
        this.env = n.env;
        this.status({});
        
        this.httpMethod = (method) => {
            switch(method) {
                case 'contact':
                case 'feedback/category':
                case 'post_bookings':
                    return 'POST';
                    break;
                case 'contacts':
                case 'feedback/categories':
                case 'account/units':
                case 'account/email':
                case 'get_bookings':
                    return 'GET';
                    break;
            }
        },


        /**
		 * Shows a status visual on the node
		 * @param  {[string]} colour [colour of status (green, yellow, red)]
		 * @param  {[string]} shape  [shape of symbol]
		 * @param  {[string]} text   [text to show]
		 */
        this.showstatus = (colour, shape, text) => {
			this.status({fill:colour,shape:shape,text:text});
        };

        /**
		 * Outputs success
		 * @param  {[Object]} msg            [success complete msg]
		 * @param  {[Object|string]} payload [success payload response]
		 * @param  {[Object]} contact        [contact object]
		 */
        this.sendSuccess = (success_msg, payload, contact) => {
            success_msg.payload = payload;
            this.showstatus("green", "dot", "Success");
        	this.send([success_msg, this.outputToMonitor(success_msg, contact, true, success_msg), null]);
        };

        /**
		 * Outputs error
		 * @param  {[Object]} msg            [error complete msg]
		 * @param  {[Object|string]} payload [error payload response]
		 * @param  {[Object]} contact        [contact object]
		 */
        this.sendError = (err_msg, payload, contact) => {
            err_msg.payload = payload;
            this.showstatus("red", "dot", "Error");
        	this.send([null, this.outputToMonitor(err_msg, contact, false, payload), err_msg]);
        };

        /**
         * Returns a monitor output object
		 * @param  {[Object]} original_msg [original msg]
		 * @param  {[Object]} contact      [contact object]
		 * @param  {[Boolean]} success     [is success or failed request]
		 * @param  {[Object]} response     [response from API]
         */
        this.outputToMonitor = (original_msg, contact, success, response) => {

            var monitor_msg = Object.assign({}, original_msg);
            monitor_msg._msgid += "_monitor";
            monitor_msg.rest_response = response

            var payload = {
                run_id: null,
                account_id: contact.account_id ?? null,
                units_ids: contact.units ? contact.units.map(unit => (unit.id)) : null,
                integration_config_id: null,
                index: `REST_Node_${success ? 'success' : 'failed'}`, 
                data: 1,
                token: null
            }

            var config = original_msg.config ?? null;
            
            if (config) {
                payload.run_id = config.run_id ?? null;
                payload.integration_config_id = config.integration_config_id ?? null;
                payload.token = config.token ?? null;
            }

            monitor_msg.payload = payload;

            return monitor_msg;
        }   


        /**
		 * Shows a status visual on the node
		 * @param  {[string]} colour [colour of status (green, yellow, red)]
		 * @param  {[string]} shape [shape of symbol]
		 * @param  {[text]} text [text to show]
		 */
        this.showstatus = (colour, shape, text) => {
			this.status({fill:colour,shape:shape,text:text});
        };

        this.on('input',  (msg) => {

        	this.showstatus("yellow","dot","Making call");

            //set variables
            let method      = msg.method ? msg.method : this.method;
            let httpMethod  = msg.httpMethod ? msg.httpMethod : this.httpMethod(method);
            let version     = msg.version ? msg.version : this.version;
            let payload     = msg.payload ? msg.payload : this.payload;
            let env         = msg.env ? msg.env : this.env;

            // build URL
            let baseUrl = '';
            switch(env){
                case 'dev':
                    baseUrl = 'https://api-airshipdev.airship.co.uk/';
                    break;
                case 'staging':
                    baseUrl = 'https://api-airshipdev.airship.co.uk/';
                    break;
                case 'production':
                    baseUrl = 'https://api.airship.co.uk/';
                    break;
		case 'fake-api':
                    baseUrl = 'https://fake-api.airship.co.uk/';
                    break;
                default:
                    baseUrl = 'https://api.airship.co.uk/';
            }

            // correct REST method in case it's a dual name
            if (method === 'post_bookings' || method === 'get_bookings') method = 'bookings';
            let url = baseUrl + version + "/" + method;


            // Set contact if is passed
            if (payload.contact && httpMethod === 'POST' ) {

                airshipvalidation.validate(payload.contact).then((invalidFields) => {
                    if (invalidFields) msg.invalidFields = invalidFields;

                    let res =  airshiprest.call(url, httpMethod, payload);

                    res.then((res) => {
                        this.sendSuccess(msg, res, payload.contact);
                    }).catch((err) => {
                        this.sendError(msg, err, payload.contact);
                    });

                }).catch((err) => {
                    this.showstatus("yellow", "dot", "validation error");
                    this.send([null, this.outputToMonitor(msg, payload.contact, false, err), null]);
                });

            } else {
                //Backwards compatibility / general methods that uses msg.payload.body instead of contact
                let res = airshiprest.call(url, httpMethod, payload);

                res.then((res)=>{
                        this.sendSuccess(msg,res, payload.body);
                }).catch((err)=>{
                    this.sendError(msg,err, payload.body);
                }).finally(()=>{
                });
            }

	    });
     
    }
    RED.nodes.registerType("Airship REST", RestCall);
};
