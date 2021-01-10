// sort elevators by when their current trip will end
function _getSortedElevatorsByTripEnd(elevators) {
	return elevators.sort((a, b) => {
		return a.currentTripEnd - b.currentTripEnd;
	});
}

function _getNextLobbyElevators(sortedElevators, elapsedTime) {
	// we take the first one and say it is in the lobby
	const lobbyElevators = [ sortedElevators[0] ];

	// if we only have one elevator, return
	if (sortedElevators.length === 1) return lobbyElevators;

	// otherwise, see if we have another elevator that happened to have
	// the same trip end time, add it to our lobby elevators
	const { currentTripEnd } = lobbyElevators[0];
	while (sortedElevators[0].currentTripEnd === currentTripEnd) {
		lobbyElevators.push(sortedElevators.shift());
	}

	return lobbyElevators;
}

function _getBestTripSet(tripSets) {
	if (tripSets.length === 1) return tripSets[0];
	return tripSets.sort((a, b) => a.efficiency - b.efficiency)[0];
}

function processElevatorQueue(params) {
	const { elevatorCount, elevatorCapacity, queue } = params;
	const maxCapacity = elevatorCount * elevatorCapacity;
	let elapsedTime = 0;

	const elevators = [];
	for (let i = 0; i < elevatorCount; i++) {
		elevators.push(new Elevator());
	}

	while (queue.length) {
		// get max capacity of passengers
		const passengers = queue.slice(0, this.maxCapacity);
		const sortedElevators = this.getSortedElevatorsByTripEnd();
		const lobbyElevators = this.getNextLobbyElevators(sortedElevators);
		const tripSets = [];
		for (let i = 0; i < (this.elevators.length - lobbyElevators.length); i++) {
			const availableElevators = sortedElevators.slice(0, lobbyElevators.length + i);
			const tripSet = new TripSet({
				availableElevators,
				elevatorCapacity: this.elevatorCapacity,
				passengers,
			});
			tripSets.push(tripSet);
		}

		const bestTripSet = this.getBestTripSet(tripSets);

		// remove however many passengers we actually took
		queue.splice(0, bestTripSet.trips.length * this.elevatorCapacity);

		// set our time to the start of this tripset
		this.elapsedTime = bestTripSet.startingTime;
		bestTripSet.trips.forEach((trip, i) => {
			sortedElevators[i].addTrip(trip);
		});
	}

}
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
		while (sortedElevators[0].currentTripEnd === this.elapsedTime) {
			lobbyElevators.push(sortedElevators.shift());
		}

		return lobbyElevators;
	}

	getBestTripSet(tripSets) {
		if (tripSets.length === 1) return tripSets[0];
		return tripSets.sort((a, b) => a.efficiency - b.efficiency)[0];
	}

	// each time there is/are elevator(s) in the lobby, calculate all tripsets
	// between lobbyElevators.length and elevatorCount
	// apply penalty to all tripsets EXCEPT the most recently added ones
	// choose the most efficient tripset
	processQueue() {
		const queue = [ ...this.queue ];
		const { elevatorCapacity } = this;
		while (queue.length) {
			// get max capacity of passengers
			const passengers = queue.slice(0, this.maxCapacity);
			const sortedElevators = this.getSortedElevatorsByTripEnd();
			const lobbyElevators = this.getNextLobbyElevators(sortedElevators);
			const tripSets = [];
			for (let i = 0; i < (this.elevators.length - lobbyElevators.length); i++) {
				const availableElevators = sortedElevators.slice(0, lobbyElevators.length + i);
				const tripSet = new TripSet({
					availableElevators,
					elevatorCapacity: this.elevatorCapacity,
					passengers,
				});
				tripSets.push(tripSet);
			}

			const bestTripSet = this.getBestTripSet(tripSets);

			// remove however many passengers we actually took
			queue.splice(0, bestTripSet.trips.length * this.elevatorCapacity);

			// set our time to the start of this tripset
			this.elapsedTime = bestTripSet.startingTime;
			bestTripSet.trips.forEach((trip, i) => {
				sortedElevators[i].addTrip(trip);
			});
		}
	}
}
