import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import colorSchemes from '../../colorSchemes';
import config from '../../config';
import utils from '../../utils';
import ParticleSystem from '../effects/ParticleSystem';
import Spring from '../effects/Spring';
export default class Card extends PIXI.Container {
	constructor(game) {
		super();
		window.CARD_ID++;
		this.cardID = window.CARD_ID;
		window.CARD_NUMBER++;
		this.isCard = true;
		this.game = game;
		this.zones = [];
		this.arrows = [];
		this.pos = { i: -1, j: -1 };
		this.type = 0;
		this.MAX_COUNTER = 10;
		this.life = 2;
		this.cardNumber = CARD_NUMBER;

		this.realSpriteWidth = 72 * 2;
		this.scaleRef = 0.7;

		let card = new PIXI.Container();
		this.counter = this.MAX_COUNTER;

		this.horizontalSpring = new Spring();
		this.targetY = 0;
		// let gridEffectSquare = PIXI.Sprite.fromImage('./assets/images/largeCard.png')
		// 		gridEffectSquare.scale.set(CARD.width / gridEffectSquare.width);

		this.cardForeground = new PIXI.mesh.NineSlicePlane(
			PIXI.Texture.fromFrame('largeCardBackPixel.png'), 20, 20, 20, 20)//new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(0, 0, CARD.width, CARD.height, 0);
		this.circleBackground = new PIXI.Graphics().beginFill(0xFFFFFF).drawCircle(0, 0, CARD.width / 2);
		this.cardBack3 = PIXI.Sprite.fromFrame('base.png');
		this.enemySprite = PIXI.Sprite.fromFrame('l0_spader_1_1.png');
		this.enemySpriteWhite = PIXI.Sprite.fromFrame('l0_spader_1_1.png');
		this.cardStats = new PIXI.Sprite();
		this.cardBlocks = new PIXI.Sprite();
		this.enemySpriteWhite.visible = false;
		this.enemySprite.addChild(this.enemySpriteWhite);
		this.enemySprite.scale.set(this.realSpriteWidth / this.enemySprite.width * this.scaleRef)
		this.enemySprite.anchor.set(0.5, 0.85);
		this.cardBack3.anchor.set(0.5, 0.85);

		this.cardForeground.alpha = 1;
		this.circleBackground.alpha = 0;

		this.enemySprite.x = CARD.width / 2;
		this.enemySprite.y = CARD.height * 0.65;

		this.circleBackground.x = CARD.width / 2;
		this.circleBackground.y = CARD.height / 2;

		let cardContainer = new PIXI.Container();
		this.cardActions = new PIXI.Container();
		card.addChild(cardContainer);
		cardContainer.addChild(this.circleBackground);
		cardContainer.addChild(this.cardBack3);
		cardContainer.addChild(this.cardActions);
		cardContainer.addChild(this.enemySprite);
		cardContainer.addChild(this.cardStats);
		cardContainer.addChild(this.cardBlocks);


		this.countdowLabel = new PIXI.Text(this.life, { font: '14px', fontWeight: '200', fill: 0xFFFFFF, fontFamily: window.STANDARD_FONT2 });
		this.countdowLabel.pivot.x = this.countdowLabel.width / 2
		this.countdowLabel.pivot.y = this.countdowLabel.height / 2
		//cardContainer.addChild(this.countdowLabel);

		this.lifeContainer = new PIXI.Container();
		cardContainer.addChild(this.lifeContainer);
		this.lifeLabel = new PIXI.Text(this.life, { font: '14px', fontWeight: '200', fill: 0x000000, fontFamily: window.STANDARD_FONT2 });
		this.lifeLabel.pivot.x = this.lifeLabel.width / 2
		this.lifeLabel.pivot.y = this.lifeLabel.height / 2

		this.lifeContainerBackground = new PIXI.mesh.NineSlicePlane(
			PIXI.Texture.fromFrame('progressBarSmall.png'), 10, 10, 10, 10)
		this.lifeContainerBackground.pivot.x = this.lifeContainerBackground.width / 2
		this.lifeContainerBackground.pivot.y = this.lifeContainerBackground.height / 2
		this.lifeContainerBackground.scale.set(0.8)


		this.lifeContainer.addChild(this.lifeContainerBackground);
		this.lifeContainer.addChild(this.lifeLabel);
		this.lifeContainer.x = CARD.width * 0.7;
		this.lifeContainer.y = CARD.height * 0.7;

		this.label = new PIXI.Text(this.counter, { font: '32px', fill: 0x000000, align: 'right' });
		// cardContainer.addChild(this.label);
		utils.centerObject(this.label, this.cardForeground);
		// utils.centerObject(this.enemySprite, this.cardForeground);
		this.currentColor = 0x000000;

		// card.addChild(this.cardForeground);
		this.cardContainer = cardContainer;//card;
		this.addChild(card);
		cardContainer.pivot.x = CARD.width / 2;
		cardContainer.x = CARD.width / 2;

		this.initGridAcc = Math.random();

		// this.crazyMood = Math.random() < 0.5;

		this.starterScale = this.enemySprite.scale.x;
		this.isBomb = false;

		this.idleAnimationLayer1 = [];
		this.idleAnimationLayer2 = [];

		for (let index = 1; index <= 5; index++) {
			this.idleAnimationLayer1.push("l0_spader_1_" + index + ".png")
			this.idleAnimationLayer2.push("l1_spader_1_" + index + ".png")
		}

		this.frameTime = 1 / 10;
		this.currentAnimationTime = 0;
		this.currentFrame = Math.floor(Math.random() * this.idleAnimationLayer1.length);
		// this.particleSystem = new ParticleSystem();
		// this.particleSystem.createParticles({x:0, y:0},4, './assets/images/particle1.png')
		// this.addChild(this.particleSystem)
	}
	updateAnimation(delta) {
		if (this.currentAnimationTime >= 0) {
			this.currentAnimationTime -= delta;
			if (this.currentAnimationTime < 0) {
				this.currentFrame++;
				this.currentFrame %= this.idleAnimationLayer1.length;
				this.currentAnimationTime = this.frameTime;
			}
		}

		this.enemySprite.setTexture(PIXI.Texture.fromFrame(this.idleAnimationLayer1[this.currentFrame]));
		this.enemySpriteWhite.setTexture(PIXI.Texture.fromFrame(this.idleAnimationLayer2[this.currentFrame]));

		if (this.isCountdown) {
			if (this.currentFrame == 1 || this.currentFrame == 2) {

				this.countdowLabel.y = CARD.height / 2 - CARD.height * 0.06;
			} else {

				this.countdowLabel.y = CARD.height / 2 - CARD.height * 0.08;
			}
		}
	}
	forceNewColor(color) {
		this.enemySprite.tint = color;

		if (this.backshape) {
			this.backshape.tint = color;
		}

		this.currentColor = color;
	}
	setCountdown(baseCountdown) {

		this.isCountdown = true;

		this.currentCountdown = baseCountdown;
		this.baseCountdown = baseCountdown;
		this.countdowLabel.text = this.currentCountdown;
		this.idleAnimationLayer1 = [];
		this.idleAnimationLayer2 = [];
		for (let index = 1; index <= 5; index++) {
			this.idleAnimationLayer1.push("l0_spader_countdown_" + index + ".png")
			this.idleAnimationLayer2.push("l1_spader_countdown_" + index + ".png")
		}
		this.countdowLabel.x = CARD.width / 2;
		this.countdowLabel.y = CARD.height / 2 - CARD.height * 0.08;
		this.cardContainer.addChild(this.countdowLabel);

		this.life = 0;
		this.updateCurrentLife();
		// if (this.life < 1) {
		// 	this.startCrazyMood();
		// }
	}
	isBlockerPivot(){
		return this.isBlockHorizontalPivot || this.isBlockVerticalPivot

	}
	hasAnyBlocker() {
		return this.isBlockHorizontalPivot || this.isBlockedByPivotVertical || this.isBlockedByPivotHorizontal || this.isBlockVerticalPivot

	}
	updateBlockAsset() {
		this.cardBlocks.visible = true;

		if (this.isBlockedByPivotVertical && this.isBlockedByPivotHorizontal) {
			this.cardBlocks.setTexture(PIXI.Texture.fromFrame('tile_1_' + (32 * 8 + 13) + '.png'));
		} else if (this.isBlockedByPivotVertical) {
			this.cardBlocks.setTexture(PIXI.Texture.fromFrame('tile_1_' + (32 * 9 + 13) + '.png'));
		} else if (this.isBlockedByPivotHorizontal) {
			this.cardBlocks.setTexture(PIXI.Texture.fromFrame('tile_1_' + (32 * 10 + 13) + '.png'));
		} else if (this.isBlockVerticalPivot) {
			this.cardBlocks.setTexture(PIXI.Texture.fromFrame('tile_1_' + (32 * 9 + 12) + '.png'));
		} else if (this.isBlockHorizontalPivot) {
			this.cardBlocks.setTexture(PIXI.Texture.fromFrame('tile_1_' + (32 * 10 + 12) + '.png'));
		} else {
			this.cardBlocks.setTexture(PIXI.Texture.EMPTY);
			this.cardBlocks.visible = false;

		}
		this.cardBlocks.scale.set(CARD.width / this.cardBlocks.width * this.cardBlocks.scale.x)
	}
	blockHorizontalPivot() {
		this.isBlockHorizontalPivot = true;
		this.updateBlockAsset();
		this.removeActionZones();
		this.cardBlocks.visible = true;

	}
	blockHorizontal() {
		this.canBeAttacked = false;
		this.isBlockedByPivotHorizontal = true;
		this.updateBlockAsset();
		this.cardActions.alpha = 0;

	}
	blockVerticalPivot() {
		this.isBlockVerticalPivot = true;
		this.updateBlockAsset();
		this.removeActionZones();
		this.cardBlocks.visible = true;
	}
	blockVertical() {
		this.canBeAttacked = false;
		this.isBlockedByPivotVertical = true;
		this.updateBlockAsset();
		this.cardActions.alpha = 0;
	}
	removeBlockStateVertical() {
		this.isBlockedByPivotVertical = false;

		if(!this.isBlockedByPivotHorizontal){
			this.enableAfterBlock();
		}else{
			this.updateBlockAsset();
		}
	}
	removeBlockStateHorizontal() {
		this.isBlockedByPivotHorizontal = false;

		if(!this.isBlockedByPivotVertical){
			this.enableAfterBlock();
		}else{
			this.updateBlockAsset();
		}
	}
	enableAfterBlock(){
		this.canBeAttacked = true;
	
		this.cardBlocks.setTexture(PIXI.Texture.EMPTY);
		this.shake(0.2, 6, 0.2);
		TweenMax.to(this.cardActions, 0.5, { delay: 0.5, alpha: 1 })

	}
	itCannotDie() {
		this.cardStats.setTexture(PIXI.Texture.fromFrame('tile_1_' + (32 * 10 + 9) + '.png'));
		this.canDie = false;
		this.cardStats.scale.set(0.5)
		this.cardStats.x = 5
		this.cardStats.y = 5
		this.cardStats.visible = true;
	}
	itEndGameIfDie() {
		this.cardStats.setTexture(PIXI.Texture.fromFrame('tile_1_' + (32 * 10 + 7) + '.png'));
		this.endGameIfDie = true;
		this.cardStats.scale.set(0.35)
		this.cardStats.x = 5
		this.cardStats.y = 5
		this.cardStats.visible = true;
	}
	startCrazyMood() {
		this.crazyMood = true;
		this.circleBackground.alpha = 0.2
		this.circleBackground.scale.set(0)
		TweenMax.to(this.circleBackground.scale, 0.5, { x: 1, y: 1, ease: Elastic.easeOut });
		this.circleBackground.visible = true;
	}
	removeCrazyMood() {
		this.crazyMood = false;
		this.circleBackground.alpha = 0
		this.circleBackground.visible = false;
	}
	removeAllStates() {
		this.isCountdown = false;
		this.crazyMood = false;
		this.canDie = true;
		this.endGameIfDie = false;
		this.dead = false;
		this.isBlockHorizontalPivot = false;
		this.isBlockVerticalPivot = false;
		this.canBeAttacked = true;

		this.isBlockedByPivotHorizontal = false;
		this.isBlockedByPivotVertical = false;

		this.cardStats.scale.set(1)
		this.cardStats.position.set(0)
		this.cardStats.setTexture(PIXI.Texture.EMPTY);
		this.cardStats.visible = false;
		this.cardBlocks.visible = false;

	}
	createCard(totalSides = 0, customData) {
		if (this.countdowLabel.parent) {
			this.countdowLabel.parent.removeChild(this.countdowLabel)
		}
		this.alpha = 1;
		this.removeAllStates();




		this.removeCrazyMood();


		this.zones = [];
		this.arrows = [];
		// this.pos = {i:-1, j:-1};
		this.type = 0;
		this.MAX_COUNTER = 10;
		// this.life = 2;
		this.cardContainer.scale.set(1);

		this.updateCard();

		if (totalSides == 0) {
			totalSides = Math.ceil(Math.random() * 2)
		}
		//console.log(totalSides)
		let order = null;
		if (customData && customData.order) {
			//console.log(customData.order)
			order = customData.order;
		}

		this.addActionZones(totalSides, order);
	}
	attacked(hits = 1) {
		this.life -= hits;
		this.life = Math.floor(this.life)
		this.updateCard()

		if (this.isCountdown) {
			if (this.life < 1) {
				//this.startCrazyMood();
			}
		}
		if (this.life < 0) {
			return true;
		}

		return false;
	}
	hasZone(zone) {
		for (var i = 0; i < this.zones.length; i++) {
			if (this.zones[i].label == zone) {
				return this.zones[i];
			}
		}
		return false;
	}
	removeActionZones() {
		while (this.cardActions.children.length > 0) {
			let element = this.cardActions.children[0];
			TweenMax.killTweensOf(element)
			TweenMax.killTweensOf(element.scale)
			element.scale.set(1);
			ARROW_UP_POOL.push(element)
			this.cardActions.removeChildAt(0);
		}

		this.zones = [];
		this.arrows = [];
	}
	updateCounter(value) {
		//this.counter += value;
		if (!this.isCountdown) {
			return null;
		}
		this.isCountdown = true;
		this.currentCountdown -= value;


		if (this.currentCountdown <= 0) {
			this.currentCountdown = this.baseCountdown;
			this.shake(0.2, 6, 0.2);
			setTimeout(() => {

				this.countdowLabel.text = this.currentCountdown;
				TweenMax.killTweensOf(this.countdowLabel.scale);
				this.countdowLabel.scale.set(0, 1.5);
				TweenMax.to(this.countdowLabel.scale, 0.5, { delay: 0.75, x: 1, y: 1, ease: Elastic.easeOut })
			}, 100);

			return this;
			//this.game.board.moveLaneDown(this);
		}


		this.countdowLabel.text = this.currentCountdown;
		TweenMax.killTweensOf(this.countdowLabel.scale);
		this.countdowLabel.scale.set(0, 1.5);
		TweenMax.to(this.countdowLabel.scale, 0.5, { delay: 0.5, x: 1, y: 1, ease: Elastic.easeOut })

		return null;
	}
	updateSprite(level, data, id = -1) {
		this.isBomb = false;

		let imageID = Math.floor(level)
		if (id >= 0) {
			imageID = id
			imageID %= window.IMAGE_DATA.enemyImagesFrame.length - 1;
		}
		// if (data && data.hasWhite){
		// 	imageID = 9;
		// 	this.enemySpriteWhite.alpha = 1;
		// }else{
		// }
		let targetID = imageID
		targetID %= 5;
		targetID++
		this.idleAnimationLayer1 = []
		this.idleAnimationLayer2 = []
		for (let index = 1; index <= 5; index++) {
			this.idleAnimationLayer1.push("l0_spader_" + targetID + "_" + index + ".png")
			this.idleAnimationLayer2.push("l1_spader_" + targetID + "_" + index + ".png")
		}

		this.enemySpriteWhite.alpha = 0.85
		this.enemySprite.setTexture(PIXI.Texture.fromFrame(window.IMAGE_DATA.enemyImagesFrame[imageID]));
		this.enemySpriteWhite.setTexture(PIXI.Texture.fromFrame("w_" + window.IMAGE_DATA.enemyImagesFrame[imageID]));

		this.enemySpriteWhite.visible = true;
		this.enemySpriteWhite.anchor = this.enemySprite.anchor

		if (data) {
			this.currentTileColor = data.color;
		}

	}
	updateCard(isCurrent = false, data = null) {

		this.starterScale = CARD.width / this.realSpriteWidth * this.scaleRef
		for (var i = 0; i < ENEMIES.list.length; i++) {
			if (ENEMIES.list[i].life == this.life) {
				this.enemySprite.tint = ENEMIES.list[i].hasWhite ? ENEMIES.list[i].hasWhite : ENEMIES.list[i].color;
			}
		}


		if (data) {
			this.currentTileColor = data.color;
			this.enemySprite.tint = data.hasWhite ? data.hasWhite : data.color;
		}
		this.currentColor = this.enemySprite.tint;

		this.updateCurrentLife();


		this.isCurrent = isCurrent;
		if (isCurrent) {
			if (this.backshape && this.backshape.parent) {
				this.backshape.parent.removeChild(this.backshape)
			}
		}

		this.cardBack3.tint = 0;
		this.cardBack3.alpha = 0.2;
	}
	updateCurrentLife() {
		if (this.life < 1) {
			this.lifeContainer.alpha = 0;
		} else {
			this.lifeContainer.alpha = 1;
			this.lifeLabel.text = Math.floor(this.life);
			this.lifeContainer.x = CARD.width * 0.75;
			this.lifeContainer.y = CARD.height * 0.75;

			this.lifeContainer.scale.set(CARD.width / this.lifeContainerBackground.width * 0.3)
		}
	}
	convertCard() {
		//this.type = this.type == 1 ? 0 : 1;
		this.updateCard();
	}
	getArrow(label) {
		// console.log("GET ARROWS",this.cardNumber, label, this.arrows);
		for (var i = 0; i < this.arrows.length; i++) {
			if (this.arrows[i].zone == label) {
				return this.arrows[i].arrow;
			}
		}
	}
	updateSize() {
		//this.enemySprite.scale.set(CARD.width / this.enemySprite.width * 0.55 * this.enemySprite.scale.x)
		this.enemySprite.scale.set(CARD.width / this.realSpriteWidth * this.scaleRef)
		this.starterScale = this.enemySprite.scale.x
		this.enemySprite.x = CARD.width / 2;
		this.enemySprite.y = CARD.height / 2;


		this.circleBackground.clear();
		this.circleBackground.beginFill(0xFFFFFF);
		this.circleBackground.drawCircle(0, 0, CARD.width / 2);
		this.circleBackground.x = CARD.width / 2;
		this.circleBackground.y = CARD.height / 2;

		this.cardForeground.scale.set(1);
		this.cardForeground.width = CARD.width
		this.cardForeground.height = CARD.height

		//this.cardActions.scale.set(0.7)
		//this.cardActions.scale.set(this.cardActions.width / CARD.width)
	}
	addExtraZone(ids) {
		let currentZones = [];;
		for (let index = 0; index < this.zonesID.length; index++) {
			currentZones.push(this.zonesID[index]);

		}

		for (let index = 0; index < ids.length; index++) {
			const element = ids[index];

			if (currentZones.indexOf(element) < 0) {
				currentZones.push(element);
			}

		}

		this.addActionZones(1, currentZones);

	}
	addActionZones(totalSides = 1, customOrder = null) {
		this.updateSize();
		this.zones = [];
		this.removeActionZones();
		this.zonesID = [];
		let orderArray = customOrder ? customOrder : [0, 1, 2, 3, 4, 5, 6, 7]

		if (!customOrder) {
			utils.shuffle(orderArray);
			if (ACTION_ZONES[orderArray[0]].label == "BOTTOM_CENTER" && totalSides <= 1) {
				//console.log("one here")
				totalSides++;
			}
		} else {
			totalSides = customOrder.length;
		}


		let arrowSize = 12 * this.starterScale;
		for (var i = totalSides - 1; i >= 0; i--) {


			this.zonesID.push(orderArray[i]);
			let zone = ACTION_ZONES[orderArray[i]];
			let arrowSprite = this.getArrowSprite()//PIXI.Sprite.fromFrame(zone.sprite);
			arrowSprite.setTexture(PIXI.Texture.fromFrame(zone.sprite))
			arrowSprite.tint = 0xFFFFFF;
			arrowSprite.anchor.set(0.5)
			arrowSprite.scale.set(0.84 * this.cardContainer.scale.x)
			//arrowSprite.scale.set(
			//	arrowSprite.width  / this.width * 0.7)

			//console.log(this.circleBackground.width )


			this.cardActions.addChild(arrowSprite)
			this.zones.push(zone);

			let tempX = (zone.pos.x / 2) * this.cardForeground.width;
			let tempY = (zone.pos.y / 2) * this.cardForeground.height;
			this.arrows.push({ arrow: arrowSprite, zone: zone.label });

			let centerPos = { x: this.cardForeground.width / 2, y: this.cardForeground.height / 2 };
			let angle = Math.atan2(tempY - centerPos.y, tempX - centerPos.x) + Math.PI / 2;

			angle = (Math.round((angle * 180 / Math.PI) / 45) * 45) / 180 * Math.PI;
			arrowSprite.rotation = angle + zone.offsetRotation;

			arrowSprite.x = CARD.width / 2 // arrowSprite.scale.x
			arrowSprite.y = CARD.height / 2 // arrowSprite.scale.y
		}

		this.cardActions.alpha = 1;
		this.cardActions.scale.set(CARD.width / Math.floor(this.cardActions.width / this.cardActions.scale.x))

		this.cardActions.pivot.x = this.cardActions.width / 2
		this.cardActions.pivot.y = this.cardActions.height / 2

		this.cardActions.x = this.cardActions.width / 2
		this.cardActions.y = this.cardActions.height / 2
	}
	isABomb() {
		this.isBomb = true;
		//this.enemySprite.setTexture( PIXI.Texture.fromImage(window.IMAGE_DATA.enemyBombImages[0]));
		this.enemySprite.setTexture(PIXI.Texture.fromFrame(window.IMAGE_DATA.enemyImagesFrame[Math.floor(0)]));

		this.startCrazyMood();
		this.removeActionZones();

		this.enemySprite.tint = ENEMIES.list[9].color;
	}
	moveAndGoCrazy(pos, time = 0.3, delay = 0) {
		// console.log(	pos);

		TweenMax.killTweensOf(this)
		TweenMax.killTweensOf(this.position)
		TweenMax.killTweensOf(this.scale)
		if (this.backshape && this.backshape.parent) {
			this.backshape.parent.removeChild(this.backshape)
		}

		TweenMax.to(this, time, {
			x: pos.x, y: pos.y, delay: delay, onComplete: () => {
				this.startCrazyMood();
			}
		});
	}
	move(pos, time = 0.3, delay = 0) {
		// console.log(	pos);
		// if (delay > 0) {

		// 	setTimeout(() => {

		// 		this.horizontalSpring.tx = pos.x;
		// 		this.targetY = pos.y;
		// 	}, delay * 1000);
		// } else {
		// 	this.horizontalSpring.tx = pos.x;
		// 	this.targetY = pos.y;
		// }
		// return;
		TweenMax.killTweensOf(this)
		TweenMax.killTweensOf(this.position)
		TweenMax.killTweensOf(this.scale)
		if (this.backshape && this.backshape.parent) {
			this.backshape.parent.removeChild(this.backshape)
		}

		TweenMax.to(this, time, { x: pos.x, y: pos.y, delay: delay });

		return
		if (!this.isCurrent) {

		} else {
			this.horizontalSpring.tx = pos.x
			TweenMax.to(this, time, { y: pos.y, delay: delay });

		}
	}

