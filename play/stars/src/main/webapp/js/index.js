
"use strict";

window.addEventListener('load', function() {
  document.querySelector("#pickWorldLeft").onclick = function() {
    game.pickWorld(-1);
  }
  document.querySelector("#pickWorldRight").onclick = function() {
    game.pickWorld(1);
  }
  document.querySelector("#level1").onclick = function() {
    game.levelClick(1);
  }
  document.querySelector("#level2").onclick = function() {
    game.levelClick(2);
  }
  document.querySelector("#level3").onclick = function() {
    game.levelClick(3);
  }
  document.querySelector("#level4").onclick = function() {
    game.levelClick(4);
  }
  document.querySelector("#level5").onclick = function() {
    game.levelClick(5);
  }
  document.querySelector("#level6").onclick = function() {
    game.levelClick(6);
  }
  document.querySelector("#level7").onclick = function() {
    game.levelClick(7);
  }
  document.querySelector("#level8").onclick = function() {
    game.levelClick(8);
  }
  document.querySelector("#level9").onclick = function() {
    game.levelClick(9);
  }
  document.querySelector("#level10").onclick = function() {
    game.levelClick(10);
  }
  document.querySelector("#level11").onclick = function() {
    game.levelClick(11);
  }
  document.querySelector("#level12").onclick = function() {
    game.levelClick(12);
  }
  document.querySelector("#save").onclick = game.save;
  document.querySelector("#load").onclick = game.load;
});

