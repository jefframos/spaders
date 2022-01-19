import * as PIXI from 'pixi.js';
import config  from '../../config';
import utils  from '../../utils';
import ParticleSystem  from '../effects/ParticleSystem';
export default class Card extends PIXI.Container{
	constructor(game){
		super();
		this.game = game;		
		this.pos = {i:-1, j:-1};
		
		let card = new PIXI.Container();
		this.counter = this.MAX_COUNTER;
		this.cardBackground = new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(0,0,CARD.width, CARD.height, 0);
		this.circleBackground = new PIXI.Graphics().beginFill(0xFFFFFF).drawCircle(0,0,CARD.width/2);
		this.cardBackground3 = new PIXI.Graphics().beginFill(0x000000).drawRect(CARD.width /2 - 10,CARD.height/2,19, 10);
		// this.sprite = PIXI.Sprite.fromImage('./assets/images/block.jpg');

		// this.sprite.width = CARD.width;
		// this.sprite.height = CARD.height;

		this.sprite = PIXI.Sprite.fromImage(window.IMAGE_DATA.enemyBlockImages[0]);

		this.sprite.scale.set(CARD.width / this.sprite.width * 0.6)
		this.sprite.tint = 0x333333;
		this.sprite.anchor.set(0.5);

		this.cardBackground.alpha = 0;
		this.circleBackground.alpha = 0;

		this.sprite.x = CARD.width/2;
		this.sprite.y = CARD.height / 2;

		this.circleBackground.x = CARD.width/2;
		this.circleBackground.y = CARD.height / 2;

		let cardContainer = new PIXI.Container();
		this.cardActions = new PIXI.Container();
		card.addChild(cardContainer);
		// cardContainer.addChild(this.cardBackground);
		cardContainer.addChild(this.circleBackground);
		cardContainer.addChild(this.sprite);
		
		
		this.cardContainer = cardContainer;//card;
		this.addChild(card);
		cardContainer.pivot.x = CARD.width / 2;
		cardContainer.x = CARD.width / 2;

	}
	forceDestroy(){
		this.parent.removeChild(this);
		//this.removeActionZones();
		//window.CARD_POOL.push(this);
	}
	
	shake(force = 1, steps = 4, time = 0.5){
		let timelinePosition = new TimelineLite();
		let positionForce = (force * 50);
		let spliterForce = (force * 20);
		let speed = time / steps;
		for (var i = steps; i >= 0; i--) {
			timelinePosition.append(TweenLite.to(this.position, speed, {x: this.position.x + (Math.random() * positionForce - positionForce/2), y: this.position.y + (Math.random() * positionForce - positionForce/2), ease:"easeNoneLinear"}));
		};

		timelinePosition.append(TweenLite.to(this.position, speed, {x:this.position.x, y:this.position.y, ease:"easeeaseNoneLinear"}));		
	}
}