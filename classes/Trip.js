module.exports = class Trip {
	constructor({ passengers, startingTime }) {
		if (!passengers || !passengers.length) {
			throw new Error('Trip ctor bad/missing parameter "passengers"');
		}
		if (typeof startingTime !== 'number') {
			throw new Error('Trip ctor bad/missing parameter "startingTime"');
		}

		this.startingTime = startingTime;
		this.passengers = passengers;
		this.max = passengers.reduce((acc, p) => acc < p ? p : acc, 0);
	}

	// efficiency in our case is the most passengers moved per unit time
	get efficiency() {
		return this.passengers.length / this.travelTime;
	}

	get travelTime() {
		// we want the highest floor times 2 seconds, 
		// plus the return trip, highest floor times 1 second,
		// assuming the stops are sorted
		return this.max * 3;
	}

	get tripEnd() {
		return this.startingTime + this.travelTime;
	}
}
