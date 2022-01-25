import * as PIXI from 'pixi.js';
import * as signals from 'signals';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';
import UIButton1 from './UIButton1';

export default class InGameMenu extends PIXI.Container {
	constructor(color, icon, iconColor) {
		super();

		this.mainContainer = new PIXI.Container();


		this.customWidth = 60;
		this.backShape = new PIXI.Graphics();
		this.backShape.lineStyle(2, color, 1);
		this.backShape.beginFill(0x000000);
		this.backShape.drawRect(0, 0, 290, 100);
		this.backShape.endFill();
		this.backShape.alpha = 1


		this.openMenu = new UIButton1(config.colors.white, './assets/images/icons/icons8-menu-48.png', config.colors.dark);
		this.openMenu.onClick.add(() => this.toggleState());

		this.closeButton = new UIButton1(config.colors.red2, './assets/images/icons/icons8-back-128.png', config.colors.dark);
		this.closeButton.onClick.add(() => {
			this.state = 1;
			this.onBack.dispatch()
		});
		this.closeButton.backShape.rotation = 0

		this.refreshButton = new UIButton1(config.colors.blue, './assets/images/icons/icons8-refresh-64.png', config.colors.dark);
		this.refreshButton.onClick.add(() => {
			this.state = 1;
			this.onRestart.dispatch()
		});
		this.refreshButton.backShape.rotation = 0

		this.mainContainer.addChild(this.backShape);
		this.mainContainer.scale.set(1.5)

		this.autoPlayButton = new UIButton1(config.colors.blue, './assets/images/icons/icons8-refresh-64.png', config.colors.dark);
		this.autoPlayButton.onClick.add(() => {
			this.state = 1;
			window.AUTO_PLAY = !window.AUTO_PLAY;
			this.onRestart.dispatch();
		});
		this.autoPlayButton.backShape.rotation = 0

		this.mainContainer.x = -this.backShape.width;
		this.addChild(this.mainContainer);
		this.mainContainer.addChild(this.closeButton);
		this.mainContainer.addChild(this.refreshButton);
		this.mainContainer.addChild(this.autoPlayButton);
		this.refreshButton.x = this.backShape.width - 60
		this.closeButton.x = this.refreshButton.x - 90
		this.refreshButton.y = 50
		this.closeButton.y = this.refreshButton.y;

		this.autoPlayButton.x = this.closeButton.x - 90;
		this.autoPlayButton.y = this.refreshButton.y;

		this.addChild(this.openMenu);

		this.onBack = new signals.Signal()
		this.onRestart = new signals.Signal()

		this.state = 1;
	}
	toggleState() {
		console.log("STATE", this.state)
		if (this.state == 1) {
			this.state = 2;
		} else {
			this.state = 1;
		}
	}
	update(delta) {
		if (this.state == 1) {
			this.openMenu.updateTexture('./assets/images/icons/icons8-menu-48.png')
			this.mainContainer.x = utils.lerp(this.mainContainer.x, this.backShape.width * this.mainContainer.scale.x + 50, 0.5);
			this.mainContainer.alpha = utils.lerp(this.mainContainer.alpha, 0, 0.5);
		} else {
			this.openMenu.updateTexture('./assets/images/icons/icons8-close-100.png')
			this.mainContainer.x = utils.lerp(this.mainContainer.x, -this.backShape.width * this.mainContainer.scale.x, 0.5);
			this.mainContainer.alpha = utils.lerp(this.mainContainer.alpha, 1, 0.5);
		}
	}
}
