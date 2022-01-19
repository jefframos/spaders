import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';
import Screen from '../../screenManager/Screen'
import Grid from '../elements/Grid'
import Card from '../elements/Card'
import Block from '../elements/Block'
import LevelSelectContainer from './LevelSelectContainer'
import Board from '../core/Board'
import BackgroundEffects from '../effects/BackgroundEffects'
import { debug } from 'webpack';

export default class StartScreenContainer extends PIXI.Container {
	constructor(screen) {
		super();

		this.gameScreen = screen;
		this.currentButtonLabel = 'SPADERS';

		this.levelSelectionContainer = new PIXI.Container();
		this.screenContainer = new PIXI.Container();
		this.stripsContainer = new PIXI.Container();
		this.chooseLevelPanel = new LevelSelectContainer(this.gameScreen);
		this.changeLabelTimer = 0;

		this.levelSelectionContainer.addChild(this.chooseLevelPanel);

		this.chooseLevelPanel.x = 0;
		this.chooseLevelPanel.y = 150;
		this.logoLabel = new PIXI.Text(window.shuffleText(this.currentButtonLabel, true), { font: '90px', fill: 0xFFFFFF, align: 'center', fontWeight: '800', fontFamily: 'round_popregular' });

		this.addChild(this.screenContainer);
		this.addChild(this.levelSelectionContainer);

		this.screenContainer.addChild(this.stripsContainer);
		this.screenContainer.addChild(this.logoLabel);
		let height = 50;
		let width = 3000;
		let line1 = new PIXI.Graphics().beginFill(window.config.colors.blue2).drawRect(-width / 2, 0, width, height);
		this.stripsContainer.addChild(line1);

		let line2 = new PIXI.Graphics().beginFill(window.config.colors.red).drawRect(-width / 2, 0, width, height);
		this.stripsContainer.addChild(line2);
		line2.y = height;

		let line3 = new PIXI.Graphics().beginFill(window.config.colors.yellow).drawRect(-width / 2, 0, width, height);
		this.stripsContainer.addChild(line3);
		line3.y = height * 2;

		this.playLine = new PIXI.Graphics().beginFill(window.config.colors.green).drawRect(-width / 2, 0, width, height * 3);
		this.stripsContainer.addChild(this.playLine);
		this.playLine.y = height * 3;


		this.stripsContainer.pivot.x = 0//this.stripsContainer.width / 2;
		this.stripsContainer.pivot.y = this.stripsContainer.height / 2;


		this.logoLabel.pivot.x = this.logoLabel.width / 2;
		this.logoLabel.pivot.y = this.logoLabel.height / 2;

		this.playLine.buttonMode = true;
		this.playLine.interactive = true;

		this.stripsContainer.rotation = Math.PI * -0.25

		this.logoLabel.rotation = -Math.PI * 0.25

		this.logoLabel.x = 0
		this.logoLabel.y = - 290

		this.logoLabel.pivot.x = this.logoLabel.width / 2
		this.logoLabel.pivot.y = this.logoLabel.height / 2

		this.playLabel = new PIXI.Text("PLAY", { font: '60px', fill: 0x000000, align: 'center', fontWeight: '800', fontFamily: 'round_popregular' });
		this.screenContainer.addChild(this.playLabel);
		this.playLabel.rotation = Math.PI * -0.25;
		this.playLabel.x = -config.width / 2 + 80 + Math.cos(this.playLabel.rotation) * 200
		this.playLabel.y = config.height / 2 - 170 + Math.sin(this.playLabel.rotation) * 200
		this.playLabel.pivot.x = this.playLabel.width / 2
		this.playLabel.pivot.y = this.playLabel.height / 2

		this.playLine.on('mousedown', this.resetGame.bind(this)).on('touchstart', this.resetGame.bind(this));



		this.backButton = new PIXI.Graphics().beginFill(window.config.colors.red).drawCircle(0, 0, 40);
		this.addChild(this.backButton);

		this.backButton.x = config.width + this.backButton.width;

		this.backButton.buttonMode = true;
		this.backButton.interactive = true;

		this.backButton.on('mousedown', this.startState.bind(this)).on('touchstart', this.startState.bind(this));


		this.playButton = new PIXI.Graphics().beginFill(window.config.colors.blue).drawCircle(0, 0, 50);
		//this.levelSelectionContainer.addChild(this.playButton);


		this.playButton.x = config.width - 80
		this.playButton.y = this.backButton.y
		this.playButton.buttonMode = true;
		this.playButton.interactive = true;

		this.playButton.on('mousedown', this.goToLevel.bind(this)).on('touchstart', this.goToLevel.bind(this));

		this.levelSelectionContainer.x = config.width;
		this.levelSelectionContainer.y = -this.y;
		this.levelSelectionContainer.visible = false;

		this.mainCanvas = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, config.width, config.height);
		this.addChild(this.mainCanvas)
		this.mainCanvas.alpha = 0

