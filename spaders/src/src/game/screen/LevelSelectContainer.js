import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';
import { debug } from 'webpack';
import SquareButton from './SquareButton';
import Spring from '../effects/Spring';
//import { utils } from 'pixi.js/lib/core';

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

            if (this.unscaledCardSize.width > 120) {
                this.unscaledCardSize = { width: 120, height: 120 }
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


            this.resize({ width: window.innerWidth, height: window.innerHeight }, true)

        }, 100);

        this.sectionsContainer.x = 0;
        this.tiersContainer.x = config.width;
        this.levelsContainer.x = config.width * 2;

        this.currentUISection = 0;

        this.panelOrder = [this.sectionsContainer, this.tiersContainer, this.levelsContainer];

        this.panelOrder.forEach(element => {
            element.spring = new Spring();
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
        });

        this.resetDrags();
        // this.center1 = new PIXI.Graphics().beginFill(0xFF00FF).drawCircle(0, 0, 20)
        // this.levelsContainer.addChild(this.center1)

        // this.center2 = new PIXI.Graphics().beginFill(0xF00FFF).drawCircle(0, 0, 20)
        // this.levelsContainer.addChild(this.center2)

    }
    resetDrags() {
        this.draggables.forEach(element => {
            element.y = 0;
            element.dragPosition = { x: element.x, y: element.y }
        });
        //this.dragSpeed = { x: 0, y: 0 }
    }
    updateDrag(element) {
        //console.log(this.newContainer.getGlobalPosition())
        let cElementH = element.height //- this.newContainer.y;
        let cCanvasH = this.mainCanvas.height - this.newContainer.getGlobalPosition().y//+ this.newContainer.y;
        if (cElementH > cCanvasH) {
            element.y = element.dragPosition.y + this.dragSpeed.y;
            element.y = Math.min(element.y, 0);
            element.y = Math.max(element.y, cCanvasH - cElementH - 40);
        } else {
            element.y = 0;
        }

        if(!this.isHolding){
            //this.dragSpeed.y = utils.lerp(this.dragSpeed.y, 0, 0.2)
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
        } else {
            this.dragSpeed = { x: 0, y: 0 }
        }
    }
    onBack() {
        if (this.disableClickCounter > 0) {
            return;
        }
        if (this.currentUISection > 0) {
            this.currentUISection--
        } else {
            //ouch
            this.gameScreen.startScreenContainer.startState(0);
            this.currentUISection = 0;
            this.resetDrags();
        }
    }
    buildSections() {

        let backButton = this.buildBackButton();
        this.sectionsView.addChild(backButton);
        this.navButtons.push(backButton);

        for (let index = 0; index < this.sections.length; index++) {
            let section = this.sections[index];

            let navButton = this.buildSectionButton(section);
            this.sectionsView.addChild(navButton)

            navButton.y = index * navButton.height

            navButton.interactive = true;
            navButton.buttonMode = true;
            this.navButtons.push(navButton);

            navButton.setColor(window.colorsOrder[ this.navButtons.length % window.colorsOrder.length])
            navButton.on('mouseup', this.openSection.bind(this, section)).on('touchend', this.openSection.bind(this, section));
        }
    }

    buildBackButton() {
        let secButton = new SquareButton(this.unscaledCardSize)
        secButton.updateIcon(PIXI.Sprite.fromImage('./assets/images/icons/icons8-back-128.png'));
        secButton.buttonMode = true;
        secButton.interactive = true;
        this.gameScreen.resizeToFitAR(this.unscaledCardSize, secButton)
        secButton.on('mouseup', this.onBack.bind(this)).on('touchend', this.onBack.bind(this));

        return secButton
    }

    buildSectionButton(section) {
        let secButton = new SquareButton(this.unscaledCardSize);
        secButton.updateLabel(section.name);
        if(section.imageSrc)
            secButton.updateIcon(PIXI.Sprite.fromImage('./assets/' + section.imageSrc));

        this.gameScreen.resizeToFitAR(this.unscaledCardSize, secButton)

        return secButton
    }
    buildLevelTierButton(level, index) {

        let dataFirstLevel = level.data[0];
        let levelTierButton = new SquareButton(this.unscaledCardSize);
        levelTierButton.updateLabel(level.name);
        levelTierButton.updateIcon(this.gameScreen.generateImage(dataFirstLevel.pieces));

        this.gameScreen.resizeToFitAR(this.unscaledCardSize, levelTierButton)

        return levelTierButton
    }
    openSection(section) {
        if (this.disableClickCounter > 0) {
            return;
        }
        this.currentUISection = 1
        if (this.currentSection == section) {
            return;
        }
        this.resetDrags()
        console.log("section", section)
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

            levelTierButton.interactive = true;
            levelTierButton.buttonMode = true;
            levelTierButton.on('mouseup', this.openLevelTier.bind(this, level.data)).on('touchend', this.openLevelTier.bind(this, level.data));
            this.sectionButtons.push(levelTierButton);
        }
        this.resize(null, true);
    }

    openLevelTier(tier) {
        if (this.disableClickCounter > 0) {
            return;
        }
        this.currentUISection = 2
        if (this.currentTier == tier) {
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

        console.log("tier", tier)
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

    addCard(data) {


        let levelButton = new SquareButton(this.unscaledCardSize);
        levelButton.updateLabel(data.levelName);
        levelButton.updateIcon(this.gameScreen.generateImage(data.pieces));

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
        this.gameScreen.startNewLevel(data, false);
        this.currentUISection = 0;
        this.resetDrags()
        this.resize(null, true)
    }
    drawGrid(elements, margin = 10) {
        let maxPerLine = Math.floor(this.mainCanvas.width / (this.unscaledCardSize.width + margin *2.5)) + 1
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
