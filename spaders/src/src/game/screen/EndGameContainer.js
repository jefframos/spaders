import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';
import Screen from '../../screenManager/Screen'
import Grid from '../elements/Grid'
import Card from '../elements/Card'
import Block from '../elements/Block'
import Board from '../core/Board'
import BackgroundEffects from '../effects/BackgroundEffects'
import { debug } from 'webpack';
import UIButton1 from './UIButton1';

export default class EndGameContainer extends PIXI.Container {
    constructor(screen) {
        super();

        this.gameScreen = screen;

        this.screenContainer = new PIXI.Container();
        this.stripsContainer = new PIXI.Container();
        this.changeLabelTimer = 0;


        this.currentButtonLabel = "YOU WIN"
        this.youWinLabel = new PIXI.Text(this.currentButtonLabel, { font: '80px', fill: 0xFFFFFF, align: 'center', fontWeight: '800', fontFamily: window.STANDARD_FONT1 });

        this.addChild(this.screenContainer);
        this.screenContainer.addChild(this.stripsContainer);
        this.screenContainer.addChild(this.youWinLabel);
        let height = 50;
        let width = 3000;
        this.line1 = new PIXI.Graphics().beginFill(window.config.colors.blue2).drawRect(-width / 2, -height * 4, width, height * 5);
        this.stripsContainer.addChild(this.line1);

        let line2 = new PIXI.Graphics().beginFill(window.config.colors.red).drawRect(-width / 2, 0, width, height);
        this.stripsContainer.addChild(line2);
        line2.y = height;

        let line3 = new PIXI.Graphics().beginFill(window.config.colors.yellow).drawRect(-width / 2, 0, width, height);
        this.stripsContainer.addChild(line3);
        line3.y = height * 2;

        let line4 = new PIXI.Graphics().beginFill(window.config.colors.green).drawRect(-width / 2, 0, width, height);
        this.stripsContainer.addChild(line4);
        line4.y = height * 3;

        let line5 = new PIXI.Graphics().beginFill(window.config.colors.pink).drawRect(-width / 2, 0, width, height);
        this.stripsContainer.addChild(line5);
        line5.y = height * 4;


        let center = new PIXI.Graphics().beginFill(0xff0000).drawCircle(0, 0, 10)

        this.buttonMode = true;

        this.levelName = new PIXI.Text("Level 1", { font: '64px', fill: 0xFFFFFF, align: 'left', fontWeight: '300', fontFamily: window.STANDARD_FONT1 });
        this.screenContainer.addChild(this.levelName);

        this.pointsLabel = new PIXI.Text("POINTS: 3450", { font: '30px', fill: 0xFFFFFF, align: 'center', fontWeight: '300', fontFamily: window.STANDARD_FONT1 });
        this.screenContainer.addChild(this.pointsLabel);

        this.movesLabel = new PIXI.Text("MOVES: 34", { font: '30px', fill: 0xFFFFFF, align: 'center', fontWeight: '300', fontface: window.STANDARD_FONT1, fontFamily: window.STANDARD_FONT1 });

        this.screenContainer.addChild(this.movesLabel);

        this.timeLabel = new PIXI.Text("TIME: 34", { font: '30px', fill: 0xFFFFFF, align: 'center', fontWeight: '300', fontface: window.STANDARD_FONT1, fontFamily: window.STANDARD_FONT1 });

        this.screenContainer.addChild(this.timeLabel);

        let pos = [this.pointsLabel, this.movesLabel, this.timeLabel]

        for (let index = 0; index < pos.length; index++) {
            const element = pos[index];
            element.y = index * 50 + 55
        }


        this.backButton = new UIButton1(config.colors.background,window.iconsData.home, config.colors.white);
        this.backButton.onClick.add(() => {
            this.goBack(0)
        });

        this.addChild(this.backButton);

        this.backButton.on('mousedown', this.goBack.bind(this)).on('touchstart', this.goBack.bind(this));


        this.replayButton = new UIButton1(config.colors.background, window.iconsData.reload, config.colors.white);
        this.replayButton.onClick.add(() => {
            this.restart()
        });
        this.addChild(this.replayButton);


        this.nextLevel = new UIButton1(config.colors.white, window.iconsData.next, config.colors.background);
        this.nextLevel.onClick.add(() => {
            this.playNextLevel()
        });
        this.addChild(this.nextLevel);
        this.nextLevel.addLabelLeft("NEXT");

        this.mainCanvas = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, config.width, config.height);
        this.addChild(this.mainCanvas)
        this.mainCanvas.alpha = 0
    }
    resize(innerResolution) {
        this.mainCanvas.width = innerResolution.width;
        this.mainCanvas.height = innerResolution.height;

        let globalPos = this.toLocal({ x: 0, y: 0 })
        this.mainCanvas.position = globalPos

        this.stripsContainer.x = 0
        this.stripsContainer.y = 0

        this.gameScreen.resizeToFitAR({ width: this.mainCanvas.width, height: this.mainCanvas.height }, this.screenContainer, this.mainCanvas)

        this.screenContainer.x = this.mainCanvas.width / 2 + this.mainCanvas.x
        this.screenContainer.y = this.mainCanvas.height / 2 + this.mainCanvas.y

        if (this.screenContainer.scale.x < 1) {
            this.replayButton.scale.set(this.screenContainer.scale.x)
            this.backButton.scale.set(this.screenContainer.scale.x)
            this.nextLevel.scale.set(this.screenContainer.scale.x)
        }

        this.nextLevel.x = this.mainCanvas.x + this.mainCanvas.width - this.backButton.width
        this.nextLevel.y = this.mainCanvas.y + this.mainCanvas.height - this.backButton.height

        this.backButton.x = this.mainCanvas.x + this.backButton.width
        this.backButton.y = this.mainCanvas.y + this.mainCanvas.height - this.backButton.height

        this.replayButton.x = this.backButton.x + this.replayButton.width
        this.replayButton.y = this.backButton.y
    }
    getRect(size = 4, color = 0xFFFFFF) {
        return new PIXI.Graphics().beginFill(color).drawRect(0, 0, size, size);
    }
    show(force = false, delay = 0) {

        TweenLite.killTweensOf(this.screenContainer)
        TweenLite.killTweensOf(this.backButton)
        TweenLite.killTweensOf(this.replayButton)
        TweenLite.killTweensOf(this.nextLevel)

        TweenLite.to(this.screenContainer, 0.25, { delay: delay, alpha: 1, ease: Cubic.easeOut })

        this.backButton.alpha = 0;
        TweenLite.to(this.backButton, 0.5, { delay: delay, alpha: 1, ease: Cubic.easeOut })
        this.backButton.interactive = true;
        this.backButton.buttonMode = true;
        this.backButton.visible = true;

        this.replayButton.alpha = 0;
        TweenLite.to(this.replayButton, 0.5, { delay: delay, alpha: 1, ease: Cubic.easeOut })
        this.replayButton.interactive = true;
        this.replayButton.buttonMode = true;
        this.replayButton.visible = true;

        this.nextLevel.alpha = 0;
        TweenLite.to(this.nextLevel, 0.5, { delay: delay, alpha: 1, ease: Cubic.easeOut })
        this.nextLevel.interactive = true;
        this.nextLevel.buttonMode = true;
        this.nextLevel.visible = true;

    }
    hide(force = false) {
        TweenLite.killTweensOf(this.screenContainer)
        TweenLite.killTweensOf(this.backButton)
        TweenLite.killTweensOf(this.replayButton)
        TweenLite.killTweensOf(this.nextLevel)
        TweenLite.to(this.screenContainer, force ? 0 : 0.5, { alpha: 0, ease: Cubic.easeIn })
        TweenLite.to(this.backButton, force ? 0 : 0.5, { alpha: 0, ease: Cubic.easeIn })
        TweenLite.to(this.replayButton, force ? 0 : 0.5, { alpha: 0, ease: Cubic.easeIn })
        TweenLite.to(this.nextLevel, force ? 0 : 0.5, { alpha: 0, ease: Cubic.easeIn })
        this.backButton.interactive = false;
        this.replayButton.interactive = false;
        this.nextLevel.interactive = false;
        //console.log("hide")
        //console.trace()
    }
    setStats(points, rounds, time, image, data) {

        if (this.currentLevelImage && this.currentLevelImage.parent) {
            this.currentLevelImage.parent.removeChild(this.currentLevelImage);
        }
        this.currentLevelImage = image;
        this.movesLabel.text = "MOVES: " + rounds;
        this.pointsLabel.text = "POINTS: " + points;
        this.timeLabel.text = "TIME: " + time;

        this.movesLabel.pivot.x = this.movesLabel.width / 2
        this.pointsLabel.pivot.x = this.pointsLabel.width / 2
        this.timeLabel.pivot.x = this.timeLabel.width / 2

        this.levelName.scale.set(1);
        this.levelName.text = data.levelName;


        this.levelName.pivot.x = this.levelName.width / 2;
        this.levelName.pivot.y = this.levelName.height;
        this.levelName.x = 0
        this.levelName.y = -220

        if (this.levelName.width > 300) {

            this.levelName.scale.set(300 / this.levelName.width)
        }
        //this.currentLevelImage.rotation = Math.PI * -0.25
        if (this.youWinLabel.parent) {
            this.youWinLabel.parent.removeChild(this.youWinLabel);
        }




        this.youWinLabel.x = this.levelName.x
        this.youWinLabel.y = this.levelName.height


        this.currentLevelImage.pivot.x = this.currentLevelImage.width / 2
        this.currentLevelImage.pivot.y = this.currentLevelImage.height / 2
        //let locStripe = this.screenContainer.toLocal(this.line1.getGlobalPosition())
        this.currentLevelImage.x = 0//Math.cos(this.currentLevelImage.rotation) * -350
        this.currentLevelImage.y = -70//locStripe.y//-imageAspect.height + Math.sin(this.currentLevelImage.rotation) * -350

        let imageAspect = { width: this.line1.width, height: this.line1.height * 0.8 }
        this.gameScreen.resizeToFitAR(imageAspect, this.currentLevelImage)

        this.line1.addChild(this.currentLevelImage);
        this.line1.addChild(this.levelName);

        //this.currentLevelImage.addChild(this.youWinLabel)
        //this.currentLevelImage.addChild(this.levelName)


        this.levelName.scale.set(1 + (1 - this.currentLevelImage.scale.x))
        this.youWinLabel.scale.set(1 + (1 - this.currentLevelImage.scale.x))

        //console.log( this.currentLevelImage.scale)
        //console.log( this.youWinLabel.scale)

        //this.screenContainer.addChild(s);
    }
    getMask() {
        this.currentMask = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, this.stripsContainer.width, this.stripsContainer.height);
        this.currentMask.rotation = this.stripsContainer.rotation;
        this.currentMask.pivot.x = this.stripsContainer.pivot.x
        this.currentMask.pivot.y = this.stripsContainer.pivot.y
        this.currentMask.x = this.x
        this.currentMask.y = this.y
        return this.currentMask
    }

    update(delta) {

        if (this.changeLabelTimer <= 0) {
            //this.updateStartLabel();

        } else {
            this.changeLabelTimer -= delta;
        }

    }
    updateStartLabel() {
        if (Math.random() < 0.2) return;
        this.youWinLabel.text = window.shuffleText(this.currentButtonLabel, true);
        //this.youWinLabel.style.fill = ENEMIES.list[Math.floor(ENEMIES.list.length * Math.random())].color;

        this.changeLabelTimer = 0.5;
    }
    restart() {
        this.hide(true);

        setTimeout(() => {            
            this.gameScreen.resetGame()
        }, 750);
    }
    goBack() {
        this.gameScreen.mainmenuStateFromGame(true)
    }
    playNextLevel() {
        this.gameScreen.playNextLevel()
    }
    removeEvents() {
        //console.log("removeEvents")
        this.backButton.interactive = true;

    }
    addEvents() {
        this.removeEvents();
        //console.log("addEvents")
        this.backButton.interactive = true;


    }


}