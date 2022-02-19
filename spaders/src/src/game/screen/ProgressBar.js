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

        this.loadingBar = new PIXI.Graphics().beginFill(config.colors.white).drawRoundedRect(0, 0, this.sizeWidth, this.sizeHeight, this.round);
        this.loadingBar.cacheAsBitmap = true;
        this.loadingBarFillBack = new PIXI.Graphics().beginFill(config.colors.background).drawRoundedRect(0, 0, this.sizeWidth - this.round / 2, this.sizeHeight * 0.75, this.round * 0.75);
        this.loadingBarFillBack.x = this.round / 4
        this.loadingBarFillBack.y = this.round / 4
        this.loadingBarFillBack.cacheAsBitmap = true;

        this.loadingBarFill = new PIXI.Graphics().beginFill(config.colors.red).drawRoundedRect(0, 0, this.sizeWidth - this.round / 2, this.sizeHeight * 0.75, this.round * 0.75);
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

        window.COOKIE_MANAGER.onChangeColors.add(() => {
            this.updateColorScheme();
        })

        this.updateColorScheme();
        this.currentColor
    }
    updateColorScheme() {
        let colorScheme = colorSchemes.getCurrentColorScheme();
        this.currentColor = colorScheme.fillBarColor;
        this.setProgressBar(this.currentValue, colorScheme.fillBarColor)
    }
    setProgressBar(value = 0, color = null) {
        if (value <= 0) {
            return;
        }
        if(color === null){
            color = this.currentColor;
        }
        this.loadingBarFill.visible = true;
        this.loadingBarFill.clear()
        value = Math.max(value, 0.1);
        this.currentValue = value;
        this.loadingBarFill.beginFill(color).drawRoundedRect(0, 0, (this.sizeWidth - this.round / 2) * value, this.sizeHeight * 0.75, this.round * 0.75);
        this.loadingBarFill.endFill();

        //console.log("UPDATE STUFF NEW PROGRESS BAR", this.loadingBarFill)

    }
}