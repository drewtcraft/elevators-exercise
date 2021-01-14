const { expect } = require('chai');
const TripSet = require('./TripSet');
const Elevator = require('./Elevator');
const Trip = require('./Trip');

describe('TripSet class', function() {
	const passengers = [ 10, 99, 5, 94, 2, 102 ];
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

	describe('constructor', function() {
		it('should construct fine', function() {
			expect(tripSet).to.be.ok;
		});

		it('should sort the passengers into correct batches', function() {
			expect(tripSet.trips).to.be.an('array');
			expect(tripSet.trips.length).to.equal(2);
			expect(tripSet.trips[0].passengers).to.deep.eq([2, 5, 10]);
			expect(tripSet.trips[1].passengers).to.deep.eq([94, 99, 102]);
		});

		it('should throw when missing params', function() {
			try {
				const t = new TripSet({ 
					passengers: [5], 
					availableElevators: [ new Elevator() ],
				});
			} catch(err) {
				expect(err.message).to.equal('TripSet ctor bad/missing parameter "elevatorCapacity"');
			}

			try {
				const t = new TripSet({ 
					elevatorCount: 2, 
					availableElevators: [ new Elevator() ],
				});
			} catch(err) {
				expect(err.message).to.equal('TripSet ctor bad/missing parameter "passengers"');
			}

			try {
				const t = new TripSet({ 
					passengers: [5], 
					elevatorCount: 4,
				});
			} catch(err) {
				expect(err.message).to.equal('TripSet ctor bad/missing parameter "availableElevators"');
			}
		});
	});

	describe('getters', function() {
		it('should calculate efficiency correctly', function() {
			expect(tripSet.efficiency).to.equal(0.054901960784313725);
		});
	});
});
