const { expect } = require('chai');
const TripSet = require('./TripSet');
const Elevator = require('./Elevator');
const Trip = require('./Trip');

describe('TripSet class', function() {
	const passengers = [ 1, 2, 3, 4, 5, 6 ];
	const availableElevators = [
		new Elevator(),
		new Elevator(),
	];
	const elevatorCapacity = 3;
	
	const tripSet = new TripSet({
		passengers,
		availableElevators,
		elevatorCapacity,
	});

	it('should construct fine', function() {
		expect(tripSet).to.be.ok;
		expect(tripSet.trips).to.be.an('array');
		expect(tripSet.trips.length).to.equal(2);
		expect(tripSet.trips[0].passengers.includes(3)).to.be.true;
	});
});
