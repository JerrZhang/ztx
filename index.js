const cheerio = require('cheerio');
const Engine = require('./lib/engine');
const Spider = require('./lib/spider');

const core = new Engine();

exports.Core = core;
exports.Spider = Spider;
exports.import$ = cheerio;