'use strict';

function filter(batch, caller){
  return batch.location === caller.location;
}

module.exports = filter;
