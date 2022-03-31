import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';
import ParticleSystem from '../effects/ParticleSystem';
export default class Card extends PIXI.Container {
	constructor(game) {
		super();
		this.game = game;
		this.pos = { i: -1, j: -1 };

		this.realSpriteWidth = 72 * 2;

		let card = new PIXI.Container();
		this.counter = this.MAX_COUNTER;
		this.cardBackground = new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(0, 0, CARD.width, CARD.height, 0);
		this.circleBackground = new PIXI.Graphics().beginFill(0xFFFFFF).drawCircle(0, 0, CARD.width / 2);
		this.cardBackground3 = new PIXI.Graphics().beginFill(0x000000).drawRect(CARD.width / 2 - 10, CARD.height / 2, 19, 10);
		// this.sprite = PIXI.Sprite.fromImage('./assets/images/block.jpg');

		// this.sprite.width = CARD.width;
		// this.sprite.height = CARD.height;

		this.sprite = PIXI.Sprite.fromFrame('l0_blocker_01.png');

		this.sprite.scale.set(CARD.width / this.realSpriteWidth * 0.8)
		this.sprite.tint = 0x333333;
		this.sprite.anchor.set(0.5);


		this.enemySpriteWhite = PIXI.Sprite.fromFrame('l0_blocker_01.png');
		this.enemySpriteWhite.anchor = this.sprite.anchor;

		this.sprite.addChild(this.enemySpriteWhite)

		this.cardBackground.alpha = 0;
		this.circleBackground.alpha = 0;

		this.sprite.x = CARD.width / 2;
		this.sprite.y = CARD.height / 2;

		this.circleBackground.x = CARD.width / 2;
		this.circleBackground.y = CARD.height / 2;

		let cardContainer = new PIXI.Container();
		this.cardActions = new PIXI.Container();
		card.addChild(cardContainer);
		// cardContainer.addChild(this.cardBackground);
		cardContainer.addChild(this.circleBackground);
		cardContainer.addChild(this.sprite);

		this.isCard = false;
		this.isBlock = true;
		this.cardContainer = cardContainer;//card;
		this.addChild(card);
		cardContainer.pivot.x = CARD.width / 2;
		cardContainer.x = CARD.width / 2;

		this.idleAnimationLayer1 = [];
		this.idleAnimationLayer2 = [];


		let stopFrames = [1, 4, 6, 9, 11]
		for (let index = 1; index <= 12; index++) {
			let id = index;
			if (index < 10) {
				id = "0" + index;
			}
			this.idleAnimationLayer1.push("l0_blocker_" + id + ".png")
			this.idleAnimationLayer2.push("l1_blocker_" + id + ".png")

			if (stopFrames.includes(index)) {
				this.idleAnimationLayer1.push("l0_blocker_" + id + ".png")
				this.idleAnimationLayer2.push("l1_blocker_" + id + ".png")
				this.idleAnimationLayer1.push("l0_blocker_" + id + ".png")
				this.idleAnimationLayer2.push("l1_blocker_" + id + ".png")
				this.idleAnimationLayer1.push("l0_blocker_" + id + ".png")
				this.idleAnimationLayer2.push("l1_blocker_" + id + ".png")
			}
		}

		this.frameTime = 1 / 8;
		this.currentAnimationTime = 0;
		this.currentFrame = Math.floor(Math.random() * this.idleAnimationLayer1.length);

	}
	hasAnyBlocker(){
		return true
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

		this.sprite.setTexture(PIXI.Texture.fromFrame(this.idleAnimationLayer1[this.currentFrame]));
		this.enemySpriteWhite.setTexture(PIXI.Texture.fromFrame(this.idleAnimationLayer2[this.currentFrame]));
	}
	update(delta) {
		this.updateAnimation(delta);
	}
	setZeroLife() {

	}
	forceNewColor() {

	}
	forceDestroy() {
		if (this.parent)
			this.parent.removeChild(this);
		//this.removeActionZones();
		//window.CARD_POOL.push(this);
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