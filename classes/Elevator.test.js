const { expect } = require('chai');
const Elevator = require('./Elevator');
const Trip = require('./Trip');

describe('Elevator class', function() {
	const elevator = new Elevator();

	describe('constructor', function() {
		it('should construct ok', function() {
			expect(elevator).to.be.ok;
		});
	});

	describe('addTrip method', function() {
		const trip = new Trip({
			passengers: [1, 2, 3],
			startingTime: 0,
		});
		it('should be able to add a trip', function() {
			elevator.addTrip(trip);
			expect(elevator.trips.length).to.equal(1);
		});

		it('should calculate currentTripEnd correctly', function() {
			expect(elevator.currentTripEnd).to.equal(9);
		});

		const trip2 = new Trip({
			passengers: [4, 5, 6],
			startingTime: 9,
		});
		it('should be able to add another trip', function() {
			elevator.addTrip(trip2);
			expect(elevator.trips.length).to.equal(2);
		});
	});

	describe('currentTripEnd', function() {
		it('should calculate currentTripEnd correctly again', function() {
			expect(elevator.currentTripEnd).to.equal(27);
		});
	});
});
