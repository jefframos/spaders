import * as PIXI from 'pixi.js';
import { debug } from 'webpack';
import config from '../../config';
import utils from '../../utils';
export default class Board {
	constructor(game) {

		this.game = game;
		this.cards = [];
		this.resetBoard();

		window.board = this;

		this.totalCards = 0;
		this.newGameFinished = true;
	}
	startNewGame() {
		this.updateNumberOfEntities();
		this.newGameFinished = false;
	}
	updateNumberOfEntities() {
		this.totalCards = 0;
		this.cards.forEach(element => {
			element.forEach(card => {
				if (card && card.isCard) {
					this.totalCards++;
				}
			});
		});

	}
	resetBoard() {
		this.cards = [];
		for (var i = window.GRID.i - 1; i >= 0; i--) {
			let lane = [];
			for (var j = window.GRID.j - 1; j >= 0; j--) {
				lane.push(0);
			}
			this.cards.push(lane);
		}
		this.updateNumberOfEntities()
	}
	addCard(card) {
		this.cards[card.pos.i][card.pos.j] = card;
		//console.log(card)
	}

	isPossibleShot(laneID) {
		if (laneID >= this.cards.length || laneID < 0) {
			return false;
		}
		if(!this.cards[laneID]){
			return false;
		}
		for (var i = this.cards[laneID].length - 1; i >= 0; i--) {
			if (!this.cards[laneID][i]) {
				return true;
			}
			break;
		}
		return false;
	}

	shootCard(laneID, card) {
		card.cardContainer.scale.x = 0.5;
		card.cardContainer.scale.y = 1.5;

		TweenLite.to(card.cardContainer.scale, 0.2, { x: 1, y: 1 });
		let spaceID = -1;
		for (var i = this.cards[laneID].length - 1; i >= 0; i--) {
			if (!this.cards[laneID][i]) {
				spaceID = i;
			} else {
				break;
			}
		}
		if (spaceID >= 0) {
			card.pos.i = laneID;
			card.pos.j = spaceID;
			this.addCard(card);
			// setTimeout(function() {
			// console.log(card);
			return this.updateRound(card);
			// }.bind(this), 50);
		}
	}

	updateRound(card, crazyMood = false) {
		// crazyMood = false
		let zones = card.zones;
		let findCards = false;
		let cardFound = null;
		let cardsToDestroy = [];
		let autoDestroyCardData = null;
		let starterLife = card.life;
		for (var i = 0; i < zones.length; i++) {
			let actionPosId = {
				i: card.pos.i + zones[i].dir.x,
				j: card.pos.j + zones[i].dir.y
			}
			if ((actionPosId.i >= 0 && actionPosId.i < window.GRID.i) &&
				(actionPosId.j >= 0 && actionPosId.j < window.GRID.j)) {
				cardFound = this.cards[actionPosId.i][actionPosId.j];
				if (cardFound && cardFound.isCard) {
					findCards = true;

					let tempZone = cardFound.hasZone(this.getOpposite(zones[i].label));
					if (tempZone && !autoDestroyCardData && !crazyMood) {
						autoDestroyCardData = {
							card: card,
							zone: tempZone,
							hits: (cardFound.life + 1)
						}
					} else if (tempZone && autoDestroyCardData) {
						autoDestroyCardData.hits += (cardFound.life + 1);
					}
					cardsToDestroy.push({ cardFound: cardFound, currentCard: card, attackZone: zones[i] });
				}
			}
		}
		if (crazyMood) {
			autoDestroyCardData = null;
		}
		card.type = 0;
		if (!findCards) {
			card.type = 0;
			card.updateCard();
			return 100;
		} else {
			setTimeout(function () {
				this.destroyCards(cardsToDestroy, card, autoDestroyCardData, starterLife + 1);
			}.bind(this), 200);
			return 200 + 300 * (cardsToDestroy.length + 1)
		}

	}

	areaAttack(card, cardToIgnore) {
		let zones = card.zones;
		let cardFound = null;
		console.log("AREA ATTACK", zones);

		let allZones = [];
		ACTION_ZONES.forEach(element => {
			allZones.push(element);
		});
		for (var i = 0; i < allZones.length; i++) {
			let actionPosId = {
				i: card.pos.i + allZones[i].dir.x,
				j: card.pos.j + allZones[i].dir.y
			}
			if (//(cardToIgnore.pos.i != card.pos.i && cardToIgnore.pos.j != card.pos.j )&&
				(actionPosId.i >= 0 && actionPosId.i < window.GRID.i) &&
				(actionPosId.j >= 0 && actionPosId.j < window.GRID.j)) {
				cardFound = this.cards[actionPosId.i][actionPosId.j];
				if (cardFound && !cardFound.dead) {
					// findCards = true;					
					//this.cards[actionPosId.i][actionPosId.j] = 0

					let cardGlobal = cardFound.getGlobalPosition({ x: 0, y: 0 });
					cardGlobal.x += CARD.width / 2;
					cardGlobal.y += CARD.height / 2;
					this.game.addPoints(30);
					this.popLabel(this.game.toLocal(cardGlobal), "+" + 10 * 3, 0, 0.1, 1.25);
					//cardsToDestroy.push({cardFound:cardFound, currentCard: card, attackZone:zones[i]});
					this.attackCard(cardFound, 1);
					cardFound = null;
				}
			}
		}
	}

