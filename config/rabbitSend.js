module.exports = function(exchangeName, message) {

    var amqp = require('amqplib/callback_api');
    var logger = require("winston");
    var log = require("./../config/log.js");

    amqp.connect('amqp://portaDD:@digitaldesk@192.168.1.31:5672/portaDD', function(err, conn) {
        if (err) {
            throw err;
        }
        conn.createChannel(function(err, ch) {
            if (err) {
                throw err;
            }

            var q = exchangeName;
            var msg = JSON.stringify(message);

            ch.assertExchange(q, 'topic', { durable: true });
            // Note: on Node 6 Buffer.from(msg) should be used
            ch.publish(q, '', new Buffer(msg));
            logger.info(msg);
        });
        setTimeout(function() {
            conn.close();
            //process.exit(0) 
        }, 500);
    });
}