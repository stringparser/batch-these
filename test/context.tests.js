'use strict';

var path = require('path');
var should = require('should');
var batch = require('../.');
var name = require('../package').name;

module.exports = function(){

  it('should provide information at `this`', function (done){
    var input = 'world what up';

    batch.these(input, function(){
      should(this.module).be
        .a.String.and.eql(name);

      should(this.data).be
        .an.Array.and.eql([input]);

      var location = [
        path.relative(process.cwd(), __filename), 13, 11
      ].join(':');

      should(this.location).be
        .a.String.and.eql(location);

      done();
    });
  });
};
