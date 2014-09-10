
"use strict";

function Inventory() {
  var myInv = {};

  this.getStarsFor = function(world, level) {
    var key = world + "-" + level;

    if (myInv.hasOwnProperty(key)) {
      return myInv[key];
    } else {
      return 0;
    }
  };

  this.setStarsFor = function(world, level, newStarNum) {
    var key = world + "-" + level;
    myInv[key] = newStarNum;
  };

  this.loadEmpty = function() {
    myInv = {};
  };

  this.load = function(data) {
    var cloudSaveObject = JSON.parse(atob(data));

    if (cloudSaveObject['version'] != '1.1') {
      myInv = {};
    } else {
      myInv = cloudSaveObject['levels'];
    }
  };

  this.save = function() {
    var cloudSaveObject = {'version': '1.1', 'levels': myInv};
    return btoa(JSON.stringify(cloudSaveObject));
  };
}
