'use strict';

var type = require('utils-type');

function store(batch, chunk){
  batch.data = batch.data || [ ];
  batch.data.push(chunk);
}

function batchStore(_batch, _chunk){

  if( arguments[1] ){
    return store(_batch, _chunk);
  }
  store = type(_batch).function || store;
  return store;
}

module.exports = batchStore;
