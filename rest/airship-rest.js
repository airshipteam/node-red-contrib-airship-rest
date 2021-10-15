module.exports = function (RED) {

    const airshiprest = require('../libs/airshiprest');

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
                    return 'POST';
                    break;
                case 'contacts':
                case 'feedback/categories':
                case 'account/units':
                case 'account/email':
                case 'bookings':
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
        	this.send([msg,null]);
        };

        /**
		 * Logs an error message
		 * @param  {[string]} msg [error message]
		 */
        this.showerror = (msg,payload) => {
        	msg.payload = payload;
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

            let method   = msg.method ? msg.method : this.method;
            let version  = msg.version ? msg.version : this.version;
            let env      = msg.env ? msg.env : this.env;
            let httpMethod = msg.httpMethod ? msg.httpMethod : this.httpMethod(method);

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

            let url      = baseUrl + version + "/" + method;

	        let res = airshiprest.call(url, httpMethod, msg.payload);
	        res.then((res)=>{
	        	this.showstatus("green","dot","Success");
	         	this.showsuccess(msg,res);
	     	}).catch((err)=>{
	        	this.showstatus("red","dot","Error");
	     		this.showerror(msg,err);
	     	}).finally(()=>{
	     	});

	    });

     
    }
    RED.nodes.registerType("Airship REST", RestCall);
};