	show(time = 0.3, delay = 0) {
		//let scheme = colorSchemes.getCurrentColorScheme().grid;

		//this.cardForeground.texture = (PIXI.Texture.fromFrame(scheme.spriteTile))

		this.updateSize();

		return;
		TweenMax.killTweensOf(this.cardForeground, true)
		this.cardForeground.tint = this.enemySprite.tint
		this.cardForeground.alpha = 1
		this.cardContainer.alpha = 0;
		TweenMax.to(this.cardForeground, time, {
			alpha: 0, delay: delay, onStart: () => {
				this.cardContainer.alpha = 1;
			}
		});
	}

	moveX(pos, time = 0.3, delay = 0) {
		// console.log(	'moveX', pos);
		TweenMax.to(this, time, { x: pos, delay: delay });
	}
	setZeroLife() {
		this.life = 0;
		if (this.life < 1) {
			this.lifeContainer.alpha = 0;
		}

		if (this.isCountdown) {
			this.isCountdown = false;
			this.countdowLabel.text = "-";
		}

	}
	mark() {

		let scheme = colorSchemes.getCurrentColorScheme().grid;


		this.backshape = new PIXI.mesh.NineSlicePlane(
			PIXI.Texture.fromFrame(scheme.spriteTile), 20, 20, 20, 20)
		this.backshape.width = CARD.width
		this.backshape.height = CARD.height
		this.backshape.tint = this.enemySprite.tint;
		this.backshape.pivot.set(CARD.width / 2)
		this.addChildAt(this.backshape, 0);
		this.backshape.x = CARD.width / 2
		this.backshape.y = CARD.height / 2
		this.backshape.alpha = 0.5
		this.cardForeground.alpha = 0;
		this.updateSize();
	}
	setOnQueue() {
		this.cardForeground.alpha = 0;
		this.updateSize();
	}
	forceDestroy(returnToPool = true) {
		if (this.parent) {
			this.parent.removeChild(this);
		}
		if (this.isCard)
			this.removeActionZones();

		if (this.backshape && this.backshape.parent) {
			this.backshape.parent.removeChild(this.backshape)
		}
		if (returnToPool) {
			window.CARD_POOL.push(this);
		}
	}
	getArrowSprite() {
		let sprite = null
		if (ARROW_UP_POOL.length) {
			sprite = ARROW_UP_POOL[0];
			ARROW_UP_POOL.shift();
		} else {
			sprite = new PIXI.Sprite();
		}


		return sprite;
	}
	update(delta) {
		// this.particleSystem.update(delta);
		this.updateAnimation(delta);
		this.enemySprite.y = CARD.height * 0.7 //+ Math.sin(this.initGridAcc) * 2;
		//this.enemySprite.y = Math.floor(CARD.height * 0.7 + Math.sin(this.initGridAcc) * 2);
		//this.cardBack3.y = this.enemySprite.y - 10;
		this.initGridAcc += delta

		this.cardBack3.position.x = this.enemySprite.position.x
		this.cardBack3.position.y = this.enemySprite.position.y + this.enemySprite.scale.y * 10
		this.cardBack3.scale.x = this.enemySprite.scale.x * 2
		this.cardBack3.scale.y = this.enemySprite.scale.y * 2
		// this.horizontalSpring.update();
		// if (this.isCurrent) {
		// 	this.x = this.horizontalSpring.x

		// }
		// this.y = utils.lerp(this.y, this.targetY, 0.2)
		//this.enemySprite.scale.y = 0.2
		//this.enemySprite.scale.x = this.starterScale + Math.cos(this.initGridAcc) * 0.1//0.05
		//this.enemySprite.scale.y = this.starterScale + Math.sin(this.initGridAcc) * 0.1//0.05

		if (this.isCountdown) {
			//this.enemySprite.tint = window.colorTweenBomb.currentColor;
		}
		if (this.crazyMood) {

			this.initGridAcc += delta * (60 * 0.25)

			//this.enemySprite.y = CARD.height / 2 + Math.sin(this.initGridAcc) * 5;
			//this.enemySprite.scale.x = this.starterScale + Math.cos(this.initGridAcc) * 0.075
			//this.enemySprite.scale.y = this.starterScale + Math.sin(this.initGridAcc) * 0.075
			this.updateAnimation(delta * 0.5)
			this.circleBackground.alpha = 0.2 + 0.1 * Math.cos(this.initGridAcc);

			this.enemySprite.tint = window.colorTweenBomb.currentColor;

		} else if ((this.enemySprite.scale.x != this.starterScale) || (this.enemySprite.scale.y != this.starterScale)) {


			// this.enemySprite.scale.set(this.starterScale);

		}

	}
	destroy() {
		// if(!this.parent){
		// 	return
		// }
		if (this.dead) {
			TweenMax.killTweensOf(this);
			TweenMax.killTweensOf(this.position);
			TweenMax.killTweensOf(this.scale);
			//console.log("FORCE THIS CARD TO DIE");
			if (this.parent) {
				this.parent.removeChild(this);
			}
			this.forceDestroy(false);
			return false;
			this.forceDestroy();
		}
		// this.removeCrazyMood();
		TweenMax.killTweensOf(this);
		TweenMax.killTweensOf(this.position);
		TweenMax.killTweensOf(this.scale);
		this.shake(0.2, 6, 0.2);

		this.dead = true;

		if (this.crazyMood) {
			TweenMax.to(this.circleBackground.scale, 0.5, { x: 2, y: 2, ease: Elastic.easeOut });
		}
		// TweenMax.to(this.cardContainer.scale, 0.2, {x:this.cardContainer.scale.x + 0.3, y:this.cardContainer.scale.y + 0.3})			
		TweenMax.to(this, 0.2, {
			delay: 0.2, alpha: 0.5, onComplete: function () {
				this.forceDestroy();
			}.bind(this)
		});
	}

	shake(force = 1, steps = 4, time = 0.5) {
		let timelinePosition = new TimelineLite();
		let positionForce = (force * 50);
		let spliterForce = (force * 20);
		let speed = time / steps;
		for (var i = steps; i >= 0; i--) {
			timelinePosition.append(TweenMax.to(this.position, speed, { x: this.position.x + (Math.random() * positionForce - positionForce / 2), y: this.position.y + (Math.random() * positionForce - positionForce / 2), ease: "easeNoneLinear" }));
		};

		timelinePosition.append(TweenMax.to(this.position, speed, { x: this.position.x, y: this.position.y, ease: "easeeaseNoneLinear" }));
	}
}