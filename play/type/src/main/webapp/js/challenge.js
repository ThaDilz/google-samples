"use strict";

var challenge = challenge || {};

challenge.isActive = false;
challenge.scoreToBeat = 0;
challenge.challenger = "";
challenge.difficulty = 0;

challenge.tryToLoad = function() {
  // Let's see if there's anything to parse here.
  var challengeString = challenge.getURLParameter('gamedata');
  
  if (challengeString && challengeString != 'null') {
    console.log("Received challenge string ", challengeString);
    var decodedString = atob(challengeString);
  
    console.log("Decoded as ", decodedString);
    var challengeObject = JSON.parse(decodedString);
    
    console.log("Parsed into ",challengeObject);
    
    // We should always be careful to not trust this data completely!
    if (challengeObject != null &&
        challengeObject.hasOwnProperty('scoreToBeat') &&
        challengeObject.hasOwnProperty('challenger') &&
        challengeObject.hasOwnProperty('difficulty')) {
    
      challenge.isActive = true;
      challenge.scoreToBeat = challengeObject.scoreToBeat;
      challenge.challenger = challengeObject.challenger;
      challenge.difficulty = challengeObject.difficulty;
    }
  }
  
  welcome.dataLoaded(welcome.ENUM_CHALLENGE_DATA);
};

// Taken from StackOverflow. Feel free to swap out with your own!
challenge.getURLParameter = function(name) {
  return (decodeURI(
      (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
  ));
};

challenge.generateChallenge = function() {
  var challengeObject = {
    'difficulty': game.difficulty,
    'scoreToBeat': game.finalScore,
    'challenger': player.displayName
  };

  return challengeObject;

};

challenge.clearData = function() {
  challenge.isActive = false;
  challenge.scoreToBeat = 0;
  challenge.challenger = "";
  challenge.difficulty = 0;
}

challenge.resetIncomingChallenge = function() {
  challenge.challenger = "";
  challenge.difficulty = 0;
  challenge.isActive = false;
};
