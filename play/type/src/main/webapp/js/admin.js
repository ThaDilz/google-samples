"use strict";

var admin = admin || {};
admin.scoresReset = 0;
admin.leaderboards = [];

admin.loadUp = function() {
  $('#adminPanel').fadeIn();
};

admin.resetAchievements = function() {
  var request = gapi.client.gamesManagement.achievements.resetAll();

  request.execute(function(response) {
    console.log('Achievement reset response: ', response);

    if (response.kind == 'gamesManagement#achievementResetAllResponse') {
      // We should probably actually analyze the data here.
      var namesOfAchievements = [];

      if (response.hasOwnProperty('results')) {
        for (var i = 0; i < response.results.length; i++) {
          namesOfAchievements.push(
            achManager.getNameForId(response.results[i].definitionId));
        }
      }
      
      // Reload our data
      achManager.loadData();
      alert('Achievements ' + namesOfAchievements.join(', ')
        + ' have all been reset.');

    } else {
      alert("Something odd is going on...");
    }
  });
};

admin.resetScores = function() {
  admin.scoresReset = 0;
  admin.leaderboards = [constants.LEADERBOARD_EASY, constants.LEADERBOARD_HARD];

  for (var i = 0; i < admin.leaderboards.length; i++) {
    var request = gapi.client.gamesManagement.scores.reset(
      {'leaderboardId': admin.leaderboards[i]}
    );

    request.execute(function(response) {
      console.log('Score reset response: ', response);

      if (response.kind == "gamesManagement#playerScoreResetResponse") {
        admin.scoresReset++;

        if (admin.scoresReset >= admin.leaderboards.length) {
          alert('All ' + admin.scoresReset 
            + ' leaderboard scores have been reset');
        }
      }
    });
  }
};

admin.goBack = function() {
  $('#adminPanel').fadeOut();
  welcome.loadUp();
};