"use strict";

// achievementBoard -- responsible for displaying the "Achievements" table

var achievementTable = achievementTable || {};

achievementTable.loadUp = function() {
  achievementTable.clearOut();

  if (achManager.preloaded) {
    $.each(achManager.achievements, function(id, obj) {
      var $row = achievementTable.buildTableRowFromData(obj);
      $row.appendTo($('#achievementsTable tbody'));
    })
  }

  $('#achievements').fadeIn();
  $("#pageHeader").text("Achievements");
};

achievementTable.buildTableRowFromData = function(obj) {
  var $row = $('<tr></tr>');
  var $name = $('<td></td>').text(obj.name).addClass('achievementName');

  var $desc = $('<td></td>').text(obj.description)
    .addClass('achievementDescrip');

  var $url = '';

  if (obj.achievementState == 'REVEALED') {
    $url = obj.revealedIconUrl;

    if (obj.achievementType == "INCREMENTAL" &&
      obj.hasOwnProperty('formattedCurrentStepsString')) {

      var progressText = '(' + obj.formattedCurrentStepsString + '/' +
        obj.formattedTotalSteps + ')';
      var $progressThingie = $('<div></div>').text(progressText);

      $desc.append($progressThingie);
    }

  } else if (obj.achievementState == 'UNLOCKED') {
    $url = obj.unlockedIconUrl;

  } else if (obj.achievementState == 'HIDDEN') {
    $url = 'img/Question_mark.png';
    // While we're add it, let's change the name and description
    $name.text('Hidden');
    $desc.text(
      'This mysterious achievement will be revealed later');
  }

  var $img = $('<img />').attr('src', $url).attr('alt', obj.achievementState)
    .addClass('medIcon').appendTo($('<td></td>'));
  
  $row.append($name).append($desc).append($img);
  return $row;
};

achievementTable.goBack = function() {
  $('#achievements').fadeOut();
  welcome.loadUp();

};

achievementTable.clearOut = function() {
  $('#achievementsTable tbody').html('');
};