const EventEmitter = require('events').EventEmitter;
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const Schedule = require('./schedule');
const Downloader = require('./downloader');


class Engine extends EventEmitter {
    constructor() {
        super();

        this.spiders = [];
        this.itemProcessMiddlewares = [];

        this.init();
    }

    use(middleware, middlewareType = Constant.ITEMPROCESSMIDDLEWARE) {
        this.itemProcessMiddlewares.push(middleware);
    }

    /**
     * 初始化
     */
    init() {
        let schedule = new Schedule(this),
            downloader = new Downloader(this);

    }
    start(options = {}) {
        let spiderPath;
        let defaultPath = path.resolve(__dirname, '../../../spiders');
        if (fs.existsSync(defaultPath)) {
            spiderPath = defaultPath;
        }
        if (options.spiderPath) {
            spiderPath = options.spiderPath;
        }

        let files = fs.readdirSync(spiderPath);

        for (let file of files) {
            let SpiderClass = require(path.join(spiderPath, file));
            let instance = new SpiderClass();
            //name 不能重复，需要基于name 设置event
            if (_.some(this.spiders, {
                    name: instance.name
                })) {
                console.error(`multi spiders have same name ${instance.name}`);
                console.error(instance)
                return;
            }

            instance.setEngine(this);

            this.spiders.push({
                ...instance
            });
        }

        //开始调度
        this.spiders.forEach(v => {

            this.emit('schedule.start', {
                url: v.start_urls,
                name: v.name
            })

        })

    }

    nextRequest(url, parse) {
        this.emit('schedule.start', {
            url,
            parse
        });
    }
}

if (require.main.filename === __filename) {
    let app = new Engine();

    app.start();
}

module.exports = Engine