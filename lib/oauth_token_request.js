'use strict';

var request = require('request-promise');

var OAuthTokenRequest = module.exports = function OAuthTokenRequest(options) {
  
  var protocol = "https://",
      host = "oauthasservices-" + options.account;
      landscape = "trial.hanatrial.ondemand.com";
      path =  "/oauth2/api/v1/token";
      url = protocol + host + landscape + path;

  var options = {
    'method': "POST",
    'url': url,
    'form': {
      'grant_type': 'client_credentials',
      'scope': options.scope 
    },
    'auth': {
      "user": options.clientId,
      "pass": options.secret
    }
  }
  
  return request(options);  
}
