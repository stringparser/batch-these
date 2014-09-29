/* jslint laxbreak: true */

'use strict';

var type = require('utils-type');
var merge = require('lodash.merge');
var monkey = require('stdout-monkey')();
var tracker = require('callsite-tracker');

var util = require('./lib/util');

var write = util.write;
var debug = util.debug;

var batch = { };

function batchThese(str, callback){

  callback = type(callback).function || false;

  var caller = tracker( callback ? batchThese : console.log );

  batch.module = batch.module || caller.module;
  batch.location = batch.location || caller.location;

  clearTimeout(batch.timer);
  delete batch.timer;

  var createTimer = callback
    ? batch.location === caller.location
    : batch.module === caller.module;

  if( createTimer ){

    batch.data = batch.data || [];
    batch.handle = callback;
    batch = merge({ }, caller);

    batch.data.push(str);
    debug('waiting...', batch);

  } else {

    debug('direct write', batch);
    write(batch, monkey);

    batch.data = [str];
    batch.handle = callback;
    batch = merge({ }, caller);
  }

  batch.timer = setTimeout(function(){
    if( batch.data ){
      debug('timer kicks', batch);
      write(batch, monkey);
      batch = { };
    }
  });
}

monkey.patch(batchThese);

process.once('exit', function(){
  var sink;
  if(batch.data){
    sink = !debug.DEBUG || console.log('exit', batch);
    write(batch, monkey);
  }
});

module.exports = batchThese;
