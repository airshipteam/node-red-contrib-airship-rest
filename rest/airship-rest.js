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
		 * @param  {[string]} shape [shape of symbol]
		 * @param  {[text]} text [text to show]
		 */
        this.showstatus = (colour, shape, text) => {
			this.status({fill:colour,shape:shape,text:text});
        };

        /**
		 * Outputs success
		 * @param  {[string]} msg [success message]
		 */
        this.showsuccess = (msg,payload) => {
            msg.payload = payload;
            this.showstatus("green", "dot", "Success");
        	this.send([msg,null]);
        };

        /**
		 * Logs an error message
		 * @param  {[string]} msg [error message]
		 */
        this.showerror = (msg,payload) => {
            msg.payload = payload;
            this.showstatus("red", "dot", "Error");
        	this.send([null,msg]);
        };


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
                default:
                    baseUrl = 'https://api.airship.co.uk/';
            }

            // correct REST method in case it's a dual name
            if (method === 'post_bookings' || method === 'get_bookings') method = 'bookings';
            let url = baseUrl + version + "/" + method;


            // Set contact if is passed
            if (payload.contact && httpMethod === 'POST' ) {
                let valid = airshipvalidation.validate(payload.contact);

                valid.then((invalidFields) => {
                    if (invalidFields) msg.invalidFields = invalidFields;

                    let res = airshiprest.call(url, httpMethod, payload);

                    res.then((res) => {
                        this.showsuccess(msg, res);
                    }).catch((err) => {
                        this.showerror(msg, err);
                    }).finally(() => {
                    });

                }).catch((err) => {
                    this.showerror(msg, err);
                }).finally(() => {
                });

            } else {
                //Backwards compatibility / general methods that uses msg.payload.body instead of contact
                let res = airshiprest.call(url, httpMethod, payload);

                res.then((res)=>{
                    this.showsuccess(msg,res);
                }).catch((err)=>{
                    this.showerror(msg,err);
                }).finally(()=>{
                });
            }

	    });
     
    }
    RED.nodes.registerType("Airship REST", RestCall);
};
