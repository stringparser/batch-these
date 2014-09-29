'use strict';

var batch = require('./.');
    batch.wait = 30;

process.on('stuff-started', function(e){
  var batched = e.name;
  batch.these(batched, function(batch){
    console.log('Started ', batch.join(', ') );
  });
});

process.on('stuff-done', function(e){
  var batched = e.name + ' in ' + Math.floor(e.time) + ' ms';
  batch.these(batched, function(batch){
    console.log('Done with Mr.', batch.join(', Mr. ') );
  });
});

var dogs = [
  'Blue', 'Pink', 'Eddie', 'Joe', 'White','Brown', 'Blonde','Orange'
];

dogs.forEach(function(name){

  var time = process.hrtime();
  var rand = Math.floor(Math.random()*100);

  setTimeout(function(){
    process.emit('stuff-started', {
      name : name,
      time : time
    });

    rand += Math.floor(Math.random()*100);
    setTimeout(function(){
      process.emit('stuff-done', {
        name : name,
        time : process.hrtime(time)[1]/1000000
      });
    }, rand);

  }, rand);
});
