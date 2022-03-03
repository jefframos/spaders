import * as PIXI from 'pixi.js';
import * as signals from 'signals';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';
import UIButton1 from './UIButton1';
import Spring from '../effects/Spring';

export default class InGameMenu extends PIXI.Container {
	constructor(color, icon, iconColor) {
		super();

		this.mainContainer = new PIXI.Container();


		this.customWidth = 60;


		this.backShape = new PIXI.mesh.NineSlicePlane(
			PIXI.Texture.fromFrame('progressBarSmall.png'), 10, 10, 10, 10)
		this.backShape.width = 290
		this.backShape.height = 100
		this.backShape.tint = config.colors.white

		this.positionSpring = new Spring();
		this.positionSpring.damp = 0.65
		
		this.openMenu = new UIButton1(config.colors.white, 'icons8-menu-48.png', config.colors.dark);
		this.openMenu.onClick.add(() => this.toggleState());

		this.closeButton = new UIButton1(config.colors.background, window.iconsData.home, config.colors.white);
		this.closeButton.onClick.add(() => {
			this.state = 1;
			this.onBack.dispatch()
		});
		this.closeButton.updateRotation(0);

		this.refreshButton = new UIButton1(config.colors.background, window.iconsData.reload, config.colors.white);
		this.refreshButton.onClick.add(() => {
			this.state = 1;
			this.onRestart.dispatch()
		});
		this.refreshButton.updateRotation(0);

		this.mainContainer.addChild(this.backShape);
		this.mainContainer.scale.set(1.5)



		this.nextLevel = new UIButton1(config.colors.background, window.iconsData.next, config.colors.white);
		this.nextLevel.onClick.add(() => {
			this.onNextLevel.dispatch()
		});
		this.nextLevel.updateRotation(0);

		this.autoPlayButton = new UIButton1(config.colors.background,  window.iconsData.reload, config.colors.white);
		this.autoPlayButton.onClick.add(() => {
			this.state = 1;
			window.AUTO_PLAY_HARD = !window.AUTO_PLAY_HARD;

			if (window.AUTO_PLAY) {
				window.TIME_SCALE = 3;
			} else {
				window.TIME_SCALE = 1;
			}

			this.onRestart.dispatch();
		});
		this.autoPlayButton.updateRotation(0);

		this.toggleSound = new UIButton1(config.colors.background, window.iconsData.soundOn, config.colors.white);
		this.toggleSound.onClick.add(() => {
			let toggle = window.SOUND_MANAGER.toggleMute();
			if (toggle) {
				this.toggleSound.updateTexture(window.iconsData.soundOff);
			} else {
				this.toggleSound.updateTexture(window.iconsData.soundOn);
			}
		});
		this.toggleSound.updateRotation(0);
		if (!window.COOKIE_MANAGER.settings.sound) {
			this.toggleSound.updateTexture(window.iconsData.soundOff);
		}

		this.positionSpring.x = -this.backShape.width;
		this.mainContainer.x = -this.backShape.width;
		this.addChild(this.mainContainer);

		this.addChild(this.openMenu);

		this.onBack = new signals.Signal()
		this.onRestart = new signals.Signal()
		this.onPause = new signals.Signal()
		this.onUnPause = new signals.Signal()
		this.onNextLevel = new signals.Signal()

		this.state = 1;

		this.buttons = [this.refreshButton, this.nextLevel, this.toggleSound, this.closeButton]

		let padding = 60
		let space = 20
		this.backShape.width = (this.refreshButton.width +space) * this.buttons.length + padding / 2
		this.backShape.height = 100
		this.refreshButton.x = this.backShape.width - padding;
		this.refreshButton.y = 50;
		for (let index = 0; index < this.buttons.length; index++) {
			let element = this.buttons[index]
			let prev = this.buttons[index - 1]
			this.mainContainer.addChild(element);
			
			element.x = this.backShape.width - element.width / 2 - ((element.width +space) * index) - padding / 2
			element.y = 50
		}

	}
	toggleState() {
		if (this.state == 1) {
			this.state = 2;
			this.onPause.dispatch();
			if (window.SOUND_MANAGER.isMute) {
				this.toggleSound.updateTexture(window.iconsData.soundOff);
			} else {
				this.toggleSound.updateTexture(window.iconsData.soundOn);
			}

		} else {
			this.collapse();
		}
	}
	collapse() {
		this.state = 1;
		this.onUnPause.dispatch();
	}
	update(delta) {

		this.positionSpring.update();
		if (this.state == 1) {
			this.openMenu.updateTexture(window.iconsData.settings)
			this.positionSpring.tx = this.backShape.width * this.mainContainer.scale.x + 50;
			this.mainContainer.x = this.positionSpring.x//utils.lerp(this.mainContainer.x, this.backShape.width * this.mainContainer.scale.x + 50, 0.5);
			this.mainContainer.alpha = utils.lerp(this.mainContainer.alpha, 0, 0.5);
		} else {
			this.openMenu.updateTexture(window.iconsData.cancel)
			this.positionSpring.tx = -this.backShape.width * this.mainContainer.scale.x
			this.mainContainer.x = this.positionSpring.x//utils.lerp(this.mainContainer.x, -this.backShape.width * this.mainContainer.scale.x, 0.5);
			this.mainContainer.alpha = utils.lerp(this.mainContainer.alpha, 1, 0.5);
		}
	}
}
