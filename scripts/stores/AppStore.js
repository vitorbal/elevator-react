var NUM_ELEVATORS = 3;
var MILLISECONDS_PER_FLOOR = 1000;

var _changeListeners = [];
var _elevators = [];
var _lobbies = {};

function getNewElevator() {
  return {
      isMoving: true,
      floor: 1,
      jobs: [],
      passengers: {},
  };
}

var AppStore = {
    init: function() {
      for (var i = 0; i < NUM_ELEVATORS; i ++) {
        _elevators.push(getNewElevator());
      }

      AppStore.notifyChange();
    },

    addFloorToElevatorJobs: function(i, floor) {
        if (_elevators[i].jobs.indexOf(floor) > -1) {
            return;
        }

        var isGoingUp = _elevators[i].jobs.length > 0 && _elevators[i].jobs[0] > _elevators[i].floor ? true : false;
        var jobs = _elevators[i].jobs.slice();
        jobs.push(floor);
        var upwardFloors = [];
        var downwardFloors = [];

        jobs.forEach(function(floor) {
            if (floor > _elevators[i].floor) {
                upwardFloors.push(floor);
            } else {
                downwardFloors.push(floor);
            }
        });

        upwardFloors.sort();
        downwardFloors.sort().reverse();

        if (isGoingUp) {
            _elevators[i].jobs = upwardFloors.concat(downwardFloors);
        } else {
            _elevators[i].jobs = downwardFloors.concat(upwardFloors);
        }
    },

    assignFloorToElevator: function(i, floor) {
        AppStore.stopElevator(i);
        AppStore.addFloorToElevatorJobs(i, floor);
        AppStore.processElevatorJob(i);
    },

    callElevatorFromFloor: function(floor, destinationFloor) {
        if (!(floor in _lobbies)) {
            _lobbies[floor] = [];
        }

        _lobbies[floor].push(destinationFloor);
        AppStore.notifyChange();

        AppStore.processElevatorCall(floor);
    },

    getElevators: function() {
      return _elevators;
    },

    getLobbies: function() {
        return _lobbies;
    },

    moveElevator: function(i, floor) {
        if (_elevators[i].floor === floor) {
            AppStore.openElevator(i);
            return;
        }

        var isGoingUp = floor > _elevators[i].floor ? true : false;
        _elevators[i].isMoving = setTimeout(function() {
            if (isGoingUp) {
                _elevators[i].floor++;
            } else {
                _elevators[i].floor--;
            }
            AppStore.notifyChange();

            if (_elevators[i].floor === floor) {
                AppStore.stopElevator(i, floor);
                AppStore.openElevator(i);
            } else {
                AppStore.moveElevator(i, floor);
            }

        }, MILLISECONDS_PER_FLOOR);
    },

    moveElevatorToFloor(i, floor) {
        AppStore.stopElevator(i, floor);
        AppStore.moveElevator(i, floor);
    },

    openElevator(i) {
        _elevators[i].passengers[_elevators[i].floor] = 0;

        if (_elevators[i].floor in _lobbies) {
            _lobbies[_elevators[i].floor].forEach(function(passengerFloor) {
                if (!(passengerFloor in _elevators[i].passengers)) {
                    _elevators[i].passengers[passengerFloor] = 0;
                }

                _elevators[i].passengers[passengerFloor]++;
                AppStore.addFloorToElevatorJobs(i, passengerFloor);
            });

            _lobbies[_elevators[i].floor] = [];
        }
        AppStore.removeCurrentFloorFromElevatorJobs(i);
        AppStore.processElevatorJob(i);
        AppStore.notifyChange();
    },

    processElevatorCall: function(floor) {
        var distances = [];
        _elevators.forEach(function(elevator){
            var distance = 999;
            if (elevator.jobs.length === 0) {
                distance = Math.abs(elevator.floor - floor);
            } else if (elevator.jobs[0] > elevator.floor && floor > elevator.floor) {
                distance = Math.abs(elevator.floor - floor);
            } else if (elevator.jobs[0] < elevator.floor && floor < elevator.floor) {
                distance = Math.abs(elevator.floor - floor);
            }
            distances.push(distance);
        });

        var i = distances.indexOf(Math.min.apply(Math, distances));
        AppStore.assignFloorToElevator(i, floor);
    },

    processElevatorJob: function(i) {
        if (_elevators[i].jobs.length === 0) {
            return;
        }

        if (_elevators[i].jobs[0] === _elevators[i].floor) {
            AppStore.openElevator(i);
        } else {
            AppStore.moveElevatorToFloor(i, _elevators[i].jobs[0]);
        }
    },

    removeCurrentFloorFromElevatorJobs: function(i) {
        var index = _elevators[i].jobs.indexOf(_elevators[i].floor);
        if (index > -1) {
            _elevators[i].jobs.splice(index, 1);
        }
    },

    stopElevator: function(i) {
        if (_elevators[i].isMoving !== false) {
            clearTimeout(_elevators[i].isMoving);
            _elevators[i].isMoving = false;
        }
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
