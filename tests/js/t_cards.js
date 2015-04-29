/**
 * Created by Ian on 29/04/2015.
 */


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