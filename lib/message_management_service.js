'use strict';

var request = require('request-promise');
var Websocket = require("ws");
var Promise = require("bluebird");

var MessageManagementService = module.exports = function MessageManagementService(options) {  
  if (typeof options === "undefined") options = {};
    
  this._account = options.account;
  this._password = options.password;  
  this._deviceId = options.deviceId;
  this._deviceToken = options.deviceToken;
  this._userToken = options.userToken;

  this._protocol = "https://";
  this._host = "iotmms" + this._account;
  this._landscape = "trial.hanatrial.ondemand.com";
  this._path =  "/com.sap.iotservices.mms/v1/api/";
  this._url = this._protocol + this._host + this._landscape + this._path;
  
  this._wsConn;
    
  this._request = function(method, url, data, bearer) {
    
    var authInfo = { };
    if (typeof this._account != "undefined" && typeof this._password != "undefined") {
      authInfo.user = this._account;
      authInfo.pass = this._password;
    } 
    if (typeof bearer != "undefined") authInfo.bearer = bearer;
    
    var options = {
      'method': method,
      'url': url,
      'auth': authInfo
    }
    if (typeof data != "undefined") options.json = data;

    return request(options);
  };
  
  this._get = function(url) { return this._request("GET", url); }
  this._delete = function(url) { return this._request("DELETE", url); }
  this._post = function(url, data) { return this._request("POST", url, data); }
  this._put = function(url, data) { return this._request("PUT", url, data); }
  this._postWithToken = function(url, data) { return this._request("POST",  url, data, this._deviceToken); }
  this._getWithToken = function(url, token) { 
    var deviceToken = typeof token == "undefined" ? this._deviceToken : token;;
    return this._request("GET",  url, [], deviceToken); 
  }  
  
  this._sendDataViaWebsocket = function(data) {
    var that = this;
    return new Promise(function(resolve, reject) {
      that._wsConn.send(JSON.stringify(data), function (response) {
        resolve(response);
      }); 
    });
  }
  
  this._hasActiveWebsocketConnection = function() {
    return typeof this._wsConn != "undefined" && this._wsConn.readyState == Websocket.OPEN;
  }
  
  this._sendDataViaHTTP = function(url, data) {
    return this._postWithToken(url, data);
  }
  
}

MessageManagementService.prototype.setLandscape = function(landscape) {
  this._landscape = landscape;
}

MessageManagementService.prototype.setDeviceToken = function(token) {
  this._deviceToken = token;
}

MessageManagementService.prototype.setDeviceId = function(id) {
  this._deviceId = id;
}

MessageManagementService.prototype.setPassword = function(pwd) {
  this._password = pwd;
}

/**
 * Methods for service settings.
 *
 * The full API specification can be found here:
 * https://help.hana.ondemand.com/iot/frameset.htm?b402dd3b74014c63a091486905c4f53c.html
 */
MessageManagementService.prototype.getConfig = function() {
  return this._get(this._url + "http/config");  
}

MessageManagementService.prototype.updateConfig = function(data) {
  return this._put(this._url + "http/config", data);  
}


/**
 * Push data to a device
 *
 * The full API specification can be found here:
 * https://help.hana.ondemand.com/iot/frameset.htm?9da1c18f6ab947c58052f4d07498a654.html
 */
MessageManagementService.prototype.pushToDevice = function(deviceId, data) {
  return this._post(this._url + "http/push/" + deviceId, data);  
}


/**
 * Get data for a device
 *
 * The full API specification can be found here:
 * https://help.hana.ondemand.com/iot/frameset.htm?8e1c277be0cd4854943a15f86188aaec.html
 */
MessageManagementService.prototype.getData = function(deviceId, deviceToken) {
  return this._getWithToken(this._url + "http/data/" + deviceId, deviceToken);  
}


/**
 * Methods for pushing to a device.
 *
 * The full API specification can be found here:
 * https://help.hana.ondemand.com/iot/frameset.htm?9da1c18f6ab947c58052f4d07498a654.html
 */
MessageManagementService.prototype.sendData = function(data) {
  if(this._hasActiveWebsocketConnection()) {
    return this._sendDataViaWebsocket(data);  
  } else {
    return this._sendDataViaHTTP(this._url + "http/data/" + this._deviceId, data);  
  }
}


MessageManagementService.prototype.sendDataAsParams = function(messageType, mode, params) {
  return this._postWithToken(this._url + "http/data/" + this._deviceId + "/" + messageType + "/" + mode + "?" + params, []);
}

MessageManagementService.prototype.openWebsocketConnection = function() {
  var that = this;
  this._wsConn = new Websocket('wss://' + this._host + this._landscape + this._path + 'ws/data/' + that._deviceId,
     { "headers": { 'Authorization': 'Bearer ' + that._deviceToken }
  });  
  return new Promise(function(resolve, reject) {
    that._wsConn.on('error', function(error){
       return reject(error);
    }); 
    that._wsConn.on('open', function(){
      return resolve();
    });    
  });
}

MessageManagementService.prototype.closeWebsocketConnection = function() {
  var that = this;
  return new Promise(function(resolve, reject) {
    that._wsConn.close();
    that._wsConn.on('close', function(){
      return resolve();
    });    
  });
}