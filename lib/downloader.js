const request = require('request');


module.exports = class Downloader {
    constructor(engine) {
        this.app = engine;

        this.app.on('request', async req => {
            if (!req.name) {
                req.name = 'direct';
            }
            let eventName = `${req.name}:response`;


            request(req, (err, response, body) => {
                if (err) {
                    console.error('request failed', err);
                } else {

                    this.app.emit(eventName, {
                        body,
                        parse: req.parse
                    });
                }
            })
        });
    }
}