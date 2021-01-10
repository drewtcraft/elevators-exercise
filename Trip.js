module.exports = class Trip {
	constructor({ passengers, startingTime }) {
		this.startingTime = startingTime;
		this.passengers = passengers;
		this.max = this.passengers.reduce((acc, p) => acc < p ? p : acc, 0);
	}

	// 
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
}
