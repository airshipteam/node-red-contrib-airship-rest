# node-red-contrib-airship-rest

Node-RED node for Airship REST API

## Install

From your Node-RED directory:
`npm install node-red-contrib-airship-rest`
    
## Usage
### Payload input
Drag the node to the editor, select the API version and Method from the dropdown.
    
In `msg.payload` send only the information needed to your request according to this:

To make a POST request that requires the contact object such as `POST contact` with or without appended information (feedback, booking, purchase history, etc.), send the contact information in `msg.payload.contact`:
        
```
msg.payload = { 
    "token":"token_here" // the API token
    "contact" : {...} // Contact Object
}
```
        
The contact validation only works when using `payload.contact`, this node will return `msg.invalidFields` in case there are any invalid fields.


To make any other request that doesn't require the contact object such as GET or a specific POST (Booking update, create feedback category, etc.), send the information in `msg.payload.body`

```
msg.payload = { 
    "token":"token_here" // the API token
    "body" : {...} // REST payload as per docs
}
```

### Input options
This node allows some information to be passed directly to the `msg`:

`msg.config` // is used by this node to gather information for the monitor/log node: `msg.config.run_id`,`msg.config.integration_config_id` and `msg.config.token`, 

`msg.env: "dev"` // Can be passed to select dev, staging, or production environment (default)

`msg.method: "get_bookings"` // Can either be passed or selected from the dropdown

`msg.version: "v1"` // Can either be passed or selected from the dropdown

`msg.httpMethod: "POST"` // Can either be passed or automatically selected by chosen method from dropdown

### Outputs

The first output will always be a success from the API response
The second output is the object ready to be sent to the log/monitor node
The third output will be an error either from the API or this node

## Examples
Basic examples: ([airship_rest_example.json](https://raw.githubusercontent.com/airshipteam/node-red-contrib-airship-rest/50b33a6120f2e05f8de0509d714cb7b99a5305e7/examples/airship_rest_example.json))
