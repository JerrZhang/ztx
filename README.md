# node scrawl 

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

module.exports = class TestSpider1 extends Spider {
    constructor() {
        super()
        this.name = "test spider1";
        this.start_urls = "https://www.baidu.com";
    }

    * parse(response) {
        // console.log(response);

    }
}
``` 
+ start ztx 
```javascript
const app = require('ztx').Core;
//use middleware
app.use((ctx,next)=>{
    //process 
    next()
})
app.start();
```