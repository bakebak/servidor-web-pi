var pn532 = require('./../../node_modules/pn532/src/pn532');
var SerialPort = require('serialport').SerialPort;

var serialPort = new SerialPort('/dev/ttyS0', { baudrate: 115200 });
var rfid = new pn532.PN532(serialPort);

console.log('Waiting for rfid ready event...');
rfid.on('ready', function() {
    console.log('Listening for a tag scan...');
    rfid.on('tag', function(tag) {
        console.log(Date.now(), 'UID:', tag.uid);
        if (tag.uid == "1c:88:0c:bb"){
        	console.log("TAG Válida!")
        }
    });
});