
"use strict";

var login = login || {};

/**
 * This function allows us to load up the game service via the discovery doc
 * and makes calls directly through the client library instead of needing
 * to specify the REST endpoints.
 */
login.loadClient = function() {
  var load = function() {
    player.loadLocalPlayer();
    game.init();
  };

  // load the API via discovery service
  gapi.client.load("games", "v1", load);
};

login.logout = function() {
  gapi.auth.signOut();
  $("#signedInStatus")[0].style.visibility = "hidden";
};

/**
 * Handles the Google+ Sign In response.
 *
 * Success calls google.devrel.samples.ttt.init. Failure makes the Sign-In
 * button visible.
 *
 * @param {Object} authResult The contents returned from the Google+
 * Sign In attempt.
 */
login.signinCallback = function(authResult) {
  if (authResult) {
    $('#signinButtonContainer')[0].classList.add('hidden');
    $("#signedInStatus")[0].style.visibility = "visible";

    login.loadClient();

  } else { // login failure
    $('#signinButtonContainer')[0].classList.remove('hidden');
    $("#signedInStatus")[0].style.visibility = "hidden";

    if (!authResult.error) {
      console.log('Unexpected result');
      console.log(authResult);

    } else if (authResult.error !== 'immediate_failed') {
      console.log('Unexpected error occured: ' + authResult.error);

    } else {
      console.log('Immediate mode failed, user needs to click Sign In.');
    }
  }
};

/**
 * Renders the Google+ Sign-in button using auth parameters.
 */
var render = function() {
  gapi.signin.render('signinButton', {
    'callback': login.signinCallback,
    'clientid': constants.CLIENT_ID,
    'cookiepolicy': 'single_host_origin',
    'immediate': true,
    'requestvisibleactions': 'http://schemas.google.com/AddActivity',
    'scope': constants.SCOPES
  });
};

// A quirk of the JSONP callback of the plusone client makes it so
// our callback must exist as an element in window.
window['render'] = render;

(function() {
  var newEl = document.createElement('script');

  newEl.type = 'text/javascript';
  newEl.async = true;
  newEl.src = 'https://apis.google.com/js/client:plusone.js'
    + '?onload=render';

  var first = document.getElementsByTagName('script')[0];
  first.parentNode.insertBefore(newEl, first);
})();

