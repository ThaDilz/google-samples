"use strict";

var login = login || {};

login.basePath = '/games/v1';
login.appStatePath = '/appstate/v1';

/**
 * This function allows us to load up the game service via the discovery doc
 * and makes calls directly through the client library instead of needing
 * to specify the REST endpoints.
 */
login.loadClient = function() {
  // sign in was successful.
  gameservices.signedIn = true;

  var load = function() {
    player.loadLocalPlayer();
    gameservices.onApiLoaded();
  };

  // load the API via discovery service
  gapi.client.load("games", "v1", load);
};

login.logout = function() {
  gapi.auth.signOut();
  gameservices.signedIn = false;

  $('.screen').hide();
  $('#wait_div').show();

  $("#signedInStatus")[0].style.visibility = "hidden";
};

/**
 * Parses email from the claim set of a JWT ID token.
 *
 * NOTE: We are not validating the ID token since from a trusted source.
 *       We are simply parsed the value from the JWT.
 *
 * See http://www.tbray.org/ongoing/When/201x/2013/04/04/ID-Tokens
 * or
 * http://openid.net/specs/openid-connect-messages-1_0.html#StandardClaims
 * for more info.
 *
 * @param {string} idToken A base64 JWT containing a user ID token.
 * @return {string} The email parsed from the claim set, else undefined
 * if one can't be parsed.
 */
login.getEmailFromIDToken = function(idToken) {
  if (typeof idToken !== 'string') {
    return;
  }

  var segments = idToken.split('.');
  if (segments.length !== 3) {
    return;
  }

  try {
    var claimSet = JSON.parse(atob(segments[1]));
  } catch (e) {
    return;
  }

  if (claimSet.email && typeof claimSet.email === 'string') {
    return claimSet.email;
  }
}

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
  var tokenEmail = login.getEmailFromIDToken(
    authResult.id_token);

  if (authResult.access_token && tokenEmail) {
    $('#signinButtonContainer')[0].classList.add('hidden');
    $("#signedInStatus")[0].style.visibility = "visible";

    $('.screen').hide();
    $('#wait_div').show();

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

    gameservices.signedIn = false;
    showMainScreen();
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
