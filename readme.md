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
    batch.wait(10); // 10 miliseconds

process.on('stuff-started', function(e){
  var chunk = e.name;
  batch.these(chunk, function(data){
    console.log('Started ', data.join(', ') );
  });
});

process.on('stuff-done', function(e){
  var chunk = e.name + ' in ' + Math.floor(e.time) + ' ms';
  batch.these(chunk, function(data){
    console.log('Done with Mr.', data.join(', Mr. ') );
  });
});

var dogs = ['Blue', 'Pink', 'Eddie', 'Joe','White','Brown', 'Blonde','Orange'];

dogs.forEach(function(name, index){
  var time = process.hrtime();
  setTimeout(function(){
    process.emit('stuff-started', {
      name : name,
      time : time
    });

    var rand = Math.floor(Math.random()*100);
    setTimeout(function(){
      process.emit('stuff-done', {
        name : name,
        time : process.hrtime(time)[1]/1000000
      });
    }, rand);
  }, (index + 1)*11);
});

```
which will output something similar to

```
Started  Blue, Pink, Eddie, Joe, White
Done with Mr. Pink in 31 ms
Started  Brown
Done with Mr. Joe in 20 ms, Mr. Brown in 3 ms, Mr. Eddie in 37 ms, Mr. Blue in 59 ms
Started  Blonde
Done with Mr. White in 20 ms
Started  Orange
Done with Mr. Blonde in 15 ms
Done with Mr. Orange in 44 ms
```

### documentation

`var batch = require('batch-these')`

#### batch.these(chunk, callback)

`chunk`
  type: none | default: none

Data to be accumulated.

`function` to pass the data when the time comes.

#### batch.store([callback])

How to store your chunks. This is the default

```js
function batchStore(batch, chunk){
  batch.data = batch.data || [ ];
  batch.data.push(chunk);
};
```

`batch.store()` returns the current `storer`.

#### batch.filter([callback])

Decides how the chunks are accumulated. The default is

```js
function batchFilter(batch, caller){
  return batch.location === caller.location;
};
```

Where location has the stack format
 `filename:lineNumber:columNumber`

`batch.filter()` returns the current filter.

#### batch.wait([ms])
ms

type: `number` | default: `0` miliseconds

Time in `ms` to wait in between batches.

#### batch.origin([handle])
handle

type: `function` | default: `console.log`

Function to track down for the batches.

### how it works

Internally is using [callers-module](https://github.com/stringparser/callers-module) to get only 1 *stacktrace* frame. With that frame one can figure out *the exact location* of the `callback`. Based on that, a batch is stored. For each *location* a batch will kept waiting for a new chunk using a timer. Thats it.

The time to be waiting is set with `batch.wait([ms])` time.

The origin from which the *stacktrace* will be taken is set with `batch.origin([handle])`

NOTE: the package is devised to work hand in hand with `process.stdout.write`. That is, the package [*monkeypatches*](https://github.com/stringparser/stdout-monkey) `stdout` in order to feed from its data.

Though it would need some changes as it is, it should work with any other function call. With a prior patch, that is.

## why

You would like to keep `stdout` writes to the bare minimum.

## test

    npm test

### license

[<img alt="LICENSE" src="http://img.shields.io/npm/l/batch-these.svg?style=flat-square"/>](http://opensource.org/licenses/MIT)
