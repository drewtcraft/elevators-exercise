module.exports = class Elevator {
	constructor() {
		this.trips = [];
	}

	get currentTripEnd() {
		if (!this.trips.length) return 0;

		const currentTrip = this.trips[this.trips.length - 1];
		return currentTrip.tripEnd;
	}

	addTrip(trip) {
		this.trips.push(trip);
	}
}

