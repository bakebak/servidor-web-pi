var express = require('express');
var router = express.Router();
var url = require('url');
var Mongo = require("./../classes/mongo.js");
var request = require('request');
var logger = require("winston");
var log = require("./../config/log.js");

router.get('/', function(req, res, next) {
	res.clearCookie("token");
    res.render('login', { title: 'Server Raspberry PI' });
});

router.get('/erro', function(req, res, next) {
    res.render('invalido', { title: 'Server Raspberry PI' });
});

router.get('/deslogado', function(req, res, next) {
    res.render('deslogado', { title: 'Server Raspberry PI' });
});

router.get('/Google', function(req, res, next) {
    res.writeHead(301, {'Location': 'https://accounts.google.com/o/oauth2/v2/auth?scope=email%20profile&state=%2Fprofile&redirect_uri=http://porta.digitaldesk.com.br/Login/CompletarGoogle&response_type=code&client_id=489399558653-enu1g23uf2gt1algid9pvfhn8n57tmqt.apps.googleusercontent.com'});
	res.end();
});

router.get('/CompletarGoogle', function(req, res, next) {
	var url_parts = url.parse(req.url, true).query;
    logger.info('Código: ' + JSON.stringify(url_parts.code));

	var codeGoogle = url_parts.code;
    var headers = {'Content-Type': 'x-www-form-urlencoded'};
    var body = {grant_type: 'authorization_code',
                client_id: '489399558653-enu1g23uf2gt1algid9pvfhn8n57tmqt.apps.googleusercontent.com',
                client_secret: 'nO767Akyi-hCQDkDuQ__i2v0',
                redirect_uri: 'http://porta.digitaldesk.com.br/Login/CompletarGoogle',
                code: codeGoogle};
    request.post({
        url:"https://www.googleapis.com/oauth2/v4/token",
        headers:headers,
        form:body
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var parse = JSON.parse(body);
            var access_token = parse.access_token;
            res.cookie("token", access_token);
            acessarToken(req, res, access_token);
            logger.info(access_token);
        }
        else{
            logger.error('Falha na primeira requisição!');
            res.writeHead(301, {'Location': 'http://porta.digitaldesk.com.br/login/erro'});
			res.end();
        }
    });
});

function acessarToken(req, res, access_token){
    request({
        uri:"https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + access_token,
        method:'GET'},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var parse = JSON.parse(body);
                var name = parse.name;
                var domain = parse.hd;
                logger.info('Nome: ' + name + ' - Dominio: ' + domain);
                verificarGrupo(req, res, access_token, name, domain);
            }
            else{
                logger.info('Falha na segunda requisição!');
                res.writeHead(301, {'Location': 'http://porta.digitaldesk.com.br/login/erro'});
				res.end();
            }
        }
    )
}

function verificarGrupo(req, res, access_token, name, domain){
    if (domain == "digitaldesk.com.br") {
        consultarUsuario(req, res, access_token, name);
        logger.info('e-mail valido!');
    }    
    else {
        logger.error('e-mail inválido!');
        res.writeHead(301, {'Location': 'http://porta.digitaldesk.com.br/login/erro'});
		res.end();
    }
}

function consultarUsuario(req, res, access_token, name){
    Mongo.find({name: name}, 'user', res, function(res, userObj){
        logger.info('Usuário encontrado!');
        var token = userObj[0].devices[0].value;
        conferirToken(req, res, token, access_token, name);
    },function(req2, res2){
        logger.warn('Usuário não encontrado!');
        cadastrarUsuario(req, res, access_token, name);
    });
}

function cadastrarUsuario(req, res, access_token, name){
    var insertObj = {name: name, role: "", status: "A", devices: [{status: "A", name: "web", value: access_token, timeRange: ""}, {status: "A", name: "mobile", value: "", timeRange: ""}, {status: "I", name: "nfc", value: "", timeRange: ""}]};    
    Mongo.insert(insertObj, 'user', function(success){
        if (success){
            res.writeHead(301, {'Location': 'http://porta.digitaldesk.com.br'});
			res.end();
		} else{ 
			res.writeHead(301, {'Location': 'http://porta.digitaldesk.com.br/login/erro'});
			res.end();
		}
    });
    logger.info('Usuário cadastrado!');
}

function conferirToken(req, res, token, access_token, name){
    if(access_token==token){
        res.writeHead(301, {'Location': 'http://porta.digitaldesk.com.br'});
		res.end()
        logger.info('Token válido');
    }
    else {
        atualizarToken(req, res, access_token, name);
    }
}

function atualizarToken(req, res, access_token, name){
    var name = {name: name};
    var action = 'web';
    Mongo.update(name, access_token, action, function (success) {
        if (success){
            res.writeHead(301, {'Location': 'http://porta.digitaldesk.com.br'});
			res.end();
		} else{ 
			res.writeHead(301, {'Location': 'http://porta.digitaldesk.com.br/login/erro'});
			res.end();
		}
    });
}

module.exports = router;