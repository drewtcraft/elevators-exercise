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
});
