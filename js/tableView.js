/**
 * Created by Ian on 29/04/2015.
 */

$(document).ready(function() {
	"use strict";

	var bj;
	var bankerView;
	var playerViews = [];
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


	var PLAYER_STATE_TEXTS = {
		IN_PLAY: '',
		STUCK: '',
		BUST: 'BUST!',
		LOST: 'You Lose',
		WON: 'You Win'
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
		$('.playerInterface button').addClass('disabled').attr('disabled', true);
	});

	$(document).on('blackjack:playbanker', function(){
		bj.runBanker();
	});

	$(document).on('blackjack:bankerUpdated', function(){
		updateTableView();
	});

	function initTableView(){
		bj = new BlackJack();

		var playerTemplate = $('#playerTemplate').html().trim().replace(/\s{2,}/g, ' ');
		Mustache.parse(playerTemplate);

		bankerView = new PlayerView(bj.banker, playerTemplate, $('#bankerPosition'));
		playerViews.push(new PlayerView(bj.player, playerTemplate, $('#playerList li')));

		console.info('GAME VIEW:', bj, bankerView, playerViews);

		updateTableView();
	}

	function updateTableView(){
		bankerView.update();
		_.each(playerViews, function(pv){
			pv.update();
		});
	}

	var PlayerView = function (playerModel, template, $context) {
		this.template = template;
		this.model = playerModel;

		this.update = function () {
			var viewModel = _.cloneDeep(this.model);

			// Get view data about each card
			_.each(viewModel.hand, function(card){
				card.suitColor = SUIT_VIEWS[card.suit].color;
				card.suitSymbol = SUIT_VIEWS[card.suit].symbol;
				card.valueText = VALUE_NAMES[card.value] || card.value;
			});

			viewModel.stateText = PLAYER_STATE_TEXTS[viewModel.state];

			$context.html(Mustache.render(this.template, viewModel));
		};

		this.update();
	};

	initTableView();


});