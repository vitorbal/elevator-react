var NUM_ELEVATORS = 3;

var _changeListeners = [];
var _elevators = [];

function getNewElevator() {
  return {
      isMoving: true,
      floor: 0,
  };
}

var AppStore = {
    init: function() {
      for (var i = 0; i < NUM_ELEVATORS; i ++) {
        _elevators.push(getNewElevator());
      }

      AppStore.notifyChange();
    },

    notifyChange: function() {
        _changeListeners.forEach(function(f){
            f();
        });
    },

    addChangeListener: function(f) {
        _changeListeners.push(f);
    },

    removeChangeListener: function(f) {
        _changeListeners = _changeListeners.filter(function (listener) {
            return listener !== f;
        });
    }
};

module.exports = AppStore;
