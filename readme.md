# batch-these [<img alt="progressed.io" src="http://progressed.io/bar/99" align="right"/>](https://github.com/fehmicansaglam/progressed.io)

[<img alt="build" src="http://img.shields.io/travis/stringparser/batch-these/master.svg?style=flat-square" align="left"/>](https://travis-ci.org/stringparser/batch-these/builds)
[<img alt="NPM version" src="http://img.shields.io/npm/v/batch-these.svg?style=flat-square" align="right"/>](http://www.npmjs.org/package/batch-these)
<br><br>

batch with ease.
<br>

## install

    npm install --save batch-these

## example

```js
var batch = require('batch-these');
    batch.wait = 30;

process.on('stuff-started', function(e){
  var batched = e.name;
  batch.these(batched, function(batch){
    console.log('Started ', batch.join(', ') );
  });
});

process.on('stuff-done', function(e){

  var batched = e.name + ' in ' + Math.floor(e.time) + ' ms';
  batch.these(batched, function(batch){
    console.log('Done with Mr.', batch.join(', Mr. ') );
  });
});

var dogs = [
  'Blue', 'Pink', 'Eddie', 'Joe',
  'White','Brown', 'Blonde','Orange'
];

dogs.forEach(function(name){
  var time = process.hrtime();
  var rand = Math.floor(Math.random()*100);

  setTimeout(function(){
    process.emit('stuff-started', {
      name : name,
      time : time
    });

    rand += Math.floor(Math.random()*100);
    setTimeout(function(){
      process.emit('stuff-done', {
        name : name,
        time : process.hrtime(time)[1]/1000000
      });
    }, rand);
  }, rand);
});

```

which will output something similar to

```shell
Started  Joe, Pink, White
Done with Mr. Pink in 34 ms
Started  Blue, Brown, Eddie, Orange, Blonde
Done with Mr. White in 101 ms, Mr. Joe in 121 ms
Done with Mr. Orange in 178 ms, Mr. Brown in 186 ms, Mr. Eddie in 202 ms
Done with Mr. Blue in 248 ms, Mr. Blonde in 257 ms
```

### documentation

`var batch = require('batch-these')`

Has only one method
  - `batch.these`

and two `exports` properties
  - `batch.wait`
  - `batch.origin`

#### batch.wait

type: `number`
default: `1 ms`

Time to wait in between batches.

#### batch.origin

type: `function`
default: `console.log`

Function to track down for the batches.

### how it works

The module uses 1 stacktrace frame to figure out *the exact location* of the function and based on that a batch is stored. It will keep waiting to have
new data input with a timer set for the `batch.wait` time.

Out of the box is devised to work hand in hand with `stdout.write` and, though it would need some changes as it is, it should work with any other function call.

## why

You would like to keep `stdout` writes to the bare minimum in an non intrusive way. 

## test

    npm test

### license

[<img alt="LICENSE" src="http://img.shields.io/npm/l/batch-these.svg?style=flat-square"/>](http://opensource.org/licenses/MIT)
