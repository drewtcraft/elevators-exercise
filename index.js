const fs = require('fs');
const path = require('path');
const optimizeTrips = require('./optimize-trips');

let _path;
if (!_path) {
	_path = process.argv[2];
}

// take a string representation of a queue "2,3,4,5"
// sanitize and convert to array of numbers
function _commaSeparatedToQueue(cs) {
	return cs.slice(0, _getLastCommaIdx(cs))
		.split(',')
		.map(t => Number(t.trim()))
		.filter(n => !isNaN(n));
}

function _parseFirstChunk(raw) {
	if (!raw || !raw.length) {
		throw new Error('_parseFirstChunk: received empty file');
	}
	const [ n, _, q, commaSeparated ] = raw.split('\n');
	const elevatorCapacity = Number(q);
	const elevatorCount = Number(n);

	if (!commaSeparated || !commaSeparated.length) {
		throw new Error('_parseFirstChunk: missing list of passengers');
	}
	const queue = _commaSeparatedToQueue(commaSeparated);

	if (!elevatorCapacity || isNaN(elevatorCapacity)) {
		throw new Error('_parseFirstChunk: bad elevatorCapacity data');
	}

	if (!elevatorCount || isNaN(elevatorCount)) {
		throw new Error('_parseFirstChunk: bad elevatorCount data');
	}

	if (!queue) {
		throw new Error('_parseFirstChunk: bad queue data');
	}

	return [
		elevatorCapacity,
		elevatorCount,
		queue,
	];
}

function _getOutputFileName(filePath) {
	// file name without extension
	return path.basename(filePath).replace(/\..*/, '') + '-output.txt';
}

// make sure we don't parse a "6" that will be "65" when we process 
// the next chunk
function _getLastCommaIdx(chunk = '') {
	const len = chunk.length;
	if (!len) return '';

	// search the last 20 characters in reverse and look for 
	// the index of a comma
	let lastCommaIndex;
	for (let i = len - 1; i > (len - 20); i--) {
		if (chunk[i] === ',') {
			lastCommaIndex = i;
			break;
		}
	}

	if (!lastCommaIndex) {
		throw new Error('bad passenger data');
	}

	return lastCommaIndex;
}

const opt = { encoding: 'utf-8' };

function processFile(filePath) {
	let elevatorCount, 
		elevatorCapacity,
		queue;

	const fileSize = fs.statSync(filePath).size;

	let currentRaw = '';
	let nRead = 0;

	const outputName = _getOutputFileName(filePath);
	const writeStream = fs.createWriteStream(outputName, { ...opt });

	const readOpts = { ...opt };
	const readStream = fs.createReadStream(filePath, readOpts);

	function read() {
		readStream.on('data', chunk => {
			console.log(`${(nRead/fileSize*100).toFixed(2)}% complete`);
			nRead = nRead + chunk.length;
			currentRaw = currentRaw + chunk;

			let lastIdx;
			const isEndOfFile = nRead >= fileSize;
			if (isEndOfFile) lastIdx = currentRaw.length - 1;
			else lastIdx =_getLastCommaIdx(currentRaw);

			const raw = currentRaw.slice(0, lastIdx);
			currentRaw = currentRaw.slice(lastIdx);

			// on the first chunk we need to parse elevatorCount
			// and elevatorCapacity and the start of the queue
			if (!elevatorCount) {
				console.log('setting variables');
				[ 
					elevatorCapacity, 
					elevatorCount, 
					queue,
				] = _parseFirstChunk(raw);
				console.log('elevatorCapacity', elevatorCapacity);
				console.log('elevatorCount', elevatorCount);
			} else {
				let prevLength = queue.length;
				queue = [ ...queue, ..._commaSeparatedToQueue(raw) ];
				console.log('extending queue by', prevLength, 'to', queue.length);
			}

			const trips = optimizeTrips({
				elevatorCount,
				elevatorCapacity,
				queue,
				isEnd: isEndOfFile,
			});

			console.log(trips);

			const passengersTaken = trips.reduce((acc, trip) => {
				return acc + trip.passengers.length;
			});

			// remove all the passengers actually taken from the queue
			queue = queue.slice(passengersTaken);

			trips.forEach(t => writeStream.write(JSON.stringify(t)));
			readStream.resume();
		});

	}

	// start processing when both streams are ready
	writeStream.on('ready', function(err) {
		if (err) {
			console.error('Problem initiating writeStream');
			console.error(err);
			return;
		}
		console.log('write stream ready');

		readStream.on('ready', function(err) {
			if (err) {
				console.error('Problem initiating readStream');
				console.error(err);
				return;
			}
			console.log('read stream ready');
			read();
		});
	});
}

if (_path) {
	try { processFile(_path); } 
	catch(err) { console.error(err) }
}

module.exports = processFile;

