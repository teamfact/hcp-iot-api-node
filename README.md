# HANA Cloud Platform IoT Services API (hcp-iot-api)

This is a lightweight node.js based wrapper for the SAP HANA Cloud Platform IoT Services API. 
Instead of hasseling with authentication and request configuration, you can use the available methods to communicate with the API.
Both services (Remote Device Management Servcie and Message Management Service) have been implemented in their own class.

**Currently work in progress**

## Installation (when available)

You can install the module through the public npm registry by running the
following command in CLI:

```
npm install --save hcp-iot-api
```

## Promises

The library is using Promises for a cleaner syntax and to avoid nested callbacks.

## Remote Device Management Service (RDMS)


### Authentication

```js
var API = require("hcp-iot-api");
var rdms = new API.RemoteDeviceManagementService("<user>", "<password>");
```

### Reading data

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
	
	
# Full documentation

## Class: RemoteDeviceManagementService

### new API.RemoteDeviceManagementService([options])

* `options` Object
  * `host` String
  * `path` String
	* `account` String
	* `password` String

Construct a new rdms object.


### rdms.createDeviceType(options)

Construct a new rdms object.
For a list of opions see https://help.hana.ondemand.com/iot/frameset.htm?44c28d07999b47d382ff5ef3a742124a.html.

### rdms.getDeviceTypes()
### rdms.getDeviceType(id)
### rdms.deleteDeviceType(id)