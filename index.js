/* jslint laxbreak: true */

'use strict';

var type = require('utils-type');
var monkey = require('stdout-monkey')();
var track = require('callsite-tracker');

var debug = require('./lib/debug');
var write = require('./lib/write');

var wait = 0;
var batch = { };
var origin = console.log;

// it can happen
process.once('exit', function(){
  var sink;
  if(batch.data){
    sink = !debug.DEBUG || console.log('exit', batch);
    write(batch, monkey);
  }
});

// exports.these
function batchThese(str, callback){

  callback = type(callback).function;
  var caller = track(callback ? batchThese : origin);

  batch.module = batch.module || caller.module;
  batch.location = batch.location || caller.location;

  if( batch.timer ){
    clearTimeout(batch.timer);
    delete batch.timer;
  }

  var waiting = callback
     ? batch.location === caller.location
     : batch.module === caller.module;

  if( waiting ){

    batch.data = batch.data || [];
    batch.module = caller.module;
    batch.location = caller.location;
    batch.handle = callback;

    batch.data.push(str);
    debug('waiting...', batch);

  } else {

    debug('direct write', batch);
    write(batch, monkey, debug);
    batch = {
        module : caller.module,
      location : caller.location,
        handle : callback,
          data : [str]
    };
  }

  // keep a timer anyway
  batch.timer = setTimeout(function(){
    if( batch.data ){
      debug('timer kicks', batch);
      write(batch, monkey);
      batch = { };
    }
  }, wait);

  return exports;
}

// exports.wait
function batchWait(_wait){

  if( _wait === void 0){
    return wait;
  }
  wait = type( Math.abs(_wait) ).integer || 0;

  return exports;
}

// exports.origin
function batchOrigin(_origin){

  if( _origin === void 0){
    return origin;
  }

  origin = type(_origin).function || console.log;
  return exports;
}

// patch stdout with the batched version
monkey.patch(batchThese);

// It would make more sense to have a class
// for `stdout` is kind of weird somehow
module.exports = {
    wait : batchWait,
   these : batchThese,
  origin : batchOrigin
};
