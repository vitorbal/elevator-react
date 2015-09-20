var React = require('react');

var Elevator = React.createClass({
    isCurrentFloor: function(floorNumber) {
        return floorNumber === this.props.elevator.floor;
    },

    renderCurrentFloor: function() {
        var passengerCount = 0;
        var passengers = [];

        for (var key in this.props.elevator.passengers) {
            passengerCount += this.props.elevator.passengers[key];
        }

        for (var i = 0; i < passengerCount; i++) {
            passengers.push(<div className='passenger'></div>);
        }

        return (
            <div className='floor elevator-current-floor'>
                <div className='passengers'>{passengers}</div>
            </div>
        );
    },

    renderFloors: function() {
        var floors = [];
        for (var i = 0; i < this.props.numOfFloors; i++) {
            var floorNumber = this.props.numOfFloors - i;
            if (this.isCurrentFloor(floorNumber)) {
                floors.push(this.renderCurrentFloor());
            } else {
                floors.push(<div className='floor'></div>);
            }
        }

        return floors;
    },

    render: function() {
        return <div className='elevator'>{this.renderFloors()}</div>;
    }
});

module.exports = Elevator;
