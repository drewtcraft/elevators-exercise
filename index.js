const fs = require('fs');
const Trip = require('./Trip');
const TripSet = require('./TripSet');
const Elevator = require('./Elevator');
const optimizeTrips = require('./optimize-trips');

function _loadInputFile(path) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, 'utf-8', (err, res) => {
			if (err) {
				console.error(`Problem loading file ${path}`);
				return reject(err);
			}
			resolve(res);
		});
	});
}

function _parseVariablesFromFile(file) {
	try {
		const [ n, m, q, queue ] = file.split('\n');
	} catch (err) {

	}
}

function _writeElevatorHistory(path, history) {
	return new Promise((resolve, reject) => {
		fs.writeFile(
			`./${path}-output.txt`, 
			JSON.stringify(history, '\t', 4),
			'utf-8',
			(err, res) => {
				if (err) {
					console.error(`Problem loading file ${path}`);
					return reject(err);
				}
				resolve(res);
			}
		);
	});
}

console.log(JSON.stringify(optimizeTrips({
	queue: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 14, 15, 16, 17],
	elevatorCount: 2,
	elevatorCapacity: 3
}), '\t', 4));

module.exports = function(path) {
	return _loadInputFile(path)
		.then(_parseVariablesFromFile)
		.then(optimizeTrips)
		.then(_writeElevatorHistory)
		.then(() => process.exit(0))
		.catch(err => {
			console.error(err);
			process.exit(1);
		});
}

