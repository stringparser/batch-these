'use strict';

function store(batch, chunk){
  batch.data = batch.data || [ ];
  batch.data.push(chunk);
}

module.exports = store;
