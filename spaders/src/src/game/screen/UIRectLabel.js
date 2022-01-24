import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';



export default class UIRectLabel extends PIXI.Container {
	constructor(color, icon) {
		super();

		this.mainContainer = new PIXI.Container();
		//this.backShape = PIXI.Sprite.fromImage('./assets/images/rect.png');
		this.icon = PIXI.Sprite.fromImage(icon);
		//this.backShape.tint = color;

		this.backShape = new PIXI.Graphics();
		this.backShape.lineStyle(3, color, 1);
		this.backShape.drawRect(0,0,224,60);
		this.backShape.endFill();
		this.backShape.alpha = 0.5


		this.label = new PIXI.Text("name", { font: '30px', fill: 0xFFFFFF, align: 'center', fontFamily: 'round_popregular' });
		this.title = new PIXI.Text("title", {
			font: '20px',
			fill: 0x000000,
			align: 'center',
			wight: '800',
			fontFamily: 'round_popregular',
			stroke: color,
			strokeThickness: 8
		});


		this.icon.scale.set(this.backShape.height /this.icon.height * 0.7)
		this.mainContainer.addChild(this.backShape);
		this.mainContainer.addChild(this.icon);
		this.mainContainer.addChild(this.label);
		this.addChild(this.mainContainer);
		//this.addChild(this.title);

		this.updateLavel("00000")
	}
	updateLavel(text, title) {
		this.label.text = text;
		this.title.text = title ? title : "";
		//this.title.pivot.x = this.title.width * 0.5
		this.title.x = 20
		this.title.pivot.y = this.title.height * 0.5
		utils.centerObject(this.icon, this.mainContainer);
		this.icon.x = this.icon.y;
		utils.centerObject(this.label, this.mainContainer);
		this.label.x += this.icon.x
	}
}
