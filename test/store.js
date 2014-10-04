'use strict';

var should = require('should');
var batch = require('../.');

var store = batch.store();
var filter = batch.filter();

module.exports = function(){

  beforeEach(function(){
    batch.store(function(batch, chunk){
      batch.data = (batch.data || []).concat(chunk.split(/[ ]+/));
    });
  });

  afterEach(function(){
    batch.filter(filter);
    batch.store(store);
  });

  it('should hook the way data is stored', function (done){
    var input = 'world what up';
    batch.these(input, function(){
      should(this.data).eql(['world', 'what', 'up']);
      done();
    });
  });

  it('the hook should be persistent', function (done){
    var input = 'another thing';
    batch.these(input, function(){
      should(this.data).eql(['another', 'thing']);
      done();
    });
  });

  it('should follow the filter given', function(done){

    var input = 'yet another';

    batch.filter(function(batch, caller){
      return caller.path === batch.path;
    });

    batch.these(input, function(){ });
    batch.these('thing', function(){
      should(this.data).eql(['yet', 'another', 'thing']);
      done();
    });
  });
};