	addCrazyCards2(numCards, cardToIgnore) {
		let tempCardList = [];
		for (var i = 0; i < this.cards.length; i++) {
			for (var j = 0; j < this.cards[i].length; j++) {
				if (this.cards[i][j] && !this.cards[i][j].crazyMood && cardToIgnore != this.cards[i][j]) {
					tempCardList.push(this.cards[i][j]);
				}
			}
		}
		//utils.shuffle(tempCardList);
		for (var i = 0; i < tempCardList.length; i++) {
			if(tempCardList[i] && tempCardList[i].startCrazyMood){

				tempCardList[i].startCrazyMood();
				numCards--;
			}
			if (numCards <= 0) {
				return
			}
		}
	}

	addCrazyCards(numCards, cardToIgnore) {
		let tempCardList = [];
		for (var i = 0; i < this.cards.length; i++) {
			for (var j = 0; j < this.cards[i].length; j++) {
				if (this.cards[i][j] && !this.cards[i][j].crazyMood && cardToIgnore != this.cards[i][j]) {
					tempCardList.push(this.cards[i][j]);
				}
			}
		}
		utils.shuffle(tempCardList);
		for (var i = 0; i < tempCardList.length; i++) {
			if(tempCardList[i] && tempCardList[i].startCrazyMood){
			tempCardList[i].startCrazyMood();
			numCards--;
			}
			if (numCards <= 0) {
				return
			}
		}
	}

	destroyCards(list, card, autoDestroyCardData, hits) {
		let timeline = new TimelineLite();
		TweenLite.killTweensOf(card);
		for (var i = 0; i < list.length; i++) {
			//timeline.append(TweenLite.to(list[i].currentCard.getArrow(list[i].attackZone.label).scale, 0.1, {x:0, y:0}))

			timeline.append(TweenLite.to(list[i].cardFound, 0.3, {
				onStartParams: [list[i].currentCard.getArrow(list[i].attackZone.label), list[i].attackZone, (i + 1)],
				onStart: function (arrow, zone, id) {
					TweenLite.to(arrow.scale, 0.3, { x: 0, y: 0, ease: Back.easeIn })
					TweenLite.to(arrow.scale, 0.3, { delay: 0.3, x: 1, y: 1, ease: Back.easeOut })

					TweenLite.to(arrow, 0.05, { x: arrow.x + 10 * zone.dir.x, y: arrow.y + 10 * zone.dir.y, ease: Back.easeIn })
					TweenLite.to(arrow, 0.2, { delay: 0.2, x: arrow.x, y: arrow.y, ease: Back.easeIn })
					let arrowGlobal = arrow.getGlobalPosition({ x: 0, y: 0 });
					let screenPos = {
						x: arrowGlobal.x / config.width,
						y: arrowGlobal.y / config.height
					}
					window.EFFECTS.addShockwave(screenPos.x, screenPos.y, 2);
					this.game.addPoints(10 * id);
					this.popLabel(this.game.toLocal(arrowGlobal), "+" + 10 * id, 0, 1, 1 + id * 0.15);
					window.EFFECTS.shakeSplitter(0.2, 3, 0.5);
				}.bind(this),
				onCompleteParams: [card, list[i].cardFound],
				onComplete: function (card, cardFound) {
					if (this.attackCard(cardFound, hits)) {
						let arrowGlobal2 = cardFound.getGlobalPosition({ x: 0, y: 0 });
						arrowGlobal2.x += 20;
						arrowGlobal2.y += 30;
						if (cardFound.crazyMood) {
							this.game.addPoints(100);
							this.popLabel(this.game.toLocal(arrowGlobal2), "+" + 100, 0.45, 0, 2, 0xE2C756, Elastic.easeOut);
							this.areaAttack(cardFound, card);
						}
						
					}
					
				}.bind(this)
			}));

		}
		let totalHits = list.length + (autoDestroyCardData ? 1 : 0);
		if (totalHits > 3) {
			setTimeout(function () {
				this.addCrazyCards(totalHits - 3, card);
			}.bind(this), list.length * 310);
		}

		

		if (autoDestroyCardData) {
			setTimeout(function () {
				let arrow = autoDestroyCardData.card.getArrow(this.getOpposite(autoDestroyCardData.zone.label));
				if (!arrow) {
					return;
				}
				let arrowGlobal = arrow.getGlobalPosition({ x: 0, y: 0 });
				this.delayedDestroy(card, autoDestroyCardData.hits);

				let counterHits = (list.length + 1);
				this.game.addPoints(10 * counterHits);

				this.popLabel(this.game.toLocal(arrowGlobal), "+" + 10 * counterHits + "\nCOUNTER", 0.2, 0, 1 + counterHits * 0.1, 0xD81639);
				// this.popLabel(arrowGlobal,10 * counterHits , 0.1, -0.5, 1 + counterHits * 0.15);
				

			}.bind(this), list.length * 200);
		} else {
			card.convertCard();
			
		}

		
	}
	popLabel(pos, label, delay = 0, dir = 1, scale = 1, color = 0xFFFFFF, ease = Back.easeOut) {
		//console.log(pos.x, pos.y);
		let tempLabel = new PIXI.Text(label, { font: '20px', fill: color, align: 'center', fontFamily:'round_popregular' });
		this.game.addChild(tempLabel);
		tempLabel.x = pos.x;
		tempLabel.y = pos.y;
		tempLabel.pivot.x = tempLabel.width / 2;
		tempLabel.pivot.y = tempLabel.height / 2;
		tempLabel.alpha = 0;
		tempLabel.scale.set(0);
		TweenLite.to(tempLabel.scale, 0.5, { delay: delay, x: scale, y: scale, ease: ease })
		TweenLite.to(tempLabel, 1, {
			delay: delay, y: tempLabel.y - 50 * dir, onStartParams: [tempLabel], onStart: function (temp) {
				temp.alpha = 1;
			}
		})
		TweenLite.to(tempLabel, 0.5, {
			delay: 0.5 + delay, alpha: 0, onCompleteParams: [tempLabel], onComplete: function (temp) {
				temp.parent.removeChild(temp);
			}
		})
	}
	attackCard(card, hits) {
		// console.log(card);
		if (card.attacked && card.attacked(hits)) {
			this.cards[card.pos.i][card.pos.j] = 0;
			card.destroy();
			card.convertCard();
			
			return true;
		}
		
	}
	delayedDestroy(card, hits) {
		this.attackCard(card, hits);
		
	}
	getOpposite(zone) {
		let id = 0;
		for (var i = ACTION_ZONES.length - 1; i >= 0; i--) {
			if (ACTION_ZONES[i].label == zone) {
				id = i;
				break;
			}
		}
		let opposit = ACTION_ZONES[(id + ACTION_ZONES.length / 2) % ACTION_ZONES.length].label;
		return opposit;
	}

