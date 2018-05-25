const isGeneratorFunction = require('is-generator-function');

module.exports = class Spider {
    constructor() {}

    setEngine(engine) {
        this.app = engine;
        let eventName = `${this.name}:response`;
        this.app.on(eventName, response => {
            //parse 为生成器函数
            if(isGeneratorFunction(this.parse)){
                let gen = this.parse(response);
                let iter = gen.next();
                if (!iter.done) {
                    this.app.emit(`item:process`, {
                        value: iter.value,
                        spider: this
                    });
                }
            }else{
                console.error('parse function must be a generate function');
            }
            
        });
    }

}