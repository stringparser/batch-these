'use strict';

var path = require('path');
var type = require('utils-type');

module.exports = caller;

function caller(frames){

  var spec = { };
  var limit = Error.stackTraceLimit;
  var depth = type(frames).integer || 2;
  // ^ be able to adjust the number of frames

  Error.stackTraceLimit = depth;
  // ^ Just the minimal overhead.

  ( new Error() ).stack
  .match(/[ ]+at[ ]+(.*)/g)[depth-1]  // <- the frame we want
    .replace(/[ ]+at[ ]+(.*)[ ]+\((.*)\:(\d+)\:(\d+)\)/,
      function($0, $1, $2, $3, $4){
        spec.module = $2.split(path.sep);
        spec.filename = $2;
        spec.basename = path.basename($2);
        spec.extension = path.extname($2);
        spec.at = $1;
        spec.line = $3;
        spec.column = $4;
        spec.frame = $0.trim();

        spec.module = spec.module.splice(
          spec.module.indexOf('node_modules') + 1, 1
        )[0] || path.dirname(require.cache[$2].parent.filename);
      }
    );

  Error.stackTraceLimit = limit;

  return spec;
}
