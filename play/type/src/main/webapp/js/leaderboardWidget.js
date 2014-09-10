"use strict";

var leaderboardWidget = leaderboardWidget || {};

leaderboardWidget.show = function(id) {
  var obj = leadManager.getLeaderboardObject(id);

  // Let's populate the little widget
  var iconUrl = (obj.iconUrl) ? obj.iconUrl : 'img/genericLeaderboard.png';
  $('#leadUnlocked img').prop('src', iconUrl);
  $('#leadUnlocked #leadName').text(obj.name);
  $('#leadUnlocked').css({top: '250px', opacity: '1.0'});
  $('#leadUnlocked').show();
  $('#leadUnlocked').delay(3000).animate({top: '50px', opacity: 0.1}, 500,
    function() {
      $('#leadUnlocked').hide();
    });

};