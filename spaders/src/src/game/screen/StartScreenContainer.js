import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';
import UIButton1 from './UIButton1';
import Spring from '../effects/Spring';
import LevelSelectContainer from './LevelSelectContainer'
import colorSchemes from '../../colorSchemes';
import Planet from './Planet';
import SprteSpritesheetAnimation from './SprteSpritesheetAnimation';
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

		this.planet = new Planet()// new PIXI.Sprite()//.fromFrame("l0_planet_2_1.png");

	


		this.logoLabel = new PIXI.Text(this.currentButtonLabel, { font: '64px', fill: config.colors.white, align: 'center', fontWeight: '800', fontFamily: window.LOGO_FONT, stroke:0, strokeThickness:8 });
		//this.logoLabel = new PIXI.Sprite()//.fromFrame("logo1.png");

		// this.logoLabel.scale.set(0.7)
		this.logoLabel.anchor.set(0.5)
		
		this.gameBy = new PIXI.Text("by jeff ramos", { font: '18px', fill: config.colors.white, align: 'center', fontFamily: window.LOGO_FONT });
		this.gameBy.pivot.x = this.gameBy.width / 2;
		this.logoLabel.addChild(this.gameBy);
		//this.logoLabel.visible = false;
		//this.logoLabel.addChild(this.planet);
		this.gameBy.y = this.logoLabel.height / 2 // + 70
		
		
		this.addChild(this.levelSelectionContainer);
		this.addChild(this.screenContainer);
		
		this.screenContainer.positionSpringX = new Spring();
		this.screenContainer.positionSpringY = new Spring();
		this.screenContainer.rotationSpring = new Spring();
		this.screenContainer.rotationSpring.damp = 0.6
		this.screenContainer.positionSpringY.damp = 0.7
		
		this.screenContainer.addChild(this.stripsContainer);
		let height = 35;
		let width = 3000;
		this.spadersContainer = new PIXI.Container();

		this.spadersContainer.addChild(this.planet);

		this.spadersList = [];
		
		let order = [8,3,6,4,0,1,7,2,5,9]
		//let order = [3,6,4,1,0,2,5,9]
		for (let index = 0; index < window.IMAGE_DATA.enemyImagesFrame.length; index++) {
			let element = window.IMAGE_DATA.enemyImagesFrame[order[index]];

			let sprite = new SprteSpritesheetAnimation();

			let spaderID = (order[index])%5 + 1

			sprite.addLayer("l0_spader_"+spaderID+"_", {min:1, max:5}, 0.15)
			sprite.addLayer("l1_spader_"+spaderID+"_", {min:1, max:5}, 0.15)

			sprite.tint = window.colorsOrder[order[index]]
			this.spadersContainer.addChild(sprite);
			if(index > 0){
				sprite.x += this.spadersList[index - 1].x + this.spadersList[index - 1].width / 2;
				
			}
			this.spadersList.push(sprite)
			let n = ((index+1) / window.IMAGE_DATA.enemyImagesFrame.length)
			sprite.x = Math.sin(n * (Math.PI * 2)) * 300
			sprite.y = Math.cos(n * Math.PI) *Math.cos(n * Math.PI) * -80 + 80
			
			sprite.scale.set( Math.sin(n * Math.PI) * 0.25 + 0.75)
		}
		
		this.spadersContainer.children.sort((a,b) => (a.y > b.y) ? 1 : ((b.y > a.y) ? -1 : 0))
		
		this.spadersOfset = 0;

		
		this.spadersContainer.rotation = -Math.PI * 0.25
		this.planet.rotation = -this.spadersContainer.rotation
		this.planet.x = 50
		//this.planet.scale.set(2)
		this.planet.sin = 0;

		this.spadersContainer.x = 60
		this.spadersContainer.y = - 350

		this.spadersContainer.pivot.x = this.spadersContainer.width / 2
		this.spadersContainer.pivot.y = this.spadersContainer.height / 2
		//this.spadersContainer.rotation = -Math.PI * 0.25
		this.spadersContainer.scale.set(0.65)
		//this.spadersContainer.x = 0
		//this.spadersContainer.y = 110
		this.spadersContainer.addChild(this.logoLabel);
		this.logoLabel.x = 20
		this.logoLabel.y = 220
		this.logoLabel.scale.set(1.5)
		this.screenContainer.addChild(this.spadersContainer);


		this.lines = [];

		let line1 = new PIXI.Graphics().beginFill(0xffffff).drawRect(-width / 2, 0, width, height);
		this.stripsContainer.addChild(line1);

		let line2 = new PIXI.Graphics().beginFill(0xffffff).drawRect(-width / 2, 0, width, height);
		this.stripsContainer.addChild(line2);
		line2.y = height;

		let line3 = new PIXI.Graphics().beginFill(0xffffff).drawRect(-width / 2, 0, width, height);
		this.stripsContainer.addChild(line3);
		line3.y = height * 2;

		this.playLine = new PIXI.Graphics().beginFill(0xffffff).drawRect(-width / 2, 0, width, height * 2);
		this.stripsContainer.addChild(this.playLine);
		this.playLine.y = height * 3;


		this.lines.push(line1)
		this.lines.push(line2)
		this.lines.push(line3)
		this.lines.push(this.playLine)

		this.stripsContainer.pivot.x = 0
		this.stripsContainer.pivot.y = this.stripsContainer.height / 2;


		this.stripsContainer.rotation = Math.PI * -0.25



		this.playLabel = new PIXI.Text("Choose your level", {
			font: '24px', fill: config.colors.background, fontWeight: '800',align: 'center', fontFamily: window.STANDARD_FONT1,
			// stroke: 0xFFFFFF,
			// strokeThickness: 4
		});
		this.playLine.addChild(this.playLabel);
		this.playLabel.y = this.playLine.height / 2 - 2

		this.mainMenuButtons = [];

		this.mainMenucontainer = new PIXI.Container();
		
		this.chooseLevelButton = new UIButton1(config.colors.dark, window.iconsData.next, config.colors.white);
		this.chooseLevelButton.addLabelLeftMenu("PLAY");
		this.chooseLevelButton.updateRotation(0, true);	
		//this.chooseLevelButton.icon.rotation = Math.PI / 4
		this.chooseLevelButton.scale.set(0.85)
		this.chooseLevelButton.onClick.add(this.resetGame.bind(this))
		
		this.howToPlayButton = new UIButton1(config.colors.dark, window.iconsData.question, config.colors.white);
		this.howToPlayButton.addLabelLeftMenu("HELP");
		this.howToPlayButton.updateRotation(0, true);		
		//this.howToPlayButton.icon.rotation = Math.PI / 4
		this.howToPlayButton.scale.set(0.85)
		this.howToPlayButton.onClick.add(this.onHowToPlay.bind(this))

		this.settingsButton = new UIButton1(config.colors.dark, window.iconsData.settings, config.colors.white);
		this.settingsButton.addLabelLeftMenu("SETTINGS");
		this.settingsButton.updateRotation(0, true);		
		//this.settingsButton.icon.rotation = Math.PI / 4
		this.settingsButton.scale.set(0.85)
		this.settingsButton.onClick.add(this.onSettings.bind(this))

		this.mainMenuButtons.push(this.chooseLevelButton);
		this.mainMenuButtons.push(this.howToPlayButton);
		this.mainMenuButtons.push(this.settingsButton);
		
		for (let index = 0; index < this.mainMenuButtons.length; index++) {
			const element = this.mainMenuButtons[index];
			
			this.mainMenucontainer.addChild(element)
			element.x = 190 - index * 70
			element.y = 130 + index * 70
		}
		this.playLine.addChild(this.mainMenucontainer)
		
		this.playLabel.pivot.x = this.playLabel.width / 2
		this.playLabel.pivot.y = this.playLabel.height / 2



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
		this.logoLabel.style.fill = colorScheme.logoColor
		this.logoLabel.style.stroke = colorScheme.buttonData.buttonStandardDarkColor;
		this.playLabel.style.fill = colorScheme.fontColor

		//this.mainLogo.tint = colorScheme.fontColor

		for (let index = 0; index < this.logoLayers.length - 1; index++) {
			const element = this.logoLayers[index];
			element.tint = colorScheme.fontColor;
		}

		this.mainMenuButtons.forEach(element => {
			element.updateMenuColors(colorScheme.background, colorScheme.fontColor);

			//element.updateMenuColors(colorScheme.fontColor, colorScheme.background);
			
		});
		this.updateLinesColor();
		//this.staticLogo.tint = colorScheme.fontColor;
	}
	updateLinesColor() {
		//console.log(window.COOKIE_MANAGER.stats.colorPalletID)
		let colors = colorSchemes.colorSchemes[window.COOKIE_MANAGER.stats.colorPalletID]

		this.gameScreen.background.updateColors(colors.list)


		this.planet.tint = colors.list[0].color;
		this.planet.updateColors(colors)

		if(colors.planetID){
			this.planet.updateMapTextures(colors.planetID);
		}else{
			this.planet.updateMapTextures(0);
		}

		for (let index = 0; index < this.lines.length; index++) {
			const element = this.lines[index];

			element.tint = colors.list[index].color;
		}

		let scheme = colorSchemes.getCurrentColorScheme();

		for (let index = 0; index < this.spadersList.length; index++) {
			const element = this.spadersList[index];		
			element.tintLayer(0, colors.list[index].color);
		}

	}
	onSettings(){
		this.gameScreen.mainMenuSettings.open()
	}
	onHowToPlay(){
		this.gameScreen.openTutorial();
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
	updateSpadersPosition(delta){


		this.planet.sin += delta;

		this.planet.sin %= Math.PI * 2

		this.planet.x = 60
		this.planet.pivot.x = 150
		this.planet.pivot.y = 150
		this.planet.y = Math.floor(Math.sin(this.planet.sin) * 10) //- 120

		this.spadersOfset += delta  * 0.1;
		this.spadersOfset %= Math.PI * 2;
		let w = 200 + Math.sin(this.planet.sin) * 40
		let h = 120
		for (let index = 0; index < this.spadersList.length; index++) {
			const element = this.spadersList[index];
			let n = ((index+1) / this.spadersList.length) + this.spadersOfset + Math.PI / 4;
			element.x = Math.sin(n * (Math.PI * 2)) * w //+ 280
			element.y = Math.cos(n * Math.PI) *Math.cos(n * Math.PI) * -h + (h/2)

			element.scale.set( ((element.y / 120) * 0.35 + 0.85) * 0.75)
			element.update(delta)

		}

		this.spadersContainer.children.sort((a,b) => (a.y > b.y) ? 1 : ((b.y > a.y) ? -1 : 0))

		

	}
	resize(innerResolution, ratio) {
		// if(this.innerResolution && this.innerResolution.width == window.innerWidth && window.innerWidth.height == window.innerHeight){
		// 	return
		// }
		this.innerResolution = innerResolution;
		this.mainCanvas.width = innerResolution.width;
		this.mainCanvas.height = innerResolution.height;

		this.gameScreen.resizeToFitAR({ width: this.mainCanvas.width, height: this.mainCanvas.height }, this.screenContainer, this.mainCanvas)
		//this.gameScreen.resizeToFitAR({ width: this.mainCanvas.width, height: this.mainCanvas.height }, this.levelSelectionContainer, this.mainCanvas)

		let globalPos = this.toLocal({ x: 0, y: 0 })
		this.mainCanvas.position = globalPos

		this.stripsContainer.x = 0
		this.stripsContainer.y = 0



		this.levelSelectionContainer.y = this.mainCanvas.y
		this.backButton.y = this.mainCanvas.y + this.backButton.height


		
		////console.log(this.chooseLevelPanel.visible, this.screenState)

		this.backButton.x = this.mainCanvas.x + this.backButton.width
		this.backButton.y = this.mainCanvas.y + this.backButton.height

		let lineConvertedPosition = this.mainCanvas.toLocal(this.playLine.getGlobalPosition())
		this.chooseLevelPanel.y = lineConvertedPosition.y + (35 * 3) * this.screenContainer.scale.x;



		this.closeApplicationButton.x = this.mainCanvas.x + this.closeApplicationButton.height * 0.75;
		this.closeApplicationButton.y = this.mainCanvas.y + this.closeApplicationButton.height * 0.75;
		this.closeApplicationButton.scale.set(0.75);

	}
	updatePositions(){
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

			this.mainMenucontainer.alpha = utils.lerp(this.mainMenucontainer.alpha, 1, 0.5)
			this.mainMenucontainer.visible = this.mainMenucontainer.alpha > 0.2

			this.playLabel.alpha = utils.lerp(this.playLabel.alpha, 0, 0.5)

			this.chooseLevelPanel.alpha = utils.lerp(this.chooseLevelPanel.alpha, 0, 0.5)
			this.backButton.scale.set(this.screenContainer.scale.x)
			this.backButton.x = utils.lerp(this.backButton.x, this.mainCanvas.x + this.mainCanvas.width + this.backButton.width, 0.5)//this.mainCanvas.width / 2* this.screenContainer.scale.x//globalPosRightCorner.x//- this.mainCanvas.x;//globalPosRightCorner.x// - 80 * this.screenContainer.scale.x


		} else if (this.screenState == 2) {


			this.closeApplicationButton.alpha = utils.lerp(this.closeApplicationButton.alpha, 0, 0.2)

			this.screenContainer.rotationSpring.tx = Math.PI * 0.25;
			this.screenContainer.rotation = this.screenContainer.rotationSpring.x;

			this.screenContainer.positionSpringX.tx = this.mainCanvas.width / 2 + this.mainCanvas.x;
			this.screenContainer.x = this.screenContainer.positionSpringX.x;

			//this.screenContainer.positionSpringY.tx = this.mainCanvas.y - 17 * this.screenContainer.scale.x;
			this.screenContainer.positionSpringY.tx = this.mainCanvas.y - (35 * 3) * this.screenContainer.scale.x;
			this.screenContainer.y = this.screenContainer.positionSpringY.x;

			this.backButton.scale.set(this.screenContainer.scale.x)
			this.backButton.x = utils.lerp(this.backButton.x, this.mainCanvas.x + this.mainCanvas.width - this.backButton.width, 0.2)//this.mainCanvas.width / 2* this.screenContainer.scale.x//globalPosRightCorner.x//- this.mainCanvas.x;//globalPosRightCorner.x// - 80 * this.screenContainer.scale.x

			this.backButton.visible = true

			this.chooseLevelPanel.alpha = utils.lerp(this.chooseLevelPanel.alpha, 1, 0.5)
			this.levelSelectionContainer.visible = true;
			this.levelSelectionContainer.x = this.mainCanvas.x//utils.lerp(this.levelSelectionContainer.x,  this.mainCanvas.width / 2 + this.mainCanvas.x - this.levelSelectionContainer.width / 2, 0.2)

			this.mainMenucontainer.alpha = utils.lerp(this.mainMenucontainer.alpha, 0, 0.5)
			this.mainMenucontainer.visible = this.mainMenucontainer.alpha > 0.2

			this.playLabel.alpha = utils.lerp(this.playLabel.alpha, 1, 0.5)

			this.chooseLevelPanel.resize(this.innerResolution);

		}

		this.chooseLevelPanel.visible = this.chooseLevelPanel.alpha > 0.1;

	}
	update(delta) {

		this.updatePositions();
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
			element.sin += delta * element.speed;
			element.sin %= Math.PI * 2;
			element.alpha = Math.sin(element.sin) * (element.maxAlpha - element.minAlpha) + element.minAlpha
		}

		if (this.screenState == 1) {

			this.updateSpadersPosition(delta);
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

		this.chooseLevelPanel.updateStartState();
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
	showFromGame(force = false, delay = 0, redirectData = null) {
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
		this.chooseLevelPanel.show();
		if(redirectData){
			this.chooseLevelPanel.setRedirectData(redirectData);
		}
		
		this.chooseLevelPanel.showingBlockTime = 0.5;
		TweenLite.to(this.screenContainer, force ? 0 : 0.2, { alpha: 1 })

		this.chooseLevelPanel.addWorldBackgroundColor();
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

		this.gameScreen.currentGameState = 1
		
		console.log("GO TO LEVEL")
		this.closeApplicationButton.visible = false;
		
		
	}
	resetGame() {
		
		window.SOUND_MANAGER.play('tapPlay', { volume: 0.65 })
		
		this.gameScreen.mainMenuSettings.collapse();
		this.chooseLevelPanel.show();
		this.startMenuState();


	}
	removeEvents() {

	}
	addEvents() {
		this.removeEvents();
	}


}