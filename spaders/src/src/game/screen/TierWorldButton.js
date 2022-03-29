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

        this.squareButtonShape = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.EMPTY, 20, 20, 20, 20)//new PIXI.Graphics().beginFill(section.color).drawRect(0, 0, this.unscaledCardSize.width, this.unscaledCardSize.height);
        //this.squareButtonShape.scale.set(this.unscaledCardSize.width / this.squareButtonShape.width)
        this.squareButtonShape.tint = 0x333333

        this.squareButtonShape.width = this.unscaledCardSize.width
        this.squareButtonShape.height = this.unscaledCardSize.height



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

        this.container.addChild(this.squareButtonShape)


        this.addChild(this.container);

        let sizeBar = { width: this.unscaledCardSize.width * 0.8, height: 20 }
        this.progressBar = new ProgressBar(sizeBar);

        this.progressBar.visible = false;

        this.progressBar.x = this.unscaledCardSize.width / 2 - sizeBar.width / 2
        this.progressBar.y = this.unscaledCardSize.height - sizeBar.height * 1.5
        //this.updateLabel("round_ar rlar")
        this.squareButtonShape.addChild(this.progressBar)

        this.currentState = 0;

        this.backTop = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('tile_1_' + (32 * 8) + '.png'), 10, 10, 10, 10)
        this.backTop.width = 20;
        this.backTop.height = 20;
        this.squareButtonShape.addChild(this.backTop)
        this.backTop.tint = 0;
        this.backTop.alpha = 1
        this.squareButtonShape.addChild(this.labelTop)
        this.squareButtonShape.addChild(this.label)

        this.lockState = PIXI.Sprite.fromFrame('tile_1_' + (32 * 8 + 4) + '.png')
        this.squareButtonShape.addChild(this.lockState)
        this.lockState.tint = 0

        this.lockIcon = PIXI.Sprite.fromFrame('tile_1_' + (32 * 8 + 3) + '.png')
        this.lockState.addChild(this.lockIcon)


        this.incompleteState = PIXI.Sprite.fromFrame('tile_1_' + (32 * 8 + 4) + '.png')
        this.squareButtonShape.addChild(this.incompleteState)
        this.incompleteState.tint = 0

        this.questionIcon = PIXI.Sprite.fromFrame('tile_1_' + (32 * 10 + 5) + '.png')
        this.questionIcon.sin = 0
        this.incompleteState.addChild(this.questionIcon)

        let stateBorder = PIXI.Sprite.fromFrame('tile_1_' + (32 * 8 + 2) + '.png')
        this.incompleteState.addChild(stateBorder)

        this.crownIcon = PIXI.Sprite.fromFrame('tile_1_' + (32 * 10 + 6) + '.png')
        this.squareButtonShape.addChild(this.crownIcon)

        //this.crownIcon.scale.set(0.75)

        window.COOKIE_MANAGER.onChangeColors.add(() => {
            this.updateColorScheme();
        })

        this.updateColorScheme();

        this.buttonState = 0;

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

        //this.crownIcon.tint = colorScheme.levelCompleteColor;

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
    update(delta) {

        if (this.iconBackgroundWhite) {

            this.incompleteState.visible = false;
            this.icon.visible = false;
            this.lockState.visible = false;
            this.crownIcon.visible = false;
            this.interactive = true;
            if (this.buttonState == 1) {


                // this.backTop.visible = true;
                // this.label.visible = true;
                this.incompleteState.visible = true;
                this.incompleteState.tint = window.colorTweenBomb.currentColor

                this.questionIcon.sin += delta * 3;
                this.questionIcon.sin %= Math.PI * 2
                this.questionIcon.x = Math.sin(this.questionIcon.sin) * 10
                //this.crownIcon.visible = true;
            } else if (this.buttonState == 0) {
                this.icon.visible = true;
                this.backTop.visible = false;
                this.label.visible = false;


            } else if (this.buttonState == 2) {
                this.lockState.visible = true;
                this.backTop.visible = false;
                this.label.visible = false;
                this.interactive = false;

            } else if (this.buttonState == 3) {
                this.icon.visible = true;
                this.backTop.visible = false;
                //this.crownIcon.visible = true;

                this.iconBackgroundWhite.tint = window.colorTweenBomb.currentColor
                //this.crownIcon.tint = window.colorTweenBomb.currentColor
            }
            if (this.forceLabel) {
                this.label.visible = true;
                this.label.scale.set(0.5)
                this.label.y = this.unscaledCardSize.height + 10
            }
            //this.iconBackgroundWhite.y = Math.random() * 10

            if(this.showCrown){
                this.crownIcon.visible = true;
            }
        }

    }
    setCrown(){
        this.showCrown = true;
    }
    completeMode() {
        this.buttonState = 0;
    }
    incompleteMode() {
        this.buttonState = 1;
    }
    lockMode() {
        this.buttonState = 2;
    }
    tierCompleteMode() {
        this.buttonState = 3;
    }
    setColor(color) {
        if (this.isPlanet || !this.iconBackgroundWhite) {
            return
        }
        //this.iconBackgroundWhite.tint = color
    }
    updateDebugLabel(text) {

        this.updateLabel(text);

        this.forceLabel = true;

        this.label.style.fill = 0xFF0000
    }
    setLargeButtonMode(addLabel = true) {

        let border = 4

        if (!this.iconBackgroundWhite) {

            this.iconBackgroundWhite = new PIXI.Sprite();
            if (window.imageThumbs['tierCardBackgroundTexture' + addLabel]) {
                this.iconBackgroundWhite.setTexture(window.imageThumbs['tierCardBackgroundTexture' + addLabel])
            } else {
                let backBackWhite = new PIXI.Sprite.fromFrame('tile_1_' + (32 * 8) + '.png')
                let texture = renderer.generateTexture(backBackWhite);
                window.imageThumbs['tierCardBackgroundTexture'] = texture;
                this.iconBackgroundWhite.setTexture(texture)
            }


            this.squareButtonShape.addChildAt(this.iconBackgroundWhite, 0)

        }

        //this.resizeIconToFitOnLarge2()
        this.icon.y -= border / 2;

        // this.progressBar.resizeBar(this.iconBackground.width, this.iconBackground.height * 0.15, true);
        // this.progressBar.x = this.iconBackground.x//+ this.iconBackground.width + 10;
        // this.progressBar.y = this.iconBackground.y + this.iconBackground.height + border//(extraBorderBottom - border) * 0.5 - this.progressBar.height * 0.5

        this.progressBar.visible = false;

        utils.resizeToFitAR(
            {
                width: this.unscaledCardSize.width * 0.62,
                height: this.unscaledCardSize.height * 0.62
            }, this.icon)
        utils.centerObject(this.icon, this.iconBackgroundWhite)


        this.crownIcon.x = this.unscaledCardSize.width / 2 - this.crownIcon.width / 2;
        this.crownIcon.y = -this.crownIcon.height + 4;

        if (!addLabel) {

            this.label.visible = false
            this.backTop.visible = false;
            this.labelTop.visible = false;

            return
        }

        utils.resizeToFitAR(
            {
                width: this.unscaledCardSize.width,
                height: this.unscaledCardSize.height * 0.3
            }, this.label)

        this.labelTop.visible = false;
        this.backTop.visible = true;
        this.labelTop.pivot.x = 0
        this.labelTop.pivot.y = 0

        utils.centerObject(this.label, this.iconBackgroundWhite)

        this.label.y += this.unscaledCardSize.height / 2 + this.label.height + 4
        this.label.x = this.iconBackgroundWhite.x + this.unscaledCardSize.width / 2

        this.backTop.x = this.iconBackgroundWhite.x + 4
        this.backTop.y = this.label.y - this.label.height / 2 - 2
        this.backTop.width = this.unscaledCardSize.width - 8
        this.backTop.height = this.label.height + 4



    }

    updateIcon(graphic, scale = 0.4, offset = { x: 0, y: 0 }, hideBackground = false) {
        if (this.icon && this.icon.parent) {
            this.icon.parent.removeChild(this.icon);
        }
        this.icon = graphic
        this.icon.scale.set(1)
        this.addChild(this.icon)
        utils.resizeToFitAR(
            {
                width: this.unscaledCardSize.width * 0.81,
                height: this.unscaledCardSize.height * scale
            }, this.icon)
        this.icon.x = 5;
        this.icon.y = 5;

        // if (!this.iconShade) {

        //     this.iconShade = new PIXI.Sprite.fromFrame('tile_1_' + (32 * 8 + 1) + '.png')
        //     this.iconShade.alpha = 0.5
        // } else {
        //     this.iconShade.parent.removeChild(this.iconShade);
        // }
        // this.addChild(this.iconShade)

    }

    setProgressBar(progression = 0) {
        this.progressBar.visible = true;
        this.progressBar.setProgressBar(progression)
    }
    updateLabelTop() { }

    updateLabel(text, offset = { x: 0, y: 0 }) {
        this.label.text = text;
        this.label.visible = true;

        utils.resizeToFitAR(
            {
                width: this.unscaledCardSize.width,// * 0.7,
                height: this.unscaledCardSize.height * 0.15
            }, this.label)

        this.label.pivot.x = this.label.width / 2 / this.label.scale.x
        this.label.pivot.y = this.label.height / 2 / this.label.scale.y;
        this.label.x = this.unscaledCardSize.width / 2 + offset.x// this.container.scale.x
        this.label.y = this.unscaledCardSize.height - this.label.height + offset.y// this.container.scale.y

        this.backTop.visible = true;

        this.forceLabel = false;

    }
}