const { expect } = require('chai');
const Elevator = require('./Elevator');
const Trip = require('./Trip');

describe('Elevator class', function() {
	const elevator = new Elevator();
	it('should construct ok', function() {
		expect(elevator).to.be.ok;
	});

	const trip = new Trip({ capacity: 4});
	trip.addPassenger(20);
	it('should be able to add a trip', function() {
		elevator.addTrip(trip);
		expect(elevator.trips.length).to.equal(1);
	});

	it('should calculate currentTripEnd correctly', function() {
		expect(elevator.currentTripEnd).to.equal(60);
	});
});
