import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';
import { debug } from 'webpack';
import SquareButton from './SquareButton';
import Spring from '../effects/Spring';
import colorSchemes from '../../colorSchemes';


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
        setTimeout(() => {
            this.addChild(this.newContainer)

            this.unscaledCardSize = { width: window.innerWidth / 5, height: window.innerWidth / 5 }

            if (this.unscaledCardSize.width > 150) {
                this.unscaledCardSize = { width: 150, height: 150 }
            }

            if (this.unscaledCardSize.width < 80) {
                this.unscaledCardSize = { width: 80, height: 80 }
            }

            this.sectionsContainer.addChild(this.sectionsView)
            this.newContainer.addChild(this.sectionsContainer)

            this.tiersContainer.addChild(this.tiersView)
            this.newContainer.addChild(this.tiersContainer)

            this.levelsContainer.addChild(this.levelsView)
            this.newContainer.addChild(this.levelsContainer)

            this.buildSections();
            this.refreshNavButtons();

            this.resize({ width: window.innerWidth, height: window.innerHeight }, true)

            this.dragPanel = new PIXI.Graphics().beginFill(0x000099).drawRect(-5000, -5000, 10000, 10000);

            this.addChild(this.dragPanel)
            this.dragPanel.interactive = true;
            this.dragPanel.visible = false;
            this.dragPanel.alpha = 0;

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

    }
    refreshNavButtons() {
        for (let index = 1; index < this.navButtons.length; index++) {
            let navButton = this.navButtons[index];

            let countLevels = 0;
            let finishedLevels = 0;
            for (let index = 0; index < navButton.section.levels.length; index++) {
                const element = navButton.section.levels[index];
                console.log(element)
                countLevels += element.data.length;

                element.data.forEach(element2 => {

                    if (window.COOKIE_MANAGER.findLevel(element2.idSaveData)) {
                        finishedLevels++
                    }
                });

            }

            navButton.setProgressBar(finishedLevels / countLevels);

            if(finishedLevels >= countLevels){
                navButton.setColor(config.colors.purple)
                navButton.updateLabel('COMPLETED');
                navButton.hideProgressBar();
            }
        }

    }
    getRect(size = 4, color = 0xFFFFFF) {
        return new PIXI.Graphics().beginFill(color).drawRect(0, 0, size, size);
    }
    drawColorPallet(id) {
        let colors = colorSchemes.colorSchemes[id]
        let size = 10;
        let container = new PIXI.Container();
        for (let index = 0; index < 9; index++) {
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
        let cElementH = element.height //- this.newContainer.y;
        let cCanvasH = this.mainCanvas.height - this.newContainer.getGlobalPosition().y//+ this.newContainer.y;
        if (cElementH > cCanvasH) {
            element.spring.tx = element.dragPosition.y + this.dragSpeed.y;
            element.spring.tx = Math.min(element.spring.tx, 0);
            element.spring.tx = Math.max(element.spring.tx, cCanvasH - cElementH - 40);
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

        this.levelsView.dragPosition = { x: this.levelsView.x, y: this.levelsView.y }
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
            if(this.currentUISection <= 0){
                this.refreshNavButtons();
            }
        } else {
            //ouch
            this.gameScreen.startScreenContainer.startState(0);
            this.currentUISection = 0;
            this.refreshNavButtons();
            this.resetDrags();
        }
    }
    buildSections() {

        let backButton = this.buildBackButton();
        this.sectionsView.addChild(backButton);
        this.navButtons.push(backButton);
        this.gameScreen.mainMenuSettings.collapse();


        for (let index = 0; index < this.sections.length; index++) {
            let section = this.sections[index];

            let navButton = this.buildSectionButton(section);
            this.sectionsView.addChild(navButton)
            navButton.section = section;
            navButton.y = index * navButton.height

            navButton.interactive = true;
            navButton.buttonMode = true;
            this.navButtons.push(navButton);

            navButton.setPallet(this.drawColorPallet(section.colorPalletId));
            //navButton.setColor(window.colorsOrder[this.navButtons.length % window.colorsOrder.length])
            navButton.on('mouseup', this.openSection.bind(this, section)).on('touchend', this.openSection.bind(this, section));
        }
    }



    buildBackButton() {
        let secButton = new SquareButton(this.unscaledCardSize)
        secButton.updateIcon(PIXI.Sprite.fromImage(window.iconsData.back));
        secButton.buttonMode = true;
        secButton.interactive = true;
        this.gameScreen.resizeToFitAR(this.unscaledCardSize, secButton)
        secButton.on('mouseup', this.onBack.bind(this)).on('touchend', this.onBack.bind(this));

        return secButton
    }

    buildSectionButton(section) {
        let secButton = new SquareButton(this.unscaledCardSize);
        secButton.updateLabelTop(section.name);
        if (section.imageSrc)
            secButton.updateIcon(PIXI.Sprite.fromImage('./assets/' + section.imageSrc));

        this.gameScreen.resizeToFitAR(this.unscaledCardSize, secButton)



        return secButton
    }
    buildLevelTierButton(level, index) {

        let dataFirstLevel = level.data[0];
        let levelTierButton = new SquareButton(this.unscaledCardSize);

        
        levelTierButton.updateLabelTop(level.name);
        levelTierButton.updateIcon(this.gameScreen.generateImage(dataFirstLevel.pieces, 24, 0, dataFirstLevel.colorPalletId));
        this.gameScreen.resizeToFitAR(this.unscaledCardSize, levelTierButton)
        
        this.refreshTier(levelTierButton, level.data)
        //levelTierButton.setProgressBar();

        return levelTierButton
    }
    openSection(section) {
        if (this.disableClickCounter > 0) {
            return;
        }
        window.SOUND_MANAGER.play('shoosh', { volume: 0.1 })
        this.gameScreen.mainMenuSettings.collapse();
        this.currentUISection = 1
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



        let backButton = this.buildBackButton();
        this.tiersView.addChild(backButton);
        this.sectionButtons.push(backButton);




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
        if (this.disableClickCounter > 0) {
            return;
        }
        window.SOUND_MANAGER.play('shoosh', { volume: 0.1 })
        this.gameScreen.mainMenuSettings.collapse();
        this.currentUISection = 2
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

        this.levelCards = [];


        let backButton = this.buildBackButton();
        this.levelsView.addChild(backButton);
        this.levelCards.push(backButton);

        //console.log("tier", tier)
        tier.forEach(element => {
            this.addCard(element);
        });


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

        if (!this.isHolding && this.disableClickCounter > 0) {
            this.disableClickCounter--;
        }
    }
    refreshTier(levelTierButton, data) {
        let count = 0;
        data.forEach(element => {
            if (window.COOKIE_MANAGER.findLevel(element.idSaveData)) {
                count++
            }
        });

        if (count >= data.length) {
            levelTierButton.setColor(config.colors.purple)
            levelTierButton.updateLabel('COMPLETED');
            levelTierButton.hideProgressBar();
        } else {
            levelTierButton.setProgressBar(count / data.length);
            console.log("UPDATE STUFF HERE",data.length,  count)
            //levelTierButton.updateLabel('(' + count + '/' + data.length + ')');
        }
    }
    refreshCard(levelButton, data) {
        let levelStored = window.COOKIE_MANAGER.findLevel(data.idSaveData);
        let debugThumb = window.COOKIE_MANAGER.debug.showAllThumbs;
        if (levelStored || debugThumb) {
            levelButton.updateIcon(this.gameScreen.generateImage(data.pieces, 24, 0, data.colorPalletId));
            if (!debugThumb) {
                levelButton.updateLabelTop(utils.convertNumToTime(Math.ceil(levelStored.bestTime)),
                    new PIXI.Sprite.fromImage(window.iconsData.time))
            }
            levelButton.setColor(config.colors.blue2)
        } else {
            levelButton.updateIcon(this.gameScreen.generateImage(window.questionMark.pieces));
        }
    }

    addCard(data) {


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

    selectLevel(data) {
        if (this.disableClickCounter > 0) {
            return;
        }
        this.gameScreen.mainMenuSettings.collapse();
        this.gameScreen.startNewLevel(data, false);
        this.currentUISection = 0;
        this.resetDrags()
        this.resize(null, true)
    }
    drawGrid(elements, margin = 10) {
        let maxPerLine = Math.floor(this.mainCanvas.width / (this.unscaledCardSize.width + margin * 2.5)) + 1
        let fullWidth = this.mainCanvas.width - margin * 2
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
            element.x = (index % maxPerLine) * chunck + adj + chunck / 2 - element.width / 2//+ distance * 0.5 - fullWidth * 0.5///+ element.width / 2 + margin * 0.5

            // // if(!element.debug){
            // //     element.debug = new PIXI.Graphics().beginFill(0xff0066).drawRect(0,0,chunck,element.height);
            // //     element.parent.addChild(element.debug)
            // //     element.debug.position = element.position
            // // }

            //element.scale.set(0.8)
            if (index >= maxPerLine) {
                element.y = 30 + lines[index - maxPerLine]
            } else {

                element.y = 50
            }

            // if(!element.debug){
            //     element.debug = new PIXI.Graphics().beginFill(0xff0066 * Math.random()).drawRect(0,0,chunck,element.height);
            //     element.parent.addChild(element.debug)
            //     element.debug.position = element.position
            //     element.debug.alpha = 0.5
            // }else{
            //     element.debug.position = element.position

            // }

            lines.push(element.y + element.height)

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



    }
    centerLevels() {
        this.drawGrid(this.sectionButtons, 20);
        this.drawGrid(this.navButtons, 20);
        this.drawGrid(this.levelCards, 20);

        this.updateDrag(this.draggables[this.currentUISection])
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
