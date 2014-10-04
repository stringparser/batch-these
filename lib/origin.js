'use strict';

var type = require('utils-type');

var origin = console.log;
function batchOrigin(_origin){

  if( _origin === void 0){
    var copy = origin;
    return copy;
  }

  origin = type(_origin).function || origin;
  return origin;
}

module.exports = batchOrigin;
