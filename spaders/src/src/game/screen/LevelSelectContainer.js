import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';
import { debug } from 'webpack';
import SquareButton from './SquareButton';
import Spring from '../effects/Spring';
import colorSchemes from '../../colorSchemes';
import UIButton1 from './UIButton1';
import VerticalNavBar from './VerticalNavBar';
import LargeImageButton from './LargeImageButton';


export default class LevelSelectContainer extends PIXI.Container {
    constructor(screen) {
        super();
        this.currentTier = 0;
        this.gameScreen = screen;

        this.navButtons = [];


        this.levelBackShape = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, config.width, config.height * 0.8);
        this.addChild(this.levelBackShape)
        this.levelBackShape.alpha = 0

        this.sections = window.levelSections.sections

        this.unscaledCardSize = { width: window.innerWidth / 5, height: window.innerWidth / 5 }
        this.unscaledLineButtonSize = { width: window.innerWidth / 5, height: window.innerWidth / 5 }

        this.mainCanvas = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, config.width, config.height);
        this.addChild(this.mainCanvas)
        this.mainCanvas.alpha = 0

        this.newContainer = new PIXI.Container();
        this.sectionsContainer = new PIXI.Container();
        this.sectionsView = new PIXI.Container();

        this.levelsContainer = new PIXI.Container();
        this.levelsView = new PIXI.Container();

        this.tiersContainer = new PIXI.Container();
        this.tiersView = new PIXI.Container();

        this.currentSection = "";
        this.currentTier = "";
        this.sectionButtons = [];
        this.levelCards = [];
        this.levelSplitCards = [];

        this.showingBlockTime = 0;

        this.tempBlockPanel = new PIXI.Graphics().beginFill(0x000099).drawRect(-5000, -5000, 10000, 10000);

        this.currentGridOffset = { x: 0, y: 0 }
        setTimeout(() => {
            this.addChild(this.newContainer)

            this.sectionsContainer.addChild(this.sectionsView)
            this.newContainer.addChild(this.sectionsContainer)

            this.tiersContainer.addChild(this.tiersView)
            this.newContainer.addChild(this.tiersContainer)

            this.levelsContainer.addChild(this.levelsView)
            this.newContainer.addChild(this.levelsContainer)

            this.resize({ width: window.innerWidth, height: window.innerHeight }, true)

            if (window.isMobile) {

                this.unscaledLineButtonSize = { width: (window.innerWidth - this.currentGridOffset.x * 2) * 0.9 / 2, height: 80 }
                this.unscaledLineButtonSize.width = Math.min(config.width, this.unscaledLineButtonSize.width)
                this.unscaledLineButtonSize.width = Math.max((window.innerWidth) * 0.9 / 2, this.unscaledLineButtonSize.width);
                this.unscaledLineButtonSize.width -= this.currentGridOffset.x /2;

                this.unscaledCardSize = { width:(window.innerWidth - this.currentGridOffset.x * 2) * 0.9 / 3, height: 80 }

                
                
                
            } else {
                this.unscaledLineButtonSize = { width: (window.innerWidth - this.currentGridOffset.x * 2) * 0.9 / 2, height: 120 }
                this.unscaledLineButtonSize.width = Math.min(config.width, this.unscaledLineButtonSize.width)
                this.unscaledLineButtonSize.width = Math.max(200, this.unscaledLineButtonSize.width);
                this.unscaledLineButtonSize.width -= this.currentGridOffset.x/2;
                
                this.unscaledCardSize = { width:(window.innerWidth - this.currentGridOffset.x * 2) * 0.9 / 3, height: 120 }
                
            }
            this.unscaledLinePlanetSize = { width: this.unscaledLineButtonSize.width, height:this.unscaledLineButtonSize.width }

            this.buildSections();
            this.refreshNavButtons();


            this.dragPanel = new PIXI.Graphics().beginFill(0x000099).drawRect(-5000, -5000, 10000, 10000);

            this.addChild(this.dragPanel)
            this.dragPanel.interactive = true;
            this.dragPanel.visible = false;
            this.dragPanel.alpha = 0;


            this.addChild(this.tempBlockPanel)
            this.tempBlockPanel.interactive = true;
            this.tempBlockPanel.visible = true;
            this.tempBlockPanel.alpha = 0;



            window.COOKIE_MANAGER.onAddNewLevel.add(() => { this.refreshAll() });
            window.COOKIE_MANAGER.onToggleDebug.add(() => { this.refreshAll() });


            this.addChild(this.verticalBar)
            this.addChild(this.backButton)


        }, 100);

        this.sectionsContainer.x = 0;
        this.tiersContainer.x = config.width;
        this.levelsContainer.x = config.width * 2;

        this.currentUISection = 0;

        this.panelOrder = [this.sectionsContainer, this.tiersContainer, this.levelsContainer];

        this.panelOrder.forEach(element => {
            element.spring = new Spring();
            element.spring.springiness = 0.085;
            element.spring.damp = 0.7;
        });

        this.currentResolution = { width: config.width, height: config.height };

        // let center = new PIXI.Graphics().beginFill(0xFF00FF).drawCircle(0, 0, 20)
        // this.sectionsView.addChild(center)


        this.interactive = true;
        this.on('mousemove', this.onTouchMove.bind(this)).on('touchmove', this.onTouchMove.bind(this));
        this.on('mousedown', this.onTouchStart.bind(this)).on('touchstart', this.onTouchStart.bind(this));
        this
            .on('mouseup', this.onTouchEnd.bind(this))
            .on('touchend', this.onTouchEnd.bind(this))
            .on('mouseupoutside', this.onTouchEnd.bind(this))
            .on('touchendoutside', this.onTouchEnd.bind(this));

        this.isHolding = false;
        this.disableClickCounter = 0;
        this.originTouch = { x: -9999, y: -9999 }
        this.currentTouch = { x: -9999, y: -9999 }
        this.endTouch = { x: -9999, y: -9999 }
        this.dragSpeed = { x: 0, y: 0 }

        this.draggables = [this.sectionsView, this.tiersView, this.levelsView]
        this.draggables.forEach(element => {
            element.dragPosition = { x: element.x, y: element.y }
            element.spring = new Spring();

        });

        this.resetDrags();
        // this.center1 = new PIXI.Graphics().beginFill(0xFF00FF).drawCircle(0, 0, 20)
        // this.levelsContainer.addChild(this.center1)

        // this.center2 = new PIXI.Graphics().beginFill(0xF00FFF).drawCircle(0, 0, 20)
        // this.levelsContainer.addChild(this.center2)

        this.backButton = new UIButton1(config.colors.background, window.iconsData.back, config.colors.white);
        this.backButton.onClick.add(() => {
            this.state = 1;
            this.onBack();
        })
        //this.addChild(this.backButton)

        this.verticalBar = new VerticalNavBar();

        window.COOKIE_MANAGER.onChangeColors.add(() => {
            this.updateColorScheme();
        })

        this.updateColorScheme();

    }
    setRedirectData(redirectData) {
        this.disableClickCounter = 0;
        if (redirectData.tier) {
            this.openLevelTier(redirectData.tier.data)
        } else if (redirectData.section) {
            this.openSection(redirectData.section)
        }
    }
    updateColorScheme() {
        let colorScheme = colorSchemes.getCurrentColorScheme().buttonData;
        this.backButton.setColor(colorScheme.buttonStandardDarkColor)
        this.backButton.setIconColor(colorScheme.fontColor)
    }
    refreshAll() {
        this.refreshNavButtons();
        this.sectionButtons.forEach(element => {
            if (element.data) {
                this.refreshTier(element, element.data);
            }
        });
        this.levelCards.forEach(element => {
            if (element.data) {
                this.refreshCard(element, element.data);
            }
        });
        this.levelSplitCards.forEach(element => {
            if (element.data) {
                this.refreshSplitCard(element, element.data);
            }
        });
    }
    refreshNavButtons() {
        let debugThumb = window.COOKIE_MANAGER.debug.showAllThumbs;
        for (let index = 0; index < this.navButtons.length; index++) {
            let navButton = this.navButtons[index];

            let countLevels = 0;
            let finishedLevels = 0;
            let estimatedTime = 0;
            let estimatedTimeHard = 0;
            for (let index = 0; index < navButton.section.levels.length; index++) {
                const element = navButton.section.levels[index];
                //console.log(element)
                countLevels += element.data.length;

                element.data.forEach(level => {

                    if (window.COOKIE_MANAGER.findLevel(level.idSaveData)) {
                        finishedLevels++
                    }

                    estimatedTime += level.estimateTime;
                    estimatedTimeHard += level.estimateTimeHard;
                });


            }
            navButton.updateLabel(finishedLevels + "/" + countLevels, { x: 0, y: -4 })
            navButton.setProgressBar(finishedLevels / countLevels);
            // console.log('SECTION',colorSchemes.colorSchemes[navButton.section.colorPalletId].list[3].color)
            if (finishedLevels >= countLevels) {


                navButton.setCompleteState()
                //navButton.setColor(config.colors.blue2)
                //navButton.setColor(colorSchemes.colorSchemes[navButton.section.colorPalletId].list[3].color)
                navButton.updateLabel('COMPLETED');
                navButton.hideProgressBar();
            } else {
                navButton.setStandardState();
            }
            if (debugThumb) {
                navButton.updateLabelTop(navButton.section.name + ' ~' + utils.convertNumToTime(Math.ceil(estimatedTime)))// + '    ' + '~' + utils.convertNumToTime(Math.ceil(estimatedTimeHard)));
            } else {
                navButton.updateLabelTop(navButton.section.name);
            }

            navButton.setSectionButtonMode();
        }

    }
    getRect(size = 4, color = 0xFFFFFF) {
        return new PIXI.Graphics().beginFill(color).drawRect(0, 0, size, size);
    }
    drawColorPallet(id) {
        let colors = colorSchemes.colorSchemes[id]
        let size = 10;
        let container = new PIXI.Container();
        for (let index = 0; index < 8; index++) {
            let tempRect = this.getRect(size, colors.list[index].color)
            container.addChild(tempRect);
            tempRect.x = size * index;
        }
        return container
    }

    resetDrags() {
        this.draggables.forEach(element => {
            element.y = 0;
            element.dragPosition = { x: element.x, y: element.y }
            element.spring.reset();
            element.spring.x = element.y;
        });
        //this.dragSpeed = { x: 0, y: 0 }
    }
    updateDrag(element) {
        //console.log(this.newContainer.getGlobalPosition())
        let cElementH = element.height//- this.newContainer.y;
        let cCanvasH = this.mainCanvas.height - this.y//this.newContainer.getGlobalPosition().y//+ this.newContainer.y;
        if (cElementH > cCanvasH) {
            element.spring.tx = element.dragPosition.y + this.dragSpeed.y;
            element.spring.tx = Math.min(element.spring.tx, 0);
            element.spring.tx = Math.max(element.spring.tx, cCanvasH - cElementH - this.unscaledCardSize.height * 0.5);
        } else {
            element.tx = 0;
        }

        element.spring.update();

        element.y = element.spring.x

        if (!this.isHolding) {

        }
    }
    onTouchStart(evt) {
        this.originTouch.x = evt.data.global.x;
        this.originTouch.y = evt.data.global.y;
        this.isHolding = true;

        this.dragSpeed = { x: 0, y: 0 }
        this.draggables.forEach(element => {
            element.dragPosition = { x: element.x, y: element.y }
        });

    }
    onTouchEnd(evt) {
        //console.log(evt)
        this.endTouch.x = evt.data.global.x;
        this.endTouch.y = evt.data.global.y;

        //this.levelsView.dragPosition = { x: this.levelsView.x, y: this.levelsView.y }
        //this.dragSpeed = { x: 0, y: 0 }

        this.isHolding = false;
        if (this.dragPanel) {
            this.dragPanel.visible = false;
        }
    }
    onTouchMove(evt) {
        if (!this.isHolding) {
            return;
        }

        this.currentTouch.x = evt.data.global.x;
        this.currentTouch.y = evt.data.global.y;



        if (utils.distance(this.originTouch.x, this.originTouch.y, this.currentTouch.x, this.currentTouch.y) > 20) {
            this.disableClickCounter = 5;

            this.dragSpeed.x = this.originTouch.x - this.currentTouch.x;
            this.dragSpeed.y = this.currentTouch.y - this.originTouch.y;

            if (this.dragPanel) {
                this.dragPanel.visible = true;
            }
        } else {
            this.dragSpeed = { x: 0, y: 0 }

            if (this.dragPanel) {
                this.dragPanel.visible = false;
            }
        }
    }
    onBack() {
        if (this.disableClickCounter > 0) {
            return;
        }


        this.gameScreen.mainMenuSettings.collapse();
        if (this.currentUISection > 0) {
            this.currentUISection--
            window.SOUND_MANAGER.play('shoosh', { volume: 0.1 })
            if (this.currentUISection <= 0) {
                this.verticalBar.setSectionLabel("")
                this.refreshNavButtons()
            } else {
                this.verticalBar.setSectionLabel(this.currentSection.name)
            }
            this.sectionButtons.forEach(element => {
                if (element.data) {
                    this.refreshTier(element, element.data);
                }
            });
        } else {
            //ouch
            this.hide();
            this.gameScreen.startScreenContainer.startState(0);
            this.currentUISection = 0;
            this.refreshNavButtons();
            this.resetDrags();
        }
    }
    buildSections() {

        // let backButton = this.buildBackButton();
        // this.sectionsView.addChild(backButton);
        // this.navButtons.push(backButton);


        this.gameScreen.mainMenuSettings.collapse();


        for (let index = 0; index < this.sections.length; index++) {
            let section = this.sections[index];
            if (!section.ignore) {

                let navButton = this.buildSectionButton(section);
                this.sectionsView.addChild(navButton)
                navButton.section = section;
                navButton.y = index * navButton.height

                navButton.ignore = section.ignore;

                navButton.interactive = true;
                navButton.buttonMode = true;
                this.navButtons.push(navButton);

                navButton.setPallet(this.drawColorPallet(section.colorPalletId), colorSchemes.colorSchemes[section.colorPalletId]);
                //navButton.setColor(window.colorsOrder[this.navButtons.length % window.colorsOrder.length])
                navButton.on('mouseup', this.openSection.bind(this, section)).on('touchend', this.openSection.bind(this, section));
            }
        }
    }



    buildBackButton() {
        let secButton = new SquareButton(this.unscaledCardSize)
        secButton.updateIcon(PIXI.Sprite.fromImage(window.iconsData.back), 0.4, { x: 0, y: 0 }, true);
        secButton.buttonMode = true;
        secButton.interactive = true;
        this.gameScreen.resizeToFitAR(this.unscaledCardSize, secButton)
        secButton.on('mouseup', this.onBack.bind(this)).on('touchend', this.onBack.bind(this));

        return secButton
    }

    buildSectionButton(section) {
        let secButton = new SquareButton(this.unscaledLinePlanetSize, true);
        secButton.updateLabelTop(section.name);
        if (section.imageSrc)
            secButton.updateIcon(PIXI.Sprite.fromImage('./assets/' + section.imageSrc));

        this.gameScreen.resizeToFitAR(this.unscaledLinePlanetSize, secButton)

        //secButton.setLargeButtonMode();

        return secButton
    }
    buildLevelTierButton(level, index) {

        let coverID = level.coverID;

        if (coverID == NaN) {
            coverID = 0;
        }
        coverID = Math.min(coverID, level.data.length - 1)

        let dataFirstLevel = level.data[coverID];

        let levelTierButton = new SquareButton(this.unscaledLineButtonSize);

        levelTierButton.tierData = level

        levelTierButton.updateLabelTop(level.name);

        let icon = dataFirstLevel.splitData ?
            this.gameScreen.generateImage(dataFirstLevel, 24, 0, dataFirstLevel.colorPalletId, false) :
            this.gameScreen.generateImage(dataFirstLevel, 24, 0, dataFirstLevel.colorPalletId)
        levelTierButton.updateIcon(icon, 0.35, { x: 0, y: -10 });
        this.gameScreen.resizeToFitAR(this.unscaledLineButtonSize, levelTierButton)

        levelTierButton.tierData = level;

        this.refreshTier(levelTierButton, level.data)
        //levelTierButton.setProgressBar();
        //levelTierButton.setLargeButtonMode();

        return levelTierButton
    }
    openSection(section) {
        if (this.disableClickCounter > 0) {
            return;
        }
        this.show();
        //console.log(section, " 000000")
        let targetPallet = section.colorPalletId
        if (section.customPallet && section.customPallet > 0) {
            targetPallet = section.customPallet;
        }
        window.COOKIE_MANAGER.updateColorPallete(targetPallet);
        this.gameScreen.startScreenContainer.updateLinesColor();
        window.SOUND_MANAGER.play('shoosh', { volume: 0.1 })
        this.gameScreen.mainMenuSettings.collapse();
        this.currentUISection = 1

        this.verticalBar.setSectionLabel(section.name)

        if (this.currentSection == section) {

            this.sectionButtons.forEach(element => {
                if (element.data) {
                    this.refreshTier(element, element.data);
                }
            });
            return;
        }
        this.resetDrags()
        //console.log("section", section)


        this.currentSection = section;
        this.sectionButtons.forEach(element => {
            if (element.parent) {
                element.parent.removeChild(element);
            }
        });

        this.sectionButtons = [];


        // let backButton = this.buildBackButton();
        // this.tiersView.addChild(backButton);
        // this.sectionButtons.push(backButton);




        for (let index = 0; index < section.levels.length; index++) {
            const level = section.levels[index];

            let levelTierButton = this.buildLevelTierButton(level, index);
            this.tiersView.addChild(levelTierButton);
            levelTierButton.y = index * levelTierButton.height// + titleSection.height;

            levelTierButton.data = level.data;
            levelTierButton.interactive = true;
            levelTierButton.buttonMode = true;
            levelTierButton.on('mouseup', this.openLevelTier.bind(this, level.data)).on('touchend', this.openLevelTier.bind(this, level.data));
            this.sectionButtons.push(levelTierButton);

            //this.refreshTier(levelTierButton, levelTierButton.data);
        }
        this.resize(null, true);


        this.sectionButtons.forEach(element => {
            if (element.data) {
                this.refreshTier(element, element.data);
            }
        });
    }

    openLevelTier(tier) {
        console.log("openLevelTier", tier[0].tier)
        if (this.disableClickCounter > 0) {
            return;
        }


        let targetPallet = tier[0].tier.customPallet

        console.log(targetPallet)
        
        if (targetPallet != undefined) {
            if(isNaN(targetPallet)){
                targetPallet = colorSchemes.findPallet(targetPallet)
                console.log(targetPallet)
            }

            if(targetPallet >= 0){
                window.COOKIE_MANAGER.updateColorPallete(targetPallet);
            }
        }

        if (targetPallet != undefined && targetPallet < 0){
            if(this.currentSection){
                window.COOKIE_MANAGER.updateColorPallete(this.currentSection.colorPalletId);
            }
        }

        this.show();

        window.SOUND_MANAGER.play('shoosh', { volume: 0.1 })
        this.gameScreen.mainMenuSettings.collapse();
        this.currentUISection = 2

        this.verticalBar.setSectionLabel(this.currentSection.name + " - " + tier[0].tierName)



        if (this.currentTier == tier) {

            this.levelCards.forEach(element => {
                if (element.data) {
                    this.refreshCard(element, element.data);
                }
            });
            return;
        }
        this.currentTier = tier;
        this.resetDrags()


        this.levelCards.forEach(element => {
            if (element.parent) {
                if (element.parent) {
                    element.parent.removeChild(element);
                }
            }
        });

        this.levelSplitCards.forEach(element => {
            if (element.parent) {
                if (element.parent) {
                    element.parent.removeChild(element);
                }
            }
        });

        this.levelCards = [];
        this.levelSplitCards = []
        // let backButton = this.buildBackButton();
        // this.levelsView.addChild(backButton);
        // this.levelCards.push(backButton);


        if (tier[0].tier.splitData) {
            //console.log("ADD SPLIT STUFF")
            this.addSplitCard(tier[0].tier);
        } else {

            tier.forEach(element => {
                this.addCard(element);
            });
        }

        //console.log("tier", tier)


    }

    update(delta) {

        for (let index = 0; index < this.panelOrder.length; index++) {
            const element = this.panelOrder[index];
            //element.spring.tx = 1;
            element.spring.tx = index * this.mainCanvas.width - this.currentUISection * this.mainCanvas.width;
            element.spring.update();
            //element.x = index * config.width - this.currentUISection* config.width;
            element.x = element.spring.x//utils.lerp(element.x, index * this.mainCanvas.width - this.currentUISection * this.mainCanvas.width, 0.5)
        }

        this.centerLevels();

        this.tempBlockPanel.visible = this.showingBlockTime > 0;

        if (this.showingBlockTime > 0) {
            this.showingBlockTime -= delta;
        }

        if (!this.isHolding && this.disableClickCounter > 0) {
            this.disableClickCounter--;
        }
    }
    refreshTier(levelTierButton, data) {
        let count = 0;
        let totalTime = 0;
        let totalEstimatedTime = 0;
        let totalEstimatedTimeHard = 0;
        data.forEach(element => {

            let levelFound = window.COOKIE_MANAGER.findLevel(element.idSaveData)
            if (levelFound) {
                totalTime += levelFound.bestTime;
                count++
            }

            totalEstimatedTime += element.estimateTime;
            totalEstimatedTimeHard += element.estimateTimeHard;
        });

        //let dataFirstLevel = data[Math.floor(Math.random() * data.length)];
        //console.log(data)

        let coverID = levelTierButton.tierData.coverID;
        coverID = Math.min(coverID, levelTierButton.tierData.data.length - 1)
        if (coverID == NaN) {
            coverID = 0;
        }

        let dataFirstLevel = data[coverID];

        levelTierButton.updateIcon(this.gameScreen.generateImage(dataFirstLevel, 24, 0, dataFirstLevel.colorPalletId), 0.35, { x: 0, y: -10 });

        if (count >= data.length) {

            levelTierButton.setCompleteState()
            //levelTierButton.setColor(config.colors.purple)
            levelTierButton.updateLabel('COMPLETED');
            levelTierButton.hideProgressBar();
        } else {

            // finishedLevels + "/" + countLevels
            levelTierButton.setProgressBar(count / data.length);
            levelTierButton.updateLabel(count + "/" + data.length, { x: 0, y: -25 });

            levelTierButton.setStandardState()
        }

        let debugThumb = window.COOKIE_MANAGER.debug.showAllThumbs;
        if (debugThumb) {
            levelTierButton.updateLabelTop(data[0].tierName + ' ~' + utils.convertNumToTime(Math.ceil(totalEstimatedTime)))// + '    ' + '~' + utils.convertNumToTime(Math.ceil(totalEstimatedTimeHard)));
        }

        levelTierButton.setLargeButtonMode();
    }
    refreshSplitCard(levelButton, data) {
        let debugThumb = window.COOKIE_MANAGER.debug.showAllThumbs;
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let levelStored = window.COOKIE_MANAGER.findLevel(element.idSaveData);

            if (levelStored || debugThumb) {
                levelButton.refreshCard(this.gameScreen.generateImage(element, 6, 0, element.colorPalletId, false), index);
            } else {
                //levelButton.updateLabelTop("~" + data.estimateTime2)
                levelButton.refreshCard(this.gameScreen.generateImage(window.questionMark), index, true);
            }
        }
    }
    refreshCard(levelButton, data) {
        let levelStored = window.COOKIE_MANAGER.findLevel(data.idSaveData);
        let debugThumb = window.COOKIE_MANAGER.debug.showAllThumbs;
        if (levelStored || debugThumb) {
            levelButton.updateIcon(this.gameScreen.generateImage(data, 24, 0, data.colorPalletId));
            if (!debugThumb) {
                levelButton.updateLabelTop(utils.convertNumToTime(Math.ceil(levelStored.bestTime)))//,
                //new PIXI.Sprite.fromImage(window.iconsData.time))
            } else {
                levelButton.updateLabelTop("~" + data.estimateTime2)// + '    ' + '~' + utils.convertNumToTime(Math.ceil(data.estimateTimeHard)))//,
                //new PIXI.Sprite.fromImage(window.iconsData.time));
            }

            levelButton.setCompleteStateLevel()
            //levelButton.setColor(colorSchemes.colorSchemes[data.colorPalletId].list[4].color)
        } else {
            levelButton.updateLabelTop("~" + data.estimateTime2)//,
            //new PIXI.Sprite.fromImage(window.iconsData.time));
            levelButton.updateIcon(this.gameScreen.generateImage(window.questionMark));
            levelButton.updateIcon(this.gameScreen.generateImage(window.questionMark));
            levelButton.setStandardState()
        }
    }
    addSplitCard(tier) {

        let unscaledSplitSize = {
            width: (this.unscaledCardSize.width) * tier.splitData.j,
            height: this.unscaledCardSize.height * tier.splitData.i,
        }

        console.log(tier)
        let levelSplitButton = new LargeImageButton(unscaledSplitSize);
        levelSplitButton.customSize = unscaledSplitSize;
        levelSplitButton.updateLabelTop(tier.name, null, tier.splitData);
        for (let index = 0; index < tier.data.length; index++) {
            const element = tier.data[index];

            let levelStored = window.COOKIE_MANAGER.findLevel(tier.data[index].idSaveData);

            let icon = levelStored ?
                this.gameScreen.generateImage(element, 6, 0, element.colorPalletId, false) :
                this.gameScreen.generateImage(window.questionMark)

            levelSplitButton.addSplitLevel(element, icon)
            //levelSplitButton.addSplitLevel(element, icon)

            levelSplitButton.data = tier.data
        }
        //
        this.refreshSplitCard(levelSplitButton, tier.data);

        this.gameScreen.resizeToFitAR(unscaledSplitSize, levelSplitButton)

        if (!this.levelsView.children.includes(levelSplitButton)) {
            this.levelsView.addChild(levelSplitButton)
        }

        levelSplitButton.onLevelSelect.add(this.selectLevel.bind(this))
        this.levelSplitCards.push(levelSplitButton)

        setTimeout(() => {
            this.refreshSplitCard(levelSplitButton, tier.data);
        }, 60);
    }
    addCard(data) {

        //console.log(data);

        let levelButton = new SquareButton(this.unscaledCardSize);
        levelButton.updateLabel(data.levelName);
        //
        this.refreshCard(levelButton, data);

        this.gameScreen.resizeToFitAR(this.unscaledCardSize, levelButton)
        levelButton.data = data;

        levelButton.on('mouseup', this.selectLevel.bind(this, data)).on('touchend', this.selectLevel.bind(this, data));
        levelButton.interactive = true;
        levelButton.buttonMode = true;

        if (!this.levelsView.children.includes(levelButton)) {
            this.levelsView.addChild(levelButton)
        }

        this.levelCards.push(levelButton)
    }
    getGridGraphic() {
        return new PIXI.Graphics().beginFill(section.color).drawRect(0, 0, 100, 130);
    }
    show() {
        this.disableClickCounter = 10;
        this.shouldUpdate = true;
        this.backButton.visible = true;
        this.verticalBar.visible = true;
    }
    hide() {
        this.shouldUpdate = false;
        this.backButton.visible = false;
        this.verticalBar.visible = false;
    }
    selectLevel(data) {
        console.log(data)
        if (this.disableClickCounter > 0) {
            return;
        }
        this.gameScreen.mainMenuSettings.collapse();
        this.gameScreen.startNewLevel(data, false);

        this.hide();
        //this.currentUISection = 0;
        this.resetDrags()
        this.resize(null, true)
    }
    drawGrid(elements, margin, size, isVertical, lineOverride = 1) {
        let maxPerLine = Math.floor((this.mainCanvas.width - this.currentGridOffset.x) / (size.width + margin * 2.5)) + 1
        if (isVertical) {
            maxPerLine = lineOverride;
        }

        let fullWidth = (this.mainCanvas.width - this.currentGridOffset.x) - margin * 2
        let distance = fullWidth / maxPerLine
        let line = -1
        let col = 0

        let lines = []

        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];

            if (index % maxPerLine == 0) {
                line++
            }
            let chunck = distance
            let adj = -(chunck * maxPerLine) / 2//0//(margin - fullWidth) * 0.5
            element.x = (index % maxPerLine) * chunck + adj + chunck / 2 - element.width / 2 + this.currentGridOffset.x
            if (index >= maxPerLine) {
                element.y = 20 + lines[index - maxPerLine]
            } else {

                element.y = 50
            }
            lines.push(element.y + size.height)

        }

    }

    drawPlanets(elements, margin, size, isVertical, lineOverride = 1) {
        let maxPerLine = Math.floor((this.mainCanvas.width - this.currentGridOffset.x) / (size.width + margin * 2.5)) + 1
        if (isVertical) {
            maxPerLine = lineOverride;
        }

        let fullWidth = (this.mainCanvas.width - this.currentGridOffset.x) - margin * 2
        let distance = fullWidth / maxPerLine
        let line = -1
        let col = 0

        let lines = []

        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];

            if (index % maxPerLine == 0) {
                line++
            }
            let chunck = distance
            let adj = -(chunck * maxPerLine) / 2//0//(margin - fullWidth) * 0.5
            element.x = (index % maxPerLine) * chunck + adj + chunck / 2 - element.width / 2 + this.currentGridOffset.x
            element.y = 50 + index * size.height
            
            lines.push(element.y + size.height)

        }

    }

    resize(innerResolution, force) {
        if (!force && (this.currentResolution.width == innerResolution.width && this.currentResolution.height == innerResolution.height)) {
            //return;
        }

        // if (this.currentResolution.width != innerResolution.width || this.currentResolution.height != innerResolution.height) {
        //     //return;
        // }

        if (innerResolution) {
            this.currentResolution = innerResolution
        }

        let globalPos = this.toLocal({ x: 0, y: this.y })
        this.mainCanvas.position = globalPos
        this.mainCanvas.width = this.currentResolution.width
        this.mainCanvas.height = this.currentResolution.height

        this.centerLevels();

        this.newContainer.y = this.mainCanvas.y - 20;

        if (this.backButton) {
            let targetScale = Math.min(1, this.gameScreen.inGameMenu.scale.x * 2);
            this.backButton.scale.set(targetScale);
            this.backButton.x = this.backButton.width / 2 + this.backButton.height * 0.1/// this.backButton.scale.x;
            this.backButton.y = this.mainCanvas.height - this.y - this.backButton.height / 2 - this.backButton.height * 0.1//- this.backButton.height / this.backButton.scale.y;

            this.currentGridOffset = { x: this.backButton.x, y: 0 }

            this.verticalBar.scale.set(targetScale);
            this.verticalBar.x = this.backButton.x
            this.verticalBar.y = this.backButton.y - 2// + this.backButton.height / 2
        }

    }
    centerLevels() {
        //this.currentGridOffset.x = 0

        if (this.shouldUpdate) {

            this.drawPlanets(this.navButtons, 20, this.unscaledLineButtonSize, true, 2);
            this.drawGrid(this.sectionButtons, 20, this.unscaledLineButtonSize, true, 2);
            this.drawGrid(this.levelCards, 20, this.unscaledCardSize, false);
            if (this.levelSplitCards.length > 0) {

                this.drawGrid(this.levelSplitCards, 20, this.levelSplitCards[0].customSize, true);
            }

            this.updateDrag(this.draggables[this.currentUISection])
        }
        // if(this.currentUISection == 2){
        //     this.updateDrag(this.levelsView);

        // }

        this.levelsView.pivot.x = this.mainCanvas.width / 2
        this.levelsView.x = this.mainCanvas.x + this.mainCanvas.width

        this.sectionsView.pivot.x = this.mainCanvas.width / 2
        this.sectionsView.x = this.mainCanvas.x + this.mainCanvas.width// - this.unscaledButtonSize.width / 2

        this.tiersView.pivot.x = this.mainCanvas.width / 2
        this.tiersView.x = this.mainCanvas.x + this.mainCanvas.width//- this.unscaledButtonSize.width / 2
        //this.tiersView.y = this.mainCanvas.y //- this.mainCanvas.height * 0.5;

    }
}
