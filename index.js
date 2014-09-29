/* jslint laxbreak: true */

'use strict';

var type = require('utils-type');
var monkey = require('stdout-monkey')();
var track = require('callsite-tracker');

exports = module.exports = { };

var util = require('./lib/util');
var write = util.write;
var debug = util.debug;

var batch = { };
var wait = 0, origin = console.log;

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
    write(batch, monkey);
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
}

// patch stdout with the batched version
monkey.patch(batchThese);

// it can happen
process.once('exit', function(){
  var sink;
  if(batch.data){
    sink = ! debug.debug || console.log('exit', batch);
    write(batch, monkey);
  }
});

exports.these = batchThese;

exports.origin = function (_origin){
  origin = type(_origin).function || console.log;
};

exports.wait = function(_wait){
  wait = type( Math.abs(_wait) ).integer || 0;
};
