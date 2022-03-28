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
import colorSchemes from '../../colorSchemes';

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

        this.lines = []
        this.line1 = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(-width / 2, -height * 4, width, height * 5);
        this.stripsContainer.addChild(this.line1);

        let line2 = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(-width / 2, 0, width, height);
        this.stripsContainer.addChild(line2);
        line2.y = height;

        let line3 = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(-width / 2, 0, width, height);
        this.stripsContainer.addChild(line3);
        line3.y = height * 2;

        let line4 = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(-width / 2, 0, width, height);
        this.stripsContainer.addChild(line4);
        line4.y = height * 3;

        let line5 = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(-width / 2, 0, width, height);
        //this.stripsContainer.addChild(line5);
        line5.y = height * 4;

        this.lines.push(this.line1);
        this.lines.push(line2);
        this.lines.push(line3);
        this.lines.push(line4);
        this.lines.push(line5);
        let center = new PIXI.Graphics().beginFill(0xff0000).drawCircle(0, 0, 10)

        this.buttonMode = true;

        this.levelName = new PIXI.Text("Level 1", { font: '54px', fill: 0xFFFFFF, align: 'left', fontWeight: '300', fontFamily: window.STANDARD_FONT1 });
        this.screenContainer.addChild(this.levelName);

        this.pointsLabel = new PIXI.Text("POINTS: 3450", { font: '30px', fill: 0xFFFFFF, align: 'center', fontWeight: '300', fontFamily: window.STANDARD_FONT1 });
        this.screenContainer.addChild(this.pointsLabel);

        this.movesLabel = new PIXI.Text("MOVES: 34", { font: '30px', fill: 0xFFFFFF, align: 'center', fontWeight: '300', fontface: window.STANDARD_FONT1, fontFamily: window.STANDARD_FONT1 });

        this.screenContainer.addChild(this.movesLabel);

        this.timeLabel = new PIXI.Text("TIME: 34", { font: '30px', fill: 0xFFFFFF, align: 'center', fontWeight: '300', fontface: window.STANDARD_FONT1, fontFamily: window.STANDARD_FONT1 });

        this.screenContainer.addChild(this.timeLabel);

        this.scoreLabelStatic = new PIXI.Text("SCORE", { font: '30px', fill: 0xFFFFFF, align: 'center', fontWeight: '300', fontface: window.STANDARD_FONT1, fontFamily: window.STANDARD_FONT1 });

        //this.screenContainer.addChild(this.scoreLabelStatic);
        this.scoreLabel = new PIXI.Text("TIME: 34", { font: '72px', fill: 0xFFFFFF, align: 'center', fontWeight: '300', fontface: window.STANDARD_FONT1, fontFamily: window.STANDARD_FONT1 });
        this.scoreLabel.x = this.scoreLabelStatic.width / 2;
        this.scoreLabel.y = 30;
        this.scoreLabelStatic.addChild(this.scoreLabel);

        this.newHighscore = new PIXI.Text("NEW HIGHSCORE", { font: '38px', fill: 0xFFFFFF, align: 'center', fontWeight: '300', fontface: window.STANDARD_FONT1, fontFamily: window.STANDARD_FONT1 });

        let highscoreIcon = new PIXI.Sprite.fromImage(window.iconsData.highscore)
        highscoreIcon.anchor.set(0.5);
        highscoreIcon.scale.set(0.5);
        highscoreIcon.tint = config.colors.red2;
        highscoreIcon.x = this.newHighscore.width / 2;
        highscoreIcon.y = -30;
        this.newHighscore.addChild(highscoreIcon);
        //this.screenContainer.addChild(this.newHighscore);
        //this.newHighscore.rotation = Math.PI * 0.1
        this.newHighscore.scale.set(0.75)

        this.newHighscore.sin = 0;

        let pos = [this.movesLabel, this.pointsLabel, this.timeLabel]

        for (let index = 0; index < pos.length; index++) {
            const element = pos[index];
            element.y = index * 50 + 55
        }


        this.backButton = new UIButton1(config.colors.background, window.iconsData.home, config.colors.white);
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
        window.COOKIE_MANAGER.onChangeColors.add(() => {
            this.updateColorScheme();
        })

        this.updateColorScheme();
    }
    updateColorScheme() {
        let colorScheme = colorSchemes.getCurrentColorScheme();

        this.movesLabel.style.fill = colorScheme.fontColor;
        this.pointsLabel.style.fill = colorScheme.fontColor;
        this.timeLabel.style.fill = colorScheme.fontColor;
        this.levelName.style.fill = colorScheme.fontColor;

        this.nextLevel.updateTextColor(colorScheme.fontColor);
    }
    updateLinesColor() {
        let scheme = window.COOKIE_MANAGER.stats.colorPalletID;
        let colors = colorSchemes.colorSchemes[scheme == undefined ? 0 : scheme]
        for (let index = 0; index < this.lines.length; index++) {
            const element = this.lines[index];

            element.tint = colors.list[index].color;
        }

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
        this.screenContainer.y = this.mainCanvas.height / 2 + this.mainCanvas.y - 50

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

        this.updateLinesColor();

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

        this.backButton.visible = false;
        this.replayButton.visible = false;
        this.nextLevel.visible = false;

        //console.log("hide")
        //console.trace()
    }
    setStats(points, rounds, time, image, data) {

        getNextLevel(data);
        //console.log(image.scale)
        if (this.currentLevelImage && this.currentLevelImage.parent) {
            this.currentLevelImage.parent.removeChild(this.currentLevelImage);
        }

        if (!this.iconBackground) {
            this.iconBackground = new PIXI.mesh.NineSlicePlane(
                PIXI.Texture.fromFrame('progressBarSmall.png'), 10, 10, 10, 10)

            this.line1.addChild(this.iconBackground)
        }

        this.currentLevelImage = image;
        this.movesLabel.text = "MOVES: " + rounds;
        this.pointsLabel.text = "POINTS: " + points;
        this.timeLabel.text = "TIME: " + time;
        this.scoreLabel.text = Math.round(points / rounds);

        this.movesLabel.pivot.x = this.movesLabel.width / 2
        this.pointsLabel.pivot.x = this.pointsLabel.width / 2
        this.timeLabel.pivot.x = this.timeLabel.width / 2
        this.scoreLabelStatic.pivot.x = this.scoreLabelStatic.width / 2
        this.scoreLabel.pivot.x = this.scoreLabel.width / 2

        this.newHighscore.pivot.x = this.newHighscore.width / 2 / this.newHighscore.scale.x
        this.newHighscore.pivot.y = this.newHighscore.height / 2 / this.newHighscore.scale.y

        this.scoreLabelStatic.y = 220;

        this.newHighscore.y = 400;
        this.newHighscore.x = 0;

        this.levelName.scale.set(1);
        this.levelName.text = data.levelName;


        this.levelName.pivot.x = this.levelName.width / 2;
        this.levelName.pivot.y = this.levelName.height;
        this.levelName.x = 0
        this.levelName.y = -210

        if (this.levelName.width > 300) {

            this.levelName.scale.set(300 / this.levelName.width / this.levelName.scale.x)
        }
        console.log(this.levelName.scale)
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




        let imageAspect = { width: 250, height: 180 }
        this.gameScreen.resizeToFitAR(imageAspect, this.currentLevelImage)

        this.line1.addChild(this.currentLevelImage);


        this.iconBackground.width = this.currentLevelImage.width + 12
        this.iconBackground.height = this.currentLevelImage.height + 12

        this.iconBackground.x = this.currentLevelImage.x - this.currentLevelImage.width / 2 - 6
        this.iconBackground.y = this.currentLevelImage.y - this.currentLevelImage.height / 2 - 6


        this.iconBackground.tint = colorSchemes.getCurrentColorScheme().background
        //this.line1.addChild(this.levelName);

        //this.currentLevelImage.addChild(this.youWinLabel)
        //this.currentLevelImage.addChild(this.levelName)


        //this.levelName.scale.set(1 + (1 - this.currentLevelImage.scale.x))
        this.youWinLabel.scale.set(1 + (1 - this.currentLevelImage.scale.x))

        //console.log( this.currentLevelImage.scale)
        //console.log( this.youWinLabel.scale)

        //this.screenContainer.addChild(s);
    }
    showHighscore() {
        this.newHighscore.visible = true;
    }
    hideHighscore() {
        this.newHighscore.visible = false;
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

        if (this.newHighscore.visible) {
            if (delta) {

                this.newHighscore.sin += delta * 2;
            }

            this.newHighscore.rotation = Math.sin(this.newHighscore.sin) * 0.15;
        }
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
        }, 900);
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