	update(delta) {
		for (var i = 0; i < this.cards.length; i++) {
			for (var j = 0; j < this.cards[i].length; j++) {
				if (this.cards[i][j] && this.cards[i][j].update) {
					this.cards[i][j].update(delta);
				}
			}
		}


		this.updateNumberOfEntities();
	}
	destroyBoard() {
		for (var i = 0; i < this.cards.length; i++) {
			for (var j = 0; j < this.cards[i].length; j++) {
				if (this.cards[i][j]) {
					this.cards[i][j].forceDestroy();
				}
			}
		}
	}
	debugBoard2() {
		for (var i = 0; i < this.cards.length; i++) {
			let str = (i + 1) + '---  ';
			for (var j = 0; j < this.cards[i].length; j++) {
				str += (this.cards[i][j] || "0") + ' - ';
			}
			console.log(str);
		}
	}

	debugBoard() {
		for (var i = this.cards.length - 1; i >= 0; i--) {
			let str = (i + 1) + '---  ';
			for (var j = 0; j < this.cards[i].length; j++) {
				str += (this.cards[i][j] || "0") + ' - ';
			}
			console.log(str);
		}
	}
	// moveCardDown(card){
	// 	this.cards[card.pos.i][card.pos.j] = 0;
	// 	card.pos.j ++;
	// 	if(card.pos.j >= GRID.j){
	// 		card.destroy();
	// 		//GAME OVER AQUI
	// 		return;
	// 	}
	// 	this.addCard(card);
	// 	card.move({
	// 		x: card.pos.i * CARD.width,
	// 		y: card.pos.j * CARD.height
	// 	}, 0.2, 0.5);
	// }
	updateCardsCounter(value, card) {
		let cardsToMove = [];
		for (var i = 0; i < this.cards.length; i++) {
			for (var j = 0; j < this.cards[i].length; j++) {
				if (this.cards[i][j]) {
					let tcard = this.cards[i][j].updateCounter(value);
					if (tcard) {
						//console.log(tcard);
						cardsToMove.push(tcard)
					}
				}
			}
		}
		// console.log(cardsToMove);
		let moveDownList = [];

		for (var i = 0; i < cardsToMove.length; i++) {
			let id = cardsToMove[i].pos.i;
			for (var j = cardsToMove[i].pos.j; j < GRID.j; j++) {
				let tempCard = this.cards[id][j];
				if (tempCard) {
					let canAdd = true;
					for (var k = 0; k < moveDownList.length; k++) {
						if ((moveDownList[k].pos.i == tempCard.pos.i) && (moveDownList[k].pos.j == tempCard.pos.j)) {
							canAdd = false;
							break;
						}
					}
					if (canAdd) {
						moveDownList.push(tempCard);
					}
				}
			}
		}
		for (var i = moveDownList.length - 1; i >= 0; i--) {
			this.moveCardDown(moveDownList[i]);
		}
		console.log(moveDownList);
	}
}