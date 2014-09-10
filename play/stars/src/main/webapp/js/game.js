
"use strict";

var game = game || {};

game.STATE_WAITING_FOR_INIT_LOAD = 0;
game.STATE_READY = 1;
game.STATE_WAITING_FOR_CLOUD = 2;
game.state = game.STATE_WAITING_FOR_INIT_LOAD;
game.currentWorld = 1;

game.init = function() {
  $('#game').fadeIn();
  game.refreshInterface();
  model.load(game.refreshInterface);
};

game.refreshInterface = function() {
  $("#worldLabel").text("World " + game.currentWorld);
  for (var i = 1; i <= 12; i++) {
    var starNum = model.getStarsFor(game.currentWorld, i);
    var starText = new Array(starNum + 1).join("\u2605") +
      new Array(5 - starNum + 1).join("\u2606");

    var $buttonHtml = $("<p></p>").html("Level " + game.currentWorld + "-" + i
      + "<br>" + starText);
    $("#level" + i).html($buttonHtml);
  }
};

game.load = function() {
  model.load(game.refreshInterface);
};

game.save = function() {
  model.save(game.refreshInterface);
};

game.levelClick = function(whatLevel) {
  var starNum = model.getStarsFor(game.currentWorld, whatLevel);
  starNum = starNum + 1;

  if (starNum > 5)
    starNum = 0;

  model.setStarsFor(game.currentWorld, whatLevel, starNum);
  game.refreshInterface();

};

game.pickWorld = function(delta) {
  game.currentWorld = game.currentWorld + delta;

  if (game.currentWorld < 0)
    game.currentWorld = 20;

  if (game.currentWorld > 20)
    game.currentWorld = 0;

  game.refreshInterface();
};