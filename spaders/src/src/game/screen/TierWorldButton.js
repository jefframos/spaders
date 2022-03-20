import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import colorSchemes from '../../colorSchemes';
import config from '../../config';
import utils from '../../utils';
import ParticleSystem from '../effects/ParticleSystem';
import Planet from './Planet';
import ProgressBar from './ProgressBar';
import SquareButton from './SquareButton';
export default class TierWorldButton extends SquareButton {
    constructor(unscaledCardSize) {
        super(unscaledCardSize);
    }
    buildBase() {
        this.container = new PIXI.Container();
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
        });

        this.container.addChild(this.squareButtonBackShape)
        this.container.addChild(this.squareButtonShape)


        this.addChild(this.container);

        let sizeBar = { width: this.squareButtonShape.width * 0.8, height: 20 }
        this.progressBar = new ProgressBar(sizeBar);

        this.progressBar.visible = false;

        this.progressBar.x = this.squareButtonShape.width / 2 - sizeBar.width / 2
        this.progressBar.y = this.squareButtonShape.height - sizeBar.height * 1.5
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
    setLargeButtonMode() {
        if (!this.iconBackground) return;
        this.iconBackground.x = 0;
        this.iconBackground.y = 0;

        this.iconBackground.width = this.squareButtonShape.height// * 0.5
        this.iconBackground.height = this.squareButtonShape.height// * 0.5
        this.resizeIconToFitOnLarge2()

        this.progressBar.resizeBar(this.iconBackground.width * 0.9, this.iconBackground.height * 0.15);
        this.progressBar.x = this.iconBackground.x + this.iconBackground.width * 0.05//+ this.iconBackground.width + 10;
        this.progressBar.y = this.iconBackground.y + this.iconBackground.height - this.iconBackground.width * 0.05 - this.progressBar.height;


        // utils.resizeToFitAR(
        //     {
        //         width: this.progressBar.width,
        //         height: this.progressBar.height * 0.8
        //     }, this.label)

        this.label.x = this.progressBar.x + this.progressBar.width / 2;
        this.label.y = this.progressBar.y + this.progressBar.height / 2;
        this.label.visible = false
        // utils.resizeToFitAR(
        //     {
        //         width: this.squareButtonBackShape.width - this.iconBackground.width - 20,
        //         height: this.iconBackground.height * 0.28
        //     }, this.labelTop)

        this.labelTop.visible = false;
        this.backTop.visible = false;
        this.labelTop.pivot.x = 0
        this.labelTop.pivot.y = 0//this.labelTop.height / this.labelTop.scale.y;
        this.labelTop.x = this.iconBackground.x + this.iconBackground.width + 15 // this.container.scale.x
        this.labelTop.y = this.iconBackground.y + 5//this.iconBackground.y + 5//+ this.labelTop.height / this.labelTop.scale.y// this.container.scale.y

        this.backTop.x = this.labelTop.x - 10
        this.backTop.y = this.labelTop.y - 5
        this.backTop.width = this.progressBar.width - this.iconBackground.width - 5
        this.backTop.height = this.labelTop.height + 10
    }
    setProgressBar(progression = 0) {
        this.progressBar.visible = true;
        this.progressBar.setProgressBar(progression)
    }

}