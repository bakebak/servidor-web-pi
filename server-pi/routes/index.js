var express = require('express');
var router = express.Router();
var led = require('./../actions/led.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Raspberry PI' });
});

var Gpio = require('onoff').Gpio,
    button = new Gpio(24, 'in', 'rising');

button.watch(function(err, value){
  if (err) {
    throw err;
  }
  if(value==1){
    led();
  }
  res.sendStatus(200);
});

module.exports = router;