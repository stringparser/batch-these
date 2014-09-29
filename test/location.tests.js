'use strict';

var should = require('should');
var batch = require('../.');
var name = require('../package').name;

module.exports = function(){

  it('should return given batch', function (done){
    var input = 'hello world what up';

    batch.these(input, function(batch){
      should(batch.join('')).match(input);
      done();
    });
  });

  it('should provide different batches', function (done){
    var batched = ['hello world', 'what up'];

    batch.these(batched[0], function(batch){
      should(this.module).eql(name);
      should(batch.join('')).match(batched[0]);
    });

    batch.these(batched[1], function(batch){
      should(this.module).eql(name);
      should(batch.join('')).match(batched[1]);
      done();
    });
  });

};
