# node scrawl 

node spiders 

## Installation

```bash
npm install --save ztx
```

## Usage

### create spiders 
+ create spider directory in root dir
```bash
mkdir spiders
```
+ create spider files in directory extend ztx.Spider
```javascript
const Spider = require('ztx').Spider;
const import$ = require('ztx').import$;
const core = require('ztx').Core;

module.exports = class CnblogsSpider extends Spider {
    constructor() {
        super()
        this.name = "test cnblogs";
        this.start_urls = "https://www.cnblogs.com/cnblogs";
        //爬虫中间件 用于获取和处理parse 后的数据
        this.use((ctx, next) => {
            console.log(ctx.value);
            // next();
        });
    }

    * parse(res) {
        let $ = import$.load(res);
        let titles = $('.post-list-item .PostTitle');
        for (let i = 0; i < titles.length; i++) {
            yield $(titles[i]).text();
        }


        let $next = $('#pager>a').last();
        let nextUrl = $next.attr('href');
        //获取下一个链接的地址
        if (nextUrl) {
            core.nextRequest(nextUrl, this.parse);
        }

    }
}
``` 
+ start ztx 
```javascript
const app = require('ztx').Core;

app.start();
```