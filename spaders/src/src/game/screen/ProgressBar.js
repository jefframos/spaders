import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import colorSchemes from '../../colorSchemes';
import config from '../../config';
import utils from '../../utils';

export default class ProgressBar extends PIXI.Container {
    constructor(size) {
        super();

        this.tapToStart = new PIXI.Container();

        this.addChild(this.tapToStart);
        this.infoLabel = new PIXI.Text('COMPLETE', { font: '16px', fill: config.colors.white, fontFamily: window.STANDARD_FONT1 });
        this.infoLabel.pivot.x = this.infoLabel.width / 2
        this.infoLabel.pivot.y = this.infoLabel.height / 2
        this.tapToStart.addChild(this.infoLabel)

        this.infoLabel.x = 125
        this.infoLabel.y = 19

        this.round = size.height / 2
        this.sizeHeight = size.height
        this.sizeWidth = size.width

        //this.loadingBar = new PIXI.Graphics().beginFill(config.colors.white).drawRoundedRect(0, 0, this.sizeWidth, this.sizeHeight, this.round);
        this.loadingBar = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('progressBarSmall.png'), 10, 10, 10, 10)
        this.loadingBar.width = this.sizeWidth
        this.loadingBar.height = this.sizeHeight
        //this.loadingBar.cacheAsBitmap = true;
        this.loadingBarFillBack = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('progressBarSmall.png'), 10, 10, 10, 10)
        this.loadingBarFillBack.width = this.sizeWidth- this.round / 2
        this.loadingBarFillBack.height = this.sizeHeight- this.round / 2
        this.loadingBarFillBack.tint = 0;
        // = new PIXI.Graphics().beginFill(config.colors.background).drawRoundedRect(0, 0, this.sizeWidth - this.round / 2, this.sizeHeight * 0.75, this.round * 0.75);
        this.loadingBarFillBack.x = this.round / 4
        this.loadingBarFillBack.y = this.round / 4
        this.loadingBarFillBack.cacheAsBitmap = true;

        this.loadingBarFill = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('progressBarSmall.png'), 10, 10, 10, 10)
        this.loadingBarFill.width = 0
        this.loadingBarFill.height = this.sizeHeight- this.round / 2
        this.loadingBarFill.tint = 0;
        this.loadingBarFill.x = this.round / 4
        this.loadingBarFill.y = this.round / 4

        this.loadingBarFill.visible = false;
        //this.loadingBarFill.scale.x = 0;

        this.infoLabel.visible = false;

        this.tapToStart.addChild(this.loadingBar)
        this.tapToStart.addChild(this.loadingBarFillBack)
        this.tapToStart.addChild(this.loadingBarFill)

        //this.setProgressBar(Math.random())
        this.currentValue = 0;
        this.state = 0;

        window.COOKIE_MANAGER.onChangeColors.add(() => {
            this.updateColorScheme();
        })

        this.updateColorScheme();
        this.currentColor

    }
    updateColorScheme() {
        this.updateColor();
        this.setProgressBar(this.currentValue, this.currentColor)
    }
    updateBackgroundColor(color){
        this.loadingBarFillBack.tint = color;
    }
    updateBackgroundFront(color){
        this.currentColor = color;
        this.loadingBarFill.tint = color;
    }
    updateColor(){
        let colorScheme = colorSchemes.getCurrentColorScheme();

        if(this.state == 0){
            this.currentColor = colorScheme.fillBarColor;
        }else{
            this.currentColor = colorScheme.fillBarCompleteColor;
        }
    }
    resizeBar(width, height = 30, hideBorder = false){
        if(width == this.sizeWidth){
            return;
        }
        this.sizeHeight = height;
        this.sizeWidth = width;
        this.loadingBar.width = this.sizeWidth
        this.loadingBar.height = this.sizeHeight

        let add = this.round / 2
        if(hideBorder){
            add = 0;
            this.loadingBarFillBack.position.set(0)
            this.loadingBarFill.position.set(0)
        }
        this.loadingBarFillBack.width = this.sizeWidth- add
        this.loadingBarFillBack.height = this.sizeHeight- add
        this.loadingBarFill.width = this.sizeWidth- add
        this.loadingBarFill.height = this.sizeHeight- add

        this.loadingBar.visible = !hideBorder
        this.setProgressBar(this.currentValue);

    }
    setProgressBar2(value = 0, color = null) {
        if (value < 0) {
            return;
        }
        if (color === null) {
            color = this.currentColor;
        }
        if(value >= 1){
            this.state = 1;
        }else{
            this.state = 0;
        }
        this.updateColor();
        this.loadingBarFill.visible = true;
        this.currentValue = value;
        this.loadingBarFill.tint = color;
        let targetWidth = (this.sizeWidth - this.round / 2) * this.currentValue;
        targetWidth = Math.max(targetWidth, 10);
        TweenMax.killTweensOf(this.loadingBarFill);
        TweenMax.to(this.loadingBarFill, 0.5, {width:targetWidth});


    }
    setProgressBar(value = 0, color = null) {
        if (value <= 0) {
            return;
        }
        if (color === null) {
            color = this.currentColor;
        }
        if(value >= 1){
            this.state = 1;
        }else{
            this.state = 0;
        }
        this.updateColor();
        this.loadingBarFill.visible = true;
        value = Math.max(value, 0.1);
        this.currentValue = value;
        this.loadingBarFill.tint = color;
        this.loadingBarFill.width =  (this.sizeWidth - this.round / 2) * value;

    }
}