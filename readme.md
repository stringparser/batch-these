# batch-these [<img alt="progressed.io" src="http://progressed.io/bar/75" align="right"/>](https://github.com/fehmicansaglam/progressed.io)

[<img alt="build" src="http://img.shields.io/travis/stringparser/batch-these/master.svg?style=flat-square" align="left"/>](https://travis-ci.org/stringparser/batch-these/builds)
[<img alt="NPM version" src="http://img.shields.io/npm/v/batch-these.svg?style=flat-square" align="right"/>](http://www.npmjs.org/package/batch-these)
<br><br>
batch data with ease
<br>

## install

    npm install --save batch-these

## example

```js
var batch = require('batch-these');
    batch.wait(30);

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

dogs.forEach(function(name, index){
  var time = process.hrtime();
  setTimeout(function(){
    process.emit('stuff-started', {
      name : name,
      time : time
    });

    var rand += Math.floor(Math.random()*100);
    setTimeout(function(){
      process.emit('stuff-done', {
        name : name,
        time : process.hrtime(time)[1]/1000000
      });
    }, rand);
  }, (index + 1)*10);
});

```
which will output something similar to

```shell
Started  Blue, Pink, Eddie, Joe
Done with Mr. Joe in 46 ms
Started  White
Done with Mr. White in 50 ms
Started  Brown, Blonde
Done with Mr. Pink in 72 ms
Started  Orange
Done with Mr. Blonde in 105 ms, Mr. Blue in 110 ms, Mr. Brown in 123 ms, Mr. Orange in 125 ms, Mr. Eddie in 128 ms

```

### documentation

`var batch = require('batch-these')`

#### batch.these(data, [callback])

`data`
  type: none.

  The data to be batched.

`callback`
  type: function
  default: none

  It will be pass to the `callback` when the time comes as an array.

#### batch.wait([miliseconds])

type: `number`
default: `0` miliseconds

Time in `ms` to wait in between batches.

#### batch.origin([function])

type: `function`
default: `console.log`

Function to track down for the batches. Internally is using [callsite-tracker](https://github.com/stringparser/callsite-tracker) to get only one stack trace frame keeping the overhead to a minium.

### how it works

The module uses 1 *stacktrace* frame to figure out *the exact location* of the `callback`. Based on that, a batch is stored. For each *location* a batch will kept waiting for new data input using a timer. The time to be waiting is set using `batch.wait([miliseconds])` time.

NOTE: this package is devised to work hand in hand with `process.stdout.write`. That is, the package [*monkeypatches*](https://github.com/stringparser/stdout-monkey) `stdout` in order feed from its data.

Though it would need some changes as it is, it should work with any other function call. With a prior patched, that is.

## why

You would like to keep `stdout` writes to the bare minimum.

## test

    npm test

### license

[<img alt="LICENSE" src="http://img.shields.io/npm/l/batch-these.svg?style=flat-square"/>](http://opensource.org/licenses/MIT)
