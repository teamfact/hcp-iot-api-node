# hcp-iot-services-node
Lightweight node.js based wrapper for the SAP HANA Cloud Platform IoT Services API. 

**Currently work in progress**

# Remote Device Management Service (RDMS)

## Authentication

´´´javascript
var API = require("hcp-iot-api");
var rdms = new API.RemoteDeviceManagementService("<user>", "<password>");
´´´

## Reading data

´´´javascript
rdms.getMessageTypes()
  .then(function(messageTypes) {
		// Do something meaningful
	})
	.catch(function(error) {
		console.log(error.message)
	});
´´´

# Message Management Service (MMS)