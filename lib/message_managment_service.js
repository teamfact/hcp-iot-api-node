'use strict';

var request = require('request-promise');

function MessageManagementService(account, password, deviceId, deviceToken) {

  this._deviceId = deviceId;
  this._deviceToken = deviceToken;
  this._host = "https://iotmms" + account + "trial.hanatrial.ondemand.com";
  this._path =  "/com.sap.iotservices.mms/v1/api/";
  this._url = this._host + this._path;
  this._authInfo = {
    'user': account,
    'pass': password
  };
  
  this._request = function(method, url, data, bearer) {
    
    var authInfo = this._authInfo;
    if (typeof bearer != "undefiend") authInfo.bearer = bearer;
    
    return request({
      'method': method,
      'url': url,
      'auth': authInfo,
      'json': data
    });
  };
  
  this._get = function(url) { return this._request("GET",  url); }
  this._delete = function(url) { return this._request("DELETE",  url); }
  this._post = function(url, data) { return this._request("POST",  url, data); }
  this._put = function(url, data) { return this._request("PUT",  url, data); }
  this._postWithToken = function(url, data) { return this._request("POST",  url, data, this._deviceToken); }
  
}

MessageManagementService.prototype.setHost = function(host) {
  this._host = host;
}

MessageManagementService.prototype.sendData = function(data) {
  return this._postWithToken(this._url + "http/data/" + this._deviceId, data);
}

module.exports = MessageManagementService;