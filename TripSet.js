const Trip = require('./Trip');
// represents several trips, each going to a different elevator
module.exports = class TripSet {
	constructor(params) {
		const { 
			availableElevators, 
			elevatorCapacity, 
			passengers,
		} = params;

		this.trips = [];

		// starting time for this trip is the last elevator's trip end
		this.startingTime = availableElevators[availableElevators.length - 1].currentTripEnd;

		// create the number of available trips
		for (let i = 0; i < availableElevators.length; i++) {
			const tripPenalty = this.startingTime - availableElevators[i].startingTime;
			const trip = new Trip({ 
				capacity: elevatorCapacity, 
				penalty: tripPenalty,
			});
			this.trips.push(trip);
		}

		const doIterate = () => {
			return this.trips.every(trip => !trip.isAtCapacity) 
				&& passengers.length;
		}

		this.passengerCount = 0;

		// room for improvement here, might be some situations where
		// not traveling at capacity is more beneficial,
		// should evaluate each passenger's impact on the tripset
		// and choose the point in the dequeue process that represents maximum
		// efficiency
		while (doIterate()) {
			const nextPassenger = passengers.shift();
			const sortedTrip = this.trips.sort((a, b) => {
				return b.evaluateNewPassenger(nextPassenger)
					- a.evaluateNewPassenger(nextPassenger);
			});
			const [ bestTrip ] = sortedTrip;
			bestTrip.addPassenger(nextPassenger);
			this.passengerCount += 1;
		}
	}

	get totalPassengers() {
		return this.trips.reduce((acc, t) => acc + t.passengers.length, 0);
	}

	get cost() {
		return this.penalty * this.trips
	}

	get efficiency() {
		const totalEfficiency = this.trips.reduce((acc, trip) => {
			return acc + trip.efficiency;
		}, 0);

		return totalEfficiency / this.trips.length;
	}
}
