/**
 * Created by Ian on 29/04/2015.
 */

$(document).ready(function() {
	"use strict";

	var bj;
	var bankerView;
	var playerView;
	Math.seedrandom();

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
		var handDom = '';
		_.each(hand, function (card) {
			handDom += '<li class="card">' + card.value + ' of ' + card.suit + '</li>';
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