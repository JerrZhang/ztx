const Ztx = require('./lib/engine');
const Spider = require('./lib/spider');

const app = new Ztx();

exports.Core = app;
exports.Spider = Spider;