var express = require('express');
var button = require('./../actions/button/button.js');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {

	gpio.setup(configPin, gpio.DIR_OUT, function(err){
	    gpio.write(configPin, true, function(err){
	        var now = new Date();  
	        var dia = now.getDate();
	        var mes = now.getMonth()+1;
	        var ano = now.getFullYear();
	        var hora = '['+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()+']';
	        var data = 'Ativado em: '+dia+'/'+mes+'/'+ano+' - '+hora;
	        console.log(data);
	        setTimeout(function(){
	            gpio.write(configPin, false);
	        }, 3000);
	    });
	});
});

module.exports = router;