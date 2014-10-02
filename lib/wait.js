'use strict';

var type = require('utils-type');

var wait = 0;
function batchWait(_wait){

  if( _wait === void 0){
    var copy = wait;
    return copy;
  }
  wait = type( Math.abs(_wait) ).integer || 0;
}

module.exports = batchWait;
