'use strict';

var debug;
var name = require('../package').name;
var DEBUG = (process.env.DEBUG || '').split(',');

if(DEBUG[0] === '*' || DEBUG.indexOf(name) > -1){
  debug = require('./_debug');
  debug.DEBUG = DEBUG;
}

module.exports = debug || function disabledDEBUG(){ };
