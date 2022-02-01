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
		this.icon = PIXI.Sprite.fromImage(icon);
		this.icon.tint = iconColor;

		// this.backShape = new PIXI.Graphics();
		// //this.backShape.lineStyle(3, color, 1);
		// this.backShape.beginFill(color);
		// this.backShape.drawRect(-width/2,-width/2,width,width);
		// this.backShape.endFill();
		// this.backShape.alpha = 1

		this.backShape = PIXI.Sprite.fromImage('./assets/images/largeCard.png')
		this.backShape.scale.set(width / this.backShape.width);
		this.backShape.anchor.set(0.5)
		this.backShape.tint = color;

        this.backShape.rotation = Math.PI * 0.25
		this.icon.anchor.set(0.5);

		this.icon.scale.set(this.backShape.height /this.icon.height * 0.7)
		this.mainContainer.addChild(this.backShape);
		this.mainContainer.addChild(this.icon);
		this.addChild(this.mainContainer);

        this.onClick = new signals.Signal()

        this.on('touchstart', this.click.bind(this));
		this.interactive = true;
		this.buttonMode = true;
	}

    click(){
        this.onClick.dispatch();
    }

	addLabelLeft(label){
        this.movesLabel = new PIXI.Text(label, { font: '18px', fill: this.backShape.tint, align: 'right', fontWeight: '300', fontFamily: window.STANDARD_FONT1 });
		this.movesLabel.pivot.x = this.movesLabel.width;
		this.movesLabel.pivot.y = this.movesLabel.height / 2;
		this.movesLabel.x = -this.mainContainer.width * 0.75;
		this.addChild(this.movesLabel);
	}

    updateTexture(texture){
        this.icon.texture = PIXI.Texture.fromImage(texture);
        this.icon.scale.set(this.backShape.height /this.icon.height * 0.7 * this.icon.scale.x);
    }
}
