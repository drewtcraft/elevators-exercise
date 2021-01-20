const { expect } = require('chai');
const Trip = require('./Trip');

describe('Trip class', function () {
	describe('constructor', function() {
		it('should construct fine', function () {
			const trip = new Trip({
				passengers: [1, 2, 3],
				startingTime: 0,
			});
			expect(trip).to.be.ok;
		});


		it('should throw when missing params', function () {
			try {
				let trip = new Trip({ startingTime: 0 });
			} catch (err) {
				expect(err.message).to.equal('Trip ctor bad/missing parameter "passengers"');
			}

			try {
				let trip = new Trip({ passengers: [1, 2, 3] });
			} catch (err) {
				expect(err.message).to.equal('Trip ctor bad/missing parameter "startingTime"');
			}
		});
	});

	describe('computed properties', function() {
		const trip = new Trip({
			passengers: [1, 2, 3],
			startingTime: 20,
		});

		it('should calculate efficiency correctly', function() {
			expect(trip.efficiency).to.equal(3/9);
		});

		it('should calculate travel time correctly', function() {
			expect(trip.travelTime).to.equal(3 * 2 + 3);
		});

		it('should calculate trip end correctly', function() {
			expect(trip.tripEnd).to.equal(3 * 2 + 3 + 20);
		});
	});
	

});
