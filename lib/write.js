'use strict';

function write(batch, monkey, debug){

  if( batch.handle ){
    monkey.restore();
    batch.handle.call(batch, batch.data);
    monkey.patch();
    return ;
  }
  debug = debug || { };
  var sign = debug.DEBUG ? '['+batch.module+'] batched\n' : '';
  monkey.write( sign + batch.data.join('') );
}
module.exports = write;
