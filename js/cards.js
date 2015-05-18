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
		self.cards = _.shuffle(self.cards);
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
};


PLAYER_STATES = {
	IN_PLAY: 0,
	STUCK: 1,
	BUST: 2,
	LOST: 3,
	WON: 4
};

/**
 *
 * @param playerName {String} - to identify the player
 * @constructor
 */
Player = function(playerName){
	this.name = playerName;
	this.hand = [];
	this.handValue = 0;
	this.state = PLAYER_STATES.IN_PLAY; // @see PLAYER_STATES
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
	var self = this;

	this.init = function(){
		this.deck = new Pack();
		this.banker = new Player('Banker');
		this.player = new Player('Player 1');

		this.player.hand.push(this.deck.deal());
		this.player.hand.push(this.deck.deal());
		this.player.handValue = this.calcHandValue(this.player.hand);

		this.banker.hand.push(this.deck.deal());
		this.banker.handValue = this.calcHandValue(this.banker.hand);
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

	}

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

	/**
	 *
	 * @param hand
	 * @param value
	 * @returns {boolean}
	 */
	this.isFiveCardTrick = function(hand, value){
		value = value || handValue(hand);
		return hand.length === 5 && !this.isBust(value);
	};

	this.updatePlayerState = function(playerModel){
		var value = playerModel.handValue = this.calcHandValue(playerModel.hand);
		if (value > GOAL) {
			playerModel.state = PLAYER_STATES.BUST;
		}
	};

	this.updateGameState = function() {
		if (self.player.state === PLAYER_STATES.IN_PLAY || self.banker.state === PLAYER_STATES.IN_PLAY) {
			return;
		}

		if (self.player.state === PLAYER_STATES.BUST) {
			self.banker.state = PLAYER_STATES.WON;
		}
		else if (self.banker.state === PLAYER_STATES.BUST) {
			self.player.state = PLAYER_STATES.WON;
		}
		else if (self.player.handValue > self.banker.handValue) {
			self.player.state = PLAYER_STATES.WON;
			self.banker.state = PLAYER_STATES.LOST;
		}
		else {
			self.banker.state = PLAYER_STATES.WON;
			self.player.state = PLAYER_STATES.LOST;
		}
	};

	this.dealTo = function(playerModel){
		playerModel.hand.push(this.deck.deal());
		this.updatePlayerState(playerModel);

	};

	this.playerSticks = function (playerModel) {
		playerModel.state = PLAYER_STATES.STUCK;
	};

	this.runBanker = function(){
		console.info('run banker');

		if (this.banker.state !== PLAYER_STATES.IN_PLAY) {
			console.info('banker not in play');
			this.updateGameState();
			return;
		}
		if (this.player.state === PLAYER_STATES.BUST) {
			this.playerSticks(this.banker);
		}
		else if (this.banker.handValue < this.player.handValue) {
			console.info('banker twists', this.banker.value, this.player.value);
			this.dealTo(this.banker);
		}
		else {
			this.playerSticks(this.banker);
			console.info('banker sticks');
		}

		this.updateGameState();
		$(document).trigger('blackjack:bankerUpdated');

		if (this.banker.state === PLAYER_STATES.IN_PLAY) {
			setTimeout(function(){
				self.runBanker()
			}, 1000);
		}
	};




	this.init();

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


