var NUM_FLOORS = 30;
var React = require('react');
var AppStore = require('../stores/AppStore');
var Elevator = require('../components/Elevator');

var App = React.createClass({
    getStateFromStore: function() {
        return {
            elevators: AppStore.getElevators(),
            lobbies: AppStore.getLobbies(),
        };
    },

    getInitialState: function() {
        AppStore.init();
        return this.getStateFromStore();
    },

    componentDidMount: function() {
        AppStore.addChangeListener(this.update);
    },

    componentWillUnmount: function() {
        AppStore.removeChangeListener(this.update);
    },

    update: function() {
        this.setState(this.getStateFromStore());
    },

    callElevatorFromFloor: function(floor) {
        var randomFloor = floor;
        while (randomFloor === floor) {
            randomFloor = Math.floor(Math.random() * NUM_FLOORS) + 1;
        }

        AppStore.callElevatorFromFloor(floor, randomFloor);
    },

    renderElevators: function() {
        var elevators = this.state.elevators.map(function(elevator){
            return (
                <Elevator
                    elevator={elevator}
                    numOfFloors={NUM_FLOORS} />
            );
        });

        return elevators;
    },

    renderFloors: function() {
        var floors = [];
        for (var i = 0; i < NUM_FLOORS; i++) {
            var floorNumber = NUM_FLOORS - i;
            var passengers = [];

            if (floorNumber in this.state.lobbies) {
                this.state.lobbies[floorNumber].forEach(function(_) {
                    passengers.push(<div className='passenger'></div>);
                });
            }

            floors.push(
                <div className='floor' key={floorNumber}>
                    <a onClick={this.callElevatorFromFloor.bind(null, floorNumber)} className='floor-title'>{floorNumber}</a>
                    <div className='passengers'>{passengers}</div>
                </div>
            );
        }

        return floors;
    },

    render: function() {
        return (
            <div className='container'>
                <div className='lobbies'>
                    {this.renderFloors()}
                </div>
                <div className='elevators'>
                    {this.renderElevators()}
                </div>
            </div>
        );
    }
});

module.exports = App;
