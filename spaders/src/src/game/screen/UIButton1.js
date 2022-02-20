import * as PIXI from 'pixi.js';
import * as signals from 'signals';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';

export default class UIButton1 extends PIXI.Container {
	constructor(color, icon, iconColor, width = 60) {
		super();

		this.mainContainer = new PIXI.Container();
		//this.backShape = PIXI.Sprite.fromImage('./assets/images/rect.png');
		this.icon = PIXI.Sprite.fromFrame(icon);
		this.icon.tint = iconColor;

		// this.backShape = new PIXI.Graphics();
		// //this.backShape.lineStyle(3, color, 1);
		// this.backShape.beginFill(color);
		// this.backShape.drawRect(-width/2,-width/2,width,width);
		// this.backShape.endFill();
		// this.backShape.alpha = 1

		let padding = 8;
		this.backShapeBorder = new PIXI.mesh.NineSlicePlane(
			PIXI.Texture.fromFrame('progressBarSmall.png'), 10, 10, 10, 10)
		this.backShapeBorder.width = width + padding
		this.backShapeBorder.height = width + padding
		this.backShapeBorder.pivot.set((width + padding) / 2)
		this.backShapeBorder.tint = iconColor;

		//this.backShape = PIXI.Sprite.fromFrame('largeCard.png')
		this.backShape = new PIXI.mesh.NineSlicePlane(
			PIXI.Texture.fromFrame('progressBarSmall.png'), 10, 10, 10, 10)
		this.backShape.width = width
		this.backShape.height = width
		this.backShape.pivot.set(width / 2)
		//this.backShape.scale.set(width / this.backShape.width);
		//this.backShape.anchor.set(0.5)
		this.backShape.tint = color;

		this.updateRotation( Math.PI * 0.25)
		
		this.icon.anchor.set(0.5);

		this.icon.scale.set(this.backShape.height / this.icon.height * 0.7)
		this.mainContainer.addChild(this.backShapeBorder);
		this.mainContainer.addChild(this.backShape);
		this.mainContainer.addChild(this.icon);
		this.addChild(this.mainContainer);

		this.onClick = new signals.Signal()

		this.on('touchstart', this.click.bind(this));
		this.interactive = true;
		this.buttonMode = true;
	}
	updateRotation(rot){
		this.backShapeBorder.rotation = rot
		this.backShape.rotation = rot
	}
	setColor(color) {
		this.backShape.tint = color;
	}
	click() {
		this.onClick.dispatch();
		window.SOUND_MANAGER.play('tap2', { volume: 0.5 })
	}
	updateTextColor(color) {
		if (this.movesLabel) {
			this.movesLabel.style.fill = color;
		}
	}
	addLabelLeft(label) {
		this.movesLabel = new PIXI.Text(label, { font: '18px', fill: this.backShape.tint, align: 'right', fontWeight: '300', fontFamily: window.STANDARD_FONT1 });
		this.movesLabel.pivot.x = this.movesLabel.width;
		this.movesLabel.pivot.y = this.movesLabel.height / 2;
		this.movesLabel.x = -this.mainContainer.width * 0.75;
		this.addChild(this.movesLabel);
	}

	updateTexture(texture) {
		this.icon.texture = PIXI.Texture.fromFrame(texture);
		this.icon.scale.set(this.backShape.height / this.icon.height * 0.7 * this.icon.scale.x);
	}
}
