module.exports = function(){
	var Gpio = require('onoff').Gpio,
    	led = new Gpio(20, 'out'),
    	vcc = new GpiO(26, 'OUT'); 
    
    vcc.writeSync(1);
	led.writeSync(1);
	setTimeout(function(){
		led.writeSync(0);
	},3000);