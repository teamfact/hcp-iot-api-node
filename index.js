
var HCPIoTServiceAPI = function () {
}

HCPIoTServiceAPI.RemoteDeviceManagementService = require('./lib/remote_device_managment_service.js');
HCPIoTServiceAPI.MessageManagementService = require('./lib/message_managment_service.js');

module.exports = HCPIoTServiceAPI;