		this.center = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, 10);
		this.screenContainer.addChild(this.center)
		this.center.alpha = 0
		this.screenState = 1
	}
	getRect(size = 4, color = 0xFFFFFF) {
		return new PIXI.Graphics().beginFill(color).drawRect(0, 0, size, size);
	}

	getMask() {
		this.currentMask = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, this.stripsContainer.width, this.stripsContainer.height);
		this.currentMask.rotation = this.stripsContainer.rotation;
		this.currentMask.pivot.x = this.stripsContainer.pivot.x
		this.currentMask.pivot.y = this.stripsContainer.pivot.y
		this.currentMask.x = this.x
		this.currentMask.y = this.y
		return this.currentMask
	}
	resize(innerResolution, ratio) {
		this.mainCanvas.width = innerResolution.width;
		this.mainCanvas.height = innerResolution.height;

		this.gameScreen.resizeToFitAR({ width: this.mainCanvas.width, height: this.mainCanvas.height }, this.screenContainer, this.mainCanvas)
		this.gameScreen.resizeToFitAR({ width: this.mainCanvas.width, height: this.mainCanvas.height }, this.levelSelectionContainer, this.mainCanvas)


		let globalPos = this.toLocal({ x: 0, y: 0 })
		this.mainCanvas.position = globalPos

		this.stripsContainer.x = 0
		this.stripsContainer.y = 0


		this.logoLabel.x = -100;
		this.logoLabel.y = this.playLine.y - 350


		this.playLabel.x = 50
		this.playLabel.y = this.playLine.y - 85
		this.playLabel.text = "PLAY"

		
		this.levelSelectionContainer.y = this.mainCanvas.y
		this.backButton.y = this.mainCanvas.y + this.backButton.height

		if (this.screenState == 1) {

			this.screenContainer.x = this.mainCanvas.width / 2 + this.mainCanvas.x
			this.screenContainer.y = utils.lerp(this.screenContainer.y, this.mainCanvas.height / 2 + this.mainCanvas.y, 0.5)

			this.levelSelectionContainer.x = utils.lerp(this.levelSelectionContainer.x,  this.mainCanvas.width  + this.mainCanvas.x + this.levelSelectionContainer.width / 2, 0.2)

			this.backButton.scale.set(this.screenContainer.scale.x)
			this.backButton.x = utils.lerp(this.backButton.x, this.mainCanvas.x + this.mainCanvas.width + this.backButton.width, 0.2)//this.mainCanvas.width / 2* this.screenContainer.scale.x//globalPosRightCorner.x//- this.mainCanvas.x;//globalPosRightCorner.x// - 80 * this.screenContainer.scale.x


		} else if (this.screenState == 2) {
			this.screenContainer.x = this.mainCanvas.width / 2 + this.mainCanvas.x
			this.screenContainer.y = utils.lerp(this.screenContainer.y, this.mainCanvas.y, 0.5)


			//this.backButton.visible = true;
			this.backButton.scale.set(this.screenContainer.scale.x)
			this.backButton.x = utils.lerp(this.backButton.x, this.mainCanvas.x + this.mainCanvas.width - this.backButton.width, 0.2)//this.mainCanvas.width / 2* this.screenContainer.scale.x//globalPosRightCorner.x//- this.mainCanvas.x;//globalPosRightCorner.x// - 80 * this.screenContainer.scale.x

			this.levelSelectionContainer.visible = true;
			this.levelSelectionContainer.x = utils.lerp(this.levelSelectionContainer.x,  this.mainCanvas.width / 2 + this.mainCanvas.x - this.levelSelectionContainer.width / 2, 0.2)

		}
	}
	update(delta) {

		if (this.changeLabelTimer <= 0) {
			this.updateStartLabel();

		} else {
			this.changeLabelTimer -= delta;
		}

	}
	startMenuState(delay = 0) {
		this.screenState = 2
		TweenLite.killTweensOf(this.screenContainer)
		//TweenLite.killTweensOf(this.levelSelectionContainer)

		TweenLite.to(this.screenContainer, 1, { delay: delay, alpha: 1, rotation: Math.PI * 0.25, ease: Back.easeOut.config(1.2) })
		//TweenLite.to(this.levelSelectionContainer, 1, { delay: delay, alpha: 1, x: -this.x, ease: Back.easeOut.config(1.2) })
		this.playLine.interactive = false;
		this.backButton.interactive = true;

		this.chooseLevelPanel.visible = true;
		this.levelSelectionContainer.visible = true;
		//this.levelSelectionContainer.y = -this.y;
	}
	startState(delay = 1, force = false) {
		if(force){
			this.screenState = 1;
			this.backButton.visible = false;
		}
		TweenLite.killTweensOf(this.screenContainer)
		//TweenLite.killTweensOf(this.levelSelectionContainer)
		this.playLine.interactive = true;
		this.backButton.interactive = false;
		
		TweenLite.to(this.screenContainer, force ? 0 : 0.75, { delay: delay, alpha: 1, rotation: 0, ease: Cubic.easeOut, onStart:()=>{
			this.screenState = 1;
			
		} })
	}
	updateStartLabel() {
		if (Math.random() < 0.2) return;
		this.logoLabel.text = window.shuffleText(this.currentButtonLabel, true);
		this.playLabel.text = window.shuffleText("PLAY", true);
		//this.logoLabel.style.fill = ENEMIES.list[Math.floor(ENEMIES.list.length * Math.random())].color;

		this.changeLabelTimer = 0.5;
	}
	show(force = false, delay = 0) {
		TweenLite.killTweensOf(this.screenContainer)

		this.startState(delay, force);

		this.playLine.interactive = true;
		this.playButton.interactive = true;
		this.backButton.interactive = true;

		this.playLine.visible = true;
		this.playButton.visible = true;
		this.backButton.visible = false;
	}
	showFromGame(force = false, delay = 0) {
		TweenLite.killTweensOf(this.screenContainer)

		this.startMenuState(delay, force);

		this.playLine.interactive = true;
		this.playButton.interactive = true;
		this.backButton.interactive = true;

		this.playLine.visible = true;
		this.playButton.visible = true;
		this.backButton.visible = true;

	}
	hide(force = false) {
		TweenLite.killTweensOf(this.screenContainer)
		this.playLine.interactive = false;
		this.playButton.interactive = false;
		this.backButton.interactive = false;

		this.playLine.visible = false;
		this.playButton.visible = false;
		this.backButton.visible = false;

		this.chooseLevelPanel.visible = false;

		TweenLite.to(this.screenContainer, force ? 0 : 0.2, { alpha: 0 })


	}
	goToLevel() {
		this.hide(true);
		this.screenState = 1
		this.gameScreen.resetGame()
	}
	resetGame() {
		this.startMenuState();
	}
	removeEvents() {

	}
	addEvents() {
		this.removeEvents();
	}


}