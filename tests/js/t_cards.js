/**
 * Created by Ian on 29/04/2015.
 */

"use strict";

QUnit.test('PACK', function(assert){
	assert.ok(Pack, 'Pack is defined');
	var pack = new Pack();
	assert.equal(pack.cards.length, 52, 'Pack has the correct number of cards');

});

QUnit.test('ENGINE', function(assert){
	assert.ok(BlackJack, 'Blackjack Engine is defined');
	var bj = new BlackJack();
	assert.equal(bj.calcHandValue([{value:2}, {value:2}, {value:3}]), 7, 'calcluate hand values without an ace');
	assert.equal(bj.calcHandValue([{value:1}, {value:2}, {value:3}]), 16, 'calculate hand values with an ace in');
	assert.equal(bj.calcHandValue([{value:1}, {value:10}, {value:3}]), 14, 'calculate hand values where high ace is bust');
	assert.equal(bj.calcHandValue([{value:11}, {value:12}, {value:13}]), 30, 'calculate hand values with picture cards');


});


var shuffleAlgs = {
	mine: function suffleAlg(array) {

		var copy = array.splice(0, array.length),
			i;

		for (i = copy.length; i > 0; i--) {
			var pos = Math.randomInt(0, i-1);
			array.push(copy.splice(pos, 1)[0]);
		}

		return array;
	},
	lodash: _.shuffle
};


/**
 * This section is to test the shuffle algorithm isn't biased.
 */

var resultsTally = {};

/**
 * Create a key for the shuffled array based on the order of the elements in it
 * @param array
 * @returns {*|string}
 */
var hashShuffeledArray = function(array) {
	return array.join(',');
};

/**
 * Ensure that the object has the correct attributes before setting the final value.
 * Will only set the value if the key does not exist
 * e.g. makeObjTree({}, ['foo','bar','baz'], true)
 * returns
 * {foo: {bar: {baz: true}}};
 * @param {object} rootObj - The object to modify
 * @param {[string]} branches - list of branch names to expect
 * @param {*} leafValue - the value to set to the final node
 * @returns {object} - Returns rootObj with the modified values.
 */
function makeObjTree(rootObj, branches, leafValue){
	_.each(branches, function(branchName, index){
		if (!rootObj.hasOwnProperty(branchName)) {
			rootObj[branchName] = index === branches.length-1 ? leafValue : {};
		}
		rootObj = rootObj[branchName];
	});

	return rootObj;
}

/**
 * Add one to the tally for the given key.
 * @param {string} arrayHash
 */
function addTally(algName, arrayLength, arrayHash) {
	makeObjTree(resultsTally, [algName, arrayLength, arrayHash], 0);
	resultsTally[algName][arrayLength][arrayHash] += 1;
}

function newArray(length) {
	var arr = [];
	while (arr.length < length) {
		arr[arr.length] = arr.length;
	}
	return arr;
}

QUnit.test('SHUFFLE BIAS', function (assert) {

	assert.expect(0);

	var start = 2, end = 5, iterations = 100000;

	_.each(shuffleAlgs, function(alg, algName){
		resultsTally[algName] = {};
		for (var arrayLength = start; arrayLength <= end; arrayLength++) {
			for (var i = 0; i < iterations; i++) {
				addTally(algName, arrayLength, hashShuffeledArray(alg(newArray(arrayLength))));
			}
		}

	});

	console.info('SHUFFLE RESULTS', resultsTally);
});