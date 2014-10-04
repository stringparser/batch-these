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

  it('should be able to handle different batches', function (done){
    var data = ['hello world', 'what up'];

    batch.these(data[0], function firstBatch(chunks){
      should(this.module).eql(name);
      should(this.handle.name).eql('firstBatch');
      should(chunks.join('')).match(data[0]);
    });

    batch.these(data[1], function secondBatch(chunks){
      should(this.module).eql(name);
      should(this.handle.name).eql('secondBatch');
      should(chunks.join('')).match(data[1]);
      done();
    });
  });

  it('different batches should have their handle', function (done){
    var data = ['hello world', 'what up'];

    batch.these(data[0], function firstBatch(){
      should(this.handle.name).eql('firstBatch');
    });

    batch.these(data[1], function secondBatch(){
      should(this.handle.name).eql('secondBatch');
      done();
    });
  });

  it('different batches should be run on sequence', function (done){
    var data = ['hello world', 'what up'];
    var previousLocation;
    batch.these(data[0], function firstBatch(chunks){
      previousLocation = this.location;
      should(this.location).eql([__filename,51,11].join(':'));
      should(chunks.join('')).match(data[0]);
    });

    batch.these(data[1], function secondBatch(chunks){
      should(previousLocation).eql([__filename,51,11].join(':'));
      should(this.location).eql([__filename,57,11].join(':'));
      should(chunks.join('')).match(data[1]);
      done();
    });
  });

};
