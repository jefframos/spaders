import * as PIXI from 'pixi.js';
import * as signals from 'signals';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';
import UIButton1 from './UIButton1';
import Spring from '../effects/Spring';

export default class MainMenu extends PIXI.Container {
    constructor(color, icon, iconColor) {
        super();

        this.mainContainer = new PIXI.Container();


        this.customWidth = 60;
        this.backShape = new PIXI.Graphics();
        this.backShape.beginFill(config.colors.white);
        this.backShape.drawRoundedRect(0, 0, 400, 400, 20);
        // this.backShape.drawRoundedRect(0, 0, 290, 100, 20);
        this.backShape.endFill();
        this.backShape.alpha = 1

        this.positionSpring = new Spring();

        this.openMenu = new UIButton1(config.colors.white, window.iconsData.settings, config.colors.dark);
        this.openMenu.onClick.add(() => this.toggleState());

        this.wipeDataButton = new UIButton1(config.colors.background, window.iconsData.wipeData, config.colors.white);
        this.wipeDataButton.onClick.add(() => {
            window.COOKIE_MANAGER.wipeData();
        });
        this.wipeDataButton.backShape.rotation = 0

        this.refreshButton = new UIButton1(config.colors.background, window.iconsData.reload, config.colors.white);
        this.refreshButton.onClick.add(() => {
            this.state = 1;
            this.onRestart.dispatch()
        });
        this.refreshButton.backShape.rotation = 0

        this.mainContainer.addChild(this.backShape);
        this.mainContainer.scale.set(1.5)

        this.toggleSound = new UIButton1(config.colors.background, window.iconsData.soundOn, config.colors.white);
        this.toggleSound.onClick.add(() => {
            let toggle = window.SOUND_MANAGER.toggleMute();
            if (toggle) {
                this.toggleSound.updateTexture(window.iconsData.soundOff);
            } else {
                this.toggleSound.updateTexture(window.iconsData.soundOn);
            }
        });
        this.toggleSound.backShape.rotation = 0


        this.toggleDebug = new UIButton1(config.colors.background, window.iconsData.debugging, config.colors.white);
        this.toggleDebug.onClick.add(() => {
            window.COOKIE_MANAGER.toogleDebug();
        });
        this.toggleDebug.backShape.rotation = 0

        if (!window.COOKIE_MANAGER.settings.sound) {
            this.toggleSound.updateTexture(window.iconsData.soundOff);
        }
        this.positionSpring.x = -this.backShape.width;
        this.mainContainer.x = -this.backShape.width;
        this.addChild(this.mainContainer);
        this.mainContainer.addChild(this.wipeDataButton);
        //this.mainContainer.addChild(this.refreshButton);
        //this.mainContainer.addChild(this.autoPlayButton);
        this.mainContainer.addChild(this.toggleSound);
        this.toggleSound.x = this.backShape.width - 60
        this.toggleSound.y = 50;

        this.mainContainer.addChild(this.toggleDebug);
        this.toggleDebug.x = this.backShape.width - 60
        this.toggleDebug.y = 350;

        // this.refreshButton.x = this.backShape.width - 60
        this.wipeDataButton.x = this.wipeDataButton.width * 0.5 + 30
        this.wipeDataButton.y = this.toggleSound.y;
        // this.refreshButton.y = 50

        // this.autoPlayButton.x = this.wipeDataButton.x - 90;
        // this.autoPlayButton.y = this.refreshButton.y;

        // this.toggleSound.x = this.wipeDataButton.x - 90;
        // this.toggleSound.y = this.refreshButton.y;

        this.addChild(this.openMenu);

        this.onBack = new signals.Signal()
        this.onRestart = new signals.Signal()


        this.statsContainer = new PIXI.Container();
        this.stats = new PIXI.Text("Stats", this.fontStyle('26px', config.colors.dark));
        this.totalCombos = new PIXI.Text("", this.fontStyle('22px', config.colors.blue2));
        this.levelsFinished = new PIXI.Text("", this.fontStyle('22px', config.colors.red));
        this.totalPlayTime = new PIXI.Text("", this.fontStyle('22px', config.colors.red2));
        this.totalMoves = new PIXI.Text("", this.fontStyle('22px', config.colors.pink));
        this.totalShards = new PIXI.Text("", this.fontStyle('22px', config.colors.purple));
        this.totalPIeces = new PIXI.Text("", this.fontStyle('22px', config.colors.background));

        let dist = 30;
        this.statsOrder = [this.stats, this.totalPlayTime, this.totalMoves, this.totalCombos, this.totalShards, this.levelsFinished, this.totalPIeces];

        for (let index = 0; index < this.statsOrder.length; index++) {
            const element = this.statsOrder[index];
            this.statsContainer.addChild(element);
            element.y = dist * index;
        }

        this.statsContainer.x = this.backShape.width / 2;
        this.statsContainer.y = 80;
        this.mainContainer.addChild(this.statsContainer)

        this.state = 1;

    }
    fontStyle(size, color) {
        let style = {
            font: size,
            fill: color,
            align: 'center',
            fontFamily: window.STANDARD_FONT1
        }
        return style;
    }
    toggleState() {
        if (this.state == 1) {
            this.open();
        } else {
            this.collapse()
        }
    }
    collapse() {
        this.state = 1;
    }
    open() {
        this.state = 2;
        if (window.SOUND_MANAGER.isMute) {
            this.toggleSound.updateTexture(window.iconsData.soundOff);
        } else {
            this.toggleSound.updateTexture(window.iconsData.soundOn);
        }

        this.totalCombos.text = 'Total Combos: ' + window.COOKIE_MANAGER.stats.totalCombos
        this.levelsFinished.text = 'Levels Completed: ' + window.COOKIE_MANAGER.stats.totalLevelsFinished
        this.totalPlayTime.text = 'Play time: ' + utils.convertNumToTime(window.COOKIE_MANAGER.stats.totalLevelsPlayTime)
        this.totalMoves.text = 'Total Moves: ' + window.COOKIE_MANAGER.stats.totalMoves
        this.totalShards.text = 'Total Shards: ' + window.COOKIE_MANAGER.stats.totalShardsCollected
        this.totalPIeces.text = 'Pieces Destroyed: ' + window.COOKIE_MANAGER.stats.totalPiecesDestroyed

        for (let index = 0; index < this.statsOrder.length; index++) {
            const element = this.statsOrder[index];
            element.pivot.x = element.width / 2;
        }

    }
    update(delta) {

        this.positionSpring.update();
        if (this.state == 1) {
            this.openMenu.updateTexture(window.iconsData.settings)
            this.positionSpring.tx = this.backShape.width * this.mainContainer.scale.x + 50;
            this.mainContainer.x = this.positionSpring.x//utils.lerp(this.mainContainer.x, this.backShape.width * this.mainContainer.scale.x + 50, 0.5);
            this.mainContainer.alpha = utils.lerp(this.mainContainer.alpha, 0, 0.5);
        } else {
            this.openMenu.updateTexture(window.iconsData.cancel)
            this.positionSpring.tx = -this.backShape.width * this.mainContainer.scale.x
            this.mainContainer.x = this.positionSpring.x//utils.lerp(this.mainContainer.x, -this.backShape.width * this.mainContainer.scale.x, 0.5);
            this.mainContainer.alpha = utils.lerp(this.mainContainer.alpha, 1, 0.5);
        }
    }
}
