"use strict";

var player = player || {};

player.displayName = '';
player.profileUrl = '';
player.userId = '';

player.loadLocalPlayer = function() {
  gapi.client.request({
    path: login.basePath + '/players/me',
    callback: function(data) {
      player.displayName = data.displayName;
      player.profileUrl = data.avatarImageUrl;
      player.userId = data.playerId;

      console.log('This is the player ' + player.displayName);
    }
  });
};
