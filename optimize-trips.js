const Elevator = require('./Elevator');
const TripSet = require('./TripSet');

// sort elevators by when their current trip will end
function _getSortedElevatorsByTripEnd(elevators) {
	return elevators.sort((a, b) => {
		return a.currentTripEnd - b.currentTripEnd;
	});
}

function _getNextLobbyElevators(sortedElevators, elapsedTime) {
	const firstTripEnd = sortedElevators[0].currentTripEnd;
	return sortedElevators.filter(e => e.currentTripEnd === firstTripEnd).length;
}

function _getMostEfficientTripSet(tripSets) {
	if (tripSets.length === 1) return tripSets[0];
	return tripSets.sort((a, b) => a.efficiency - b.efficiency)[0];
}

module.exports = function optimizeTrips(params) {
	const { elevatorCount, elevatorCapacity, queue } = params;
	const maxCapacity = elevatorCount * elevatorCapacity;
	let elapsedTime = 0;

	const elevators = [];
	for (let i = 0; i < elevatorCount; i++) {
		elevators.push(new Elevator());
	}

	// start processing the queue of passengers
	while (queue.length) {
		// start with the most passengers we can take
		const passengers = queue.slice(0, maxCapacity);

		// order elevators by how soon they will return to the lobby
		const sortedElevators = _getSortedElevatorsByTripEnd(elevators);

		// get the number of elevators that will in the lobby soonest
		const elevatorsInLobby = _getNextLobbyElevators(sortedElevators, elapsedTime);
		//
		// array of tripsets
		const tripSets = [];
		for (let i = 0; i < elevators.length; i++) {
			// take a subset of the sorted elevators as available
			const availableElevators = sortedElevators.slice(0, elevatorsInLobby + i);

			// create a tripset, which automatically distributes passengers 
			// optimally among a set of trips
			const tripSet = new TripSet({
				availableElevators,
				elevatorCapacity,
				passengers,
			});
			tripSets.push(tripSet);
		}

		// figure out which tripset is the most efficient
		const bestTripSet = _getMostEfficientTripSet(tripSets);

		// remove however many passengers the best tripset took
		queue.splice(0, bestTripSet.trips.length * elevatorCapacity);

		elapsedTime = bestTripSet.startingTime;

		// apply the tripset to the sorted elevators
		bestTripSet.trips.forEach((trip, i) => {
			sortedElevators[i].addTrip(trip);
		});
		console.log('elapsed time', elapsedTime);
	}


	return elevators;
}
