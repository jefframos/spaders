import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import colorSchemes from '../../colorSchemes';
import config from '../../config';
import utils from '../../utils';
import ParticleSystem from '../effects/ParticleSystem';
import Planet from './Planet';
import ProgressBar from './ProgressBar';
export default class SquareButton extends PIXI.Container {
    constructor(unscaledCardSize, isPlanet) {
        super();

        this.unscaledCardSize = unscaledCardSize;
        this.isPlanet = isPlanet;
        
        this.buildBase();
    }
    buildBase(){
        this.container = new PIXI.Container();
        if (!this.isPlanet) {
            this.squareButtonBackShape = new PIXI.mesh.NineSlicePlane(
                PIXI.Texture.fromFrame('largeCardBackPixel.png'), 20, 20, 20, 20)//= PIXI.Sprite.fromFrame('largeCardBack.png');
            this.squareButtonShape = new PIXI.mesh.NineSlicePlane(
                PIXI.Texture.fromFrame('largeCardPixel.png'), 20, 20, 20, 20)//new PIXI.Graphics().beginFill(section.color).drawRect(0, 0, this.unscaledCardSize.width, this.unscaledCardSize.height);
            //this.squareButtonShape.scale.set(this.unscaledCardSize.width / this.squareButtonShape.width)
            this.squareButtonShape.tint = 0x333333
            this.squareButtonBackShape.tint = 0x222222

            this.squareButtonShape.width = this.unscaledCardSize.width
            this.squareButtonShape.height = this.unscaledCardSize.height


            this.squareButtonBackShape.width = this.unscaledCardSize.width
            this.squareButtonBackShape.height = this.unscaledCardSize.height
        } else {
            this.squareButtonShape = new Planet()//.fromFrame('l0_planet_2_1.png')
            this.squareButtonBackShape = new PIXI.Sprite.fromFrame('l0_planet_2_1.png')

            this.squareButtonShape.sin = Math.random() * Math.PI * 2;
           
            //this.squareButtonShape.scale.set(this.unscaledCardSize.width / this.squareButtonShape.width)
            //this.squareButtonBackShape.scale.set(this.unscaledCardSize.width / this.squareButtonBackShape.width)
            this.squareButtonBackShape.alpha = 0;
        }

        this.innerBorder = PIXI.Sprite.fromFrame('innerBorder.png');


        this.label = new PIXI.Text("", {
            font: '32px',
            fill: 0xFFFFFF,
            align: 'center',
            //fontWeight: '200',
            fontFamily: window.STANDARD_FONT1,
            stroke: 0x000000,
            strokeThickness: 4
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

        if(this.isPlanet){

            this.squareButtonBackShape.y = this.unscaledCardSize.height * 0.025
        }else{

            this.squareButtonBackShape.y = this.unscaledCardSize.height * 0.075
        }

        this.container.addChild(this.squareButtonBackShape)
        //this.container.addChild(this.innerBorder)
        this.container.addChild(this.squareButtonShape)


        this.addChild(this.container);

        this.squareButtonBackShape.interactive = true;
        this.squareButtonBackShape.on('pointerover', this.onPointerOver.bind(this)).on('touchstart', this.onPointerOver.bind(this));
        this.squareButtonBackShape.on('pointerout', this.onPointerOut.bind(this)).on('touchend', this.onPointerOut.bind(this)).on('touchendoutside', this.onPointerOut.bind(this));
        this.squareButtonBackShape.on('pointerup', this.onPointerUp.bind(this));

        let sizeBar = { width: this.unscaledCardSize.width * 0.8, height: 20 }
        this.progressBar = new ProgressBar(sizeBar);

        this.progressBar.visible = false;

        this.progressBar.x = this.unscaledCardSize.width / 2 - sizeBar.width / 2
        this.progressBar.y = this.unscaledCardSize.height - sizeBar.height * 1.5
        //this.updateLabel("round_ar rlar")
        this.squareButtonShape.addChild(this.progressBar)

        this.currentState = 0;
        this.squareButtonShape.addChild(this.label)

        this.backTop = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('progressBarSmall.png'), 10, 10, 10, 10)
        this.backTop.width = 20;
        this.backTop.height = 20;
        this.squareButtonShape.addChild(this.backTop)
        this.backTop.tint = 0;
        this.backTop.alpha = 0.25
        this.squareButtonShape.addChild(this.labelTop)


        window.COOKIE_MANAGER.onChangeColors.add(() => {
            this.updateColorScheme();
        })

        this.updateColorScheme();
    }
    updateColorScheme() {
        let colorScheme = colorSchemes.getCurrentColorScheme().buttonData;

        this.label.style.fill = colorScheme.fontColor;
        this.label.style.fontWeight = 800;
        //this.label.style.stroke = colorScheme.buttonStandardDarkColor;
        //this.label.style.strokeThickness = 8
        this.labelTop.style.fill = colorScheme.fontColor;

        //this.backTop.tint = colorScheme.buttonBackTitleColor;

        this.progressBar.updateBackgroundColor(colorScheme.buttonStandardDarkColor)
        if (this.iconBackground) {
            this.iconBackground.tint = colorScheme.buttonStandardDarkColor;
        }
        switch (this.currentState) {
            case 0:
                this.setColor(colorScheme.buttonStandardColor);
                break;
            case 1:
                this.setColor(colorScheme.tierCompleteColor);
                break;
            case 2:
                this.setColor(colorScheme.levelCompleteColor);
                break;
            default:
                break;
        }
    }
    onPointerUp() {

        window.SOUND_MANAGER.play('tap', { volume: 0.5 })
    }
    onPointerOver() {
        TweenMax.killTweensOf(this.squareButtonShape)

        if(this.isPlanet){
            TweenMax.to(this.squareButtonShape, 0.6, { y: this.unscaledCardSize.height * 0.015, ease: Elastic.easeOut })
        }else{

            TweenMax.to(this.squareButtonShape, 0.2, { y: this.unscaledCardSize.height * 0.075, ease: Back.easeOut })
        }
        //this.squareButtonShape.y = 10;

    }
    onPointerOut() {
        TweenMax.killTweensOf(this.squareButtonShape)
        TweenMax.to(this.squareButtonShape, 0.5, { y: 0, ease: Back.easeOut })
    }
    hideProgressBar(progression = 0) {
        this.progressBar.visible = false;
    }
    setLargeButtonMode() {
        if (!this.iconBackground) return;
        this.iconBackground.x = 10;
        this.iconBackground.y = 10;

        this.iconBackground.width = this.unscaledCardSize.height * 0.5
        this.iconBackground.height = this.unscaledCardSize.height * 0.5
        this.resizeIconToFitOnLarge2()

        this.progressBar.resizeBar(this.unscaledCardSize.width - 20, this.unscaledCardSize.height * 0.2);
        this.progressBar.x = this.iconBackground.x //+ this.iconBackground.width + 10;
        this.progressBar.y = this.iconBackground.y + this.iconBackground.height + 5// - this.progressBar.height;


        utils.resizeToFitAR(
            {
                width: this.progressBar.width,
                height: this.progressBar.height * 0.8
            }, this.label)

        this.label.x = this.progressBar.x + this.progressBar.width / 2;
        this.label.y = this.progressBar.y + this.progressBar.height / 2;

        utils.resizeToFitAR(
            {
                width: this.unscaledCardSize.width - this.iconBackground.width - 20,
                height: this.iconBackground.height * 0.28
            }, this.labelTop)

        this.labelTop.pivot.x = 0
        this.labelTop.pivot.y = 0//this.labelTop.height / this.labelTop.scale.y;
        this.labelTop.x = this.iconBackground.x + this.iconBackground.width + 15 // this.container.scale.x
        this.labelTop.y = this.iconBackground.y + 5//this.iconBackground.y + 5//+ this.labelTop.height / this.labelTop.scale.y// this.container.scale.y

        this.backTop.x = this.labelTop.x - 10
        this.backTop.y = this.labelTop.y - 5
        this.backTop.width = this.progressBar.width - this.iconBackground.width - 5
        this.backTop.height = this.labelTop.height + 10
    }

    setSectionButtonMode(index) {
        utils.resizeToFitAR(
            {
                width: this.squareButtonBackShape.width,
                height: this.squareButtonBackShape.height * 0.1
            }, this.labelTop)

            let marginBack = this.labelTop.height * 0.2

            if(index % 2 == 0){

                this.labelTop.x = this.squareButtonBackShape.width * 1.25
            }else{
                this.labelTop.x = -this.squareButtonBackShape.width * 0.25//this.unscaledCardSize.width * 1.25
                this.squareButtonShape.x = this.squareButtonBackShape.width * 0.5
            }
        this.labelTop.y = this.labelTop.height//this.squareButtonShape.height / 2 - this.labelTop.height
        this.backTop.height = this.labelTop.height + marginBack
        this.backTop.width = this.squareButtonBackShape.width - 40
        this.backTop.x = this.labelTop.x - this.backTop.width / 2
        this.backTop.y = this.labelTop.y - marginBack * 0.5

        this.backTop.alpha = 1;

        this.progressBar.resizeBar(this.backTop.width - 40, this.squareButtonShape.height * 0.1);

        this.progressBar.x = this.backTop.x + 20;
        this.progressBar.y = this.backTop.y + this.progressBar.height * 1.5;

        utils.resizeToFitAR(
            {
                width: this.progressBar.width,
                height: this.progressBar.height * 0.8
            }, this.label)

        this.label.x = this.progressBar.x + this.progressBar.width / 2;
        this.label.y = this.progressBar.y + this.progressBar.height / 2;
        // this.labelTop.pivot.x = 0
        // this.labelTop.pivot.y = 0//this.labelTop.height / this.labelTop.scale.y;
        // this.labelTop.x = this.progressBar.x // this.container.scale.x
        // this.labelTop.y = 10 //+ this.labelTop.height / this.labelTop.scale.y// this.container.scale.y

    }

    setProgressBar(progression = 0) {
        this.progressBar.visible = true;
        this.progressBar.setProgressBar(progression)
    }
    setColor(color) {
        if (this.isPlanet) {
            return
        }
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

        utils.resizeToFitAR(
            {
                width: this.unscaledCardSize.width,
                height: this.unscaledCardSize.height * 0.15
            }, this.labelTop)

        this.labelTop.pivot.x = this.labelTop.width / 2 / this.labelTop.scale.x
        this.labelTop.pivot.y = 0//this.labelTop.height / this.labelTop.scale.y;
        this.labelTop.x = this.squareButtonShape.width / 2 // this.container.scale.x
        this.labelTop.y = this.squareButtonShape.height * 0.05 //+ this.labelTop.height / this.labelTop.scale.y// this.container.scale.y
        if (icon) {
            this.labelTop.x += icon.width / 2 * this.labelTop.scale.x//icon.scale.x;
        }

        let marginBack = this.labelTop.height * 0.2

        this.backTop.height = this.labelTop.height + marginBack
        this.backTop.width = this.labelTop.width * 1.1
        this.backTop.x = this.labelTop.x - this.backTop.width / 2
        this.backTop.y = this.labelTop.y - marginBack * 0.5

    }
    update(delta){

        if(!delta){
            delta = 1/60
        }
        if(this.isPlanet){

            this.squareButtonShape.sin += delta * 0.5;
            this.squareButtonShape.sin %= Math.PI * 2
            this.squareButtonShape.y = Math.floor(Math.sin(this.squareButtonShape.sin) * 5) //- 120
        }
    }
    setPallet(colors, colorList) {
        if (this.pallet && this.pallet.parent) {
            this.pallet.parent.removeChild(this.pallet);
        }

        if(this.isPlanet){
            //console.log(colorList.list)
            
            this.squareButtonShape.updateColors(colorList)
            
            if(colorList.planetID){
                this.squareButtonShape.updateMapTextures(colorList.planetID);
            }else{
                this.squareButtonShape.updateMapTextures(0);
            }
          
            
            return;
        }
        this.pallet = colors;
        this.pallet.scale.set(1);
        this.pallet.pivot.x = this.pallet.width / 2
        this.pallet.pivot.y = this.pallet.height / 2


        utils.resizeToFitAR(
            {
                width: this.unscaledCardSize.width,
                height: this.unscaledCardSize.height * 0.15
            }, this.pallet)


        if (this.isPlanet) {
            this.pallet.width = this.squareButtonShape.width - 40

        } else {

            this.pallet.width = this.squareButtonShape.width
        }
        this.pallet.x = this.squareButtonShape.width / 2;
        this.pallet.y = this.squareButtonShape.height / 2;

        this.squareButtonShape.addChildAt(this.pallet, 0);

        this.label.visible = false;


    }
    updateLabel(text, offset = { x: 0, y: 0 }) {
        this.label.text = text;
        this.label.visible = true;

        utils.resizeToFitAR(
            {
                width: this.unscaledCardSize.width * 0.7,
                height: this.unscaledCardSize.height * 0.15
            }, this.label)

        this.label.pivot.x = this.label.width / 2 / this.label.scale.x
        this.label.pivot.y = this.label.height / 2 / this.label.scale.y;
        this.label.x = this.squareButtonShape.width / 2 + offset.x// this.container.scale.x
        this.label.y = this.squareButtonShape.height - this.label.height + offset.y// this.container.scale.y



    }
    setStandardState() {
        this.currentState = 0;
        this.updateColorScheme();
    }
    setCompleteStateLevel() {
        this.currentState = 2;
        this.updateColorScheme();
    }
    setCompleteState() {
        this.currentState = 1;
        this.updateColorScheme();
    }
    updateIcon(graphic, scale = 0.4, offset = { x: 0, y: 0 }, hideBackground = false) {
        if (this.icon && this.icon.parent) {
            this.icon.parent.removeChild(this.icon);
        }

        if (!this.iconBackground) {
            this.iconBackground = new PIXI.mesh.NineSlicePlane(
                PIXI.Texture.fromFrame('progressBarSmall.png'), 10, 10, 10, 10)

            this.squareButtonShape.addChildAt(this.iconBackground, 0)
        }
        this.icon = graphic
        this.icon.scale.set(1)
        this.iconBackground.addChild(this.icon)
        //this.icon.x = offset.x
        //this.icon.y = offset.y
        utils.resizeToFitAR(
            {
                width: this.unscaledCardSize.width * 0.8,
                height: this.unscaledCardSize.height * scale
            }, this.icon)
        // if (graphic.width > graphic.height) {
        //     this.icon.scale.set(this.squareButtonBackShape.width / (this.icon.width / this.icon.scale.x) * scale);
        // } else {
        //     this.icon.scale.set(this.squareButtonBackShape.height / (this.icon.height / this.icon.scale.y) * scale);
        // }

        this.iconBackground.width = this.icon.width + 10;
        this.iconBackground.height = this.icon.height + 10
        this.icon.x = 5;
        this.icon.y = 5;
        this.iconBackground.x = this.unscaledCardSize.width / 2 - this.iconBackground.width / 2 + offset.x
        this.iconBackground.y = this.unscaledCardSize.height / 2 - this.iconBackground.height / 2 + offset.y

        if (hideBackground) {
            this.iconBackground.width = 0
            this.iconBackground.height = 0
        }
        //this.icon.mask = this.buttonMask
    }

    resizeIconToFitOnLarge2() {
        utils.resizeToFitAR(
            {
                width: this.iconBackground.width - 10,
                height: this.iconBackground.height - 10
            }, this.icon)

        this.icon.x = this.iconBackground.width / 2 - this.icon.width / 2
        this.icon.y = this.iconBackground.height / 2 - this.icon.height / 2
    }

    resizeIconToFitOnLarge() {
        utils.resizeToFitAR(
            {
                width: this.iconBackground.width - 10,
                height: this.iconBackground.height - 10
            }, this.icon)

        this.icon.x = this.iconBackground.width / 2 - this.icon.width / 2
        this.icon.y = this.iconBackground.height / 2 - this.icon.height / 2
    }
}