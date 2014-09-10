var achievementWidget = achievementWidget || {};

achievementWidget.showAchievementWidget = function(id) {
  // Let's populate the little widget
  var achUnlocked = $('#achUnlocked');

  achUnlocked.find('img').prop('src',
    achManager.achievements[id].unlockedIconUrl);
  achUnlocked.find('#achName').text(achManager.achievements[id].name);
  achUnlocked.find('#achDescrip').text(achManager.achievements[id].description);
  achUnlocked.css({'top': '300px', 'opacity': '1.0'});

  achUnlocked.show();
  achUnlocked.delay(2000).animate({top: 50, opacity: 0.1}, 500,
    function() {
      achUnlocked.hide();
    });

  //TODO: Update our internal model as well
};
