import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';
import TweenMax from 'gsap';
import colorSchemes from '../../colorSchemes';



export default class UIRectLabel extends PIXI.Container {
	constructor(color, icon, center = true) {
		super();

		this.iconSrc = icon;
		this.mainContainer = new PIXI.Container();
		//this.backShape = PIXI.Sprite.fromImage('./assets/images/rect.png');
		this.icon = PIXI.Sprite.fromFrame(icon);
		//this.backShape.tint = color;

		// this.backShape = new PIXI.Graphics();
		// this.backShape.lineStyle(3, color, 1);
		// this.backShape.drawRect(0,0,224,60);
		// this.backShape.endFill();
		// this.backShape.alpha = 0


		this.backShape = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('progressBarSmall.png'), 10, 10, 10, 10)
        this.backShape.width = 224
        this.backShape.height = 60


		this.label = new PIXI.Text("name", { font: '30px', fill: 0xFFFFFF, align: center?'center':'left', fontFamily: window.STANDARD_FONT1 });
		this.title = new PIXI.Text("title", {
			font: '20px',
			fill: 0x000000,
			align: 'center',
			wight: '800',
			fontFamily: window.STANDARD_FONT1,
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
		window.COOKIE_MANAGER.onChangeColors.add(() => {
            this.updateColorScheme();
        })

        this.updateColorScheme();
    }
    updateFontSize(size) {
		this.label.style.fontSize = size;
	}
    updateColorScheme() {
        let colorScheme = colorSchemes.getCurrentColorScheme();
		this.backShape.texture = PIXI.Texture.fromFrame(colorScheme.grid.spriteRect)
		this.backShape.tint = colorScheme.background
		this.backShape.alpha = 0.75


		// let colorScheme = colorSchemes.getCurrentColorScheme();
		// this.timerRect.updateColor(colorScheme.fontColor);
		// this.movesRect.updateColor(colorScheme.fontColor);
		// this.scoreRect.updateColor(colorScheme.fontColor);


		// let colorSchemeGrid = colorScheme.grid;
		// this.backQueueShape.texture = PIXI.Texture.fromFrame(colorSchemeGrid.sprite)
		// this.backQueueShape.width = CARD.width * 3 + 4
		// this.backQueueShape.height = CARD.height + 4
		// this.backQueueShape.x = -2
		// this.backQueueShape.y = -2
		// this.backQueueShape.tint = colorScheme.background;
		// this.backQueueShape.alpha = 0.75;
	}
	updateColor(fontColor){
		if(this.label){
			this.label.style.fill = fontColor;
			this.icon.tint = fontColor;
		}

	}
	updateLavel(text, title, center = true, offset = {x:0, y:0}) {
		this.label.text = text;
		this.title.text = title ? title : "";
		//this.title.pivot.x = this.title.width * 0.5
		this.title.x = 20
		this.title.pivot.y = this.title.height * 0.5
		this.icon.anchor.set(0.5)
		utils.centerObject2(this.icon, this.mainContainer);
		this.icon.x = this.icon.y;

		if(center){

			utils.centerObject(this.label, this.mainContainer);
			this.label.x += this.icon.x + 10
			this.label.y += -3
		}else{
			this.label.x = this.icon.x + this.icon.width + 5;
			this.label.y = 12;
		}

		this.label.x += offset.x;
		this.label.y += offset.y;
	}
	getParticles(particle){
		TweenMax.killTweensOf(this.icon.scale);
		
		if(!this.colorIcon){
			this.colorIcon = PIXI.Sprite.fromImage(this.iconSrc);
			this.icon.addChild(this.colorIcon);
			this.colorIcon.anchor.set(0.5);
		}
		TweenMax.killTweensOf(this.colorIcon);
		this.icon.scale.set(this.backShape.height /this.icon.height * 0.7*this.icon.scale.y)
		this.colorIcon.tint = particle.tint;

		this.colorIcon.alpha = 1;
		TweenMax.from(this.icon.scale, 0.5, {x:this.icon.scale.x*1.25, y:this.icon.scale.y*0.75, ease:Elastic.easeOut})
		TweenMax.to(this.colorIcon, 0.5, {delay:0.1, alpha:0})
	}
}
