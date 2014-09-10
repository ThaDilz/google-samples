var gameservices = gameservices || {};

// are we signed in?
gameservices.signedIn = false;
gameservices.loadFinishedCallback = undefined;


// highest score we posted to the leaderboard
gameservices.highestScorePosted = 0;

// achievement data
gameservices.achievements = {};

// this keeps track of async stuff we are loading. When everything is done
// loading, we call gameservices.loadFinishedCallback.
gameservices.asyncLoads = {
  achievements: false,
  definitions: false,
  publicHighScores: false,
  socialHighScores: false
}

// when was the last time we refreshed the high scores?
gameservices.lastHighScoreRefresh = 0;

// result of the high scores loading operation
gameservices.highScores = {social: [], public: [], playerScore: 0};

// Called when API is ready to use.
gameservices.onApiLoaded = function() {
  for (var k in gameservices.asyncLoads) {
    gameservices.asyncLoads[k] = false;
  }

  gameservices.loadFinishedCallback = showMainScreen;

  // load achievement definitions
  var req = gapi.client.games.achievementDefinitions.list();
  req.execute(gameservices.onAchievementDefinitionsLoaded);

  // load player's achievements
  req = gapi.client.games.achievements.list({playerId: "me"});
  req.execute(gameservices.onAchievementsLoaded);

  // load high scores
  gameservices.loadHighScores();

    $('.screen').hide();
    $('#wait_div').show();
    
  // DEBUG: handle debug request to reset achievements
  if (("" + window.location).indexOf("debug_reset=1") > 0) {
    alert("DEBUG: achievements reset requested.");
    
    gapi.client.request({
      path: "/games/v1management/achievements/reset",
      method: "post",
      callback: function(resp) {
        alert("Reset result: " + (resp ? "OK" : "Failed"));
      }
    });
  }
};

// If all async loads are finished, call the async load finished callback.
gameservices.checkAsyncLoadsFinished = function() {
  console.log("Async loads so far: ");
  
  for (var k in gameservices.asyncLoads) {
    console.log(" - " + k + ": " + gameservices.asyncLoads[k]);
  
    if (!gameservices.asyncLoads[k])
      return;
  }
  
  if (gameservices.loadFinishedCallback) {
    console.log("Async loads finished. Calling callback.");
    gameservices.loadFinishedCallback();
  
  } else {
    console.log("No callback.");
  }
};

// Called when achievements have been loaded.
gameservices.onAchievementsLoaded = function(result) {
  if (!result) {
    alert("Failed to sign in (failed to load achievements).");
    gameservices.onSignInResult(false);
    return;
  }

  if (result.items) {
    for (var i = 0; i < result.items.length; i++) {
      var a = result.items[i];

      if (!gameservices.achievements[a.id]) {
        gameservices.achievements[a.id] = {};
      }

      gameservices.achievements[a.id].unlocked =
        (a.achievementState == "UNLOCKED");
      gameservices.achievements[a.id].hidden =
        (a.achievementState == "HIDDEN");
      gameservices.achievements[a.id].currentSteps = a.currentSteps ?
        a.currentSteps : 0;
    }
  }

  if (result.nextPageToken) {
    // there's more to load
    var req = gapi.client.games.achievements.list({
      playerId: "me", pageToken: result.nextPageToken});
    req.execute(gameservices.onAchievementsLoaded);
  
  } else {
    // done loading
    gameservices.asyncLoads.achievements = true;
    gameservices.checkAsyncLoadsFinished();
  }
};

// Called when the achievement definitions have been loaded.
gameservices.onAchievementDefinitionsLoaded = function(result) {
  if (!result) {
    alert("Failed to sign in (failed to load achievement definitions).");
    gameservices.onSignInResult(false);
    return;
  }

  if (result.items) {
    for (var i = 0; i < result.items.length; ++i) {
      var d = result.items[i];
    
      if (!gameservices.achievements[d.id]) {
        gameservices.achievements[d.id] = {};
      }
      
      gameservices.achievements[d.id].def = d;
    }
  }

  if (result.nextPageToken) {
    // there's more to load
    var req = gapi.client.games.achievementDefinitions.list({
      pageToken: result.nextPageToken});
    req.execute(gameservices.onAchievementDefinitionsLoaded);
    return;
  }

  gameservices.asyncLoads.definitions = true;
  gameservices.checkAsyncLoadsFinished();
};

