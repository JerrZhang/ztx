const isGeneratorFunction = require('is-generator-function');

module.exports = class Spider {
    constructor() {}

    setEngine(engine) {
        this.app = engine;
        let eventName = `${this.name}:response`;
        this.app.on(eventName, response => {
            //parse 为生成器函数
            let {
                body,
                parse
            } = response;
            let gen = null;
            // 由spider 直接发起的请求
            if (eventName === 'direct:response' && parse && typeof parse === 'function') {
                isGeneratorFunction(parse) && (gen = parse(body));
            } else {
                if (isGeneratorFunction(this.parse)) {
                    gen = this.parse(response);
                } else {
                    console.error('parse function must be a generate function');
                }
            }

            let iter = gen.next();
            if (!iter.done) {
                this.app.emit(`item:process`, {
                    value: iter.value
                });
            }

        });
    }

}