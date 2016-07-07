var gpio = require('rpi-gpio');

function button(){
    
}

button.prototype.configInput = function(pin){
    gpio.setup(pin, gpio.DIR_IN);
}

button.prototype.configOutput = function(pin){
    gpio.setup(pin, gpio.DIR_OUT);
}

button.prototype.write = function(pin, status){
    gpio.write(pin, status);
}

button.prototype.read = function(pin, callback){
    var configInterval = 300;
    setInterval(function() {
        gpio.read(pin, callback);
    }, configInterval);
}

button.prototype.unlock = function(){
    var configInterval = 300;
    setInterval(function() {
        gpio.read(18, function(err, value){
            /*if(value!==undefined){
                console.log('The value is : ' + value);
            }*/
            if(value==true){
                var configPin = 7;
                /*this.configInput(configPin, function(err){
                    this.write(configPin, true, function(err){
                        this.delayWrite(configPin, false, 3000);
                    });
                });*/
                gpio.setup(configPin, gpio.DIR_OUT, function(err){
                    gpio.write(configPin, true, function(err){
                        setTimeout(function(){
                            gpio.write(configPin, false);
                        }, 3000);
                    });
                });
            }
        });
    }, configInterval);
}

button.prototype.delayWrite = function(pin, status, time){
    setTimeout(function(){
        gpio.write(pin, status);
    }, time);
}

module.exports = new button();