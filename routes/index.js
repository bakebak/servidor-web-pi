var express = require('express');
var router = express.Router();
var lock = require('./../actions/lock.js');
var sound = require('./../actions/sound.js');
var sleep = require('sleep');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Server Raspberry PI' });
});

var Gpio = require('onoff').Gpio,
    button = new Gpio(21, 'in', 'falling'),
    dingdong = new Gpio(19, 'in', 'falling'),
    vcc = new Gpio(26, 'out'),
    rele = new Gpio(16, 'out');    

vcc.writeSync(1);
rele.writeSync(1);

button.watch(function(err, value){
    if (err) {
        throw err;
    }
    if(value==1){
        lock('buttonOut', 'Exit button');
    } 
});

dingdong.watch(function(err, value){
    if (err) {
        throw err;
    }
    if(value==1){
        sound();
    }
});

module.exports = router;
