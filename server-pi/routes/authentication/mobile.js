var express = require('express');
var Senha = express.Router();
var Mongo = require("./../../classes/mongo/mongo.js");

Senha.get('/', function(req, res){
    var senha = req.query.senha;
    Mongo.find({key:senha}, res, function(res){
        res.redirect("./../unlock?key=fjdn!=?fuio9==2W");
    });
});

module.exports = Senha;