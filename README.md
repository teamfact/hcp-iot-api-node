# HANA Cloud Platform IoT Services API (hcp-iot-api)

This is a lightweight Node.js based wrapper for the [SAP HANA Cloud Platform IoT Services API](https://help.hana.ondemand.com/iot/frameset.htm?ad829c660e584c329200022332f04d00.html). 
Instead of wrangling with authentication and request configuration, you can use the libraries methods to communicate with the API.
Both services (Remote Device Management Servcie and Message Management Service) have been implemented in their own class (see documentation below).

There is also a utility class available to request OAuth tokens for configured HCP clients.

## Installation (when available)

You can install the module through the public npm registry by running the
following command in CLI:

```
npm install --save hcp-iot-api
```

## Promises

The library is using promises for a cleaner syntax and to avoid nested callbacks.
So when there is the need to have things be in sequence, you would normally have to write nested callbacks in JavaScript:

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
Because the libraries methods return Promises, it is much easer to deal with sychronous requests, avoid handling errors multiple times and keep everything more readable. So the API actually looks like this:

```js
rdms.createDeviceType({...})
	 .then(function(deviceType){
		 return rdms.createMessageType({...});
	 })
	 .then(function(messageType){
		 return rdms.registerDevice({...});
	 }).
	 .then(function(device){
		 ...
	 }).
	 catch(function(error) { console.log(error) });
```
Every time you want something to run sync, just put the code in the `then` function and return the promise.
More on promises can be found [here](https://promise-nuggets.github.io/).

## Remote Device Management Service (RDMS)

The IoT Services Cockit inside HCP contains a user interface to manage devices, device types, message types, etc. The [Remote Device Management Service](https://help.hana.ondemand.com/iot/frameset.htm?c4477ad35f1c405fb9364f279f24d973.html) can be used to programatically do the administration without the need to access the cockpit.
Especially in big projects it may be a good solution to store the definition of message types, etc. as code fragements in one central place with versioning support (e.g. git). 

### Setup

The RDMS always needs the users HCP username and password for authentication. This information needs to be given when initializing a new object.

```js
var API = require("hcp-iot-api");
var rdms = new API.RemoteDeviceManagementService({
	"account": "<user>", 
	"password": "<password>"
});
```
### Reading and posting data

The API allows to completly configure the HCP IoT services without the need to access a GUI. Instead, there are fuctions available to read out, create and delete all kinds of entity types.
A simple example showing how to fetch all message types:
```js
rdms.getMessageTypes()
	.then(function(messageTypes) {
		// Do something meaningful
	})
	.catch(function(error) { console.log(error.message)	});

```
And another one showing how to create a device type and after that, create a corresponding message type. The available fields can be read in the [official documentation](https://help.hana.ondemand.com/iot/frameset.htm?ad829c660e584c329200022332f04d00.html).

```js
rdms.createDeviceType({ "name": "Device Type 1" })
	.then(function (deviceType) {
    
		// Then create a message type for the device type
		return rdms.createMessageType({'device_type': deviceType.id, ...});
	.then(function (messageType) {
		...
	.catch(function(error) { console.log(error.message) });
```

### Registering devices

It is possible to dynamically register devices via API. A key requirement is the former definition of a device type, because its `id` and `token` need to be applied. A possible call could look like:

```js
rdms.registerDevice({
	"name": "Device 1",
	"device_type": deviceType.id,
		"attributes": [
			{ "key": "customKey", "value": "custom value" }
		]
	}, deviceType.token);
})
.then(function(device) {
  
	var deviceToken = device.token;   // Needs to be stored!
	var deviceId = device.id;
	...
  
});  
```

When registering a device, the API returns the devices JSON object containing a `token`. This is only returned once directly after creation, so it is highly important to store it for later usage. When using the MMS to send sensor data from a device, this token needs to be passed in as the OAuth token.

# Message Management Service (MMS)

The [Message Management Service](https://help.hana.ondemand.com/iot/frameset.htm?7c71e35a19284736a806fb25a19dde41.html) is the acutal service to send data from the IoT device into the Hana Cloud Platform and/or back to the device.

### Setup

The MMS acutally is a bit more complex in terms of authorization. There are several methods, which are bound to a specific device. For exampe, if you want to send sensor data from a device into the HCP (`mms.sendData(...)`), you need the `deviceId` and `deviceToken` information. If the device was being registered via RDMS programatically, it is highly importend to store the returned deviceToken as this is no more readable afterwards.
Other methods (e.g. `mms.pushToDevice(...)`) require a user authentication via HTTP Basic auth (`account`/`password`) or OAuth (`oauthToken'). 

```js
var API = require("hcp-iot-api");
var mms = new API.MessageManagementService({
	"account": "<username>",
	"password": "<password>",
	"deviceToken": "<deviceToken>",
	"deviceId": "<deviceId>",
	"oauthToken": "<oauthToken>"
});
```	
You can pass in all the required information in the constructor or apply the required information directly when callling a function.

## Send sensor data

The main purpose of the MMS is to send sensor data from the device into the HCP. The API is very straight forward. The following statement sends the data via HTTP(S) connection.

```js
mms.sendData({
	"messageType": "<messageTypeId>",
	"messages": [{
      "sensor1": "Value 1",
      "sensor2": "Value 2"
    }]
	})
	.catch(function(error) { console.log(error.message) });
```	

## Sending information back to a device

## Using websockets

## MMS configuration via API

- - - -
- - - -
	
# Full documentation

The following section describes the full API.

## Class: RemoteDeviceManagementService

### new API.RemoteDeviceManagementService([options])

* `options` Object
  * `account` String
  * `password` String

Construct a new rdms object. `account` and `password` need to be set for HTTP authentication.

Example:
```js
var API = require("hcp-iot-api");
var rdms = new API.RemoteDeviceManagementService({
	"account": "<user>", 
	"password": "<password>"
});
```

- - - -

### rdms.createDeviceType(options)

* `options` Object – For a list of options check out the [official docs](https://help.hana.ondemand.com/iot/frameset.htm?44c28d07999b47d382ff5ef3a742124a.html).

Creates a new device type.

Example:
```js
rdms.createDeviceType({ "name": "Device Type 1" })
  .then(function (deviceType) {
  ...
  })
  .catch(function(error) { console.log(error.message) });
```

### rdms.getDeviceTypes()

Returns all existing device types.

Example:
```js
rdms.getDeviceTypes()
  .then(function (deviceTypes) {
    ...
  })
  .catch(function(error) { console.log(error.message) });
```

### rdms.getDeviceType(id)

* `id` String

Returns one specific device type.

### rdms.deleteDeviceType(id)

* `id` String

Deletes the device type.

- - - -

### rdms.createMessageType(options)

* `options` Object – For a list of options check out the [official docs](https://help.hana.ondemand.com/iot/frameset.htm?a7dbcb07bdac466db03168f37719f81a.html).

Creates a new message type. A message type is always bound to a specific device type and needs the `direction` set to either `fromDevice` or `toDevice`.

Example:
```js
rdms.createMessageType({
   "device_type": deviceType.id, 
  "name": "Message Type 1",
    "direction": "fromDevice",
    "fields": [
       {
          "position": 1, 
          "name": "sensor1",
          "type": "string"
       },
       {
          "position": 2,
          "name": "sensor2",
          "type": "string"
       }
    ]
  }); 
  .catch(function(error) { console.log(error.message) });
```

### rdms.getMessageTypes()

Returns all existing message types.

### rdms.getMessageType(id)

* `id` String

Returns one specific message type.

### rdms.deleteMessageType(id)

* `id` String

Deletes the message type.

- - - -

### rdms.registerDevice(options, deviceTypeToken)

* `options` Object – For a list of options check out the [official docs](https://help.hana.ondemand.com/iot/frameset.htm?2e2fe26905c247668f1e61360846ce53.html).
* `deviceTypeToken` String – The token from the device type

Registers a new device. A device is always bound to a specific device type. A device can be created using the `registerDevice` or `createDevice` method. The latter one does not return the OAuth-token required to send data to the API via MMS. 
The token itself can be read and recreated via the IoT Cockpit.

Example:
```js
rdms.registerDevice({
  "name": "Device 1",
  "device_type": device_type.id,
  "attributes": [
    { "key": "customKey1", "value": "custom value" },
    { "key": "customKey2", "value": "custom value" }
  ]}, deviceTypeToken); 
.catch(function(error) { console.log(error.message) });
```

### rdms.createDevice(options)

* `options` Object – For a list of options check out the [official docs](https://help.hana.ondemand.com/iot/frameset.htm?2e2fe26905c247668f1e61360846ce53.html).

Creates a new device. To use the device for sending data, you have to read the token from the IoT Cockpit.

Example:
```js
rdms.createDevice({
  "name": "Device 1",
  "device_type": device_type.id,
  "attributes": [
    { "key": "customKey1", "value": "custom value" },
    { "key": "customKey2", "value": "custom value" }
  ]
}); 
.catch(function(error) { console.log(error.message) });
```

### rdms.getDevices()

Returns all existing deviced.

### rdms.getDevice(id)

* `id` String

Returns one specific device.

### rdms.deleteDevice(id)

* `id` String

Deletes the device.

### rdms.getDeviceAttributes(id)

* `id` String

Returns all attributes for a  device.

### rdms.createDeviceAttribute(id, options)

* `id` String – The id of the device
* `options` Object – For all options please check out the [official docs](https://help.hana.ondemand.com/iot/frameset.htm?2e2fe26905c247668f1e61360846ce53.html)

Creates a specific attribute for a device.

### rdms.deleteDeviceAttribute(id, key)

* `id` String
* `key` String

Deletes a specific attribute of a device.

- - - -

### rdms.getSettings()

Returns the RDMS settings. For more information please check out the [official docs](https://help.hana.ondemand.com/iot/frameset.htm?0ec86a1dab0245ddbf4f40b66f6751fd.html)

- - - -

## Class: MessageManagementService

### new API.MessageManagementService([options])

* `options` Object
  * `account` String (mandatory)
  * `password` String (optional)
  * `deviceId` String (optional)  
  * `deviceToken` String (optional)  

Construct a new mms object. `account` and `password` need to be set for HTTP authentication.

Example:
```js
var API = require("hcp-iot-api");
var rdms = new API.MessageManagementService({
	"account": "<user>", 
	"deviceId": "<deviceId>",
	"deviceToken": "<deviceToken>"
});
```

- - - -

### mms.sendData(options, deviceId, deviceToken)

* `options` Object – For a list of options check out the [official docs](https://help.hana.ondemand.com/iot/frameset.htm?2e2fe26905c247668f1e61360846ce53.html).
* `deviceId` String (optional) – Has to be given if not set on global level  
* `deviceToken` String (optional) – Has to be given if not set on global level    

Send sensor data to the IoT Cockpit from a specific device.

Example:
```js
mms.sendData({
  "mode": "async",
  "messageType": "<messageTypeId>",
  "messages": [
    {
      "sensor1": "Value 1",
      "sensor2": "Value 2"
    }
  ]
})
.catch(function(error) { console.log(error.message) });
```