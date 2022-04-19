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
import TierWorldButton from './TierWorldButton';
import TierMap from './TierMap';


export default class LevelSelectContainer extends PIXI.Container {
    constructor(screen) {
        super();
        this.currentTier = 0;
        this.gameScreen = screen;

        this.planetButtons = [];

        this.isSinglePlanet = null;


        this.levelBackShape = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, config.width, config.height * 0.8);
        this.addChild(this.levelBackShape)
        this.levelBackShape.alpha = 0

        this.sections = window.levelSections.sections

        this.unscaledCardSize = { width: window.innerWidth / 5, height: window.innerWidth / 5 }
        this.unscaledplanetButtonSize = { width: window.innerWidth / 5, height: window.innerWidth / 5 }

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
        this.tierButtons = [];
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
            //this.resize({ width: config.width, height: config.height }, true)

            if (window.isMobile) {

                this.unscaledplanetButtonSize = { width: (window.innerWidth - this.currentGridOffset.x * 2) * 0.9 / 2, height: 80 }
                this.unscaledplanetButtonSize.width = Math.min(config.width, this.unscaledplanetButtonSize.width)
                this.unscaledplanetButtonSize.width = Math.max((window.innerWidth) * 0.9 / 2, this.unscaledplanetButtonSize.width);
                this.unscaledplanetButtonSize.width -= this.currentGridOffset.x / 2;

                this.unscaledCardSize = { width: (window.innerWidth - this.currentGridOffset.x * 2) * 0.9 / 3, height: 80 }

                let planetTarget = Math.min((window.innerWidth) * 0.3, this.unscaledplanetButtonSize.width)

                this.unscaledLinePlanetSize = { width: planetTarget, height: planetTarget }

                this.unscaledTierButtonSize = { width: 64, height: 64 }//{ width: 48, height: 48 }
                this.newUnscaledLevelButtonSize = { width: 64, height: 64 }


            } else {

                this.unscaledplanetButtonSize = { width: (config.width - this.currentGridOffset.x * 2) * 0.9 / 2, height: 120 }
                this.unscaledplanetButtonSize.width = Math.min(config.width / 2, this.unscaledplanetButtonSize.width)
                this.unscaledplanetButtonSize.width = Math.max(200, this.unscaledplanetButtonSize.width);
                this.unscaledplanetButtonSize.width -= this.currentGridOffset.x / 2;

                this.unscaledCardSize = { width: (config.width - this.currentGridOffset.x * 2) * 0.9 / 3, height: 120 }

                this.unscaledLinePlanetSize = { width: this.unscaledplanetButtonSize.width, height: this.unscaledplanetButtonSize.width }
                this.unscaledTierButtonSize = { width: 64, height: 64 }
                this.newUnscaledLevelButtonSize = { width: 64, height: 64 }
            }


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
            window.COOKIE_MANAGER.onToggleNames.add(() => { this.refreshAll() });


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

            element.springX = new Spring();
            element.springX.springiness = 0.085;
            element.springX.damp = 0.7;
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


        this.tierMap = new TierMap()
        this.levelMap = new TierMap()

        this.tiersView.isHorizontal = true;
        this.tiersView.map = this.tierMap;
        this.levelsView.map = this.levelMap;
        this.draggables = [this.sectionsView, this.tiersView, this.levelsView]
        this.draggables.forEach(element => {
            element.dragPosition = { x: element.x, y: element.y }
            element.spring = new Spring();
            element.springX = new Spring();

            element.spring.springiness = 0.2;
            element.spring.damp = 0.6;
            element.spring.max = 30000;

            element.springX.springiness = 0.2;
            element.springX.damp = 0.6;
            element.springX.max = 30000;
        });


        this.backButton = new UIButton1(config.colors.background, window.iconsData.back, config.colors.white);
        this.backButton.onClick.add(() => {
            this.state = 1;
            this.onBack();
        })

        this.verticalBar = new VerticalNavBar();

        window.COOKIE_MANAGER.onChangeColors.add(() => {
            this.updateColorScheme();
        })

        this.updateColorScheme();



        this.tiersView.addChild(this.tierMap)
        this.levelsView.addChild(this.levelMap)
        let center = new PIXI.Graphics().beginFill(0xFF00FF).drawCircle(0, 0, 20)
        //this.tiersView.addChild(center)

