import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';
import ParticleSystem from '../effects/ParticleSystem';
import ProgressBar from './ProgressBar';
export default class SquareButton extends PIXI.Container {
    constructor(unscaledCardSize) {
        super();

        this.unscaledCardSize = unscaledCardSize;
        this.container = new PIXI.Container();
        this.squareButtonBackShape = PIXI.Sprite.fromFrame('largeCardBack.png');
        this.squareButtonShape = PIXI.Sprite.fromFrame('largeCard.png');//new PIXI.Graphics().beginFill(section.color).drawRect(0, 0, this.unscaledCardSize.width, this.unscaledCardSize.height);
        //this.squareButtonShape.scale.set(this.unscaledCardSize.width / this.squareButtonShape.width)
        this.squareButtonShape.tint = 0x333333
        this.squareButtonBackShape.tint = 0x222222


        this.buttonMask = PIXI.Sprite.fromFrame('largeCard.png');
        this.innerBorder = PIXI.Sprite.fromFrame('innerBorder.png');


        this.label = new PIXI.Text("", {
            font: '22px',
            fill: 0xFFFFFF,
            align: 'center',
            //fontWeight: '200',
            fontFamily: window.STANDARD_FONT1,
            // stroke: 0x000000,
            // strokeThickness: 12
        });

        this.labelTop = new PIXI.Text("", {
            font: '24px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '200',
            fontFamily: window.STANDARD_FONT1,
            // stroke: 0x000000,
            // strokeThickness: 12
        });

        this.squareButtonBackShape.y = 20

        this.container.addChild(this.squareButtonBackShape)
        //this.container.addChild(this.innerBorder)
        this.container.addChild(this.squareButtonShape)
        //this.container.addChild(this.buttonMask)
        this.squareButtonShape.addChild(this.label)
        this.squareButtonShape.addChild(this.labelTop)

        this.addChild(this.container);

        this.squareButtonBackShape.interactive = true;
        this.squareButtonBackShape.on('pointerover', this.onPointerOver.bind(this));
        this.squareButtonBackShape.on('pointerout', this.onPointerOut.bind(this));
        this.squareButtonBackShape.on('pointerup', this.onPointerUp.bind(this));

        let sizeBar = {width:this.squareButtonShape.width * 0.8, height:this.squareButtonShape.height * 0.12}
        this.progressBar = new ProgressBar(sizeBar);
       // this.progressBar.scale.set(0.5)
        this.progressBar.visible = false;

        this.progressBar.x = this.squareButtonShape.width / 2 - sizeBar.width / 2
        this.progressBar.y = this.squareButtonShape.height  - sizeBar.height * 1.5
        //this.updateLabel("round_ar rlar")
        this.squareButtonShape.addChild(this.progressBar)
    }
    onPointerUp() {
        window.SOUND_MANAGER.play('tap', { volume: 0.5 })
    }
    onPointerOver() {
        this.squareButtonShape.y = 20;

    }
    onPointerOut() {
        this.squareButtonShape.y = 0;
    }
    hideProgressBar(progression = 0) {
        this.progressBar.visible = false;
    }
    setProgressBar(progression = 0) {
        this.progressBar.visible = true;
        this.progressBar.setProgressBar(progression)
    }
    setColor(color) {
        this.squareButtonShape.tint = color
        this.squareButtonBackShape.tint = color
    }
    updateLabelTop(text, icon) {
        this.labelTop.text = text;

        if (icon) {
            if (this.labelTop.icon) {
                this.labelTop.icon.parent.removeChild(this.labelTop.icon)
            }
            this.labelTop.icon = icon;

            icon.scale.set(1);
            icon.scale.set(this.labelTop.height / icon.height);
            icon.anchor.x = 1.1;
            icon.anchor.y = 0;

            this.labelTop.addChild(icon);
        }

        if (this.labelTop.width > this.squareButtonShape.width * 0.9) {
            this.labelTop.scale.set(this.squareButtonShape.width / this.labelTop.width * 0.9)
        }

        this.labelTop.pivot.x = this.labelTop.width / 2 / this.labelTop.scale.x
        this.labelTop.pivot.y = this.labelTop.height / this.labelTop.scale.y;
        this.labelTop.x = this.squareButtonShape.width / 2 // this.container.scale.x
        this.labelTop.y = this.squareButtonShape.height * 0.07 + this.labelTop.height / this.labelTop.scale.y// this.container.scale.y
        if (icon) {
            this.labelTop.x += icon.width / 2//icon.scale.x;
        }
    }
    setPallet(colors) {
        if (this.pallet && this.pallet.parent) {
            this.pallet.parent.removeChild(this.pallet);
        }

        this.pallet = colors;
        this.pallet.scale.set(1);
        this.pallet.pivot.x = this.pallet.width / 2
        this.pallet.pivot.y = this.pallet.height / 2
        this.pallet.scale.set(this.squareButtonShape.width / this.pallet.width);


        this.pallet.x = this.squareButtonShape.width / 2;
        this.pallet.y = this.squareButtonShape.height / 2;

        this.squareButtonShape.addChild(this.pallet);

        this.label.visible = false;


    }
    updateLabel(text, offset = {x:0, y:0}) {
        this.label.text = text;
        this.label.visible = true;

        if (this.label.width > this.squareButtonShape.width * 0.9) {
            this.label.scale.set(this.squareButtonShape.width / this.label.width * 0.9)
        }

        this.label.pivot.x = this.label.width / 2 / this.label.scale.x
        this.label.pivot.y = this.label.height / this.label.scale.y;
        this.label.x = this.squareButtonShape.width / 2 +offset.x// this.container.scale.x
        this.label.y = this.squareButtonShape.height * 0.93 + offset.y// this.container.scale.y
    }
    updateIcon(graphic, scale = 0.5, offset = { x: 0, y: 0 }) {
        if (this.icon && this.icon.parent) {
            this.icon.parent.removeChild(this.icon);
        }
        this.icon = graphic
        this.squareButtonShape.addChildAt(this.icon, 0)
        this.icon.x = offset.x
        this.icon.y = offset.y
        if (graphic.width > graphic.height) {
            this.icon.scale.set(this.buttonMask.width / this.icon.width * scale);
        } else {
            this.icon.scale.set(this.buttonMask.height / this.icon.height * scale);
        }

        this.icon.x = this.squareButtonShape.width / 2 - this.icon.width / 2 + offset.x
        this.icon.y = this.squareButtonShape.height / 2 - this.icon.height / 2 + offset.y
        //this.icon.mask = this.buttonMask
    }
}