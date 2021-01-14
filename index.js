const fs = require('fs');
const path = require('path');
const optimizeTrips = require('./optimize-trips');

function _loadInputFile(filePath) {
	return new Promise((resolve, reject) => {
		if (!/\.txt$/.test(filePath)) {
			return reject(new Error('provided file is not of type ".txt"'));
		}
		fs.readFile(filePath, 'utf-8', (err, res) => {
			if (err) {
				console.error(`Problem loading file ${filePath}`);
				return reject(err);
			}
			resolve(res);
		});
	});
}

function _parseVariablesFromFile(file) {
	if (!file || !file.length) {
		throw new Error('received empty file');
	}
	const [ n, _, q, commaSeparated ] = file.split('\n');
	const elevatorCapacity = Number(q);
	const elevatorCount = Number(n);

	if (!commaSeparated || !commaSeparated.length) {
		throw new Error('missing list of passengers');
	}
	const queue = commaSeparated.split(',').map(t => Number(t.trim()));

	if (!elevatorCapacity || isNaN(elevatorCapacity)) {
		throw new Error('bad elevatorCapacity data');
	}

	if (!elevatorCount || isNaN(elevatorCount)) {
		throw new Error('bad elevatorCount data');
	}

	if (!queue) {
		throw new Error('bad queue data');
	}
	return { 
		elevatorCapacity,
		elevatorCount,
		queue,
	};
}

function _writeElevatorHistory(filePath, history) {
	// file name without extension
	const basename = path.basename(filePath)
		.replace(/\..*/, '');

	return new Promise((resolve, reject) => {
		fs.writeFile(
			`./${basename}-output.txt`, 
			JSON.stringify(history, '\t', 4),
			'utf-8',
			(err, res) => {
				if (err) {
					console.error(`Problem loading file ${filePath}`);
					return reject(err);
				}
				resolve(res);
			}
		);
	});
}

module.exports = function(filePath, doWrite = true) {
	return _loadInputFile(filePath)
		.then(_parseVariablesFromFile)
		.then(optimizeTrips)
		.then(elevatorHistory => {
			if (!doWrite) return elevatorHistory;

			return _writeElevatorHistory(filePath, elevatorHistory)
				.then(() => elevatorHistory);
		})
		.catch(err => {
			console.error('problem optimizing trips:');
			console.error(err);
		});
}

