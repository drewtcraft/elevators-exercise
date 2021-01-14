const Trip = require('./Trip');

// represents several trips, each going to a different elevator
module.exports = class TripSet {
	constructor({ availableElevators, elevatorCapacity, passengers }) {
		if (!availableElevators || !availableElevators.length) {
			throw new Error('TripSet ctor bad/missing parameter "availableElevators"');
		}

		if (!passengers || !passengers.length) {
			throw new Error('TripSet ctor bad/missing parameter "passengers"');
		}

		if (!elevatorCapacity) {
			throw new Error('TripSet ctor bad/missing parameter "elevatorCapacity"');
		}

		this.trips = [];

		// starting time for this trip is the last elevator's trip end
		this.startingTime = availableElevators[availableElevators.length - 1].currentTripEnd;

		const sortedPassengers = passengers.sort((a, b) => a - b)

		// dont take the full elevatorcapcity of passengers if there
		// aren't enough passengers to fill all elevators
		const passengersToTake = Math.min(
			elevatorCapacity, 
			passengers.length / availableElevators.length
		);
		// create the number of available trips
		for (let i = 0; i < availableElevators.length; i++) {
			const myPassengers = sortedPassengers.splice(0, passengersToTake);

			// penalty is the time waiting for another elevator
			// to return to the lobby
			const penalty = this.startingTime - availableElevators[i].currentTripEnd;
			const startingTime = availableElevators[i].currentTripEnd + penalty;

			const trip = new Trip({ 
				passengers: myPassengers,
				elevatorCapacity, 
				startingTime,
			});
			this.trips.push(trip);
		}
	}

	// average efficiency of all trips in this tripset
	get efficiency() {
		const totalEfficiency = this.trips.reduce((acc, trip) => {
			return acc + trip.efficiency;
		}, 0);

		return totalEfficiency / this.trips.length;
	}
}
