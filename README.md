# HANA Cloud Platform IoT Services API (hcp-iot-api)

This is a lightweight node.js based wrapper for the [SAP HANA Cloud Platform IoT Services API](https://help.hana.ondemand.com/iot/frameset.htm?ad829c660e584c329200022332f04d00.html). 
Instead of wrangling with authentication and request configuration, you can use the libraries methods to communicate with the API.
Both services (Remote Device Management Servcie and Message Management Service) have been implemented in their own class and own set of methods (see documentation below).

## Installation

You can install the module through the public npm registry by running the
following command in CLI:

```
npm install --save hcp-iot-api
```

## Promises

The library is using Promises for a cleaner syntax and to avoid nested callbacks.
So when there is the need to have things be done sequentially, you would normally have to write nested callbacks like this in JavaScript:

```js
// This is how the API would look without promises
rdms.createDeviceType({...} , function (deviceType) {
	rdms.createMessageType({...}, function(messageType) {		
		rdms.registerDevice({...}, function(device) {
			...
		}, function(error) { console.log(error); });
	}, function(error) { console.log(error); });
}, function(error) { console.log(error); });
```
Because all methods return Promises, it is much easer to deal with sychronous requests, avoid handling errors multipe time and keep everything more readable. So the API actually looks like this:

```js
rdms.createDeviceType({...}
	 .done(function(deviceType){
		 return rdms.createMessageType({...});
	 })
	 .done(function(messageType){
		 return rdms.registerDevice({...});
	 }).
	 .done(function(device){
		 ...
	 }).
	 catch(function(error) { console.log(error) });
```

More on Promises can be found [here](https://promise-nuggets.github.io/).

## Remote Device Management Service (RDMS)

The [Remote Device Management Service](https://help.hana.ondemand.com/iot/frameset.htm?c4477ad35f1c405fb9364f279f24d973.html) is used to programatically administrate devices, device types, message types, etc.

### Setup

The RDMS always needs the users username and password for authentication.

```js
var API = require("hcp-iot-api");
var rdms = new API.RemoteDeviceManagementService("<user>", "<password>");
```
### Reading data and posting data

The API allows to read all kinds of data from service.

```js
rdms.getMessageTypes()
	.then(function(messageTypes) {
		// Do something meaningful
	})
	.catch(function(error) { console.log(error.message)	});

```
It's also possible to create entities by using the various `create` functions.
Please keep in mind, that there is a fixed order, how to create obects:

1. Create device type
2. Create message type
3. Register device
4. Assign device to hierarchy (if required)

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
```	
	
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