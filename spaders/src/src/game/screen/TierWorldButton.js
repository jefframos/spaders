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
            // stroke: 0x000000,
            // strokeThickness: 4
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
    updateColorScheme() {
        let colorScheme = colorSchemes.getCurrentColorScheme().buttonData;

        this.label.style.fill = colorScheme.fontColor;
        this.label.style.fontWeight = 800;
        this.labelTop.style.fill = colorScheme.fontColor;


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
    removeDarkMode(){
        if (this.isPlanet || !this.iconBackgroundWhite) {
            return
        }

        this.iconBackgroundWhite.tint = 0xFFFFFF; 
    }
    darkMode(){
        if (this.isPlanet || !this.iconBackgroundWhite) {
            return
        }
        let colorScheme = colorSchemes.getCurrentColorScheme().buttonData;

        this.iconBackgroundWhite.tint = colorScheme.buttonStandardDarkColor;
    }
    setColor(color) {
        if (this.isPlanet || !this.iconBackgroundWhite) {
            return
        }
        this.iconBackgroundWhite.tint = color
    }
    setLargeButtonMode(addBottomBorder = true) {
        if (!this.iconBackground) return;

        let border = 4
        let extraBorderBottom = addBottomBorder ? (border * 2) + this.iconBackground.height * 0.15 + border : 0
        let color = colorSchemes.getCurrentColorScheme()

        this.iconBackground.x = 0;
        this.iconBackground.y = 0;

        this.iconBackground.width = this.squareButtonShape.height// * 0.5
        this.iconBackground.height = this.squareButtonShape.height// * 0.5

        if (!this.iconBackgroundWhite) {

            this.iconBackgroundWhite = new PIXI.Sprite();
            if (window.imageThumbs['tierCardBackgroundTexture'+addBottomBorder]) {
                this.iconBackgroundWhite.setTexture(window.imageThumbs['tierCardBackgroundTexture'+addBottomBorder])
            } else {


                let back1 = new PIXI.mesh.NineSlicePlane(
                    PIXI.Texture.fromFrame('progressBarSmall.png'), 10, 10, 10, 10)

                let backWhite = new PIXI.mesh.NineSlicePlane(
                    PIXI.Texture.fromFrame('progressBarSmall.png'), 10, 10, 10, 10)

                let backBackWhite = new PIXI.mesh.NineSlicePlane(
                    PIXI.Texture.fromFrame('progressBarSmall.png'), 10, 10, 10, 10)

                    
                    back1.width = this.squareButtonShape.height + border * 4
                    back1.height = this.squareButtonShape.height + extraBorderBottom + border * 2 + border
                    
                    backWhite.width = this.squareButtonShape.height + border * 2 // * 0.5
                    backWhite.height = this.squareButtonShape.height + extraBorderBottom + border - 19
                    
                    backBackWhite.width = back1.width + border * 2 
                    backBackWhite.height = back1.height + border * 3 
                    
                    backWhite.x = border
                    backWhite.y = border

                    back1.x = border
                    back1.y = border
                    
                    backBackWhite.addChild(back1);
                    back1.addChild(backWhite)

                    backBackWhite.tint = 0xFFFFFF//color.buttonData.tierButtonBackground;
                backWhite.tint = 0xFFFFFF//color.buttonData.tierButtonBackground;
                back1.tint = 0;

                let texture = renderer.generateTexture(backBackWhite);

                window.imageThumbs['tierCardBackgroundTexture'] = texture;

                this.iconBackgroundWhite.setTexture(texture)
            }

            this.squareButtonShape.addChildAt(this.iconBackgroundWhite, 0)
        }

        this.iconBackground.x = border * 3
        this.iconBackground.y = border * 3

        //this.icon.y = border
        //this.iconBackgroundWhite.x = -border
        //this.iconBackgroundWhite.y = -border
        this.iconBackgroundWhite.tint = color.buttonData.tierButtonBackground;

        this.resizeIconToFitOnLarge2()
        this.icon.y -= border / 2;

        this.progressBar.resizeBar(this.iconBackground.width, this.iconBackground.height * 0.15, true);
        this.progressBar.x = this.iconBackground.x//+ this.iconBackground.width + 10;
        this.progressBar.y = this.iconBackground.y + this.iconBackground.height + border//(extraBorderBottom - border) * 0.5 - this.progressBar.height * 0.5

        this.progressBar.visible = false;
        this.label.visible = addBottomBorder
        utils.resizeToFitAR(
            {
                width: this.progressBar.width,
                height: extraBorderBottom + border
            }, this.label)

        this.label.x = this.progressBar.x + this.progressBar.width / 2;
        this.label.y = this.progressBar.y + this.progressBar.height / 2 + 1;
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

        this.iconBackground.tint = 0xFFFFFF
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
                width: this.squareButtonBackShape.width * 0.8,
                height: this.squareButtonBackShape.height * scale
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
        this.iconBackground.x = this.squareButtonShape.width / 2 - this.iconBackground.width / 2 + offset.x
        this.iconBackground.y = this.squareButtonShape.height / 2 - this.iconBackground.height / 2 + offset.y

        if (hideBackground) {
            this.iconBackground.width = 0
            this.iconBackground.height = 0
        }
        //this.icon.mask = this.buttonMask
    }

    setProgressBar(progression = 0) {
        this.progressBar.visible = true;
        this.progressBar.setProgressBar(progression)
    }

}