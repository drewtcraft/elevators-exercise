const Elevator = require('./classes/Elevator');
const Trip = require('./classes/Trip');
const TripSet = require('./classes/TripSet');
const { expect } = require('chai');
const rewire = require('rewire');
const fs = require('fs');
const optimizeTrips = require('./optimize-trips');
const mod = rewire('./optimize-trips.js');
const _getSortedElevatorsByTripEnd = mod.__get__('_getSortedElevatorsByTripEnd');
const _getNextLobbyElevators = mod.__get__('_getNextLobbyElevators');
const _getMostEfficientTripSet = mod.__get__('_getMostEfficientTripSet');

describe('optimize trips', function() {
	describe('utility functions', function() {
		const input = [ new Elevator(), new Elevator() ]
			.map((el, i) => {
				el.addTrip(new Trip({
					startingTime: 0,
					passengers: [ i + 1 * 20 ],
				}));
				return el;
			});

		let sorted;

		describe('_getSortedElevatorsByTripEnd', function() {
			it('should sort the elevators by trip end', function() {
				sorted = _getSortedElevatorsByTripEnd(input);
				expect(sorted[0].currentTripEnd).to.be.below(sorted[1].currentTripEnd);
			});
		});

		describe('_getNextLobbyElevators', function() {
			it('should get the index of the next elevator in the lobby', function() {
				expect(_getNextLobbyElevators(sorted)).to.equal(0);
			})
		});

		describe('_getMostEfficientTripSet', function() {
			it('should return the most efficient tripset', function() {
				const elevators = [ new Elevator(), new Elevator() ];
				const tripSets = [
					new TripSet({
						passengers: [100],
						availableElevators: [ elevators[0] ],
						elevatorCapacity: 1,
					}),
					new TripSet({
						passengers: [101, 100],
						availableElevators: elevators,
						elevatorCapacity: 1,
					}),
				];

				expect(_getMostEfficientTripSet(tripSets)).to.deep.eq(tripSets[0]);
			});
		});
	});

	describe('optimizeTrips function', function() {
		const input = {
			elevatorCapacity: 3,
			elevatorCount: 2,
			queue: [ 5, 90, 20, 1, 2, 120 ],
		};
		const output = optimizeTrips(input);
		it('should return an elevator history array', function() {
			expect(output).to.deep.eq([
				{ passengers: [1, 2, 5], departs: 0 },
				{ passengers: [20, 90, 120], departs: 0 },
			]);
		});

		it('should account for every passenger', function() {
			const allPassengersAccountFor = output.map(h => h.passengers)
				.flat()
				.filter(p => input.queue.includes(p))
				.length === input.queue.length;
			expect(allPassengersAccountFor).to.be.true;
		});
	});
});

