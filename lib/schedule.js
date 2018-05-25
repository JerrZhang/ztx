
module.exports = class Schedule {
    constructor(engine) {
        this.app = engine;
        //fixme:调度器应该启动多个 调度器拿到url 组装
        this.app.on('schedule.start',({url,name})=>{
            //构建request请求对象
            let req = {
                method:'GET',
                uri:url,
                resolveWithFullResponse:true,
                name
            }
            this.app.emit('request',req);
        })
    }
}