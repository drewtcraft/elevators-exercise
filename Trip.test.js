const { expect } = require('chai');
const Trip = require('./Trip');

describe('Trip class', function () {
	const capacity = 4;
	const trip = new Trip({ capacity });
	it('should construct a class', function () {
		expect(trip).to.be.ok;
		expect(trip instanceof Trip).to.be.true;
	});

	const passenger55 = 55;
	it('should be able to add passengers', function () {
		expect(trip.passengers.length).to.equal(0);

		trip.addPassenger(passenger55);

		expect(trip.passengers.length).to.equal(1);
		expect(trip.passengers[0]).to.equal(passenger55);
	});

	const passenger10 = 10;
	const passenger56 = 56;
	it('should have dynamic max and min properties', function () {
		expect(trip.min).to.equal(passenger55);
		expect(trip.max).to.equal(passenger55);

		trip.addPassenger(passenger10);
		expect(trip.min).to.equal(passenger10);

		trip.addPassenger(passenger56);
		expect(trip.max).to.equal(passenger56);

	});

	it('trip.range should calculate correctly', function () {
		expect(trip.range).to.equal(passenger56 - passenger10);
	});

	it('trip.evaluateNewPassenger should return a high number for a desirable passenger', function () {
		expect(trip.evaluateNewPassenger(10)).to.equal(Infinity);
	});

	it('trip.evaluateNewPassenger should return a negative number for an undesirable passenger', function () {
		expect(trip.evaluateNewPassenger(100)).to.equal(passenger56 - 100);
	});

	it('trip.isAtCapacity should calculate correctly', function () {
		expect(trip.isAtCapacity).to.be.false;
		trip.addPassenger(11);
		expect(trip.isAtCapacity).to.be.true;
	});
});
