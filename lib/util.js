'use strict';

var debug, name = require('../package').name;
var DEBUG = (process.env.DEBUG || '').split(',');

if( DEBUG[0] && DEBUG[0] === '*' || DEBUG.indexOf(name) > -1){
  debug = require('./debug');
} else {
  debug = function disabledDEBUG(){ };
  debug.DEBUG = null;
}

module.exports.debug = debug;

function write(batch, monkey){

  if( batch.handle ){
    monkey.restore();
    batch.handle.call(batch, batch.data);
    monkey.patch();
    return ;
  }

  var sign = DEBUG[0] ? '['+batch.module+'] batched\n' : '';
  monkey.write( sign + batch.data.join('') );
}

module.exports.write = write;
