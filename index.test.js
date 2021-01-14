const Elevator = require('./classes/Elevator');
const Trip = require('./classes/Trip');
const { expect } = require('chai');
const rewire = require('rewire');
const fs = require('fs');
const main = require('./index');

describe('utility functions', function() {
	const mod = rewire('./index.js');
	describe('_loadInputFile', function() {
		const _loadInputFile = mod.__get__('_loadInputFile');
		it('should work with a txt file', function() {
			return _loadInputFile('./test/input-files/input1.txt')
				.then(res => {
					expect(res).to.be.ok;
					expect(res.split('')[0]).to.equal('2');
				});
		});

		it('should fail with a non txt file', function() {
			expect(_loadInputFile('./index.js')).to.throw;
		});
	});

	describe('_parseVariablesFromFile', function() {
		const _parseVariablesFromFile = mod.__get__('_parseVariablesFromFile');
		it('should work with good input', function() {
			const parsed = _parseVariablesFromFile('1\n2\n3\n4,5,6,7,8,9');
			expect(parsed).to.deep.eq({
				elevatorCount: 1,
				elevatorCapacity: 3,
				queue: [4,5,6,7,8,9],
			})
		});

		it('should fail with bad input', function() {
			try { _parseVariablesFromFile(''); }
			catch(err) {
				expect(err.message).to.equal('received empty file');
			}

			try { _parseVariablesFromFile('0\n0\n1\n2,3'); }
			catch(err) {
				expect(err.message).to.equal('bad elevatorCount data');
			}

			try { _parseVariablesFromFile('1\n0\n0\n2,3'); }
			catch(err) {
				expect(err.message).to.equal('bad elevatorCapacity data');
			}

			try { _parseVariablesFromFile('1\n0\n1'); }
			catch(err) {
				expect(err.message).to.equal('missing list of passengers');
			}
		});

	});
});

describe('main export', function() {
	const path = './test/input-files';
	fs.readdirSync(path).forEach(file => {
		if (!/\.txt$/.test(file)) return;

		const myPath = path + '/' + file;
		main(myPath);
	});
});
