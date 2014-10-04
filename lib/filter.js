'use strict';

var type = require('utils-type');

function filter(batch, caller){
  return batch.location === caller.location;
}

function batchFilter(_batch, _caller){

  if( arguments[1] ){
    return filter(_batch, _caller);
  }
  filter = type(_batch).function || filter;
  return filter;
}

module.exports = batchFilter;