        center.y = 50
        this.resetDrags();
    }
    setRedirectData(redirectData) {
        this.disableClickCounter = 0;
        if (redirectData.tier) {
            this.openLevelTier(redirectData.tier.data)
        } else if (redirectData.section) {
            setTimeout(() => {

                this.openSection(redirectData.section)
            }, 30);
        }
    }
    updateColorScheme() {
        let colorScheme = colorSchemes.getCurrentColorScheme().buttonData;
        this.backButton.setColor(colorScheme.buttonStandardDarkColor)
        this.backButton.setIconColor(colorScheme.fontColor)
    }
    refreshAll() {
        this.refreshNavButtons();
        let orderTier = 0
        this.tierButtons.forEach(element => {
            if (element.data) {
                this.refreshTier(element, element.data, orderTier);
                orderTier++;
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
        for (let index = 0; index < this.planetButtons.length; index++) {
            let navButton = this.planetButtons[index];

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
                navButton.updateLabel("COMPLETED")//completeMode();
                navButton.hideProgressBar();
            } else {
                navButton.setStandardState();
            }
            if (debugThumb) {
                navButton.updateLabelTop(navButton.section.name + ' ~' + utils.convertNumToTime(Math.ceil(estimatedTime)))// + '    ' + '~' + utils.convertNumToTime(Math.ceil(estimatedTimeHard)));
            } else {
                navButton.updateLabelTop(navButton.section.name);
            }

            navButton.setSectionButtonMode(index);
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
            //element.x = 0;
            element.dragPosition = { x: element.x, y: element.y }
            element.spring.reset();
            element.spring.x = element.y;

            element.springX.reset();
            element.springX.x = element.x;

            if (element.isHorizontal) {

                let target = element.targetX// + this.mainCanvas.width
                element.springX.tx = target
                element.springX.x = target

                element.x = target;
            }

        });

        // if(this.levelMap)console.log(this.levelMap.scale)
        if (this.levelMap) {
            let levelYStart = - (this.levelMap.height + 50) + window.innerHeight
            this.levelsView.y = levelYStart
            this.levelsView.spring.x = levelYStart
            this.levelsView.spring.tx = levelYStart
        }

        if (this.tierMap && this.tierMap.width > 80) {
            let levelYStart = window.innerHeight / 2 - this.tierMap.height / 2
            levelYStart = Math.max(window.innerHeight * 0.05, levelYStart)
            this.tiersView.y = levelYStart
            this.tiersView.spring.x = levelYStart
            this.tiersView.spring.tx = levelYStart
        }

        //this.dragSpeed = { x: 0, y: 0 }
    }
    updateMapDrag(element) {
        if (this.dragSpeed.y != 0) {
            element.spring.tx = element.dragPosition.y + this.dragSpeed.y;
        } else {
        }

        if (this.dragSpeed.x != 0) {
            element.springX.tx = element.dragPosition.x + this.dragSpeed.x;
        } else {
        }
        if (!this.isHolding && element.map.width > 100) {

            if (element.isHorizontal) {
                if (element.springX.tx + element.map.boundPoints.maxx * element.map.scale.x < 0) {
                    element.springX.tx = -element.map.boundPoints.maxx * element.map.scale.x
                }

                if (element.springX.tx + element.map.boundPoints.minx * element.map.scale.x > this.mainCanvas.width) {
                    element.springX.tx = this.mainCanvas.width + -element.map.boundPoints.minx * element.map.scale.x
                }
            }

            if (element.spring.tx + element.map.boundPoints.maxy * element.map.scale.x < 0) {
                element.spring.tx = -element.map.boundPoints.maxy * element.map.scale.x
            }

            if (element.spring.tx + element.map.boundPoints.miny * element.map.scale.x > this.mainCanvas.height) {
                element.spring.tx = this.mainCanvas.height + -element.map.boundPoints.miny * element.map.scale.x
            }

        } else {

        }

        element.springX.update();
        element.x = element.springX.x


        element.spring.update();
        element.y = element.spring.x

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
            element.spring.tx = 0;
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

            this.dragSpeed.x = this.currentTouch.x - this.originTouch.x;
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

        let firstId = 0;
        if (this.isSinglePlanet) {
            firstId = 1
        }
        if (this.currentUISection > firstId) {
            this.currentUISection--
            window.SOUND_MANAGER.play('shoosh', { volume: 0.2 })
            if (this.currentUISection <= 0) {
                this.verticalBar.setSectionLabel("")
                this.refreshNavButtons()
                this.addStandardBackgroundColor();
            } else {
                this.addWorldBackgroundColor();
                this.verticalBar.setSectionLabel(this.currentSection.name)
            }
            let orderTier = 0
            this.tierButtons.forEach(element => {
                if (element.data) {
                    this.refreshTier(element, element.data, orderTier);
                    orderTier++
                }
            });
        } else {
            //ouch
            this.hide();
            this.gameScreen.startScreenContainer.startState(0);
            this.currentUISection = 0;
            this.refreshNavButtons();
            this.resetDrags();

            this.addStandardBackgroundColor();
        }
    }

    addWorldBackgroundColor() {
        let colorScheme = colorSchemes.getCurrentColorScheme()
        this.gameScreen.background.updateMainBackgroundColor(colorScheme.worldBackground)
    }
    addStandardBackgroundColor() {
        let colorScheme = colorSchemes.getCurrentColorScheme()
        this.gameScreen.background.updateMainBackgroundColor(colorScheme.background)
    }
    buildSections() {

        // let backButton = this.buildBackButton();
        // this.sectionsView.addChild(backButton);
        // this.planetButtons.push(backButton);


        this.gameScreen.mainMenuSettings.collapse();


        for (let index = 0; index < this.sections.length; index++) {
            let section = this.sections[index];
            if (!section.ignore) {

                let sectionButton = this.buildSectionButton(section);
                this.sectionsView.addChild(sectionButton)
                sectionButton.section = section;
                sectionButton.y = index * sectionButton.height

                sectionButton.ignore = section.ignore;

                sectionButton.interactive = true;
                sectionButton.buttonMode = true;
                this.planetButtons.push(sectionButton);

                sectionButton.setPallet(this.drawColorPallet(section.colorPalletId), colorSchemes.colorSchemes[section.colorPalletId]);
                //sectionButton.setColor(window.colorsOrder[this.planetButtons.length % window.colorsOrder.length])
                sectionButton.on('mouseup', this.openSection.bind(this, section)).on('touchend', this.openSection.bind(this, section));
            }
        }
        if (this.planetButtons.length <= 1) {

            this.isSinglePlanet = this.planetButtons[0].section;
        }
    }



    buildBackButton() {
        let backButton = new SquareButton(this.unscaledCardSize)
        backButton.updateIcon(PIXI.Sprite.fromImage(window.iconsData.back), 0.4, { x: 0, y: 0 }, true);
        backButton.buttonMode = true;
        backButton.interactive = true;
        this.gameScreen.resizeToFitAR(this.unscaledCardSize, backButton)
        backButton.on('mouseup', this.onBack.bind(this)).on('touchend', this.onBack.bind(this));

        return backButton
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
    addCard(data) {

        //console.log(data);

        let levelButton = new TierWorldButton(this.newUnscaledLevelButtonSize);//= new SquareButton(this.unscaledCardSize);
        levelButton.updateLabel(data.levelName);

        let order = this.currentTier[0].tier.mapData.levelLayers[data.order >= 0 ? level.order : this.levelCards.length]

        //console.log(order)
        this.levelMap.addTierLevel(levelButton, order)
        //
        this.refreshCard(levelButton, data);

        //let resize = { width: this.newUnscaledLevelButtonSize.width, height: this.newUnscaledLevelButtonSize.height * 2 }
        //this.gameScreen.resizeToFitAR(resize, levelButton)
        levelButton.data = data;

        levelButton.on('mouseup', this.selectLevel.bind(this, data)).on('touchend', this.selectLevel.bind(this, data));
        levelButton.interactive = true;
        levelButton.buttonMode = true;



        // if (!this.levelsView.children.includes(levelButton)) {
        //     this.levelsView.addChild(levelButton)
        // }


        this.levelCards.push(levelButton)
    }
    buildLevelTierButton(level, index) {

        let coverID = level.coverID;

        if (coverID == NaN) {
            coverID = 0;
        }
        coverID = Math.min(coverID, level.data.length - 1)

        let dataFirstLevel = level.data[coverID];

        let levelTierButton = new TierWorldButton(this.unscaledTierButtonSize);

        levelTierButton.tierData = level

        levelTierButton.updateLabelTop(level.name);

        let icon = dataFirstLevel.splitData ?
            this.gameScreen.generateImage(dataFirstLevel, 24, 0, dataFirstLevel.colorPalletId, false) :
            this.gameScreen.generateImage(dataFirstLevel, 24, 0, dataFirstLevel.colorPalletId)
        levelTierButton.updateIcon(icon, 0.35, { x: 0, y: -10 });
        this.gameScreen.resizeToFitAR(this.unscaledTierButtonSize, levelTierButton)

        levelTierButton.tierData = level;

        this.refreshTier(levelTierButton, level.data, index)
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
        window.SOUND_MANAGER.play('shoosh', { volume: 0.2 })
        this.gameScreen.mainMenuSettings.collapse();
        this.currentUISection = 1

        this.verticalBar.setSectionLabel(section.name)

        this.addWorldBackgroundColor();

        if (this.currentSection == section) {

            let tierOrder = 0
            this.tierButtons.forEach(element => {
                if (element.data) {
                    this.refreshTier(element, element.data, tierOrder);
                    tierOrder++
                }
            });
            return;
        }
        //console.log("section", section)

        window.colorTweenBomb.startTween(section.colorPalletId)
        this.currentSection = section;
        this.tierButtons.forEach(element => {
            if (element.parent) {
                element.parent.removeChild(element);
            }
        });

        this.tierButtons = [];



        // let backButton = this.buildBackButton();
        // this.tiersView.addChild(backButton);
        // this.tierButtons.push(backButton);


        if (!section.mapData.terrainColors) {
            let colors = colorSchemes.getCurrentColorScheme();
            section.mapData.terrainColors = colors.map.terrainColors;
            section.mapData.pathColors = colors.map.pathColors;
        }
        this.tierMap.drawMap(section.mapData, this.unscaledTierButtonSize)


        for (let index = 0; index < section.levels.length; index++) {
            const level = section.levels[index];


            let levelTierButton = this.buildLevelTierButton(level, index);
            //this.tierMap.addChild(levelTierButton);
            levelTierButton.y = index * levelTierButton.height// + titleSection.height;

            levelTierButton.data = level.data;
            levelTierButton.interactive = true;
            levelTierButton.buttonMode = true;
            levelTierButton.on('mouseup', this.openLevelTier.bind(this, level.data)).on('touchend', this.openLevelTier.bind(this, level.data));



            let order = section.mapData.levelLayers[level.order >= 0 ? level.order : this.tierButtons.length];
            //console.log(order)

            this.tierMap.addTierLevel(levelTierButton, order)
            this.tierButtons.push(levelTierButton);

            //this.refreshTier(levelTierButton, levelTierButton.data);
        }

        this.resize(null, true);


        //this.tiersView.x = this.currentGridOffset.x * 2//this.tiersView.targetX;
        //this.tiersView.springX.x = this.tiersView.x;

        //this.levelMap.x = this.currentGridOffset.x * 2
        let tierOrder = 0
        this.tierButtons.forEach(element => {
            if (element.data) {
                this.refreshTier(element, element.data, tierOrder);
                tierOrder++
            }
        });

        this.resetDrags()

    }

    openLevelTier(tier) {
        console.log("openLevelTier", tier[0].tier)
        if (this.disableClickCounter > 0) {
            return;
        }


        let targetPallet = tier[0].tier.customPallet

        console.log(targetPallet)

        if (targetPallet != undefined) {
            if (isNaN(targetPallet)) {
                targetPallet = colorSchemes.findPallet(targetPallet)
                console.log(targetPallet)
            }

            if (targetPallet >= 0) {
                window.COOKIE_MANAGER.updateColorPallete(targetPallet);
            }
        }

        if (targetPallet != undefined && targetPallet < 0) {
            if (this.currentSection) {
                window.COOKIE_MANAGER.updateColorPallete(this.currentSection.colorPalletId);
            }
        }

        this.show();


        this.addWorldBackgroundColor();

        window.SOUND_MANAGER.play('shoosh', { volume: 0.2 })
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
        console.log(this.currentTier[0].tier)

        if (tier[0].tier.splitData) {
            this.addSplitCard(tier[0].tier);
            this.levelMap.cleanMap();
        } else {


            if (!this.currentTier[0].tier.mapData.terrainColors) {
                let colors = colorSchemes.getCurrentColorScheme();
                this.currentTier[0].tier.mapData.terrainColors = colors.map.terrainColors
                this.currentTier[0].tier.mapData.pathColors = [0xFFFFFF]
            }

            this.levelMap.drawMap(this.currentTier[0].tier.mapData, this.newUnscaledLevelButtonSize, this.currentTier.length - 1)
            tier.forEach(element => {
                this.addCard(element);
            });

            setTimeout(() => {
                this.resetDrags();
            }, 30);
        }

        this.resetDrags()


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

        // if(this.currentUISection){
        //     console.log(this.mainCanvas.width - this.currentUISection * this.mainCanvas.width, this.tiersView.x)
        // }
        this.tiersView.visible = this.currentUISection == 1
        this.levelsView.visible = this.currentUISection == 2
        this.centerLevels();

        this.planetButtons.forEach(element => {
            element.update(delta);
        });

        this.tempBlockPanel.visible = this.showingBlockTime > 0;

        if (this.showingBlockTime > 0) {
            this.showingBlockTime -= delta;
        }

        if (!this.isHolding && this.disableClickCounter > 0) {
            this.disableClickCounter--;
        }

        if (this.tierMap) {
            this.tierMap.update(delta);
            this.levelMap.update(delta);
        }
    }
    refreshTier(levelTierButton, data, tierOrder) {
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



        if (COOKIE_MANAGER.isTierComplete(data[0].tier)) {

            let progress = COOKIE_MANAGER.getTierProgress(data[0].tier)
            if (progress >= 1) {
                levelTierButton.setCrown()
            }
            levelTierButton.setCompleteState()
            //levelTierButton.setColor(config.colors.purple)
            levelTierButton.tierCompleteMode();//updateLabel('COMPLETED');
            levelTierButton.hideProgressBar();
        } else {

            //if(levelTierButton)
            // finishedLevels + "/" + countLevels
            levelTierButton.setProgressBar(count / data.length);
            levelTierButton.updateLabel(count + "/" + data.length, { x: 0, y: -25 });

            if (COOKIE_MANAGER.isTierLocked(data[0].tier)) {
                levelTierButton.lockMode()
            } else {
                levelTierButton.incompleteMode()
            }

            // levelTierButton.setStandardState()
        }

        let debugThumb = window.COOKIE_MANAGER.debug.showAllThumbs;
        if (debugThumb) {
            levelTierButton.incompleteMode();
            levelTierButton.updateLabel(count + "/" + data.length, { x: 0, y: -25 });
            levelTierButton.updateLabelTop(data[0].tierName + ' ~' + utils.convertNumToTime(Math.ceil(totalEstimatedTime)))// + '    ' + '~' + utils.convertNumToTime(Math.ceil(totalEstimatedTimeHard)));
        }

        levelTierButton.setLargeButtonMode();
        let debugNames = window.COOKIE_MANAGER.debug.showAllNames;
        if (debugNames) {
            levelTierButton.updateDebugLabel(data[0].tierName + " - " + tierOrder + "\n" +utils.convertNumToTime(Math.ceil(totalEstimatedTime)))
        }
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
        let debugNames = window.COOKIE_MANAGER.debug.showAllNames;
        if (levelStored || debugThumb) {
            levelButton.updateIcon(this.gameScreen.generateImage(data, 24, 0, data.colorPalletId));
            if (!debugThumb) {
                levelButton.updateLabel(utils.convertNumToTime(Math.ceil(levelStored.bestTime)))//,
                //new PIXI.Sprite.fromImage(window.iconsData.time))
            } else {
                levelButton.updateLabel("~" + data.estimateTime2)// + '    ' + '~' + utils.convertNumToTime(Math.ceil(data.estimateTimeHard)))//,
                //new PIXI.Sprite.fromImage(window.iconsData.time));
            }

            levelButton.setLargeButtonMode(false);
            //levelButton.setCompleteStateLevel()
            levelButton.completeMode()
            //levelButton.setColor(colorSchemes.colorSchemes[data.colorPalletId].list[4].color)
        } else {

            let levelEnabled = false;
            if (data.require[0] < 0) {
                levelEnabled = true;
            } else {
                levelEnabled = false;
                data.require.forEach(element => {
                    if (element < 0 || element >= data.tier.data.length) {
                        console.log("Required level doesnt exist", element, data.tier.data);
                        levelEnabled = true;
                    } else {
                        let idSave = data.tier.data[element].idSaveData;
                        if (window.COOKIE_MANAGER.findLevel(idSave)) {
                            levelEnabled = true;
                        }
                    }
                });
            }
            levelButton.updateIcon(new PIXI.Sprite());
            if (levelEnabled) {

                levelButton.updateLabel("~" + data.estimateTime2)//,
                levelButton.incompleteMode();
            } else {
                levelButton.lockMode();

            }
            levelButton.setLargeButtonMode(false);
        }

        if (debugNames) {
            console.log(data, data.require)

            let findID = 0;
            for (let index = 0; index < data.tier.data.length; index++) {
                const element = data.tier.data[index];
                if (element.id == data.id) {
                    findID = index
                }
            }
            levelButton.updateDebugLabel(data.id + " - " + findID + "\n"+ data.estimateTime2)
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

        this.addStandardBackgroundColor()
        this.gameScreen.mainMenuSettings.collapse();
        this.gameScreen.startNewLevel(data, false);

        this.hide();
        //this.currentUISection = 0;
        this.resetDrags()
        this.resize(null, true)
    }
    drawGrid(elements, margin, size, isVertical, lineOverride = 1) {
        let maxPerLine = Math.floor((this.mainCanvas.width - this.currentGridOffset.x - 20) / (size.width + margin * 3)) + 1
        if (isVertical) {
            maxPerLine = lineOverride;
        }

        if (lineOverride > 1) {
            maxPerLine = Math.min(lineOverride, maxPerLine)
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
            element.x = (index % maxPerLine) * chunck + adj + chunck / 2 - element.unscaledCardSize.width / 2 + (this.currentGridOffset.x * 0.5) + this.mainCanvas.width / 2
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
            element.y = 50 + index * size.height * 0.5

            lines.push(element.y + size.height)
        }
    }

    resize(innerResolution, force) {

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


        if (this.unscaledTierButtonSize && this.currentGridOffset.x > 0) {

            let targetScale = (this.currentResolution.width - this.currentGridOffset.x * 2 - 20) / (this.unscaledTierButtonSize.width * 7)
            if (window.isMobile) {
                targetScale = Math.min(1, targetScale)

            } else {
                targetScale = Math.min(1, targetScale)
            }
            this.tierMap.scale.set(targetScale)
            this.levelMap.scale.set(targetScale)
            this.levelMap.x = this.currentGridOffset.x * 2
        }


    }

    updateStartState() {
        if (this.isSinglePlanet) {
            this.currentUISection = 1
            this.disableClickCounter = 0;
            this.openSection(this.isSinglePlanet)
            setTimeout(() => {
                
                this.centerLevels()

                this.resetDrags();
            }, 30);
        }
    }
    centerLevels() {
        if (this.shouldUpdate) {

            if (!this.isSinglePlanet){
                this.drawPlanets(this.planetButtons, 20, this.unscaledLinePlanetSize, true, 2);
            }

            if (this.levelSplitCards.length > 0 && this.currentUISection == 2) {
                this.drawGrid(this.levelSplitCards, 20, this.levelSplitCards[0].customSize, true);
                this.updateDrag(this.draggables[this.currentUISection])
            } else {
                if (this.currentUISection >= 1) {
                    this.updateMapDrag(this.draggables[this.currentUISection])
                } else {
                    this.updateDrag(this.draggables[this.currentUISection])
                }
            }
        }

        this.levelsView.x = this.mainCanvas.x + this.mainCanvas.width / 2 - this.levelsView.width / 2 - this.currentGridOffset.x

        this.sectionsView.pivot.x = this.mainCanvas.width / 2
        this.sectionsView.x = this.mainCanvas.x + this.mainCanvas.width

        if (this.tiersView.width < window.innerWidth) {
            this.tiersView.targetX = this.mainCanvas.x + this.mainCanvas.width / 2 - this.tiersView.width / 2// - this.currentGridOffset.x//this.mainCanvas.x + this.currentGridOffset.x * 2
        } else {
            this.tiersView.targetX = this.mainCanvas.x + this.currentGridOffset.x * 2
        }

    }
}