gameservices.loadHighScores = function() {
  // throw away the scores we have
  gameservices.highScores["public"] = [];
  gameservices.highScores["social"] = [];
  gameservices.asyncLoads.publicHighScores = false;
  gameservices.asyncLoads.socialHighScores = false;

  // request social scores:
  var req = gapi.client.games.scores.list({
    collection: "SOCIAL",
    leaderboardId: constants.LEAD_ONE,
    timeSpan: HIGHSCORE_TIME_SPAN
  });
  
  req.execute(function(data) {
    gameservices.onHighScoresLoaded("social", data);
  });

  // request public scores:
  var req = gapi.client.games.scores.list({
    collection: "PUBLIC",
    leaderboardId: constants.LEAD_ONE,
    timeSpan: HIGHSCORE_TIME_SPAN
  });
  
  req.execute(function(data) {
    gameservices.onHighScoresLoaded("public", data);
  });
}

gameservices.refreshHighScores = function(callback, force) {
  // if not logged in, no refreshing...
  if (!gameservices.signedIn) {
    callback();
    return;
  }
  
  // too soon?
  if (!force && Date.now() < gameservices.lastHighScoreRefresh +
    (1000 * MIN_HIGHSCORE_REFRESH_INTERVAL)) {
    callback();
    return;
  }

  gameservices.asyncLoads.publicHighScores = false;
  gameservices.asyncLoads.socialHighScores = false;
  gameservices.loadFinishedCallback = callback;
  gameservices.loadHighScores();
};

gameservices.onHighScoresLoaded = function(collection, data) {
  var MIN_HIGH_SCORES = 10;

  if (!data || !data.kind) {
    // Failed to load (in a real app, you would do something more robust
    // than this!)
    alert("Failed to load " + collection + " high scores.");
    return;
  }

  if (data.items) {
    for (var i = 0; i < data.items.length; ++i) {
      gameservices.highScores[collection].push({
        name: data.items[i].player.displayName,
        image: data.items[i].player.avatarImageUrl,
        score: data.items[i].scoreValue
      });
    }
  }

  if (data.playerScore) {
    gameservices.highScores.playerScore = data.playerScore.scoreValue;
  }

  // if we don't have enough data yet, get next page
  if (gameservices.highScores[collection].length < MIN_HIGH_SCORES &&
    data.nextPageToken) {
  
    var req = gapi.client.games.scores.list({
      collection: collection.toUpperCase(),
      leaderboardId: constants.LEAD_ONE,
      timeSpan: HIGHSCORE_TIME_SPAN,
      pageToken: data.nextPageToken
    });
    
    req.execute(function(data) {
      gameservices.onHighScoresLoaded(collection, data);
    });
  
  } else {
    // done loading
    gameservices.lastHighScoreRefresh = Date.now();
    gameservices.asyncLoads[collection + "HighScores"] = true;
    gameservices.checkAsyncLoadsFinished();
  }
};

gameservices.postHighScore = function(score) {
  if (!gameservices.signedIn || score <= gameservices.highestScorePosted) {
    return;
  }
  
  var req = gapi.client.games.scores.submit({
    leaderboardId: constants.LEAD_ONE, score: score});
  
  req.execute(function(resp) {
    if (resp)
      gameservices.highestScorePosted = score;
  });
};

gameservices.showAchToast = function(achId) {
  $("#ach_toast").html("ACHIEVEMENT: " +
  
    gameservices.achievements[achId].def.name);
  $("#ach_toast").show();
  
  setTimeout(function() {
    $("#ach_toast").hide();
  }, 2000);
};

gameservices.unlockAchievement = function(achId) {
  if (!gameservices.signedIn)
    return;
  
  if (gameservices.achievements[achId].unlocked)
    return;
  
  gameservices.achievements[achId].unlocked = true;

  var req = gapi.client.games.achievements.unlock({achievementId: achId});
  
  req.execute(function(resp) {
    if (resp) {
      gameservices.achievements[achId].unlocked = true;
      if (resp.newlyUnlocked)
        gameservices.showAchToast(achId);
    }
  });
};

gameservices.incrementAchievement = function(achId, steps) {
  if (!gameservices.signedIn)
    return;
  
  var req = gapi.client.games.achievements.increment({
    achievementId: achId,
    stepsToIncrement: steps
  });
  
  req.execute(function(resp) {
    if (resp) {
      var ach = gameservices.achievements[achId];
  
      if (resp.currentSteps) {
        ach.currentSteps = resp.currentSteps;
      
      } else {
        ach.currentSteps += steps;
      
        if (ach.currentSteps > ach.def.totalSteps) {
          ach.currentSteps = ach.def.totalSteps;
        }
      }

      if (resp.newlyUnlocked) {
        ach.unlocked = true;
        gameservices.showAchToast(achId);
      }
    }
  });
};
