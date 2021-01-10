module.exports = class Trip {
	constructor(params = {}) {
		const {
			passengers = [],
			startingTime = 0,
			penalty = 0,
			capacity = 0,
		} = params;

		this.startingTime = startingTime;
		this.capacity = capacity;
		this.passengers = passengers;
		this.penalty = penalty;

		// get passenger with lowest floor
		this.min = passengers.reduce((acc, p) => p < acc ? p : acc, 0);
		this.max = passengers.reduce((acc, p) => p > acc ? p : acc, 0);
	}

	get efficiency() {
		return this.passengers.length / this.travelTime;
	}

	get isAtCapacity() {
		return this.passengers.length === this.capacity;
	}

	get range() {
		return this.max - this.min;
	}

	get travelTime() {
		// basically we want the highest floor times 2 seconds, 
		// plus the return trip, highest floor times 1 second,
		// assuming the stops are sorted
		return this.max * 3 + this.penalty;
	}

	// see how much adding the passenger will add to our floor range
	// higher is better!
	evaluateNewPassenger (passenger) {
		// it is highly desirable to have multiple passengers going to the same floor
		if (this.passengers.includes(passenger)) return Infinity;

		// if there are no passengers yet, that's cool, but not as cool as having
		if (!this.passengers.length) return 0;

		// return effect on range, a negative number
		if (passenger >= this.max) return this.max - passenger;
		if (passenger <= this.min) return passenger - this.min;
	}

	addPassenger(passenger) {
		this.passengers.push(passenger);

		// re-evaluate max and min
		if (passenger > this.max || !this.max) this.max = passenger;
		if (passenger < this.min || !this.min) this.min = passenger;
	}
}
