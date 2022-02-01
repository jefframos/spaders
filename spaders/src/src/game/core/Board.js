import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import signals from 'signals';
import { debug } from 'webpack';
import config from '../../config';
import utils from '../../utils';
export default class Board {
	constructor(game) {

		window.LABEL_POOL = [];
		this.game = game;
		this.cards = [];
		this.allCards = [];
		this.resetBoard();

		window.board = this;

		this.totalCards = 0;
		this.newGameFinished = true;

		this.onDestroyCard = new signals();
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
		this.allCards = [];
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
		if (card) {

			this.allCards.push(card);
		}

		//console.log(card)
	}

	isPossibleShot(laneID) {
		if (laneID >= this.cards.length || laneID < 0) {
			return false;
		}
		if (!this.cards[laneID]) {
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

		TweenMax.to(card.cardContainer.scale, 0.2, { x: 1, y: 1 });
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
			}.bind(this), 200 / window.TIME_SCALE);
			return 200 + 300 * (cardsToDestroy.length + 1) / window.TIME_SCALE
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
		let areaAttacksCards = [];
		for (var i = 0; i < allZones.length; i++) {
			let actionPosId = {
				i: card.pos.i + allZones[i].dir.x,
				j: card.pos.j + allZones[i].dir.y
			}
			if (//(cardToIgnore.pos.i != card.pos.i && cardToIgnore.pos.j != card.pos.j )&&
				(actionPosId.i >= 0 && actionPosId.i < window.GRID.i) &&
				(actionPosId.j >= 0 && actionPosId.j < window.GRID.j)) {
				cardFound = this.cards[actionPosId.i][actionPosId.j];
				if (cardFound && !cardFound.dead) {//} && !cardFound.isCard) {
					// findCards = true;					
					//this.cards[actionPosId.i][actionPosId.j] = 0

					areaAttacksCards.push(cardFound)

					cardFound = null;
				}
			}
		}
		console.log("-------------------------")
		areaAttacksCards.forEach(element => {
			let cardGlobal = element.getGlobalPosition({ x: 0, y: 0 });
			cardGlobal.x += CARD.width / 2;
			cardGlobal.y += CARD.height / 2;
			let points = (areaAttacksCards.length + 1) * 10
			this.game.addPoints(points);
			this.game.fxContainer.addParticlesToScore(
				1,
				this.game.toLocal(cardGlobal),
				this.game.scoreRect,
				element.currentColor
			)
			////AREA ATTACK
			this.popLabel(this.game.toLocal(cardGlobal), "+" + points, 0.1, 0.5, 0.5, window.textStyles.areaAttack);
			//cardsToDestroy.push({cardFound:cardFound, currentCard: card, attackZone:zones[i]});
			this.attackCard(element, 1);
		});
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
			if (tempCardList[i] && tempCardList[i].startCrazyMood) {

				tempCardList[i].startCrazyMood();
				numCards--;
				this.addCrazyMoodParticles(tempCardList[i]);
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
			if (tempCardList[i] && tempCardList[i].startCrazyMood) {
				tempCardList[i].startCrazyMood();
				numCards--;

				this.addCrazyMoodParticles(tempCardList[i]);

			}
			if (numCards <= 0) {
				return
			}
		}
	}
	addCrazyMoodParticles(target, color = 0xFFFFFF) {
		let cardGlobal = target.getGlobalPosition({ x: 0, y: 0 });
		cardGlobal.x += target.width / 2 * this.game.cardsContainer.scale.x
		cardGlobal.y += target.height/ 2 * this.game.cardsContainer.scale.y
		this.game.fxContainer.addParticlesToScore(
			8,
			this.game.toLocal(cardGlobal),
			null,
			color,
			0.5
		)
	}
	destroyCards(list, card, autoDestroyCardData, hits) {
		let timeline = new TimelineLite();
		TweenMax.killTweensOf(card);
		for (var i = 0; i < list.length; i++) {
			//timeline.append(TweenMax.to(list[i].currentCard.getArrow(list[i].attackZone.label).scale, 0.1, {x:0, y:0}))

			timeline.append(TweenMax.to(list[i].cardFound, 0.3, {
				onStartParams: [list[i].currentCard.getArrow(list[i].attackZone.label), list[i].attackZone, (i + 1), list[i].cardFound],
				onStart: function (arrow, zone, id, cardFound) {
					if (arrow) {
						TweenMax.to(arrow.scale, 0.3, { x: 0, y: 0, ease: Back.easeIn })
						TweenMax.to(arrow.scale, 0.3, { delay: 0.3, x: 1, y: 1, ease: Back.easeOut })

						TweenMax.to(arrow, 0.05, { x: arrow.x + 10 * zone.dir.x, y: arrow.y + 10 * zone.dir.y, ease: Back.easeIn })
						TweenMax.to(arrow, 0.2, { delay: 0.2, x: arrow.x, y: arrow.y, ease: Back.easeIn })
						let arrowGlobal = arrow.getGlobalPosition({ x: 0, y: 0 });
						let screenPos = {
							x: arrowGlobal.x / config.width,
							y: arrowGlobal.y / config.height
						}


						//window.EFFECTS.addShockwave(screenPos.x, screenPos.y, 2);
						this.game.addPoints(10 * id);
						//normal attack
						this.popAttack(cardFound)

						this.game.fxContainer.addParticlesToScore(
							id,
							this.game.toLocal(arrowGlobal),
							this.game.scoreRect,
							cardFound.currentColor
						)

						this.popLabel(this.game.toLocal(arrowGlobal), "+" + 10 * id, 0, 1, 0.5 + id * 0.15, window.textStyles.normalAttack);

					}
				}.bind(this),
				onCompleteParams: [card, list[i].cardFound],
				onComplete: function (card, cardFound) {
					if (this.attackCard(cardFound, hits)) {
						let arrowGlobal2 = cardFound.getGlobalPosition({ x: 0, y: 0 });
						arrowGlobal2.x += 20;
						arrowGlobal2.y += 30;
						if (cardFound.crazyMood) {
							this.game.addPoints(100);

							this.game.fxContainer.addParticlesToScore(
								4,
								this.game.toLocal(arrowGlobal2),
								this.game.scoreRect,
								cardFound.currentColor
							)

							window.EFFECTS.shake(0.2, 5, 0.3, this.game.gameContainer);
							//explosion
							this.popLabel(this.game.toLocal(arrowGlobal2), "+" + 100, 0.25, 0.4, 0.8, window.textStyles.areaAttack, Elastic.easeOut);
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
			}.bind(this), list.length * 310 / window.TIME_SCALE);
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

				this.game.fxContainer.addParticlesToScore(
					3,
					this.game.toLocal(arrowGlobal),
					this.game.scoreRect,
					card.currentColor
				)


				this.addCrazyMoodParticles(card, autoDestroyCardData.card.currentColor)
				let spritePos = this.game.toLocal(arrowGlobal)
				spritePos.y -= CARD.height
				this.game.fxContainer.popSprite('./assets/images/finish/counter.png', spritePos, CARD.width * 2, autoDestroyCardData.card.currentColor)
				let style = window.textStyles.counter
				style.fill = autoDestroyCardData.card.currentColor
				this.popLabel(this.game.toLocal(arrowGlobal), "+" + 10 * counterHits, 0.2, 0, 0.3 + counterHits * 0.1, style);
				window.EFFECTS.shake(0.2, 5, 0.3, this.game.gameContainer);


			}.bind(this), list.length * 200 / window.TIME_SCALE);
		} else {
			card.convertCard();

		}


	}
	popAttack(card) {


		this.addCrazyMoodParticles(card)

		return;

		let cardGlobal = card.getGlobalPosition({ x: 0, y: 0 });
		let convertedPosition = this.game.toLocal(cardGlobal)
		let realRadius = CARD.width / 2 * this.game.gridContainer.scale.x;
		let external = new PIXI.Graphics().lineStyle(3, 0xFFFFFF).drawCircle(0, 0, realRadius);
		external.x = convertedPosition.x + realRadius;
		external.y = convertedPosition.y + realRadius;
		this.game.addChild(external);

		external.scale.set(0.5)
		TweenMax.to(external.scale, 0.2, {
			x: 1.5, y: 1.5, onComplete: () => {
				external.parent.removeChild(external);

			}
		})
	}
	popLabel(pos, label, delay = 0, dir = 1, scale = 1, style = {}, ease = Back.easeOut, time = 0.5) {
		//console.log(pos.x, pos.y);
		// let style = {
		// 	font: '32px',
		// 	fill: color,
		// 	align: 'center',
		// 	fontFamily: window.STANDARD_FONT1,
		// 	stroke: color == 0xFFFFFF ? 0x000000 : 0xFFFFFF,
		// 	strokeThickness: 6 * scale
		// }
		console.log(style)
		let tempLabel = null;
		if (window.LABEL_POOL.length > 0) {
			tempLabel = window.LABEL_POOL[0];
			window.LABEL_POOL.shift();
		} else {
			tempLabel = new PIXI.Text(label);
		}
		tempLabel.style = style;
		tempLabel.text = label;
		tempLabel.fill = style.color;

		this.game.addChild(tempLabel);
		tempLabel.x = pos.x;
		tempLabel.y = pos.y;
		tempLabel.pivot.x = tempLabel.width / 2;
		tempLabel.pivot.y = tempLabel.height / 2;
		tempLabel.alpha = 0;
		tempLabel.scale.set(0);
		TweenMax.to(tempLabel.scale, 0.5, { delay: delay, x: scale, y: scale, ease: ease })
		TweenMax.to(tempLabel, 1, {
			delay: delay, y: tempLabel.y - 50 * dir, onStartParams: [tempLabel], onStart: function (temp) {
				temp.alpha = 1;
				temp.parent.addChild(temp)
			}
		})
		TweenMax.to(tempLabel, time, {
			delay: time + delay, alpha: 0, onCompleteParams: [tempLabel], onComplete: function (temp) {
				temp.parent.removeChild(temp);
				window.LABEL_POOL.push(temp);
			}
		})
	}
	attackCard(card, hits) {
		// console.log(card);
		if (card.attacked && card.attacked(hits)) {

			this.onDestroyCard.dispatch(card);

			this.cards[card.pos.i][card.pos.j] = 0;

			for (let index = 0; index < this.allCards.length; index++) {
				const element = this.allCards[index];
				if (element.cardID == card.cardID) {
					this.allCards.splice(index, 1);
					break;
				}

			}
			card.destroy();
			card.convertCard();

			return true;
		}

	}
	updateAllCardsColors(color) {
		this.allCards.forEach(element => {
			element.forceNewColor(color)
		});
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
	getWhereWillStop(laneID) {
		let spaceID = -1
		for (var i = this.cards[laneID].length - 1; i >= 0; i--) {
			if (!this.cards[laneID][i]) {
				spaceID = i;
			} else {
				break;
			}
		}
		return spaceID
	}
	findBestShoot(card) {

		let ids = [];
		let canShoot = false;

		//finds out if needs to build a tower
		let isolated = this.findOneIsolated();

		if (isolated) {
			//console.log("FOUND ISOLATED", isolated.pos)
			if (this.isPossibleShot(isolated.pos.i - 1)) {
				if (this.getWhereWillStop(isolated.pos.i - 1) <= isolated.pos.j) {
					return isolated.pos.i - 1;
				}
			} else if (this.isPossibleShot(isolated.pos.i + 1)) {
				if (this.getWhereWillStop(isolated.pos.i + 1) <= isolated.pos.j) {
					return isolated.pos.i + 1;
				}
			}

		}

		for (let index = 0; index < GRID.i; index++) {
			if (!this.isPossibleShot(index)) {
				ids.push(-999999)
			} else {
				canShoot = true;
				ids.push(this.simulate(card, index))
			}
		}


		let max = -999;
		let idMax = -1

		for (let index = 0; index < ids.length; index++) {
			const element = ids[index];
			if (element > max) {
				max = element;
				idMax = index;
			}

		}
		//console.log(ids)
		if (!canShoot) {
			return -1
		} else {
			return idMax;
		}
	}
	findOneIsolated() {
		let offsets = [
			{ i: 0, j: -1 },
			{ i: -1, j: -1 },
			{ i: 1, j: -1 },
			{ i: 1, j: 0 },
			{ i: -1, j: 0 }
		]

		let noCard = false;
		let cards = []
		for (var i = this.cards.length - 1; i >= 0; i--) {
			for (var j = this.cards[i].length - 1; j > 2; j--) {
				let card = this.cards[i][j];
				let aroundData = { card: card, arounds: [] }
				if (card) {
					offsets.forEach(element => {
						let next = {
							i: i + element.i,
							j: j + element.j,
						}

						if (
							(next.i >= 0 && next.i < this.cards.length - 1) &&
							(next.j >= 0 && next.j < this.cards[i].length - 1)
						) {
							if (this.cards[next.i][next.j]) {
								aroundData.arounds.push(this.cards[next.i][next.j])
							}
						}
					});
					cards.push(aroundData);
				}
			}
		}

		let isolated = null;

		// for (let index = 0; index < cards.length; index++) {
		// 	const element = array[index];

		// }
		// for (let index = cards.length - 1; index >= 0; index--) {
		for (let index = 0; index < cards.length; index++) {
			const element = cards[index];
			if (element.arounds.length == 0) {
				isolated = element.card;
				console.log(isolated.pos)
				break
			}

		}

		return isolated
	}
	simulate(card, laneID) {
		let zones = card.zones;
		let findCards = false;
		let cardFound = null;
		let cardsToDestroy = [];

		let spaceID = -1;
		for (var i = this.cards[laneID].length - 1; i >= 0; i--) {
			if (!this.cards[laneID][i]) {
				spaceID = i;
			} else {
				break;
			}
		}

		let simulatedPosition = {
			i: laneID,
			j: spaceID
		}

		let value = - (simulatedPosition.j * 2);
		for (var i = 0; i < zones.length; i++) {
			let actionPosId = {
				i: simulatedPosition.i + zones[i].dir.x,
				j: simulatedPosition.j + zones[i].dir.y
			}
			if ((actionPosId.i >= 0 && actionPosId.i < window.GRID.i) &&
				(actionPosId.j >= 0 && actionPosId.j < window.GRID.j)) {
				cardFound = this.cards[actionPosId.i][actionPosId.j];
				if (cardFound && cardFound.isCard) {
					findCards = true;

					value += 50 - cardFound.life;

					let tempZone = cardFound.hasZone(this.getOpposite(zones[i].label));

					if (tempZone) {
						value += 150
					}
				}
			}
		}

		return value;

	}
}