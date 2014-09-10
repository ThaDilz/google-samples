
"use strict";

var model = model || {};

model.INVENTORY_SLOT = 0;

model.inv = new Inventory();
model.lastSaveVersion = '';

model.load = function(callback) {
  console.log("Loading data");

  gapi.client.request({
    path: constants.APPSTATEPATH + '/states/' + model.INVENTORY_SLOT,
    callback: function(response, rawResponse) {
      console.log('Cloud get response: ', response, rawResponse);
      var responseObject = JSON.parse(rawResponse);

      if (responseObject.gapiRequest.data.status == 404) {
        // Looks like there's no data. Must be our first time playing
        model.inv.loadEmpty();

      } else {
        console.log('Here is your saved game ', response);

        if (response.kind == ('appstate#getResponse') &&
          response.hasOwnProperty('data')) {
          model.inv.load(response.data);
          model.lastSaveVersion = response.currentStateVersion;

        } else {
          console.log("This was not the response I expected.");
          model.inv.loadEmpty();
        }
      }

      callback();
    }
  });
};

model.beginMergeResolve = function(originalCallback) {
  gapi.client.request({
    path: constants.APPSTATEPATH + '/states/' + model.INVENTORY_SLOT,
    callback: function(response) {
      if (response.kind == ('appstate#getResponse') &&
        response.hasOwnProperty('data')) {

        // Merge the two sets of data
        var serverData = new Inventory();
        serverData.loadDataFromCloud(response.data);
        var mergedData = new Inventory();

        for (var world = 1; world <= 20; world++) {
          for (var level = 1; level <= 12; level++) {
            var maxStars = Math.max(model.inv.getStarsFor(world, level),
              serverData.getStarsFor(world, level));
            if (maxStars > 0) {
              mergedData.setStarsFor(world, level, maxStars);
            }
          }
        }

        console.log("This is my merged data  ", mergedData);
        model.lastSaveVersion = response.currentStateVersion;
        model.inv = mergedData;
        model.save(originalCallback);

      } else {
        console.log("Something really strange is going on");
      }
    }
  });
};

model.save = function(callback) {
  console.log("Saving ", atob(model.inv.save()));

  var paramsObj = {};

  if (model.lastSaveVersion != '') {
    paramsObj['currentStateVersion'] = model.lastSaveVersion;
  }

  gapi.client.request({
    path: constants.APPSTATEPATH + '/states/' + model.INVENTORY_SLOT,
    params: paramsObj,
    body: {
      kind: 'appstate#updateRequest',
      data: model.inv.save()
    },
    method: 'put',
    callback: function(data, rawResponse) {
      console.log('Cloud update response: ', data, rawResponse);

      var responseObject = JSON.parse(rawResponse);

      if (responseObject.gapiRequest.data.status == 409) {
        // Uh-oh! Conflict
        console.log("We appear to be out of date");
        model.beginMergeResolve(callback)
        //model.requestUpdatedStateForMerging(objectToSave);

      } else if (data.kind == "appstate#writeResult") {
        // We'll want to look for an error
        if (!data.hasOwnProperty('error')) {
          // We need to update our version, and we'll save
          // our inventory
          model.lastSaveVersion = data.currentStateVersion;
          callback();
        }
      }
    }
  });
};

model.getStarsFor = function(world, level) {
  return model.inv.getStarsFor(world, level);
};

model.setStarsFor = function(world, level, newNum) {
  model.inv.setStarsFor(world, level, newNum);
};
