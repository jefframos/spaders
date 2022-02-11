import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';
import StarParticle from './StarParticle';
import TweenLite from 'gsap';

export default class BackgroundEffects extends PIXI.Container {
	constructor() {

		super();
		this.stars = [];

		this.background = new PIXI.Container();
		this.addChild(this.background);

		
		//this.backgroundImage = PIXI.Sprite.fromImage("./assets/images/background.png");
		//this.background.addChild(this.backgroundImage);
		this.backgroundShape = new PIXI.Graphics().beginFill(config.colors.background).drawRect(0, 0, 10, 10);
		this.background.addChildAt(this.backgroundShape, 0);
		//this.backgroundImage.anchor.set(0.5)
		
		//this.backgroundImage.alpha = 0.5

		//this.backgroundImage.blendMode = PIXI.BLEND_MODES.ADD
		
		this.starsContainer = new PIXI.Container();
		this.addChild(this.starsContainer);


		this.innerResolution = { width: config.width, height: config.height }


		this.addStars();
	

		this.starsMoveTimer = 0;

		this.starsDeacc = 0.9;

		this.currentSpeed = {
			x: 0,
			y: 200
		}


		window.fxSpeed = 1;
		// let center = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0,0,10);
		// this.starsContainer.addChild(center)

	}
	resize(scaledResolution, innerResolution) {

		this.innerResolution = innerResolution;
		//console.log(resolution, innerResolution)
		this.background.width = innerResolution.width
		this.background.height = innerResolution.height

		this.background.x = -innerResolution.width / 2
		this.background.y = -innerResolution.height / 2

		//this.starsContainer.width = innerResolution.width
		//this.starsContainer.height = innerResolution.height

		//this.starsContainer.x = -innerResolution.width / 2
		//this.starsContainer.y = -innerResolution.height / 2

	}
	updateColors(colorList){
		for (var i = 0; i < this.stars.length; i++) {
			this.stars[i].graphics.tint = colorList[ Math.floor(Math.random() * colorList.length * 0.5)].color;
		}
	}
	changeStates(type = 'start') {
		return
		if (type == 'start') {
			TweenLite.to(this.groundContainer, 2, {
				y: 0
			});
			// this.groundContainer
		}
		if (type == 'load') {
			TweenLite.to(this.groundContainer, 2, {
				y: 400
			});
			// this.groundContainer
		}
	}
	update(delta) {

		//console.log(this.stars)
		if(window.fxSpeed > 1){
			window.fxSpeed -= delta * 5;
			if(window.fxSpeed < 1){
				window.fxSpeed = 1;
			}
		}
		this.currentSpeed.y = this.innerResolution.height * 0.05 * window.fxSpeed

		//console.log(this.currentSpeed.y, delta)
		let spd = this.currentSpeed.y * delta;
		if(spd){
			for (var i = 0; i < this.stars.length; i++) {
				this.stars[i].update(this.currentSpeed.y * delta, this.innerResolution);
			}
		}
	}
	addStars() {
		let totalStars = this.innerResolution.width * 0.08;

		totalStars = Math.min(40, totalStars);
		let l = this.innerResolution.width * 0.001
		l = Math.max(l, 1)
		this.stars = [];
		for (var i = 0; i < totalStars; i++) {
			let dist = Math.random() * (l *2) + l;
			let tempStar = new StarParticle(dist);
			tempStar.alpha = (Math.min(dist, 3) / 3 * 0.4) + 0.2
			let toClose = true;
			let acc = 5;
			while (toClose || acc > 0) {
				acc--;
				let angle = Math.random() * Math.PI * 2;
				let max = Math.max(this.innerResolution.width, this.innerResolution.height)
				let radius = Math.random() * max + 20;
				tempStar.x = Math.cos(angle) * radius// - this.innerResolution.width/2;
				tempStar.y = Math.sin(angle) * radius// - this.innerResolution.height/2;
				toClose = false;
				for (var j = 0; j < this.stars.length; j++) {
					let distance = utils.distance(this.stars[j].x, this.stars[j].y, tempStar.x, tempStar.y)
					if (distance > 15) { } else {
						toClose = true;
						break
					}
				}
			}
			this.starsContainer.addChild(tempStar);
			this.stars.push(tempStar)
		}
	}

	changeColors(type = 'morning') {

		CURRENT_SKYCOLOR = SKYCOLOR[type];
		utils.addColorTween(this.topGradient, this.topGradient.tint, SKYCOLOR[type].top);
		utils.addColorTween(this.bottomGradient, this.bottomGradient.tint, SKYCOLOR[type].bottom);
		utils.addColorTween(this.bigblur, this.bigblur.tint, SKYCOLOR[type].blur);
		utils.addColorTween(this.additiveSky, this.additiveSky.tint, SKYCOLOR[type].additiveSky);
		// utils.addColorTween(this.front1, this.front1.tint, SKYCOLOR[type].front1);
		// utils.addColorTween(this.front2, this.front2.tint, SKYCOLOR[type].front2);
		// utils.addColorTween(this.front3, this.front3.tint, SKYCOLOR[type].front3);
		utils.addColorTween(this.fogGradient, this.fogGradient.tint, SKYCOLOR[type].fogGradient);
		// utils.addColorTween(this.man, this.man.tint, SKYCOLOR[type].man);
	}

}