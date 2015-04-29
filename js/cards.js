/*global _, $*/

/**
 * Created by Ian on 29/04/2015.
 */


/**
 * Utility class for a pack of cards
 * @constructor
 */
Pack = function(){
	var self = this;

	this.suits = ['hearts', 'clubs', 'diamonds', 'spades'];
	this.cards = [];
	this.discardPile = [];


	this.init = function(){
		_.each(self.suits, function(suit){
			for (var i=1; i<=13; i++) {
				self.cards.push(new Card(suit, i));
			}
		});
	};

	this.shuffle = function(){
		var copy = self.cards.splice(0, self.cards.length),
			i;

		for (i = copy.length; i > 0; i--) {
			var pos = Math.randomInt(0, i-1);
			self.cards.push(copy.splice(pos, 1)[0]);
		}
	};

	/**
	 * Adds the discard pile to the remaining deck and shuffles them together.
	 */
	this.reShuffle = function(){
		self.cards.concat(self.discardPile.splice(0, self.discardPile.length));
		self.shuffle();
	};

	this.deal = function(){
		if (self.cards.length == 0) {
			self.reShuffle();
		}

		return self.cards.pop();
	};

	this.discard = function(card){
		self.discardPile.push(card);
	};

	this.init();
	this.shuffle();
};

Card = function(suit, value) {
	this.suit = suit;
	this.value = value;
}

/**
 *
 * @param playerName {String} - to identify the player
 * @constructor
 */
Player = function(playerName){
	var self = this;
	this.name = playerName;
	this.hand = [];
	this.handValue = 0;
	this.score = 0;
};

/**
 * Blackjack game engin
 * @constructor
 */
BlackJack = function(){
	this.deck = null;
	this.banker = null;
	this.player = null;

	var GOAL = 21;

	this.init = function(){
		this.deck = new Pack();
		this.banker = new Player('Banker');
		this.player = new Player('Player 1');
	};

	/**
	 * Recursively add up the cards in the given hand.
	 * Fork on ace between adding 11 or 1 returning the highest value that hasn't bust
	 * @param hand {[]} - The array of cards to add up
	 * @param currVal (optional) {number} - value generated from the previous iterations.
	 * @returns {number}
	 */
	function handValue(hand, currVal){
		currVal = currVal || 0;
		var softValue = 0;
		var hardValue = 0;

		if (hand.length === 0) {
			return currVal;
		}

		if (hand[0].value === 1) {
			softValue = handValue(hand.slice(1, hand.length), currVal + 11);
			hardValue = handValue(hand.slice(1, hand.length), currVal + 1);
			return softValue > GOAL ? hardValue : softValue;
		}
		else if (hand[0].value >= 10) {
			return handValue(hand.slice(1, hand.length), currVal + 10);
		}
		else {
			return handValue(hand.slice(1, hand.length), currVal + hand[0].value);
		}

	};

	/**
	 * Public interface for handValue.
	 * @param hand
	 * @returns {number}
	 */
	this.calcHandValue = function(hand) {
		return handValue(hand);
	};

	this.isBust = function(value) {
		return value > GOAL;
	};

	this.isFiveCardTrick = function(hand, value){
		value = value || handValue(hand);
		return hand.length === 5 && !this.isBust(value);
	};

	this.init = function(){
		this.player.hand.push(this.deck.deal());
		this.player.hand.push(this.deck.deal());
		this.banker.hand.push(this.deck.deal());
	};

};




/**
 * Math.randomInt(high)
 * Math.randomInt(low, high)
 * Math.randomInt(low, high, interval)
 *
 * Returns a random intager in the range 0 -> high or low -> high inclusive.
 * if interval is defined then the return value will be
 * a multiple of the interval + low with a max value of high.
 */
Math.randomInt = function (low, high, interval){
	var out = 0;
	var num = Math.random();
	if (low !== undefined && high === undefined)
	{
		out = Math.round(num * low);
	}
	else if (low !== undefined && high !== undefined && interval === undefined)
	{
		out = Math.round(num * (high - low)) + low;
	}
	else if (low && high && interval)
	{
		var sub_high = (high - low) / interval;
		out = Math.round(num * sub_high);
		out = (out + low) * interval;
	}
	//log("Math.randomInt: low: "+low+", high: "+high+", interval: "+interval+", out: "+out);
	return out;
};
