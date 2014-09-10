var audio = audio || {};

// Correct sound extension (use ogg on Chrome, wav on others)
audio.EXT = (/Chrome/.test(navigator.userAgent)) ? "ogg" : "wav";

// Our sounds:
audio.availableSounds = {
  explosion: "assets/sounds/explosion." + audio.EXT,
  laser: "assets/sounds/laser." + audio.EXT,
  wallbreak: "assets/sounds/wallbreak." + audio.EXT,
  badhit: "assets/sounds/badhit." + audio.EXT,
  blast: "assets/sounds/blast." + audio.EXT,
  powerup: "assets/sounds/powerup." + audio.EXT
};

// are sounds enabled?
audio.soundsEnabled = false;

// sounds currently loaded:
audio.sounds = {};

// Play a sound
audio.playSound = function(soundName) {
  if (!audio.soundsEnabled)
    return;
  var s = audio.sounds[soundName];
  if (s)
    s.play();
};

// Wait for sounds to be loaded, then calls the given callback.
audio.waitForSounds = function(callback) {
  var numReady = 0, total = 0;

  for (var i in audio.sounds) {
    if (audio.sounds[i].readyState == 4)
      numReady++;

    total++;
  }

  if (numReady >= total) {
    // all sounds ready
    audio.soundsEnabled = true;
    callback();
  
  } else {
    setTimeout(function() {
      audio.waitForSounds(callback);
    }, 1000);
  }
};

// Load all sounds and calls the given callback when ready.
audio.prepareSounds = function(callback) {
  if (audio.soundsEnabled) {
    // we're already prepared, so just call the callback.
    callback();
    
  } else {
    // start loading sounds and wait until they are loaded
    for (i in audio.availableSounds) {
      audio.sounds[i] = new Audio(audio.availableSounds[i]);
    }
    
    audio.waitForSounds(callback);
  }
};

