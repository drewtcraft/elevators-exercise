module.exports = class ElevatorDirector {
	constructor(params) {
		this.elevatorCount = params.elevatorCount;
		this.elevatorCapacity = params.elevatorCapacity;
		this.queue = params.queue;
		this.maxCapacity = elevatorCount * elevatorCapacity;

		this.elapsedTime = 0; // time from start
		this.chunkStart = 0; // chunk == subarray of passengers

		// create elevators
		this.elevators = [];
		for (let i = 0; i < elevatorCount; i++) {
			const elevator = new Elevator();
			this.elevators.push(elevator);
		}
	}

	// represents index of whatever
	get chunkEnd() {
		return this.chunkStart + this.maxCapacity;
	}

	// sort elevators by when their current trip will end
	getSortedElevatorsByTripEnd() {
		return this.elevators.sort((a, b) => {
			return a.currentTripEnd - b.currentTripEnd;
		});
	}

	getNextLobbyElevators(sortedElevators) {
		// we take the first one and say it is in the lobby
		const lobbyElevators = [ sortedElevators.unshift() ];
		// set elapsed time to elevator in lobby
		this.elapsedTime = lobbyElevators[0].currentTripEnd;

		// if we only have one elevator, return
		if (this.elevatorCount === 1) return lobbyElevators;

		// otherwise, see if we have another elevator that happened to have
		// the same trip end time, add it to our lobby elevators
		while (sortedElevators[0].currentTripEnd === elapsedTime) {
			lobbyElevators.push(sortedElevators[0]);
		}

		return lobbyElevators;
	}

	getBestTripSet(tripSets) {
		return tripSets.sort((a, b) => a.efficiency - b.efficiency)[0];
	}

	dispatch(tripSet) {
		this.elapsedTime = tripSet.startingTime;
	}

	// each time there is/are elevator(s) in the lobby, calculate all tripsets
	// between lobbyElevators.length and elevatorCount
	// apply penalty to all tripsets EXCEPT the most recently added ones
	// choose the most efficient tripset
	processQueue() {
		const queue = [ ...this.queue ];
		while (queue.length) {
			const chunk = queue.slice(this.chunkStart, this.chunkEnd);
			// get lobby elevators
			// make a tripset with those
			// add new elevator(s)
			// sum wait time with previous lobby elevators
			// make new tripset
			const sortedElevators = this.getSortedElevatorsByTripEnd();
			const lobbyElevators = this.getNextLobbyElevators(sortedElevators);
			const tripSets = [];
			for (let i = 0; i < (this.elevators.length - lobbyElevators.length); i++) {
				const availableElevators = sortedElevators.slice(0, lobbyElevators.length + i);
				const tripSet = new TripSet({
					availableElevators,
					elevatorCapacity: this.elevatorCapacity,
					passengers: chunk,
				});
				tripSets.push(tripSet);
			}

			const bestTripSet = this.getBestTripSet(tripSets);

			this.dispatch(bestTripSet);
		}
	}
}
