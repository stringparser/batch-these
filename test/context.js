'use strict';

var should = require('should');
var batch = require('../.');
var name = require('../package').name;

module.exports = function(){

  it('should be pinned to the location', function (done){
    var input = 'world what up';

    batch.these(input, function(){
      should(this.path).be
        .a.String.and.eql(__filename);
      should(this.location).be
        .a.String.and.eql([__filename, 12, 11].join(':'));
      done();
    });
  });

  it('should provide caller\'s module name at `this`', function (done){
    var input = 'world what up';

    batch.these(input, function(){
      should(this.module).be
        .a.String.and.eql(name);
      done();
    });
  });

  it('should contain the data given', function(done){
    var input = ['data here', 'more data here'];

    batch.these(input[0], function(){
      should(this.data).be
        .an.Array.and.eql([input[0]]);
      done();
    });

    batch.these(input[1], function(){
      should(this.data).be
        .an.Array.and.eql([input[1]]);
    });
  });
};
