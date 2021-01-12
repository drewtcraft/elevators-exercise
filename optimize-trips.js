const Elevator = require('./classes/Elevator');
const TripSet = require('./classes/TripSet');

// sort elevators by when their current trip will end
function _getSortedElevatorsByTripEnd(elevators) {
	return elevators.sort((a, b) => {
		return a.currentTripEnd - b.currentTripEnd;
	});
}

// get the last index of the next elevator(s) to arrive in the lobby
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
	let elapsedTime = 0;

	// create all of our elevators
	const elevators = [];
	for (let i = 0; i < elevatorCount; i++) {
		elevators.push(new Elevator());
	}

	// start processing the queue of passengers
	while (queue.length) {
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

			// take the most passengers we can fit
			const maxCapacity = availableElevators.length * elevatorCapacity;
			const endIdx = Math.min(maxCapacity, queue.length);
			const passengers = queue.slice(0, endIdx);

			// create a tripset, which automatically distributes passengers 
			// optimally amongst a maximum set of trips
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
	}

	return elevators;
}
