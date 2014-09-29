/* jslint laxbreak: true */

'use strict';

var fs = require('fs');
var path = require('path');

var name = require('../package').name;
var ws = fs.createWriteStream(name+'-log.json', { flags : 'w+' });

function inspector(key, value){

  if( key === '_onTimeout' ){
    return (value+'').split(/\n[ ]{2}|\n/);
  } else {
    return value;
  }
}

function debugBatch(label, batch){

  var sign = { };
  sign[batch.module + ' ' + label] =
    ' location ' + path.basename(batch.location) +
    ' handle? ' + (batch.handle ? true : false);

  ws.write(
    JSON.stringify(sign, null, '') + '\n' +
    JSON.stringify(batch, inspector, '  ') + '\n' +
    '\n\n'
  );
}

module.exports = debugBatch;
