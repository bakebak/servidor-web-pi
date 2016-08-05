var express = require('express');
var Mobile = express.Router();
var Mongo = require("./../../classes/mongo.js");
var requisicao = require('./../../classes/requisicao.js');

var google = {
    name: '',
    domain: '',
    access_token: {token: ''}
};

Mobile.post('/', function(req, res){
    var tokenGoogle = req.query.token;

    requisicao.requisicaoToken('/oauth2/v4/token', 'POST', {
        grant_type: 'authorization_code',
        client_id: '489399558653-rde58r2h6o8tnaddho7lathv2o135l7m.apps.googleusercontent.com',
        client_secret: 'QlGfYitSzTxQv0PlhWXer8xh',
        redirect_uri: '',
        code: tokenGoogle
    }, function(data){
        google.access_token.token = data.access_token;
        acessarToken();
    });
});

function acessarToken(){
    requisicao.requisicaoToken('/oauth2/v1/userinfo?access_token=' + google.access_token.token, 'GET', {}, function(data){ 
        google.name = data.name;
        google.domain = data.hd;
        verificarGrupo(req, res);
    });
}

function verificarGrupo(req, res){
    if (google.domain == "digitaldesk.com.br") {
        consultarUsuario(req, res);
    }    
    else {
        /*res.type('json');
        res.send(var empty = {});*/
        res.sendStatus(404);
    }
}

function consultarUsuario(req, res){
    Mongo.find({name: google.name}, 'user', res, function(res, userObj){ 
        conferirToken(req, res, userObj.devices[1].value);
    },function(req, res){
        cadastrarUsuario(req, res);
    });
}

function cadastrarUsuario(req, res){
    var insertObj = {name: req.query.name, role: "", status: "A", devices: [{status: "I", name: "touch", value: "", timeRange: ""}, {status: "A", name: "mobile", value: google.access_token.token, timeRange: ""}, {status: "I", name: "nfc", value: "", timeRange: ""}]};    
    Mongo.insert(insertObj, 'user', function(){}) ;
    res.type('json');
    res.send(google.access_token);
}

function conferirToken(req, res, token){
    if(google.access_token.token==token){
        res.type('json');
        res.send(google.access_token);
    }
    else {
        atualizarToken(req, res);
    }
}

function atualizarToken(req, res){
    Mongo.update({name: google.name}, 'user', req, function(userObj, req){
        userObj.devices[1].value = google.access_token.token;
        return userObj;
    });
    res.type('json');
    res.send(google.access_token);
}

module.exports = Mobile;