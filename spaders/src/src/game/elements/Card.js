import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';
import ParticleSystem from '../effects/ParticleSystem';
export default class Card extends PIXI.Container {
	constructor(game) {
		super();
		window.CARD_ID ++;
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

		this.realSpriteWidth = 72;
		this.scaleRef = 0.75;

		let card = new PIXI.Container();
		this.counter = this.MAX_COUNTER;

		// let gridEffectSquare = PIXI.Sprite.fromImage('./assets/images/largeCard.png')
		// 		gridEffectSquare.scale.set(CARD.width / gridEffectSquare.width);

		this.cardForeground = PIXI.Sprite.fromImage('./assets/images/largeCard.png')//new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(0, 0, CARD.width, CARD.height, 0);
		this.circleBackground = new PIXI.Graphics().beginFill(0xFFFFFF).drawCircle(0, 0, CARD.width / 2);
		this.cardBack3 = new PIXI.Graphics().beginFill(0x000000).drawRect(CARD.width / 2 - 10, CARD.height / 2, 19, 10);
		this.enemySprite = PIXI.Sprite.fromImage('./assets/images/enemy.png');

		this.enemySprite.scale.set(this.realSpriteWidth / this.enemySprite.width * this.scaleRef)
		this.enemySprite.anchor.set(0.5);

		this.cardForeground.alpha = 1;
		this.circleBackground.alpha = 0;

		this.enemySprite.x = CARD.width / 2;
		this.enemySprite.y = CARD.height / 2;

		this.circleBackground.x = CARD.width / 2;
		this.circleBackground.y = CARD.height / 2;

		let cardContainer = new PIXI.Container();
		this.cardActions = new PIXI.Container();
		card.addChild(cardContainer);
		cardContainer.addChild(this.circleBackground);
		cardContainer.addChild(this.cardActions);
		// cardContainer.addChild(this.cardBack3);
		cardContainer.addChild(this.enemySprite);


		this.lifeContainer = new PIXI.Container();
		cardContainer.addChild(this.lifeContainer);
		this.lifeLabel = new PIXI.Text(this.life, { font: '20px', fill: 0x000000,  fontFamily:window.STANDARD_FONT1 });
		this.lifeLabel.pivot.x = this.lifeLabel.width / 2
		this.lifeLabel.pivot.y = this.lifeLabel.height / 2
		this.lifeContainerBackground = PIXI.Sprite.fromImage('./assets/images/backLabel.png')
		this.lifeContainerBackground.anchor.x = 0.5
		this.lifeContainerBackground.anchor.y = 0.5
		this.lifeContainerBackground.scale.set(1.4)

		this.lifeContainer.addChild(this.lifeContainerBackground);
		this.lifeContainer.addChild(this.lifeLabel);
		this.lifeContainer.x = CARD.width * 0.75;
		this.lifeContainer.y = CARD.height * 0.75;

		this.label = new PIXI.Text(this.counter, { font: '32px', fill: 0x000000, align: 'right' });
		// cardContainer.addChild(this.label);
		utils.centerObject(this.label, this.cardForeground);
		// utils.centerObject(this.enemySprite, this.cardForeground);
		this.currentColor = 0x000000;

		card.addChild(this.cardForeground);
		this.cardContainer = cardContainer;//card;
		this.addChild(card);
		cardContainer.pivot.x = CARD.width / 2;
		cardContainer.x = CARD.width / 2;

		this.initGridAcc = Math.random();

		// this.crazyMood = Math.random() < 0.5;

		this.starterScale = this.enemySprite.scale.x;
		this.isBomb = false;
		// this.particleSystem = new ParticleSystem();
		// this.particleSystem.createParticles({x:0, y:0},4, './assets/images/particle1.png')
		// this.addChild(this.particleSystem)
	}
	forceNewColor(color){
		this.enemySprite.tint = color;

		if(this.backshape){
			this.backshape.tint = color;
		}
	}
	startCrazyMood() {
		this.crazyMood = true;
		this.circleBackground.alpha = 0.2
		this.circleBackground.scale.set(0)
		TweenMax.to(this.circleBackground.scale, 0.5, { x: 1, y: 1, ease: Elastic.easeOut });
	}
	removeCrazyMood() {
		this.crazyMood = false;
		this.circleBackground.alpha = 0.0
	}
	createCard(totalSides = 0, customData) {
		this.alpha = 1;
		this.crazyMood = false;
		this.removeCrazyMood();

		this.dead = false;

		this.zones = [];
		this.arrows = [];
		// this.pos = {i:-1, j:-1};
		this.type = 0;
		this.MAX_COUNTER = 10;
		// this.life = 2;
		this.cardContainer.scale.set(1);

		this.updateCard();

		if(totalSides == 0){
			totalSides = Math.ceil(Math.random() * 2)
		}
		//console.log(totalSides)
		let order = null;
		if(customData && customData.order){
			order = customData.order;
		}
		this.addActionZones(totalSides, order);
	}
	attacked(hits = 1) {
		this.life -= hits;
		this.life = Math.floor(this.life)
		this.updateCard()

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
			this.cardActions.removeChildAt(0);
		}

