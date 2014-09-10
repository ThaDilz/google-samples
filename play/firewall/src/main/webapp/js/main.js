// When document is ready, attach callbacks.
$(document).ready(function() {
  $('#play_button').click(onPlayClicked);
  $('#lb_button').click(onLbClicked);
  $('#ach_button').click(onAchClicked);
  $('.back_to_menu_button').click(onBackToMenuClicked);
  
  $(document).keydown(function(evt) { gamelogic.handleKey(evt.which, true); });
  $(document).keyup(function(evt) { gamelogic.handleKey(evt.which, false); });
});

// when the Play button is clicked, get ready to play:
function onPlayClicked() {
  $('.screen').hide();
  $('#wait_div').show();
  console.log("Loading sounds...");
  
  audio.prepareSounds(onReadyToPlay);
}

function onReadyToPlay() {
  console.log("Ready to play.");
  $('.screen').hide();
  $('#game_div').show();
  console.log("Starting game.");

  gamelogic.startGame(onGameEnded);
}

// Game ended. Post high score and to results screen.
function onGameEnded(score) {
  $('#game_div').hide();
  $('#score').html(score);
  $('#result_div').show();

  // post score, if necessary
  gameservices.postHighScore(score);
}

// Shows the main screen.
function showMainScreen() {
  updatePodium();
  
  $('.screen').hide(); // hide all screens
  $('#main_menu').show(); // show main menu
}

// Update podium on main screen
function updatePodium() {
  if (gameservices.signedIn) {
    fillInHighscores("#podium", gameservices.highScores["public"], 3);
    $('#podium').show();
  
  } else {
    $('#podium').hide();
  }
}

// Called when user wants to go back to the menu.
function onBackToMenuClicked() {
  $('.screen').hide(); // hide all screens
  $('#wait_div').show(); // say "please wait"

  // refresh high scores, if needed
  gameservices.refreshHighScores(showMainScreen);
}

// Called when user wants to view the leaderboard.
function onLbClicked() {
  if (!gameservices.signedIn) {
    alert("Please sign in with Google to see high scores.");
    return;
  }

  // put up the wait screen while we load the leaderboards
  $('.screen').hide();
  $('#wait_div').show();

  // load the leaderboards. When done, fill in the leaderboards screen
  // and show it.
  gameservices.refreshHighScores(function() {
    var scores = gameservices.highScores;
    
    fillInHighscores("#hssoc", scores["social"]);
    fillInHighscores("#hspub", scores["public"]);
  
    $('#your_high_score').text(scores.playerScore ?
        util.formatScore(scores.playerScore) : "NO SCORE");
    $('.screen').hide();
    $('#highscores_div').show();
  });
}

// Fill in the high scores elements with the given list of scores.
function fillInHighscores(idPrefix, scoreList, numScores) {
  var scoresAdded = 0;
  var MAX_SCORES = 10;
  
  if (!numScores) numScores = MAX_SCORES;

  for (var i = 0; i < scoreList.length || i < numScores; ++i) {
    if (i < scoreList.length) {
      // show image
      var s = scoreList[i];
      img = s.image;
      if (!img) img = "images/empty.png";
      $(idPrefix + "_img" + i).attr("src", img + "?size=32");
      $(idPrefix + "_img" + i).show();

      // show score and player name
      $(idPrefix + "_span" + i).text(util.formatScore(s.score) + " " + s.name);
      $(idPrefix + "_span" + i).show();
  
    } else {
      // clear the image and the text
      $(idPrefix + "_img" + i).hide();
      $(idPrefix + "_span" + i).hide();
    }
  }
  
  if (scoreList.length == 0) {
    $(idPrefix + "_empty").show();
  } else {
    $(idPrefix + "_empty").hide();
  }
}

// Called when the "Achievements" button is clicked. React by showing the
// achievements screen.
function onAchClicked() {
  if (!gameservices.signedIn) {
    alert("Please sign in with Google to see achievements.");
    return;
  }

  // fill in achievements screen
  var htmlv = [];
  htmlv.push(_makeAchBox(constants.ACHIEVEMENTS.OVUM));
  htmlv.push(_makeAchBox(constants.ACHIEVEMENTS.KILL_ENEMY));
  htmlv.push(_makeAchBoxV(constants.ACHIEVEMENTS.PRECISION));
  htmlv.push(_makeAchBoxV(constants.ACHIEVEMENTS.INTEGRITY));
  htmlv.push(_makeAchBoxV(constants.ACHIEVEMENTS.RANK));
  htmlv.push(_makeAchBoxV(constants.ACHIEVEMENTS.EXPERIENCE));
  htmlv.push(_makeAchBox(constants.ACHIEVEMENTS.FREQUENT));
  htmlv.push(_makeAchBox(constants.ACHIEVEMENTS.SERIOUS.id));
  
  $('#ach_list').html(htmlv.join(''));

  // show achievements screen
  $('.screen').hide();
  $('#ach_div').show();
}

// Helper function to format a list of achievements.
function _makeAchBoxV(achs) {
  var s = [];
  
  for (var i = 0; i < achs.length; ++i) {
    s.push(_makeAchBox(achs[i].id));
  }
  
  return s.join("");
}

// Helper function to format an achievement.
function _makeAchBox(id) {
  var ach = gameservices.achievements[id];
  
  if (!ach) {
    console.log("BUG: achievement ID not found: " + id);
    return "?";
  }

  // if this achievement is hidden, we obviously don't want to show it:
  if (ach.hidden) return "";

  var inc = "";
  
  if (ach.def.achievementType == "INCREMENTAL" && !ach.unlocked) {
    inc = " (progress: " + ach.currentSteps + "/" + ach.def.totalSteps + ")";
  }

  return "<div class='ach_list_item'><img src='" +
    (ach.unlocked ?  ach.def.unlockedIconUrl : ach.def.revealedIconUrl) +
    "?size=32' class='ach_icon'><div class='ach_info'>" +
    "<span class='ach_name_" + (ach.unlocked ? "unlocked" : "locked") + "'>"+
    ach.def.name + "</span><br/><span class='ach_desc_" +
    (ach.unlocked ? "unlocked" : "locked") + "'>" +
    ach.def.description + inc + "</span></div></div>";
}
