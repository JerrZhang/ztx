const isGeneratorFunction = require('is-generator-function');

module.exports = class Spider {
    constructor() {
        this.middlewares = []; //每个spider 应该有自己的处理中间件，用以处理自己爬取的数据（eg：数据保存，结构化等）
    }

    use(middleware) {
        this.middlewares.push(middleware);
    }

    applyMiddlewares(ctx) {

        let index = 0;
        let self = this;
        (function next() {
            let handler = self.middlewares[index++];
            if (!handler) return;
            handler(ctx, next);
        })();
    }

    _generateFnInvoke(gen) {
        let iter = gen.next();
        while (!iter.done) {
            this.applyMiddlewares({
                value: iter.value
            });
            iter = gen.next();
        }
    }

    setEngine(engine) {
        this.app = engine;
        let eventName = `${this.name}:response`;
        this.app.on(eventName, res => {

            if (isGeneratorFunction(this.parse)) {
                let gen = this.parse(res.body);
                this._generateFnInvoke(gen);

            } else {
                console.error('parse function must be a generate function');
                return;
            }

        });

        this.app.on('direct:response', res => {
            let {
                body,
                parse
            } = response;
            // 由spider 直接发起的请求
            if (parse && isGeneratorFunction(parse)) {

                let gen = parse.call(this,body);
                this._generateFnInvoke(gen);

            }
        })

    }

}