		this.zones = [];
		this.arrows = [];
	}
	updateCounter(value) {
		//this.counter += value;
		this.label.text = this.counter;
		if (this.counter <= 0) {
			this.counter = this.MAX_COUNTER;
			return this;
			//this.game.board.moveLaneDown(this);
		}
		return null;
	}
	updateSprite(level) {
		this.isBomb = false;
		this.enemySprite.setTexture( PIXI.Texture.fromImage(window.IMAGE_DATA.enemyImages[Math.floor(level)]));
	}
	updateCard(isCurrent = false) {

		this.starterScale = CARD.width / this.realSpriteWidth * 0.55
		for (var i = 0; i < ENEMIES.list.length; i++) {
			if (ENEMIES.list[i].life == this.life) {
				this.enemySprite.tint = ENEMIES.list[i].color;
			}
		}
		this.currentColor = this.enemySprite.tint;
		if (this.life < 1) {
			this.lifeContainer.alpha = 0;
		} else {
			this.lifeContainer.alpha = 1;
			this.lifeLabel.text = Math.floor(this.life);
			this.lifeContainer.x = CARD.width * 0.75;
			this.lifeContainer.y = CARD.height * 0.75;

			this.lifeContainer.scale.set(CARD.width / this.lifeContainerBackground.width * 0.3)
		}


		if (isCurrent) {
			if (this.backshape && this.backshape.parent) {
				this.backshape.parent.removeChild(this.backshape)
			}
			
			// this.backshape = new PIXI.Graphics();
			// this.backshape.lineStyle(3, this.enemySprite.tint, 1);
			// this.backshape.beginFill(this.enemySprite.tint);
			// //this.backshape.drawCircle(0, 0, CARD.width * 0.5);
			// this.backshape.drawRect(CARD.width * -0.5, CARD.width * -0.5, CARD.width, CARD.width);
			// this.backshape.endFill();

			this.backshape = PIXI.Sprite.fromImage('./assets/images/largeCard.png')
			this.backshape.scale.set(CARD.width / this.backshape.width);
			this.backshape.tint = this.enemySprite.tint;
			this.backshape.anchor.set(0.5)
			this.addChildAt(this.backshape, 0);
			this.backshape.x = this.enemySprite.x
			this.backshape.y = this.enemySprite.y
			this.backshape.alpha = 0.25
		}
		//this.life = Math.floor(this.life)
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

		this.circleBackground.x = CARD.width / 2;
		this.circleBackground.y = CARD.height / 2;

		this.cardForeground.width = CARD.width
		this.cardForeground.height = CARD.height
	}
	addActionZones(totalSides = 1, customOrder = null) {
		this.updateSize();
		this.zones = [];
		this.removeActionZones();
		let orderArray = customOrder?customOrder:[0, 1, 2, 3, 4, 5, 6, 7]

		if(!customOrder){
			utils.shuffle(orderArray);
			if(ACTION_ZONES[orderArray[0]].label == "BOTTOM_CENTER" && totalSides <= 1){
				//console.log("one here")
				totalSides ++;
			}
		}else{
			totalSides = customOrder.length;
		}

		let arrowSize = 12*this.starterScale;
		for (var i = totalSides - 1; i >= 0; i--) {

			let arrowContainer = new PIXI.Container();
			let arrow = new PIXI.Graphics().beginFill(0xFFFFFF);
			arrow.moveTo(-arrowSize, 0);
			arrow.lineTo(arrowSize, 0);
			arrow.lineTo(0, -arrowSize);

			
			arrowContainer.addChild(arrow);
			
			// arrow.lineTo(0,-5);

			let zone = ACTION_ZONES[orderArray[i]];

			this.zones.push(zone);

			let tempX = (zone.pos.x / 2) * this.cardForeground.width;
			let tempY = (zone.pos.y / 2) * this.cardForeground.height;
			arrowContainer.x = tempX;
			arrowContainer.y = tempY;

			this.arrows.push({ arrow: arrowContainer, zone: zone.label });

			let centerPos = { x: this.cardForeground.width / 2, y: this.cardForeground.height / 2 };
			let angle = Math.atan2(tempY - centerPos.y, tempX - centerPos.x) + Math.PI / 2;

			angle = (Math.round((angle * 180 / Math.PI) / 45) * 45) / 180 * Math.PI;
			arrowContainer.rotation = angle;
			this.cardActions.addChild(arrowContainer);

			arrowContainer.x -= Math.sin(angle) * (arrowSize + 1);
			arrowContainer.y += Math.cos(angle) * (arrowSize + 1);

			let arrowLine = new PIXI.Graphics().lineStyle(2, 0xFFFFFF);
			arrowLine.moveTo(0, 0);
			arrowLine.lineTo(0, CARD.width / 2);
			arrowContainer.addChild(arrowLine);
		}
		// console.log("ADD ACTION ZONES", this.zones, this.arrows);
	}
	isABomb(){
		this.isBomb = true;
		this.enemySprite.setTexture( PIXI.Texture.fromImage(window.IMAGE_DATA.enemyBombImages[0]));
		this.startCrazyMood();
		this.removeActionZones();

		this.enemySprite.tint = config.colors.red;
	}
	move(pos, time = 0.3, delay = 0) {
		// console.log(	pos);
		if (this.backshape && this.backshape.parent) {
			this.backshape.parent.removeChild(this.backshape)
		}

		TweenMax.to(this, time, { x: pos.x, y: pos.y, delay: delay });
	}

	show(time = 0.3, delay = 0) {
		TweenMax.killTweensOf(this.cardForeground, true)
		this.cardForeground.tint = this.enemySprite.tint
		this.cardForeground.alpha = 1
		this.cardContainer.alpha = 0;
		TweenMax.to(this.cardForeground, time, { alpha: 0, delay: delay , onStart:()=>{
			this.cardContainer.alpha = 1;
		}});
	}

	moveX(pos, time = 0.3, delay = 0) {
		// console.log(	'moveX', pos);
		TweenMax.to(this, time, { x: pos, delay: delay });
	}
	setZeroLife(){
		this.life = 0;
		if (this.life < 1) {
			this.lifeContainer.alpha = 0;
		}
	}
	mark() {
		// this.backshape = new PIXI.Graphics();
		// this.backshape.lineStyle(3, this.enemySprite.tint, 1);
		// this.backshape.beginFill(this.enemySprite.tint);
		// this.backshape.drawRect(-CARD.width / 2, -CARD.height / 2, CARD.width, CARD.height);
		// this.backshape.endFill();

		this.backshape = PIXI.Sprite.fromImage('./assets/images/innerBorder.png')
			this.backshape.scale.set(CARD.width / this.backshape.width);
			this.backshape.tint = this.enemySprite.tint;
			this.backshape.anchor.set(0.5)
		this.addChildAt(this.backshape, 0);
		this.backshape.x = this.enemySprite.x
		this.backshape.y = this.enemySprite.y
		this.backshape.alpha = 0.5
		this.cardForeground.alpha = 0;
		this.updateSize();
	}
	setOnQueue() {
		// this.backshape = new PIXI.Graphics();
		// //this.backshape.lineStyle(3, this.enemySprite.tint, 1);
		// this.backshape.beginFill(this.enemySprite.tint);
		// this.backshape.drawRect(-CARD.width / 2, -CARD.height / 2, CARD.width, CARD.height);
		// this.backshape.endFill();
		// this.addChildAt(this.backshape, 0);
		// this.backshape.x = this.enemySprite.x
		// this.backshape.y = this.enemySprite.y
		// this.backshape.alpha = 0.25
		this.cardForeground.alpha = 0;
		this.updateSize();
	}
	forceDestroy(returnToPool = true) {
		if(this.parent){			
			this.parent.removeChild(this);
		}
		if (this.isCard)
			this.removeActionZones();

		if (this.backshape && this.backshape.parent) {
			this.backshape.parent.removeChild(this.backshape)
		}
		if(returnToPool){
			window.CARD_POOL.push(this);
		}
	}
	update(delta) {
		// this.particleSystem.update(delta);
		this.enemySprite.y = CARD.height / 2 + Math.sin(this.initGridAcc) * 2;
		this.cardBack3.y = this.enemySprite.y - 10;
		this.initGridAcc += 0.05

		this.enemySprite.scale.x = this.starterScale + Math.cos(this.initGridAcc) * 0.05
		this.enemySprite.scale.y = this.starterScale + Math.sin(this.initGridAcc) * 0.05
		if (this.crazyMood) {

			this.initGridAcc += 0.25

			this.enemySprite.y = CARD.height / 2 + Math.sin(this.initGridAcc) * 5;
			this.enemySprite.scale.x = this.starterScale + Math.cos(this.initGridAcc) * 0.1
			this.enemySprite.scale.y = this.starterScale + Math.sin(this.initGridAcc) * 0.1

			this.circleBackground.alpha = 0.2 + 0.1 * Math.cos(this.initGridAcc);

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
			console.log("FORCE THIS CARD TO DIE");
			if(this.parent){			
				this.parent.removeChild(this);
			}
			this.forceDestroy(false);
			return false;
			this.forceDestroy();
		}
		// this.removeCrazyMood();
		this.shake(0.2, 6, 0.2);
		TweenMax.killTweensOf(this);

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