const Trip = require('./Trip');

// represents several trips, each going to a different elevator
module.exports = class TripSet {
	constructor({ availableElevators, elevatorCapacity, passengers }) {
		this.trips = [];
		this.passengers = passengers;

		// starting time for this trip is the last elevator's trip end
		this.startingTime = availableElevators[availableElevators.length - 1].currentTripEnd;

		const sortedPassengers = passengers.sort((a, b) => a - b)
		// create the number of available trips
		for (let i = 0; i < availableElevators.length; i++) {
			const penalty = this.startingTime - availableElevators[i].currentTripEnd;
			const myPassengers = sortedPassengers.splice(0, elevatorCapacity);
			const startingTime = availableElevators[i].currentTripEnd + penalty;
			const trip = new Trip({ 
				passengers: myPassengers,
				elevatorCapacity, 
				startingTime,
			});
			this.trips.push(trip);
		}
	}

	get efficiency() {
		const totalEfficiency = this.trips.reduce((acc, trip) => {
			return acc + trip.efficiency;
		}, 0);

		return totalEfficiency / this.trips.length;
	}
}
