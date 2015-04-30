/**
 * Created by Ian on 29/04/2015.
 */

$(document).ready(function() {
	"use strict";

	var bj;
	var bankerView;
	var playerView;
	Math.seedrandom();

	var SUIT_VIEWS = {
		'spades' : {color: 'black', symbol: '♠'},
		'hearts' : {color: 'red', symbol: '♥'},
		'diamonds' : {color: 'red', symbol: '♦'},
		'clubs' : {color: 'black', symbol: '♣'}
	};
	var VALUE_NAMES = {
		1: 'A',
		11: 'J',
		12: 'Q',
		13: 'K'
	};

	$('.hitButton').on('click', function(){
		if ($(this).hasClass('disabled')) {
			return;
		}
		bj.dealTo(bj.player);
		if (bj.player.state === PLAYER_STATES.BUST) {
			$(document).trigger('blackjack:disablePlayer');
			$(document).trigger('blackjack:playbanker');
			bj.updateGameState();
		}
		updateTableView();

	});

	$('.stickButton').on('click', function(){
		bj.playerSticks(bj.player);
		$(document).trigger('blackjack:disablePlayer');
		$(document).trigger('blackjack:playbanker');
	});

	$(document).on('blackjack:disablePlayer', function(){
		$('.interface button').addClass('disabled').attr('disabled', true);
	});

	$(document).on('blackjack:playbanker', function(){
		bj.runBanker();
	});

	$(document).on('blackjack:bankerUpdated', function(){
		updateTableView();
	});

	function initTableView(){
		bj = new BlackJack();
		bankerView = new PlayerView(bj.banker, 'playerBanker');
		playerView = new PlayerView(bj.player, 'player1');

		console.info('GAME VIEW:', bj, bankerView, playerView);

		updateTableView();
	}

	function updateTableView(){
		bankerView.update();
		playerView.update();
	}

	var generateHandView = function (hand) {
		var handDom = '',
			suitColor, suitSymbol, valueText;
		_.each(hand, function (card) {
			suitColor = SUIT_VIEWS[card.suit].color;
			suitSymbol = SUIT_VIEWS[card.suit].symbol;
			valueText = VALUE_NAMES[card.value] || card.value;
			handDom += '<li class="card ' + suitColor + '"><span class="cardTop">' + valueText + suitSymbol + '</span>';
			handDom += '<span class="cardBottom">' + valueText + suitSymbol + '</span></li>';
		});

		console.info('HAND DOM:', handDom);
		return handDom;
	};

	var PlayerView = function (playerModel, templateID) {
		var $view = $('#' + templateID);
		this.model = playerModel;

		this.update = function () {
			$view.find('.playerName').html(this.model.name);
			$view.find('.playerHand').html(generateHandView(this.model.hand));
			$view.find('.handValue').html(this.model.handValue);

			if (this.model.state === PLAYER_STATES.BUST) {
				$view.find('.playerState').html('BUST');
			}
			else if (this.model.state === PLAYER_STATES.WON) {
				$view.find('.playerState').html('Winner!');
			}
			else if (this.model.state === PLAYER_STATES.LOST) {
				$view.find('.playerState').html('You Lost!');
			}
			else {
				$view.find('.playerState').html('');
			}

		};
	};

	initTableView();


});