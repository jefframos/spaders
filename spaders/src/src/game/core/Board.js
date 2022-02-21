import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import signals from 'signals';
import { debug } from 'webpack';
import colorSchemes from '../../colorSchemes';
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
		this.OnStartNextRound = new signals();
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
	firstLineShots() {

		let availableSpaces = 0
		for (let index = 0; index < this.cards.length; index++) {
			const line = this.cards[index];

			if (!line[line.length - 1]) {
				availableSpaces++
			}

		}
		let firstLineShots = 0
		if (availableSpaces <= 1) {
			for (let index = 0; index < this.cards.length; index++) {
				const line = this.cards[index];

				if (!line[line.length - 1] && line[line.length - 2]) {
					firstLineShots++
				}

			}
			//console.log('firstLineShots', firstLineShots)
		}

		return firstLineShots
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
		this.isFinalState = false;
		this.updateNumberOfEntities()
	}

	setFinalState() {
		//console.log("FINAL STATE")
		//utils.shuffle(this.allCards);
		//let tm = 1000 / this.allCards.length;
		this.isFinalState = true;

		let movers = 0;
		for (var i = 0; i < this.allCards.length; i++) {
			if (this.allCards[i] && this.allCards[i].isBlock) {
				this.allCards[i].forceDestroy();
				this.cards[this.allCards[i].pos.i][this.allCards[i].pos.j] = 0;
			}
		}
		for (var i = 0; i < this.allCards.length; i++) {
			if (this.allCards[i] && this.allCards[i].startCrazyMood) {
				if (this.allCards[i]) {
					this.allCards[i].setZeroLife();
					this.allCards[i].startCrazyMood();
					this.addCrazyMoodParticles(this.allCards[i]);

					let card = this.allCards[i];
					if (card.pos.j > 0) {

						for (let totalMoves = card.pos.j; totalMoves >= 0; totalMoves--) {
							if (!this.cards[card.pos.i][card.pos.j - totalMoves]) {
								this.cards[card.pos.i][card.pos.j] = 0;
								card.pos.j-= totalMoves;
								this.addCard(card);
								card.moveAndGoCrazy({
									x: card.pos.i * CARD.width,
									y: card.pos.j * CARD.height
								}, 0.05 * movers + 0.2);
								movers ++;
								break;
							}
							
							// if (!this.cards[card.pos.i][card.pos.j - 1]) {
								
							// }
						}
					}
					
				}
			}
		}
	}
	addCard(card) {
		this.cards[card.pos.i][card.pos.j] = card;
		if (card) {

			this.allCards.push(card);
		}

		////console.log(card)
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
	nextRound() {
		if (this.canGoNext) {
			this.OnStartNextRound.dispatch();
			this.canGoNext = false;
		}
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
			// //console.log(card);

			window.SOUND_MANAGER.play('place', { volume: 0.5, speed: 0.7 + Math.random() * 0.3 })
			return this.updateRound(card);
			// }.bind(this), 50);
		}
	}

	updateRound(card, crazyMood = false) {
		// crazyMood = false
		this.canGoNext = true;
		this.chainTimer = 0;
		this.explosionChain = []
		this.explosionAreaChain = []
		let zones = card.zones;
		let findCards = false;
		let cardFound = null;
		let cardsToDestroy = [];
		let autoDestroyCardData = null;
		let starterLife = card.life;

		let tempBombDelay = 0;
		if (card.isBomb) {
			setTimeout(() => {
				this.areaAttack(card)
				this.attackCard(card, 1000);

				//on forced bomb
				setTimeout(() => {
					this.nextRound();
				}, 300);
			}, 300);
			return 1000 / window.TIME_SCALE
		}
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
					if (cardFound.crazyMood) {
						tempBombDelay += 500;
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

			if (this.isFinalState) {
				this.setCardToCrazy(card.pos.i, card.pos.j, 100);
			}
			//when nothing happens
			console.log("nothi explode", tempBombDelay)
			setTimeout(() => {
				this.nextRound();
			}, 300 + tempBombDelay);
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
		////console.log("AREA ATTACK", zones);

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
				if (cardFound && !cardFound.dead && !this.explosionAreaChain.includes(cardFound)) {//} && !cardFound.isCard) {
					// findCards = true;					
					//this.cards[actionPosId.i][actionPosId.j] = 0
					this.explosionAreaChain.push(cardFound);
					areaAttacksCards.push(cardFound)

					cardFound = null;
				}
			}

		}

		if (areaAttacksCards.length > 0) {
			window.SOUND_MANAGER.play('kill')
			setTimeout(() => {
				window.SOUND_MANAGER.play('explosion', { singleInstance: true })
			}, 100 + this.chainTimer);
		}
		for (let index = 0; index < areaAttacksCards.length; index++) {
			const element = areaAttacksCards[index];

			let cardGlobal = element.getGlobalPosition({ x: 0, y: 0 });
			cardGlobal.x += CARD.width / 2;
			cardGlobal.y += CARD.height / 2;
			setTimeout(() => {



				let points = (areaAttacksCards.length + 1) * 10
				this.game.addPoints(points);

				this.playDelayedCoins(1);
				this.game.fxContainer.addParticlesToScore(
					1,
					this.game.toLocal(cardGlobal),
					this.game.scoreRect,
					element.currentColor
				)
				
				let style = window.getStyle('areaAttack', colorSchemes.colorSchemes[window.COOKIE_MANAGER.stats.colorPalletID].list[4].color)

				this.popLabel(this.game.toLocal(cardGlobal), "+" + points, 0.1, 0.5, 0.5, style);
				//cardsToDestroy.push({cardFound:cardFound, currentCard: card, attackZone:zones[i]});

				let globalPosTemp = element.getGlobalPosition({ x: 0, y: 0 })

				if (card.isBomb) {
					this.attackCard(element, 100);
				} else {
					this.attackCard(element, 1);
				}

				if (element.dead && element.crazyMood) {
					setTimeout(() => {
						this.explodeCard(element, globalPosTemp)

						//console.log('-', this.explosionAreaChain)
					}, 100 * areaAttacksCards[index] * 100 + this.chainTimer);
				}
			}, 100 * index);
		}

	}

	setCardToCrazy(i, j, timeout) {
		setTimeout(() => {
			if (this.cards[i][j] && this.cards[i][j].startCrazyMood) {
				this.cards[i][j].startCrazyMood();
				this.addCrazyMoodParticles(this.cards[i][j]);
			}
		}, timeout);
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
	addCrazyCards3(numCards, cardToIgnore) {
		let tempCardList = [];
		for (var i = 0; i < this.cards.length; i++) {
			for (var j = 0; j < this.cards[i].length; j++) {
				if (this.cards[i][j] && !this.cards[i][j].crazyMood && cardToIgnore != this.cards[i][j]) {
					if (this.cards[i][j].life < 1) {
						tempCardList.push(this.cards[i][j]);
					}
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

		window.SOUND_MANAGER.play('revealSpecial', { volume: 0.5, speed: 0.9 })
		window.COOKIE_MANAGER.addCombo();

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
		let cardGlobal = target.enemySprite.getGlobalPosition({ x: 0, y: 0 });
		this.game.fxContainer.addParticlesToScore(
			8,
			this.game.toLocal(cardGlobal),
			null,
			color,
			0.5
		)
	}
	explodeCard(cardFound, customPosition) {
		if (this.explosionChain.includes(cardFound)) {
			return;
		}

		let cardGlobal = customPosition ? customPosition : cardFound.getGlobalPosition({ x: 0, y: 0 });
		cardGlobal.x += 20;
		cardGlobal.y += 30;
		//this.game.addPoints(100);
		console.log("PLAY EXPLOSION")
		window.COOKIE_MANAGER.addExplosion();
		this.playDelayedCoins(4);
		this.game.fxContainer.addParticlesToScore(
			4,
			this.game.toLocal(cardGlobal),
			this.game.scoreRect,
			cardFound.currentColor
		)
		this.addCrazyMoodParticles(cardFound, cardFound.currentColor);

		window.EFFECTS.shake(0.2, 5, 0.3, this.game.gameContainer);
		//explosion
		//this.popLabel(this.game.toLocal(cardGlobal), "+" + 100, 0.25, 0.4, 0.8, window.textStyles.explosion, Elastic.easeOut);

		this.areaAttack(cardFound);

		console.log(this.chainTimer)

		this.explosionChain.push(cardFound)

		this.chainTimer += 300;
	}
	destroyAllCards() {
		for (let index = this.allCards.length - 1; index >= 0 ; index--) {
			const element = this.allCards[index];
			this.attackCard(element, 1000);
		}
	}
	destroyCards(list, card, autoDestroyCardData, hits) {
		let timeline = new TimelineLite();
		TweenMax.killTweensOf(card);
		TweenMax.killTweensOf(card.position);
		TweenMax.killTweensOf(card.scale);
		this.playDelayedCoins(list.length);

		let hasExplosionTime = 0;
		for (var i = 0; i < list.length; i++) {

			if (list[i].cardFound.crazyMood) {
				hasExplosionTime = 1000;
			}

			//timeline.append(TweenMax.to(list[i].currentCard.getArrow(list[i].attackZone.label).scale, 0.1, {x:0, y:0}))
			timeline.append(TweenMax.to(list[i].cardFound, 0.3, {
				onStartParams: [list[i].currentCard.getArrow(list[i].attackZone.label), list[i].attackZone, (i + 1), list[i].cardFound],
				onStart: function (arrow, zone, id, cardFound) {
					if (arrow) {

						let arrowGlobal = arrow.getGlobalPosition({ x: 0, y: 0 });

						//this.popCircle(arrowGlobal);

						arrow.tint = card.currentColor;

						TweenMax.to(arrow.scale, 0.3, { x: 0, y: 0, ease: Back.easeIn })
						TweenMax.to(arrow.scale, 0.3, { delay: 0.3, x: 1, y: 1, ease: Back.easeOut, onStart:()=>{


						} })

						TweenMax.to(arrow, 0.05, { x: arrow.x + 10 * zone.dir.x, y: arrow.y + 10 * zone.dir.y,
							ease: Back.easeIn, onComplete:()=>{
								let arrowGlobal2 = arrow.getGlobalPosition({ x: 0, y: 0 });

								this.popCircle(arrowGlobal2, card.currentColor);
		

							} })
						TweenMax.to(arrow, 0.2, { delay: 0.2, x: arrow.x, y: arrow.y, ease: Back.easeIn, onComplete:()=>{
							arrow.tint = 0xFFFFFF;
						} })
						let screenPos = {
							x: arrowGlobal.x / config.width,
							y: arrowGlobal.y / config.height
						}


						//window.EFFECTS.addShockwave(screenPos.x, screenPos.y, 2);
						this.game.addPoints(10 * id);
						window.SOUND_MANAGER.play('pop', { speed: Math.random() * 0.075 + 0.925 + 0.2 * id })
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
						if (cardFound.crazyMood) {
							setTimeout(() => {

								this.explodeCard(cardFound);
							}, this.chainTimer);
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

				window.SOUND_MANAGER.play('pop2', { speed: Math.random() * 0.075 + 0.925 })

				this.playDelayedCoins(3);

				this.game.fxContainer.addParticlesToScore(
					3,
					this.game.toLocal(arrowGlobal),
					this.game.scoreRect,
					card.currentColor
				)


				this.addCrazyMoodParticles(card, autoDestroyCardData.card.currentColor)
				let spritePos = this.game.toLocal(arrowGlobal)
				spritePos.y -= CARD.height
				this.game.fxContainer.popSprite('counter.png', spritePos, CARD.width * 2, autoDestroyCardData.card.currentColor)
				let style = window.textStyles.counter
				
				style.fill = autoDestroyCardData.card.currentColor
				this.popLabel(this.game.toLocal(arrowGlobal), "+" + 10 * counterHits, 0.2, 0, 0.3 + counterHits * 0.1, style);
				window.EFFECTS.shake(0.2, 5, 0.3, this.game.gameContainer);

				//when has an attack
				console.log("when has explosion 2", hasExplosionTime)
				setTimeout(() => {
					this.nextRound();
				}, list.length * 200 / window.TIME_SCALE);


			}.bind(this), list.length * 200 / window.TIME_SCALE);
		} else {
			card.convertCard();

			console.log("when has explosion old", hasExplosionTime)
			setTimeout(() => {
				this.nextRound();
			}, hasExplosionTime / window.TIME_SCALE);

		}


	}

	playDelayedCoins(total) {
		for (let index = 0; index < total; index++) {
			setTimeout(() => {

				window.SOUND_MANAGER.play('coin', { volume: 0.1, speed: 1 + 0.1 * index })
			}, 80 * index + 50);

		}
	}
	popCircle(pos, color = 0xFFFFFF){
		let convertedPosition = this.game.toLocal(pos)
		let realRadius = CARD.width / 2 * this.game.gridContainer.scale.x * 0.25;
		let external = new PIXI.Graphics().lineStyle(3, color).drawCircle(0, 0, realRadius);
		external.x = convertedPosition.x;
		external.y = convertedPosition.y;
		this.game.addChild(external);

		external.scale.set(0.5)
		TweenMax.to(external.scale, 0.2, {
			x: 1.5, y: 1.5, onComplete: () => {
				external.parent.removeChild(external);

			}
		})
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
		// //console.log(card);
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
			//console.log(str);
		}
	}

	debugBoard() {
		for (var i = this.cards.length - 1; i >= 0; i--) {
			let str = (i + 1) + '---  ';
			for (var j = 0; j < this.cards[i].length; j++) {
				str += (this.cards[i][j] || "0") + ' - ';
			}
			//console.log(str);
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
						////console.log(tcard);
						cardsToMove.push(tcard)
					}
				}
			}
		}
		// //console.log(cardsToMove);
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
		//console.log(moveDownList);
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
			////console.log("FOUND ISOLATED", isolated.pos)
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
		////console.log(ids)
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
				//console.log(isolated.pos)
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