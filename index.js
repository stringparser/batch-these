/* jslint laxbreak: true */

'use strict';

var type = require('utils-type');
var monkey = require('stdout-monkey')();
var track = require('callsite-tracker');

var batch = { };
var wait = require('./lib/wait');
var store = require('./lib/store');
var origin = require('./lib/origin');
var filter = require('./lib/filter');

var debug = require('./lib/debug');
var write = require('./lib/write');

// it can happen
process.once('exit', function(){
  var sink;
  if(batch.data){
    sink = !debug.DEBUG || console.log('exit', batch);
    write(batch, monkey);
  }
});

// exports.these
function these(chunk, callback){

  callback = type(callback).function;
  var caller = track(callback ? these : origin() );

  batch.path = batch.path || caller.path;
  batch.module = batch.module || caller.module;
  batch.location = batch.location || caller.location;

  if( batch.timer ){
    clearTimeout(batch.timer);
    delete batch.timer;
  }

  var waiting = callback
     ? filter(batch, caller)
     : batch.module === caller.module;

  if( waiting ){

    store(batch, chunk);
    batch.path = caller.path;
    batch.module = caller.module;
    batch.location = caller.location;
    batch.handle = callback;

    debug('waiting...', batch);

  } else {

    debug('direct write', batch);
    write(batch, monkey, debug);
    batch = {
          path : caller.path,
        module : caller.module,
      location : caller.location,
        handle : callback
    };
    store(batch, chunk);
  }

  // keep a timer anyway
  batch.timer = setTimeout(function(){
    if( batch.data ){
      debug('timer kicks', batch);
      write(batch, monkey);
      batch = { };
    }
  }, wait() );

  return exports;
}

// patch stdout with the batched version
monkey.patch(these);

// It would make more sense to have a class
// but for `stdout`... is kind of weird somehow
module.exports = {
    wait : wait,
  origin : origin,
  filter : filter,
   these : these,
   store : store,
};
