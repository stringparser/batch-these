'use strict';

describe('batch-these', function(){

  var fs = require('fs');
  var path = require('path');
  var batchThese = require('../');
  var testFiles = fs.readdirSync('./test');

  testFiles.splice( testFiles.indexOf(path.basename(__filename)), 1);

  testFiles.forEach(function(testFile){
    var suite = testFile.match(/\w+/)[0];
    describe(suite, function(){
      require('./'+testFile)(batchThese);
    });

  });
});
