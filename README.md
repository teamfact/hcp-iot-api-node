# hcp-iot-services-node
Lightweight node.js based wrapper for the SAP HANA Cloud Platform IoT Services API. 

**Currently work in progress**

# Remote Device Management Service (RDMS)

## Authentication

```js
var API = require("hcp-iot-api");
var rdms = new API.RemoteDeviceManagementService("<user>", "<password>");
```

## Reading data

```js
rdms.getMessageTypes()
	.then(function(messageTypes) {
		// Do something meaningful
	})
	.catch(function(error) {
		console.log(error.message)
	});
```

## Posting data

```js
rdms.createDeviceType({ "name": "Device Type 1" })
	.then(function (deviceType) {
		// Store token for later usage
		var deviceTypeToken = deviceType.token;
	.catch(function(error) {
		console.log(error.message)
	});
```

# Message Management Service (MMS)

## Send sensor data

```js
mms.sendData({
	"messageType": "<messageTypeId>",
	"messages": [{
      "sensor1": "Value 1",
      "sensor2": "Value 2"
    }]
	})
	.catch(function(error) {
		console.log(error.message)
	});