"use strict";

var utils = utils || {};

utils.bigRand = function() {
  return Math.round(Math.random() * 10000000);
};

utils.isPrime = function(checkMe) {
  if (checkMe == 1) {
    return false
  }
  
  var checkMax = Math.floor(Math.sqrt(checkMe));
  
  for (var i = 2; i <= checkMax; i++) {
    if (checkMe % i == 0)
      return false;
  }
  
  console.log('Hey ' + checkMe + ' is prime!');
  return true;
};
