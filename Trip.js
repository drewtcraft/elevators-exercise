module.exports = class Trip {
	constructor(params = {}) {
		const { passengers = [], startingTime = 0, penalty = 0 } = params;

		this.startingTime = startingTime + this.penalty;
		this.passengers = passengers;
		this.penalty = penalty;
	}

	get efficiency() {
		return this.passengers.length / this.travelTime;
	}

	get travelTime() {
		// basically we want the highest floor times 2 seconds, 
		// plus the return trip, highest floor times 1 second,
		// assuming the stops are sorted
		return this.max * 3;
	}

	get tripEnd() {
		return this.startingTime + this.travelTime;
	}

	addPassenger(passenger) {
		this.passengers.push(passenger);
	}
}
