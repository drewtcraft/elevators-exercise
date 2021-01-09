const fs = require('fs');

function _loadInputFile (path) {
	return fs.readFile(path, 'utf-8', (err, res) => {
		if (err) {
			console.error(`Problem loading file ${path}`);
			console.error(err);
			process.exit(1);
		}


	});
}

function _parseVariablesFromFile (file) {
	try {
		const [ n, m, q, queue ] = file.split('\n');
	} catch (err) {

	}
}

class ElevatorDirector {
	constructor(params) {
		this.elevatorCount = params.elevatorCount;
		this.elevatorCapacity = params.elevatorCapacity;
		this.queue = params.queue;
		this.maxCapacity = elevatorCount * elevatorCapacity;
		this.elapsedTime = 0;
		this.chunkStart = 0;

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
	getSortedElevatorsByTripEnd(time = 0) {
		return this.elevators.filter(e => {
			return e.currentTripEnd > (this.elapsedTime + penalty);
		})
		.sort((a, b) => a.currentTripEnd - b.currentTripEnd);
	}

	getNextLobbyElevators(time = 0) {
		const sortedElevators = this.getSortedElevatorsByTripEnd(time);
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

	dispatchTripSet(tripSet) {
		this.elapsedTime = tripSet.startingTime;

	}

	// each time there is/are elevator(s) in the lobby, calculate all tripsets
	// between lobbyElevators.length and elevatorCount
	// apply penalty to all tripsets EXCEPT the most recently added ones
	// choose the most efficient tripset
	processQueue() {
		const tripSets = [];
		let penalty = 0;
		const queue = [ ...this.queue ];
		let lobbyElevators = [];
		while (queue.length) {
			lobbyElevators = [ 
				...lobbyElevators, 
				...this.getNextLobbyElevators(penalty),
			];
			const chunk = queue.slice(this.chunkStart, this.chunkEnd);
			const tripSet = new TripSet({
				availableElevators: lobbyElevators.length,
				penalty,
				startingTime: this.elapsedTime,
				passengers: chunk,
			})
		}
	}
}


// represents several trips, each going to a different elevator
class TripSet {
	constructor(params) {
		const { 
			availableElevators, 
			penalty, 
			elevatorCapacity, 
			startingTime,
			passengers,
		} = params;

		this.trips = [];
		this.startingTime = startingTime + penalty;

		// create the number of available trips
		for (let i = 0; i < availableElevators.length; i++) {
			const trip = new Trip({ 
				capacity: elevatorCapacity, 
				penalty,
				startingTime,
			});
			this.trips.push(trip);
		}

		function doIterate() {
			return this.trips.every(trip => !trip.isAtCapacity()) 
				&& passengers.length;
		}

		this.passengerCount;

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

class Trip {
	constructor(params) {
		const passengers = this.passengers = params.passengers;
		this.startingTime = params.startingTime;
		this.capacity = params.capacity;
		this.penalty = params.penalty;

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

	get isEmpty() {
		return this.passengers.length === 0;
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
		if (passenger > this.max) this.max = passenger;
		if (passenger < this.min) this.min = passenger;
	}

	// returns negative if trip is not complete
	// returns 0 if trip is complete
	// returns positive number if trip is in the past
	distanceFrom(time) {
		return time - this.startingTime - this.travelTime;
	}
}

class Elevator {
	constructor(params) {
		this.trips = [];
	}

	get currentTripEnd() {
		const currentTrip = this.trips[this.trips.length - 1];
		return currentTrip.startingTime + currentTrip.travelTime;
	}

	distanceFrom(time) {
		const currentTrip = this.trips[this.trips.length - 1];
		return currentTrip.distanceFrom(time);
	}
}
