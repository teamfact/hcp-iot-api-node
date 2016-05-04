'use strict';

var request = require('request-promise');

var RemoteDeviceManagementService = module.exports = function RemoteDeviceManagementService(options) {

  this._account = options.account;
  this._password = options.password;  
  this._protocol = "https://";
  this._host = "iotrdmsiotservices-" + this._account;
  this._landscape = "trial.hanatrial.ondemand.com";
  this._path =  "/com.sap.iotservices.dms/api/";
  this._url = this._protocol + this._host + this._landscape + this._path;
  
  this._authInfo = {
    'user': options.account,
    'pass': options.password
  };
  
  this._request = function(method, url, data, bearer) {
    
    var authInfo = this._authInfo;
    if (typeof bearer != "undefiend") authInfo.bearer = bearer;
    if (typeof data == "undefined") data = " ";
        
    var options = {
      'method': method,
      'url': url,
      'auth': authInfo,
      'json': data
    }

    return request(options);
  };
  
  this._get = function(url) { return this._request("GET",  url); }
  this._delete = function(url) { return this._request("DELETE",  url); }
  this._post = function(url, data) { return this._request("POST",  url, data); }
  this._postWithToken = function(url, data, bearer) { return this._request("POST",  url, data, bearer); }
  
}

RemoteDeviceManagementService.prototype.setPassword = function(pwd) {
  this._password = pwd;
}

RemoteDeviceManagementService.prototype.setAccount = function(account) {
  this._account = account;
}

RemoteDeviceManagementService.prototype.setLandscape = function(landscape) {
  this._landscape = landscape;
}


/**
 * Methods for device handling.
 *
 * The full API specification can be found here:
 * https://help.hana.ondemand.com/iot/frameset.htm?2e2fe26905c247668f1e61360846ce53.html
 */
RemoteDeviceManagementService.prototype.getDevices = function() {
  return this._get(this._url + "devices");
}

RemoteDeviceManagementService.prototype.getDevice = function(id) {
  return this._get(this._url + "devices/" + id);
}

RemoteDeviceManagementService.prototype.deleteDevice = function(id) {
  return this._delete(this._url + "devices/" + id);
}

RemoteDeviceManagementService.prototype.createDevice = function(data) {
  return this._post(this._url + "devices", data);
}

RemoteDeviceManagementService.prototype.registerDevice = function(token, data) {
  return this._postWithToken(this._url + "deviceregistration", data, token);
}

RemoteDeviceManagementService.prototype.getDeviceAttributes = function(id) {
  return this._get(this._url + "devices/" + id + "/attributes");
}


/**
 * Methods for message type handling.
 *
 * The full API specification can be found here:
 * https://help.hana.ondemand.com/iot/frameset.htm?a7dbcb07bdac466db03168f37719f81a.html
 */
RemoteDeviceManagementService.prototype.getMessageTypes = function() {
  return this._get(this._url + "messagetypes");
}

RemoteDeviceManagementService.prototype.getMessageType = function(id) {
  return this._get(this._url + "messagetypes/" + id);
}

RemoteDeviceManagementService.prototype.createMessageType = function(data) {
  return this._post(this._url + "messagetypes", data);
}


/**
 * Methods for device type handling.
 *
 * The full API specification can be found here:
 * https://help.hana.ondemand.com/iot/frameset.htm?44c28d07999b47d382ff5ef3a742124a.html
 */
RemoteDeviceManagementService.prototype.getDeviceTypes = function() {
  return this._get(this._url + "devicetypes");
}

RemoteDeviceManagementService.prototype.getDeviceType = function(id) {
  return this._get(this._url + "devicetypes/" + id);
}

RemoteDeviceManagementService.prototype.createDeviceType = function(data) {
  return this._post(this._url + "devicetypes", data);
}

RemoteDeviceManagementService.prototype.deleteDeviceType = function(id) {
  return this._delete(this._url + "devicetypes/" + id);
}


/**
 * Methods for data type handling.
 *
 * The full API specification can be found here:
 * https://help.hana.ondemand.com/iot/frameset.htm?69d77128d8d74186b685a4a0583fe4f9.html
 */
RemoteDeviceManagementService.prototype.getDataTypes = function() {
  return this._get(this._url + "datatypes");
}


/**
 * Methods for dimension handling.
 *
 * The full API specification can be found here:
 * https://help.hana.ondemand.com/iot/frameset.htm?849cddcf18e440d8bb6ee2cf590e0016.html
 */
RemoteDeviceManagementService.prototype.getDimensions = function() {
  return this._get(this._url + "dimensions");
}

RemoteDeviceManagementService.prototype.getDimension = function(id) {
  return this._get(this._url + "dimensions/" + id);
}

RemoteDeviceManagementService.prototype.createDimension = function(data) {
  return this._post(this._url + "dimensions", data);
}

RemoteDeviceManagementService.prototype.deleteDimension = function(id) {
  return this._delete(this._delete + "dimensions/", id);
}

RemoteDeviceManagementService.prototype.getDimensionElements = function(id) {
  return this._get(this._url + "dimensions/" + id + "/elements");
}

RemoteDeviceManagementService.prototype.createDimensionElement = function(id, data) {
  return this._post(this._url + "dimensions/" + id + "/elements", data);
}

RemoteDeviceManagementService.prototype.deleteDimensionElement = function(dimensionId, id) {
  return this._delete(this._url + "dimensions/" + dimensionId + "/elements/" + id);
}

RemoteDeviceManagementService.prototype.createDimensionElementDeviceAssignment = function(dimensionId, elementId, data) {
  return this._post(this._url + "dimensions/" + dimensionId + "/elements/" + id + "/devices", data);
}

RemoteDeviceManagementService.prototype.deleteDimensionElementDeviceAssignment = function(dimensionId, elementId, id) {
  return this._delete(this._url + "dimensions/" + dimensionId + "/elements/" + id + "/devices/" + id);
}


/**
 * Methods for settings handling.
 *
 * The full API specification can be found here:
 * https://help.hana.ondemand.com/iot/frameset.htm?0ec86a1dab0245ddbf4f40b66f6751fd.html
 */

RemoteDeviceManagementService.prototype.getSettings = function() {
  return this._get(this._url + "settings");
}