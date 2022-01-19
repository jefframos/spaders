import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';
import ParticleSystem from '../effects/ParticleSystem';
export default class Card extends PIXI.Container {
	constructor(game) {
		super();
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

		let card = new PIXI.Container();
		this.counter = this.MAX_COUNTER;
		this.cardForeground = new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(0, 0, CARD.width, CARD.height, 0);
		this.circleBackground = new PIXI.Graphics().beginFill(0xFFFFFF).drawCircle(0, 0, CARD.width / 2);
		this.cardBack3 = new PIXI.Graphics().beginFill(0x000000).drawRect(CARD.width / 2 - 10, CARD.height / 2, 19, 10);
		this.enemySprite = PIXI.Sprite.fromImage('./assets/images/enemy.png');

		this.enemySprite.scale.set(CARD.width / this.enemySprite.width * 0.55)
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
		this.lifeLabel = new PIXI.Text(this.life, { font: '20px', fill: 0x000000,  fontFamily:'round_popregular' });
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


		card.addChild(this.cardForeground);
		this.cardContainer = cardContainer;//card;
		this.addChild(card);
		cardContainer.pivot.x = CARD.width / 2;
		cardContainer.x = CARD.width / 2;

		this.initGridAcc = Math.random();

		// this.crazyMood = Math.random() < 0.5;

		this.starterScale = this.enemySprite.scale.x;

		// this.particleSystem = new ParticleSystem();
		// this.particleSystem.createParticles({x:0, y:0},4, './assets/images/particle1.png')
		// this.addChild(this.particleSystem)
	}
	startCrazyMood() {
		this.crazyMood = true;
		this.circleBackground.alpha = 0.2
		this.circleBackground.scale.set(0)
		TweenLite.to(this.circleBackground.scale, 0.5, { x: 1, y: 1, ease: Elastic.easeOut });
	}
	removeCrazyMood() {
		this.crazyMood = false;
		this.circleBackground.alpha = 0.0
	}
	createCard() {
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

		this.addActionZones();
	}
	attacked(hits = 1) {
		this.life -= hits;

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
		this.enemySprite.setTexture( PIXI.Texture.fromImage(window.IMAGE_DATA.enemyImages[level]));
		console.log(window.IMAGE_DATA.enemyImages[level])
	}
	updateCard(isCurrent = false) {

		this.starterScale = CARD.width / this.enemySprite.width * 0.55 * this.enemySprite.scale.x
		for (var i = 0; i < ENEMIES.list.length; i++) {
			if (ENEMIES.list[i].life == this.life) {
				this.enemySprite.tint = ENEMIES.list[i].color;
			}
		}
		if (this.life < 1) {
			this.lifeContainer.alpha = 0;
		} else {
			this.lifeContainer.alpha = 1;
			this.lifeLabel.text = this.life;
			this.lifeContainer.x = CARD.width * 0.75;
			this.lifeContainer.y = CARD.height * 0.75;

			this.lifeContainer.scale.set(CARD.width / this.lifeContainerBackground.width * 0.3)
		}


		if (isCurrent) {
			if (this.backshape && this.backshape.parent) {
				this.backshape.parent.removeChild(this.backshape)
			}
			this.backshape = new PIXI.Graphics();
			//this.backshape.lineStyle(3, this.enemySprite.tint, 1);
			this.backshape.beginFill(this.enemySprite.tint);
			this.backshape.drawCircle(0, 0, CARD.width * 0.5);
			this.backshape.endFill();
			this.addChildAt(this.backshape, 0);
			this.backshape.x = this.enemySprite.x
			this.backshape.y = this.enemySprite.y
			this.backshape.alpha = 0.25
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
		this.enemySprite.scale.set(CARD.width / this.enemySprite.width * 0.55 * this.enemySprite.scale.x)
		this.starterScale = this.enemySprite.scale.x
		this.enemySprite.x = CARD.width / 2;
		this.enemySprite.y = CARD.height / 2;

		this.circleBackground.x = CARD.width / 2;
		this.circleBackground.y = CARD.height / 2;

		this.cardForeground.width = CARD.width
		this.cardForeground.height = CARD.height
	}
	addActionZones() {
		this.updateSize();
		this.zones = [];
		this.removeActionZones();
		let orderArray = [0, 1, 2, 3, 4, 5, 6, 7]
		utils.shuffle(orderArray);
		let totalSides = Math.floor(Math.random() * ACTION_ZONES.length * 0.4) + 1;
		let arrowSize = 7*this.starterScale;
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
			arrowLine.lineTo(0, this.enemySprite.width * this.starterScale);
			arrowContainer.addChild(arrowLine);
		}
		// console.log("ADD ACTION ZONES", this.zones, this.arrows);
	}
	move(pos, time = 0.3, delay = 0) {
		// console.log(	pos);
		if (this.backshape && this.backshape.parent) {
			this.backshape.parent.removeChild(this.backshape)
		}

		TweenLite.to(this, time, { x: pos.x, y: pos.y, delay: delay });
	}

	show(time = 0.3, delay = 0) {
		TweenLite.killTweensOf(this.cardForeground, true)
		this.cardForeground.tint = this.enemySprite.tint
		this.cardForeground.alpha = 1
		this.cardContainer.alpha = 0;
		TweenLite.to(this.cardForeground, time, { alpha: 0, delay: delay , onStart:()=>{
			this.cardContainer.alpha = 1;
		}});
	}

	moveX(pos, time = 0.3, delay = 0) {
		// console.log(	'moveX', pos);
		TweenLite.to(this, time, { x: pos, delay: delay });
	}
	setOnQueue() {
		this.backshape = new PIXI.Graphics();
		//this.backshape.lineStyle(3, this.enemySprite.tint, 1);
		this.backshape.beginFill(this.enemySprite.tint);
		this.backshape.drawRect(-CARD.width / 2, -CARD.height / 2, CARD.width, CARD.height);
		this.backshape.endFill();
		this.addChildAt(this.backshape, 0);
		this.backshape.x = this.enemySprite.x
		this.backshape.y = this.enemySprite.y
		this.backshape.alpha = 0.25
		this.cardForeground.alpha = 0;
		this.updateSize();
	}
	forceDestroy() {
		this.parent.removeChild(this);
		if (this.isCard)
			this.removeActionZones();

		if (this.backshape && this.backshape.parent) {
			this.backshape.parent.removeChild(this.backshape)
		}
		window.CARD_POOL.push(this);
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
			TweenLite.killTweensOf(this);
			console.log("FORCE THIS CARD TO DIE");
			this.alpha = 0.1;
			this.forceDestroy();
			return false;
			this.forceDestroy();
		}
		// this.removeCrazyMood();
		this.shake(0.2, 6, 0.2);
		TweenLite.killTweensOf(this);

		this.dead = true;

		if (this.crazyMood) {
			TweenLite.to(this.circleBackground.scale, 0.5, { x: 2, y: 2, ease: Elastic.easeOut });
		}
		// TweenLite.to(this.cardContainer.scale, 0.2, {x:this.cardContainer.scale.x + 0.3, y:this.cardContainer.scale.y + 0.3})			
		TweenLite.to(this, 0.2, {
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
			timelinePosition.append(TweenLite.to(this.position, speed, { x: this.position.x + (Math.random() * positionForce - positionForce / 2), y: this.position.y + (Math.random() * positionForce - positionForce / 2), ease: "easeNoneLinear" }));
		};

		timelinePosition.append(TweenLite.to(this.position, speed, { x: this.position.x, y: this.position.y, ease: "easeeaseNoneLinear" }));
	}
}