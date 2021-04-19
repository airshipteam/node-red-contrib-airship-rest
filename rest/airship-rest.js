module.exports = function (RED) {

    const airshiprest = require('../libs/airshiprest');

    function RestCall(n) {

        RED.nodes.createNode(this, n);
        
		this.method  = n.method;
		this.payload = n.payload;
        this.version = n.version;
        this.baseUrl = n.env === "dev" ? 'https://api-airshipdev.airship.co.uk/': 'https://api.airship.co.uk/';
        this.url     = this.baseUrl + this.version + this.method;
        this.status({});
        
        this.httpMethod = (method) => {
            switch(method) {
                case 'contact':
                case 'feedback/category':
                    return 'POST';
                    break;
                case 'feedback/categories':
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

            let httpMethod = this.httpMethod(this.method);
            let url = this.url;

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
