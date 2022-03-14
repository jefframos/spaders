import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import colorSchemes from '../../colorSchemes';
import config from '../../config';
import utils from '../../utils';
import * as signals from 'signals';
import ProgressBar from './ProgressBar';
export default class LargeImageButton extends PIXI.Container {
    constructor(unscaledCardSize) {
        super();

        this.unscaledCardSize = unscaledCardSize;
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

        this.squareButtonBackShape.y = this.unscaledCardSize.height * 0.075

        //this.container.addChild(this.squareButtonBackShape)
        //this.container.addChild(this.innerBorder)
        this.container.addChild(this.squareButtonShape)

        this.iconContainer = new PIXI.Container();

        this.container.addChild(this.iconContainer)


        this.addChild(this.container);

        // this.squareButtonBackShape.interactive = true;
        // this.squareButtonBackShape.on('pointerover', this.onPointerOver.bind(this)).on('touchstart', this.onPointerOver.bind(this));
        // this.squareButtonBackShape.on('pointerout', this.onPointerOut.bind(this)).on('touchend', this.onPointerOut.bind(this)).on('touchendoutside', this.onPointerOut.bind(this));
        // this.squareButtonBackShape.on('pointerup', this.onPointerUp.bind(this));

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



        if (!this.iconBackground) {
            this.iconBackground = new PIXI.mesh.NineSlicePlane(
                PIXI.Texture.fromFrame('progressBarSmall.png'), 10, 10, 10, 10)

            this.squareButtonShape.addChildAt(this.iconBackground, 0)

        }
        window.COOKIE_MANAGER.onChangeColors.add(() => {
            this.updateColorScheme();
        })


        this.currentLevels = [];
        this.offset = { x: 0, y: 0 }

        this.slotSize = { width: 0, height: 0 }
        this.updateColorScheme();

        this.onLevelSelect = new signals.Signal()
    }
    updateColorScheme() {
        let colorScheme = colorSchemes.getCurrentColorScheme().buttonData;

        this.label.style.fill = colorScheme.fontColor;
        this.label.style.fontWeight = 800;
        this.label.style.stroke = colorScheme.buttonStandardDarkColor;
        this.label.style.strokeThickness = 8
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
    onPointerUp(levelSprite) {

        window.SOUND_MANAGER.play('tap', { volume: 0.5 })

        let levelData = null;
        this.currentLevels.forEach(element => {
            if (element.currentSprite == levelSprite) {
                levelData = element;
            }
        });

        if (levelData) {
            this.onLevelSelect.dispatch(levelData);
        }
        //console.log(levelData);
    }
    onPointerOver() {
        TweenMax.killTweensOf(this.squareButtonShape)
        TweenMax.to(this.squareButtonShape, 0.2, { y: this.unscaledCardSize.height * 0.075, ease: Back.easeOut })
        //this.squareButtonShape.y = 10;

    }
    onPointerOut() {
        TweenMax.killTweensOf(this.squareButtonShape)
        TweenMax.to(this.squareButtonShape, 0.5, { y: 0, ease: Back.easeOut })
    }
    hideProgressBar(progression = 0) {
        this.progressBar.visible = false;
    }
    reset() {

    }
    refreshCard(sprite, id, isQuestion) {
        this.currentLevels[id].currentSprite.setTexture(sprite.texture);

        if (!isQuestion) {

            this.currentLevels[id].currentSprite.height = this.slotSize.height
            this.currentLevels[id].currentSprite.width = this.slotSize.width

            this.currentLevels[id].currentSprite.x = this.currentLevels[id].offset.x * this.slotSize.width
            this.currentLevels[id].currentSprite.y = this.currentLevels[id].offset.y * this.slotSize.height

        } else {
            //utils.resizeToFitAR(this.slotSize, this.currentLevels[id].currentSprite)
            utils.resizeToFitAR({ width: this.slotSize.width * 0.5, height: this.slotSize.height * 0.5 }, this.currentLevels[id].currentSprite)

            this.currentLevels[id].currentSprite.x = this.currentLevels[id].offset.x * this.slotSize.width + this.slotSize.width / 2 - this.currentLevels[id].currentSprite.width / 2
            this.currentLevels[id].currentSprite.y = this.currentLevels[id].offset.y * this.slotSize.height + this.slotSize.height / 2 - this.currentLevels[id].currentSprite.height / 2
        }


        this.iconBackground.width = this.iconContainer.width + 20;
        this.iconBackground.height = this.iconContainer.height + 20;

        this.iconContainer.x = this.unscaledCardSize.width / 2 - this.iconContainer.width / 2
        this.iconContainer.y = this.unscaledCardSize.height - this.iconContainer.height - this.unscaledCardSize.height * 0.15

        this.iconBackground.x = this.iconContainer.x - 10
        this.iconBackground.y = this.iconContainer.y - 10

    }
    addSplitLevel(level, levelSprite) {
        this.tierData = level;
        if (!this.iconBackground) {
            this.iconBackground = new PIXI.mesh.NineSlicePlane(
                PIXI.Texture.fromFrame('progressBarSmall.png'), 10, 10, 10, 10)
            this.squareButtonShape.addChildAt(this.iconBackground, 0)
        }


        this.slotSize.width = (this.unscaledCardSize.width * 0.9) / level.splitData.j
        this.slotSize.height = ((this.unscaledCardSize.height - this.labelTop.y + this.labelTop.height) * 0.7) / level.splitData.i
        this.slotSize.width = this.slotSize.height = Math.min(this.slotSize.height, this.slotSize.width)
        this.iconContainer.addChild(levelSprite)

        let backSlot = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('progressBarSmall.png'), 10, 10, 10, 10)
            this.iconContainer.addChildAt(backSlot, 0)

        utils.resizeToFitAR(this.slotSize, levelSprite)

        backSlot.width = this.slotSize.width;
        backSlot.height = this.slotSize.height;

        backSlot.x = this.offset.x * this.slotSize.width;
        backSlot.y = this.offset.y * this.slotSize.height;

        backSlot.alpha = 0.25

        levelSprite.x = this.offset.x * this.slotSize.width;
        levelSprite.y = this.offset.y * this.slotSize.height;

        backSlot.interactive = true;
        backSlot.buttonMode = true;
        backSlot.on('pointerup', this.onPointerUp.bind(this, levelSprite));

        level.currentSprite = levelSprite;
        
        level.offset = { x: this.offset.x, y: this.offset.y }
        this.currentLevels.push(level)

        if (this.currentLevels.length > 0) {
            if (this.currentLevels.length % level.splitData.j == 0) {
                this.offset.x = 0;
                this.offset.y++;
            } else {
                this.offset.x++;
            }
        }


        this.iconBackground.width = this.iconContainer.width + 20;
        this.iconBackground.height = this.slotSize.height * level.splitData.i + 20;

        this.iconContainer.x = this.unscaledCardSize.width / 2 - this.iconContainer.width / 2
        this.iconContainer.y = this.unscaledCardSize.height - this.iconContainer.height - this.unscaledCardSize.height * 0.15

        this.iconBackground.x = this.iconContainer.x - 10
        this.iconBackground.y = this.iconContainer.y - 10
    }
    setProgressBar(progression = 0) {
        this.progressBar.visible = true;
        this.progressBar.setProgressBar(progression)
    }
    setColor(color) {
        this.squareButtonShape.tint = color
        this.squareButtonBackShape.tint = color
    }
    updateLabelTop(text, icon, splitData) {
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
                width: this.squareButtonBackShape.width * 0.7,
                height: (this.squareButtonBackShape.height / splitData.j) * 0.15
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
    setPallet(colors) {
        if (this.pallet && this.pallet.parent) {
            this.pallet.parent.removeChild(this.pallet);
        }

        this.pallet = colors;
        this.pallet.scale.set(1);
        this.pallet.pivot.x = this.pallet.width / 2
        this.pallet.pivot.y = this.pallet.height / 2

        utils.resizeToFitAR(
            {
                width: this.squareButtonBackShape.width,
                height: this.squareButtonBackShape.height * 0.15
            }, this.pallet)

        this.pallet.width = this.squareButtonShape.width
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
                width: this.squareButtonBackShape.width * 0.7,
                height: this.squareButtonBackShape.height * 0.15
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