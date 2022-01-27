import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';
import ParticleSystem from '../effects/ParticleSystem';
export default class SquareButton extends PIXI.Container {
    constructor(unscaledCardSize) {
        super();

        this.unscaledCardSize = unscaledCardSize;
        this.container = new PIXI.Container();
        this.squareButtonShape = PIXI.Sprite.fromImage('./assets/images/largeCard.png');//new PIXI.Graphics().beginFill(section.color).drawRect(0, 0, this.unscaledCardSize.width, this.unscaledCardSize.height);
        //this.squareButtonShape.scale.set(this.unscaledCardSize.width / this.squareButtonShape.width)
        this.squareButtonShape.tint = 0x333333


        this.buttonMask = PIXI.Sprite.fromImage('./assets/images/largeCard.png');
        this.innerBorder = PIXI.Sprite.fromImage('./assets/images/innerBorder.png');

    
        this.label = new PIXI.Text("level.name", {
            font: '24px',
            fill: 0xFFFFFF,
            align: 'left',
            fontWeight: '200',
            fontFamily: 'round_popregular',
            // stroke: 0x000000,
            // strokeThickness: 12
        });
        
        
        this.container.addChild(this.squareButtonShape)
        //this.container.addChild(this.buttonMask)
        this.container.addChild(this.label)
        this.container.addChild(this.innerBorder)

        this.addChild(this.container);

        //this.updateLabel("round_ar rlar")
    }
    updateLabel(text){
        this.label.text = text;

        if (this.label.width > this.squareButtonShape.width * 0.9) {
            this.label.scale.set(this.squareButtonShape.width / this.label.width * 0.9)
        }

        this.label.pivot.x = this.label.width / 2 / this.label.scale.x
        this.label.pivot.y = this.label.height / this.label.scale.y;
        this.label.x = this.squareButtonShape.width / 2 // this.container.scale.x
        this.label.y = this.squareButtonShape.height * 0.9// this.container.scale.y
    }
    updateIcon(graphic, scale = 0.5, offset = {x:0, y:0}){
        if(this.icon && this.icon.parent){
            this.icon.parent.removeChild(this.icon);
        }
        this.icon = graphic
        this.container.addChildAt(this.icon, 1)
        this.icon.x = offset.x
        this.icon.y = offset.y
        if(graphic.width > graphic.height){
            this.icon.scale.set(this.buttonMask.width / this.icon.width * scale);
        }else{
            this.icon.scale.set(this.buttonMask.height / this.icon.height * scale);            
        }

        this.icon.x = this.squareButtonShape.width / 2 - this.icon.width / 2 + offset.x
        this.icon.y = this.squareButtonShape.height / 2 - this.icon.height / 2 + offset.y
        //this.icon.mask = this.buttonMask
    }
}