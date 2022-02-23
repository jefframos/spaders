import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';
import UIButton1 from './UIButton1';
import Spring from '../effects/Spring';
import LevelSelectContainer from './LevelSelectContainer'
import colorSchemes from '../../colorSchemes';
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

		this.logoLayers = [];


		//this.logoLabel = new PIXI.Text(this.currentButtonLabel, { font: '64px', fill: config.colors.white, align: 'center', fontWeight: '800', fontFamily: window.LOGO_FONT });
		this.logoLabel = new PIXI.Sprite()//.fromFrame("logo1.png");

		this.logoLabel.rotation = -Math.PI * 0.25

		this.logoLabel.x = -130
		this.logoLabel.y = - 280
		this.logoLabel.scale.set(0.7)
		this.logoLabel.anchor.set(0.5)

		for (let index = 1; index <= 3; index++) {
			let logoLayer = new PIXI.Sprite.fromFrame("logoLayer" + index + ".png");
			logoLayer.anchor = this.logoLabel.anchor
			//logoLayer.tint = 0xFFffff * Math.random();
			//logoLayer.alpha = 0;
			this.logoLabel.addChild(logoLayer);

			logoLayer.sin = index * Math.PI / 4;
			logoLayer.maxAlpha = 0.65;
			logoLayer.minAlpha = 0;
			this.logoLayers.push(logoLayer);
		}

		this.mainLogo = new PIXI.Sprite.fromFrame("logo1.png");
		this.mainLogo.anchor = this.logoLabel.anchor

		this.mainLogo.sin = Math.PI;
		this.mainLogo.maxAlpha = 1;
		this.mainLogo.minAlpha = 0.75;

		//	this.logoLayers.push(this.mainLogo);

		this.logoLabel.addChild(this.mainLogo);

		this.gameBy = new PIXI.Text("by jeff ramos", { font: '24px', fill: config.colors.white, align: 'center', fontFamily: window.LOGO_FONT });
		this.gameBy.pivot.x = this.gameBy.width / 2;
		this.gameBy.y = this.logoLabel.height + 70
		this.logoLabel.addChild(this.gameBy);


		this.addChild(this.levelSelectionContainer);
		this.addChild(this.screenContainer);

		this.screenContainer.positionSpringX = new Spring();
		this.screenContainer.positionSpringY = new Spring();
		this.screenContainer.rotationSpring = new Spring();


		this.screenContainer.addChild(this.stripsContainer);
		this.screenContainer.addChild(this.logoLabel);
		let height = 50;
		let width = 3000;
		let spadersContainer = new PIXI.Container();
		this.spadersList = [];
		for (let index = 0; index < window.IMAGE_DATA.enemyImagesFrame.length; index++) {
			const element = window.IMAGE_DATA.enemyImagesFrame[index];
			let sprite = new PIXI.Sprite.fromFrame(element);
			sprite.tint = window.colorsOrder[index]
			spadersContainer.addChild(sprite);
			sprite.x += 80 * index;
			let spriteWhite = new PIXI.Sprite.fromFrame("w_" + element);
			sprite.addChild(spriteWhite);
			sprite.white = spriteWhite;
			this.spadersList.push(sprite);
		}
		spadersContainer.pivot.x = spadersContainer.width / 2
		spadersContainer.pivot.y = spadersContainer.height / 2
		spadersContainer.rotation = -Math.PI * 0.25
		spadersContainer.scale.set(0.65)
		spadersContainer.x = -60
		spadersContainer.y = -200
		this.screenContainer.addChild(spadersContainer);

		this.lines = [];

		let line1 = new PIXI.Graphics().beginFill(0xffffff).drawRect(-width / 2, 0, width, height);
		this.stripsContainer.addChild(line1);

		let line2 = new PIXI.Graphics().beginFill(0xffffff).drawRect(-width / 2, 0, width, height);
		this.stripsContainer.addChild(line2);
		line2.y = height;

		let line3 = new PIXI.Graphics().beginFill(0xffffff).drawRect(-width / 2, 0, width, height);
		this.stripsContainer.addChild(line3);
		line3.y = height * 2;

		this.playLine = new PIXI.Graphics().beginFill(0xffffff).drawRect(-width / 2, 0, width, height * 3);
		this.stripsContainer.addChild(this.playLine);
		this.playLine.y = height * 3;

		this.lines.push(line1)
		this.lines.push(line2)
		this.lines.push(line3)
		this.lines.push(this.playLine)

		this.stripsContainer.pivot.x = 0//this.stripsContainer.width / 2;
		this.stripsContainer.pivot.y = this.stripsContainer.height / 2;


		this.playLine.buttonMode = true;
		this.playLine.interactive = true;

		this.stripsContainer.rotation = Math.PI * -0.25



		this.playLabel = new PIXI.Text("PLAY", {
			font: '60px', fill: config.colors.background, align: 'center', fontFamily: window.LOGO_FONT,
			stroke: 0xFFFFFF,
			strokeThickness: 8
		});
		this.playLine.addChild(this.playLabel);
		this.playLabel.y = this.playLine.height / 2 - 5
		//this.playLabel.rotation = Math.PI * -0.25;
		//this.playLabel.x = -config.width / 2 + 80 + Math.cos(this.playLabel.rotation) * 200
		//this.playLabel.y = config.height / 2 - 170 + Math.sin(this.playLabel.rotation) * 200
		this.playLabel.pivot.x = this.playLabel.width / 2
		this.playLabel.pivot.y = this.playLabel.height / 2

		this.playLine.on('mouseup', this.resetGame.bind(this)).on('touchend', this.resetGame.bind(this));



		this.backButton = new UIButton1(config.colors.red2, 'icons8-close-100.png', config.colors.white);
		this.backButton.onClick.add(() => {
			//console.log("TO START")
			this.startState(0)
		});

		//this.addChild(this.backButton);

		this.playButton = new PIXI.Graphics().beginFill(window.config.colors.blue).drawCircle(0, 0, 50);

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

		this.closeApplicationButton = new UIButton1(config.colors.white, 'icons8-close-100.png', config.colors.dark);
		this.closeApplicationButton.onClick.add(() => this.gameScreen.closeApplication());
		if (window.isCordova) {
			this.addChild(this.closeApplicationButton);
		}

		this.screenContainer.positionSpringX.x = this.screenContainer.x
		this.screenContainer.positionSpringY.x = this.screenContainer.y
		this.screenContainer.rotationSpring.x = this.screenContainer.rotation

		this.updateLinesColor();

		window.COOKIE_MANAGER.onChangeColors.add(() => {
			this.updateColorScheme();
		})

		this.updateColorScheme();

	}
	updateColorScheme() {
		let colorScheme = colorSchemes.getCurrentColorScheme();

		this.gameBy.style.fill = colorScheme.fontColor
		this.mainLogo.tint = colorScheme.fontColor

		for (let index = 0; index < this.logoLayers.length - 1; index++) {
			const element = this.logoLayers[index];
			element.tint = colorScheme.fontColor;
		}
	}
	updateLinesColor() {
		console.log(window.COOKIE_MANAGER.stats.colorPalletID)
		let colors = colorSchemes.colorSchemes[window.COOKIE_MANAGER.stats.colorPalletID]

		this.gameScreen.background.updateColors(colors.list)

		for (let index = 0; index < this.lines.length; index++) {
			const element = this.lines[index];

			element.tint = colors.list[index].color;
		}

		let scheme = colorSchemes.getCurrentColorScheme();

		for (let index = 0; index < this.spadersList.length; index++) {
			const element = this.spadersList[index];

			if (scheme.list[index].hasWhite) {
				element.white.visible = true;
				element.white.tint = scheme.list[index].hasWhite;
			} else {
				element.white.visible = false;
			}

			element.tint = colors.list[index].color;
		}

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
		//this.gameScreen.resizeToFitAR({ width: this.mainCanvas.width, height: this.mainCanvas.height }, this.levelSelectionContainer, this.mainCanvas)

		let globalPos = this.toLocal({ x: 0, y: 0 })
		this.mainCanvas.position = globalPos

		this.stripsContainer.x = 0
		this.stripsContainer.y = 0


		//this.logoLabel.x = -100;
		//this.logoLabel.y = this.playLine.y - 350

		this.playLabel.text = "PLAY"

		////console.log(this.playLine.getGlobalPosition())


		this.levelSelectionContainer.y = this.mainCanvas.y
		this.backButton.y = this.mainCanvas.y + this.backButton.height


		this.screenContainer.positionSpringX.update()
		this.screenContainer.positionSpringY.update()
		this.screenContainer.rotationSpring.update()
		if (this.screenState == 1) {

			this.closeApplicationButton.alpha = utils.lerp(this.closeApplicationButton.alpha, 1, 0.5)

			this.screenContainer.rotationSpring.tx = 0;
			this.screenContainer.rotation = this.screenContainer.rotationSpring.x;

			this.screenContainer.positionSpringX.tx = this.mainCanvas.width / 2 + this.mainCanvas.x;
			this.screenContainer.x = this.screenContainer.positionSpringX.x;

			this.screenContainer.positionSpringY.tx = this.mainCanvas.height / 2 + this.mainCanvas.y;
			this.screenContainer.y = this.screenContainer.positionSpringY.x;

			this.levelSelectionContainer.x = utils.lerp(this.levelSelectionContainer.x, this.mainCanvas.width + this.mainCanvas.x + this.levelSelectionContainer.width / 2, 0.2)

			this.backButton.visible = false

			this.chooseLevelPanel.alpha = utils.lerp(this.chooseLevelPanel.alpha, 0, 0.5)
			this.backButton.scale.set(this.screenContainer.scale.x)
			this.backButton.x = utils.lerp(this.backButton.x, this.mainCanvas.x + this.mainCanvas.width + this.backButton.width, 0.5)//this.mainCanvas.width / 2* this.screenContainer.scale.x//globalPosRightCorner.x//- this.mainCanvas.x;//globalPosRightCorner.x// - 80 * this.screenContainer.scale.x


		} else if (this.screenState == 2) {


			this.closeApplicationButton.alpha = utils.lerp(this.closeApplicationButton.alpha, 0, 0.2)

			this.screenContainer.rotationSpring.tx = Math.PI * 0.25;
			this.screenContainer.rotation = this.screenContainer.rotationSpring.x;

			this.screenContainer.positionSpringX.tx = this.mainCanvas.width / 2 + this.mainCanvas.x;
			this.screenContainer.x = this.screenContainer.positionSpringX.x;

			this.screenContainer.positionSpringY.tx = this.mainCanvas.y;
			this.screenContainer.y = this.screenContainer.positionSpringY.x;

			this.backButton.scale.set(this.screenContainer.scale.x)
			this.backButton.x = utils.lerp(this.backButton.x, this.mainCanvas.x + this.mainCanvas.width - this.backButton.width, 0.2)//this.mainCanvas.width / 2* this.screenContainer.scale.x//globalPosRightCorner.x//- this.mainCanvas.x;//globalPosRightCorner.x// - 80 * this.screenContainer.scale.x

			this.backButton.visible = true

			this.chooseLevelPanel.alpha = utils.lerp(this.chooseLevelPanel.alpha, 1, 0.5)
			this.levelSelectionContainer.visible = true;
			this.levelSelectionContainer.x = this.mainCanvas.x//utils.lerp(this.levelSelectionContainer.x,  this.mainCanvas.width / 2 + this.mainCanvas.x - this.levelSelectionContainer.width / 2, 0.2)

		}

		this.chooseLevelPanel.visible = this.chooseLevelPanel.alpha > 0.1;

		////console.log(this.chooseLevelPanel.visible, this.screenState)

		this.backButton.x = this.mainCanvas.x + this.backButton.width
		this.backButton.y = this.mainCanvas.y + this.backButton.height

		let lineConvertedPosition = this.mainCanvas.toLocal(this.playLine.getGlobalPosition())
		this.chooseLevelPanel.y = lineConvertedPosition.y + this.playLine.height
		this.chooseLevelPanel.resize(innerResolution);



		this.closeApplicationButton.x = this.mainCanvas.x + this.closeApplicationButton.height * 0.75;
		this.closeApplicationButton.y = this.mainCanvas.y + this.closeApplicationButton.height * 0.75;
		this.closeApplicationButton.scale.set(0.75);

	}
	update(delta) {

		if (this.changeLabelTimer <= 0) {
			this.updateStartLabel();

		} else {
			this.changeLabelTimer -= delta;
		}

		this.chooseLevelPanel.update(delta)
		if (!delta) {
			return;
		}
		for (let index = 0; index < this.logoLayers.length; index++) {
			const element = this.logoLayers[index];
			element.sin += delta * 2;
			element.sin %= Math.PI * 2;
			element.alpha = Math.sin(element.sin) * (element.maxAlpha - element.minAlpha) + element.minAlpha
		}

	}
	startMenuState(delay = 0) {
		this.screenState = 2
		TweenLite.killTweensOf(this.screenContainer)
		//TweenLite.killTweensOf(this.levelSelectionContainer)

		TweenLite.to(this.screenContainer, 1, {
			delay: delay, alpha: 1, onStart: () => {
				window.SOUND_MANAGER.play('shoosh', { volume: 0.1 })
			}
		})
		//TweenLite.to(this.levelSelectionContainer, 1, { delay: delay, alpha: 1, x: -this.x, ease: Back.easeOut.config(1.2) })
		this.playLine.interactive = false;
		this.backButton.interactive = true;

		this.chooseLevelPanel.visible = true;
		this.levelSelectionContainer.visible = true;
		//this.levelSelectionContainer.y = -this.y;
	}
	startState(delay = 1, force = false) {
		if (force) {
			this.screenState = 1;
			this.backButton.visible = false;
			window.SOUND_MANAGER.play('shoosh', { volume: 0.1 })
			//window.SOUND_MANAGER('shoosh')
		}

		TweenLite.killTweensOf(this.screenContainer)
		//TweenLite.killTweensOf(this.levelSelectionContainer)
		this.playLine.interactive = true;
		this.backButton.interactive = false;

		TweenLite.to(this.screenContainer, force ? 0 : 0.75, {
			delay: delay, alpha: 1, onStart: () => {
				this.screenState = 1;
				if (!force) {
					window.SOUND_MANAGER.play('shoosh', { volume: 0.1 })
				}
			}
		})
	}
	updateStartLabel() {
		// if (Math.random() < 0.2) return;
		// this.logoLabel.text = window.shuffleText(this.currentButtonLabel, true);
		// this.playLabel.text = window.shuffleText("PLAY", true);
		// //this.logoLabel.style.fill = ENEMIES.list[Math.floor(ENEMIES.list.length * Math.random())].color;

		// this.changeLabelTimer = 0.5;
	}
	show(force = false, delay = 0) {
		TweenLite.killTweensOf(this.screenContainer)

		this.gameScreen.mainMenuSettings.collapse();
		//this.startState(delay, force);
		//this.startMenuState(delay, force);

		this.playLine.interactive = true;
		this.playButton.interactive = true;
		this.backButton.interactive = true;

		this.playLine.visible = true;
		this.playButton.visible = true;
		this.backButton.visible = false;
	}
	showCloseButton() {
		this.closeApplicationButton.visible = true;
	}
	showFromGame(force = false, delay = 0) {
		TweenLite.killTweensOf(this.screenContainer)
		this.screenState = 2
		//this.startMenuState(delay, force);
		this.gameScreen.mainMenuSettings.collapse();
		this.playLine.interactive = true;
		this.playButton.interactive = true;
		this.backButton.interactive = true;

		this.playLine.visible = true;
		this.playButton.visible = true;
		this.backButton.visible = true;

		this.chooseLevelPanel.showingBlockTime = 0.5;
		TweenLite.to(this.screenContainer, force ? 0 : 0.2, { alpha: 1 })
	}
	hide(force = false) {
		TweenLite.killTweensOf(this.screenContainer)
		this.gameScreen.mainMenuSettings.collapse();
		this.playLine.interactive = false;
		this.playButton.interactive = false;
		this.backButton.interactive = false;

		this.playLine.visible = false;
		this.playButton.visible = false;
		this.backButton.visible = false;
		this.screenState = 1
		this.chooseLevelPanel.visible = false;

		//console.log("HideStart")

		TweenLite.to(this.screenContainer, force ? 0 : 0.2, { alpha: 0 })


	}
	newLevelStarted() {
		this.closeApplicationButton.visible = false;
	}
	goToLevel() {
		this.hide(true);
		this.screenState = 1
		this.gameScreen.resetGame()
		console.log("GO TO LEVEL")
		this.closeApplicationButton.visible = false;


	}
	resetGame() {

		window.SOUND_MANAGER.play('tapPlay', { volume: 0.65 })

		this.gameScreen.mainMenuSettings.collapse();
		this.startMenuState();


	}
	removeEvents() {

	}
	addEvents() {
		this.removeEvents();
	}


}