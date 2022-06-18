import * as PIXI from 'pixi.js';
import TweenMax from 'gsap';
import config from '../../config';

import utils from '../../utils';
import Screen from '../../screenManager/Screen'
import Grid from '../elements/Grid'
import Card from '../elements/Card'
import Block from '../elements/Block'
import Board from '../core/Board'
import StartScreenContainer from './StartScreenContainer'
import EndGameContainer from './EndGameContainer'
import BackgroundEffects from '../effects/BackgroundEffects'
import UIRectLabel from './UIRectLabel'
import UIButton1 from './UIButton1'
import { debug } from 'webpack';
import InGameMenu from './InGameMenu';
import SquareButton from './SquareButton';
import ColorTweens from '../effects/ColorTweens';
import FXContainer from '../effects/FXContainer';
import MainMenu from './MainMenu';
import Trail from '../effects/Trail';
import TutorialOverlay from './TutorialOverlay';
import colorSchemes from '../../colorSchemes';
import PopUpOverlay from './PopUpOverlay';
import ProgressBar from './ProgressBar';
import Spring from '../effects/Spring';
import SpecialCardsManager from '../core/SpecialCardsManager';
import SprteSpritesheetAnimation from './SprteSpritesheetAnimation';
import TutorialPopLabel from './TutorialPopLabel';

export default class TetraScreen extends Screen {
	constructor(label) {
		super(label);

		this.generateImage(window.questionMark, 24, 0, 0, true, true);
		this.specialCardsManager = new SpecialCardsManager();
		//levelData, size = 24, paddingBottom = 0, schemeID = 0, addPadding = true, ignoreEmpty = false)

		window.AUTO_PLAY_HARD = false;
		window.AUTO_PLAY = false;

		this.blockGameTimer = 0;
		////console.log(levels)
		this.innerResolution = { width: config.width, height: config.height };

		this.colorTween = new ColorTweens();

		this.colorTweenBomb = new ColorTweens();
		window.colorTweenBomb = this.colorTweenBomb;


		this.levels = window.levelData;//window.levelsJson.levels;

		this.offsetCard = { x: 0, y: 0 }

		this.trailHorizontal = new PIXI.mesh.NineSlicePlane(
			PIXI.Texture.fromFrame('largeCard.png'), 5, 0, 5, 0)//new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(0, 0, 20, 20, 10);
		this.trailHorizontal.alpha = 0;

		this.hasHash = false;
		this.currentLevelID = 0;
		this.currentLevelData = this.levels[this.currentLevelID];

		this.isTutorial = false;
		this.autoRedirectToLevelSelect = false;

		this.autoRedirectData = { section: null, tier: null }

		if (window.location.hash) {
			var hash = window.location.hash.substring(1);
			if (hash == "t") {
				this.isTutorial = true;
			} else if (hash == "a") {

				this.hasHash = true;
				this.currentLevelID = 0;
			} else if (hash == "m") {
				this.autoRedirectToLevelSelect = true;
			} else {
				if (hash < this.levels.length) {

					this.hasHash = true;
					this.currentLevelID = hash;
					this.currentLevelData = this.levels[hash];

				}
			}
		}



		this.findURLParams()

		this.updateGridDimensions();

		window.CARD_POOL = [];
		window.ARROW_UP_POOL = [];
		window.ARROW_CORNER_POOL = [];

		window.CARD_NUMBER = 0;

		this.grid = new Grid(this);
		this.grid.onDestroyAllStartedCards.add(() => this.onDestroyAllStartedCards());
		this.grid.onDestroyTile.add((tile) => this.onDestroyTile(tile));

		this.board = new Board(this);
		window.board = this.board;
		this.board.onDestroyCard.add((card) => this.onDestroyCard(card));
		this.board.OnStartNextRound.add((card) => this.OnStartNextRound(card));
		this.board.OnGameOver.add((card) => this.OnGameOver(card));
		this.board.OnWin.add((card) => this.OnWin(card));

		this.totalLines = 6;

		this.currentPoints = 0;
		this.currentPointsLabel = 0;
		this.currentRound = 0;

		this.cardQueue = [];
		this.cardQueueSize = 4;

		this.currentButtonLabel = 'START';

		this.stopGameplay();

		this.mouseDirty = false;

		this.latestShoot = { x: 0, id: 0 };

		this.dataToSave = {
			levelName: "",
			wins: 0,
			loses: 0,
			bestTime: 999999999,
			bestMoves: 99999999,
			bestScore: 0
		}

		this.gameplayState = 0;
		//console.log(utils.convertNumToTime(1231))

		this.colorTweenBomb.startTween(0)

		window.onEscPressed.add(() => {
			if (this.gameRunning) {
				this.inGameMenu.toggleState();
			}

		})

	}

	uniq_fast(a) {
		var seen = {};
		var out = [];
		var len = a.length;
		var j = 0;
		for (var i = 0; i < len; i++) {
			var item = a[i];
			if (seen[item] !== 1) {
				seen[item] = 1;
				out[j++] = item;
			}
		}
		return out;
	}
	drawDebugCharacters() {


		let scheme = colorSchemes.getCurrentColorScheme().list;
		this.debugCardsContainer = new PIXI.Container();

		let y = 0;
		let x = 0;

		let orders = [];

		for (let index = 0; index < 8; index++) {
			orders.push([index])
		}

		var array1 = [0, 2, 4, 6];
		var array2 = [1, 3, 5, 7];

		utils.flat2Arrays(array1, array1).forEach(element => {
			orders.push(element)
		});
		utils.flat2Arrays(array2, array2).forEach(element => {
			orders.push(element)
		});
		utils.flat2Arrays(array2, array1).forEach(element => {
			orders.push(element)
		});
		utils.flat3Arrays(array1, array1, array1).forEach(element => {
			orders.push(element)
		});
		utils.flat3Arrays(array2, array2, array2).forEach(element => {
			orders.push(element)
		});
		utils.flat3Arrays(array2, array2, array1).forEach(element => {
			orders.push(element)
		});
		orders = utils.uniq_fast(orders);
		//console.log(orders)
		let card
		for (let index = 0; index < orders.length; index++) {
			card = new Card(this);
			if (index > 0) {
				if (index % 8 == 0) {
					y += card.height
					x = 0;
				} else {

					x += card.width
				}
			}
			const element = 0//scheme[index];

			card.life = 0;
			card.createCard(0, { order: orders[index % orders.length] });
			card.updateSprite(card.life, element, index);
			card.updateCard(false, element);
			//card.removeActionZones();
			card.update(0.1);
			card.x = x
			card.y = y;
			card.scale.set(1.75)
			card.cardBack3.visible = false;
			card.enemySprite.visible = false;
			this.debugCardsContainer.addChild(card);

		}

		// let blocker = new Block(this);
		// if (scheme.length % 4 == 0) {
		// 	y += card.height
		// 	x = 0;
		// } else {

		// 	x += card.width
		// }


		// this.debugCardsContainer.addChild(blocker);
		// blocker.scale.set(2)
		// blocker.x = x
		// blocker.y = y;

		let background = new PIXI.mesh.NineSlicePlane(
			PIXI.Texture.fromFrame('progressBarSmall.png'), 10, 10, 10, 10)

		this.debugCardsContainer.addChildAt(background, 0)

		background.width = this.debugCardsContainer.width
		background.height = this.debugCardsContainer.height

		background.tint = 0xFF00FF//colorSchemes.getCurrentColorScheme().dark

		this.debugCardsContainer.pivot.x = this.debugCardsContainer.width / 2
		this.debugCardsContainer.pivot.y = this.debugCardsContainer.height / 2
		this.addChild(this.debugCardsContainer)
	}
	findURLParams() {
		const urlParams = new URLSearchParams(window.location.search);
		if (window.COOKIE_MANAGER.stats.timesLoaded <= 1) {
			//alert(window.COOKIE_MANAGER.stats.timesLoaded)
			setTimeout(() => {
				window.game.onTapUp();

				this.colorTweenBomb.startTween(0)

				this.openTutorial(0)

			}, 10);
		} else if (urlParams) {

			if (urlParams.get('debug')) {
				let debugParameters = urlParams.get('debug')
				debugParameters = debugParameters.split(',');

				if (debugParameters[0]) {
					setTimeout(() => {
						window.game.onTapUp();
						this.drawDebugCharacters()

					}, 10);
				}
			}


			let levelRedirectParameters = urlParams.get('level')
			if (levelRedirectParameters) {
				levelRedirectParameters = levelRedirectParameters.split(',');

				for (let index = 0; index < 3; index++) {
					if (levelRedirectParameters.length < index + 1) {
						levelRedirectParameters.push(null);
					}
				}
				let parameters = window.getLevelData(levelRedirectParameters[0], levelRedirectParameters[1], levelRedirectParameters[2])
				if (levelRedirectParameters[0] == 'tutorial') {
					setTimeout(() => {
						//console.log(levelRedirectParameters)
						window.game.onTapUp();

						this.colorTweenBomb.startTween(0)

						this.openTutorial(levelRedirectParameters[1])

					}, 10);
				} else {

					if (parameters.level) {
						this.currentLevelData = parameters.level
						this.hasHash = true;
						this.currentLevelID = 0;
					} else if (parameters.section) {
						this.autoRedirectData.section = parameters.section;
						this.autoRedirectData.tier = parameters.tier;
						this.autoRedirectToLevelSelect = true;
						this.hasHash = true;
						this.currentLevelID = -1;

						this.colorTweenBomb.startTween(parameters.section.colorPalletId)

					}


				}

			}
		}

	}
	onDestroyTile(tile) {
		this.movesRect.icon.tint = tile.tint;
		this.movesRect.sortIconScale();
		TweenMax.from(this.movesRect.icon.scale, 0.5, {
			x: this.movesRect.icon.scale.x * 0.8,
			y: this.movesRect.icon.scale.y * 1.2,
			ease: Elastic.easeOut
		})

	}
	onDestroyAllStartedCards() {
		if (!this.gameRunning) {
			return;
		}
		this.blockGameTimer = 1;

		if (this.currentLevelData.gameMode == 10) {
			window.scrabbleManager.destroyAllWords()
		}

		let targetPallet = this.currentLevelData.colorPalletId
		if (this.currentLevelData.customPallet && this.currentLevelData.customPallet > 0) {
			targetPallet = this.currentLevelData.customPallet;
		}

		this.colorTween.startTween(targetPallet);
		this.gameplayState = 1;

		//(pos, label, delay = 0, dir = 1, scale = 1, color = 0xFFFFFF, ease = Back.easeOut)
		////AREA ATTACK
		this.isFinalState = true;
		setTimeout(() => {

			this.board.setFinalState();
			this.grid.endGameMode();
		}, 500);

		if (this.currentCard) {
			this.currentCard.setZeroLife();
			this.applyFinalState();
		}

		this.cardQueue.forEach(element => {

			element.setZeroLife();
		});

		if (this.endGameLabel && this.endGameLabel.parent) {
			this.endGameLabel.parent.removeChild(this.endGameLabel);

			TweenMax.killTweensOf(this.endGameLabel);
		}


		this.spawnFireworks();

		this.endGameLabel = PIXI.Sprite.fromFrame('finish-them-all.png');
		this.endGameLabel.anchor.set(0.5)
		utils.resizeToFitAR({ width: this.gameCanvas.width, height: this.gameCanvas.height }, this.endGameLabel);


		window.SOUND_MANAGER.play('getThemAll')
		window.SOUND_MANAGER.speedUpSoundTrack(1.05);

		let fallData = {
			gravity: 500,
			timeToDie: 5,
			timeToFall: 1.5,
			velocity: { x: Math.random() * CARD.width, y: 0 },
			angularVelocity: (Math.random() - 0.5) * Math.PI * 2
		}
		this.endGameLabel.fallData = fallData;

		TweenMax.from(this.endGameLabel.scale, 0.5, {
			x: this.endGameLabel.scale.x * 0.8,
			y: this.endGameLabel.scale.y * 1.2,
			ease: Elastic.easeOut
		})

		this.endGameLabel.x = this.gameCanvas.width / 2 + this.gameCanvas.x;
		this.endGameLabel.y = this.gridContainer.y + this.grid.gridSprite.height / this.gridContainer.scale.y / 2;
		this.addChild(this.endGameLabel);

		let global = this.endGameLabel.getGlobalPosition({ x: 0, y: 0 });
		this.fxContainer.addParticlesToScore(
			8,
			this.toLocal(global),
			null,
			0xffffff,
			0.9
		)


	}
	onDestroyCard(card) {
		this.grid.destroyCard(card);
		this.currentSectionPiecesKilled++;

		if (this.specialCardsOnGrid.cards.length) {
			for (let index = this.specialCardsOnGrid.cards.length - 1; index >= 0; index--) {
				const element = this.specialCardsOnGrid.cards[index];
				if (element == card) {
					this.specialCardsOnGrid.cards.splice(index, 1);
				}

			}
		}
	}
	updateGridDimensions() {
		window.GRID = {
			i: this.currentLevelData.pieces[0].length,
			j: this.currentLevelData.pieces.length,
			height: this.innerResolution.width,
			width: this.innerResolution.height,
			iDraw: this.currentLevelData.piecesToDraw[0].length,
			jDraw: this.currentLevelData.piecesToDraw.length,
			heightDraw: this.innerResolution.width / this.currentLevelData.levelDataScale,
			widthDraw: this.innerResolution.height / this.currentLevelData.levelDataScale,
			scale: this.currentLevelData.levelDataScale
		}

		let min = 60;

		if (GRID.height > GRID.width) {
			window.CARD = {
				width: Math.min(GRID.height / GRID.j, min),
				height: Math.min(GRID.height / GRID.j, min)
			}
		} else {

			window.CARD = {
				width: Math.min(GRID.width / GRID.i, min),
				height: Math.min(GRID.width / GRID.i, min)
			}
		}

		window.GRID.width = window.GRID.i * CARD.width;
		window.GRID.height = window.GRID.j * CARD.height;

		window.GRID.widthDraw = CARD.width / this.currentLevelData.levelDataScale;
		window.GRID.heightDraw = CARD.height / this.currentLevelData.levelDataScale;


		if (this.gridContainer) {
			this.buildTrails();
		}
	}
	getPixelSprite() {
		if (!window.PIXEL_SPRITE_POOL) {
			window.PIXEL_SPRITE_POOL = [];
		}
		let sprite;
		if (window.PIXEL_SPRITE_POOL.length) {
			sprite = window.PIXEL_SPRITE_POOL[0];
			window.PIXEL_SPRITE_POOL.shift();
		} else {
			sprite = new PIXI.Sprite.fromFrame("pixelSquare.png");
		}
		return sprite;
	}
	getRect(size = 4, color = 0xFFFFFF) {
		let sprite = this.getPixelSprite();
		sprite.width = size
		sprite.height = size
		sprite.tint = color;
		return sprite;
	}
	getRect2(w = 4, h = 4, color = 0xFFFFFF) {
		let sprite = this.getPixelSprite();
		sprite.width = w
		sprite.height = h
		sprite.tint = color;
	}
	getRoundRect2(w = 4, h = 4, color = 0xFFFFFF) {
		return new PIXI.Graphics().beginFill(color).drawRoundedRect(0, 0, w, h, 10);
	}
	getCircle(size = 4, color = 0xFFFFFF) {
		return new PIXI.Graphics().beginFill(color).drawCircle(0, 0, size * 0.5);
	}
	generateImage(levelData, size = 24, paddingBottom = 0, schemeID = 0, addPadding = true, ignoreEmpty = false) {

		ignoreEmpty = true;
		if (window.imageThumbs[levelData.idSaveData]) {
			let sprite = window.imageThumbs[levelData.idSaveData]
			sprite.scale.set(1);
			let copy = new PIXI.Sprite();
			copy.setTexture(sprite.texture);
			return copy;
		}

		let container = new PIXI.Container();
		let level = [];
		size = 200 / levelData.piecesToDraw[0].length
		size = Math.max(size, 6)
		size = Math.min(size, 24)
		size = Math.round(size)

		for (let i = 0; i < levelData.piecesToDraw.length; i++) {
			let temp = []
			for (let j = 0; j < levelData.piecesToDraw[i].length; j++) {
				temp.push(levelData.piecesToDraw[i][j]);

			}
			level.push(temp);
		}
		utils.trimMatrix(level, true)

		if (addPadding) {
			utils.paddingMatrix(level, { left: 1, right: 1, top: 1, bottom: 1 })
		}


		let tempRect = null;

		let colors = colorSchemes.colorSchemes[schemeID]
		let allSprites = [];
		for (var i = level.length - 1; i >= 0; i--) {
			for (var j = 0; j < level[i].length; j++) {
				if (level[i][j] >= 0) {

					if (colors.list[level[i][j]].isBlock) {
						tempRect = this.getRect(size, colors.dark)
						container.addChild(tempRect)
						allSprites.push(tempRect);
						tempRect.x = j * size + size * 0.5;
						tempRect.y = i * size + size * 0.5;
					} else {
						tempRect = this.getRect(size, colors.list[level[i][j]].color)
						container.addChild(tempRect)
						allSprites.push(tempRect);
						tempRect.x = j * size + size * 0.5;
						tempRect.y = i * size + size * 0.5;
					}
				} else if (level[i][j] == -2) {
					tempRect = this.getRect(size, colors.dark)
					container.addChild(tempRect)
					allSprites.push(tempRect);
					tempRect.x = j * size + size * 0.5;
					tempRect.y = i * size + size * 0.5;
					if (ignoreEmpty) {
						//tempRect.alpha = 0;
					}
				} else {
					// tempRect = this.getRect(size, colors.dark)
					// container.addChild(tempRect)
					// allSprites.push(tempRect);
					// tempRect.x = j * size + size * 0.5;
					// tempRect.y = i * size + size * 0.5;

					// if (ignoreEmpty) {
					// 	tempRect.alpha = 0.5;
					// }
				}
			}

		}

		// let background = this.getRoundRect2(level[0].length * size + size, container.height + size + paddingBottom, 0x222222)

		// container.addChildAt(background, 0)

		let texture = renderer.generateTexture(container);

		let sprite = new PIXI.Sprite()
		sprite.setTexture(texture)

		//sprite.background = background;

		sprite.nodeSize = size;
		window.imageThumbs[levelData.idSaveData] = sprite;

		allSprites.forEach(element => {
			window.PIXEL_SPRITE_POOL.push(element);
		});
		return sprite;
	}
	buildUI() {
		this.pointsLabel = new PIXI.Text(this.currentPoints, { font: '24px', fill: 0xFFFFFF, align: 'right', fontWeight: '500', fontFamily: window.STANDARD_FONT1 });
		this.roundsLabel = new PIXI.Text(0, { font: '24px', fill: 0xFFFFFF, align: 'right', fontWeight: '500', fontFamily: window.STANDARD_FONT1 });
		this.entitiesLabel = new PIXI.Text(0, { font: '24px', fill: 0xFFFFFF, align: 'right', fontWeight: '500', fontFamily: window.STANDARD_FONT1 });
		this.timeLabel = new PIXI.Text(0, { font: '24px', fill: 0xFFFFFF, align: 'right', fontWeight: '500', fontFamily: window.STANDARD_FONT1 });

		this.pointsLabelStatic = new PIXI.Text("SCORE", { font: '24px', fill: 0xFFFFFF, align: 'right', fontWeight: '500', fontFamily: window.STANDARD_FONT1 });
		this.roundsLabelStatic = new PIXI.Text("MOVES", { font: '24px', fill: 0xFFFFFF, align: 'right', fontWeight: '500', fontFamily: window.STANDARD_FONT1 });
		this.entitiesLabelStatic = new PIXI.Text("ENTITIES", { font: '24px', fill: 0xFFFFFF, align: 'right', fontWeight: '500', fontFamily: window.STANDARD_FONT1 });
		this.timeLabelStatic = new PIXI.Text("TIME", { font: '24px', fill: 0xFFFFFF, align: 'right', fontWeight: '500', fontFamily: window.STANDARD_FONT1 });

		this.levelNameLabel = new PIXI.Text("name", { font: '30px', fill: 0xFFFFFF, align: 'center', fontWeight: '800', fontFamily: window.STANDARD_FONT1 });



		//this.UIContainer.addChild(this.resetLabelBack)


		this.mainMenuContainer = new PIXI.Container();
		this.UIInGame = new PIXI.Container();
		this.bottomUINewContainer = new PIXI.Container();

		this.startScreenContainer = new StartScreenContainer(this);
		this.mainMenuContainer.addChild(this.startScreenContainer)

		this.endGameScreenContainer = new EndGameContainer(this);
		this.mainMenuContainer.addChild(this.endGameScreenContainer)



		this.topUIContainer.addChild(this.UIInGame)
		this.bottomUIContainer.addChild(this.bottomUINewContainer)


		this.startScreenContainer.addEvents();


		this.endGameScreenContainer.x = this.width / 2
		this.endGameScreenContainer.y = this.height / 2

		this.endGameScreenContainer.addEvents();

		this.UIContainer.addChild(this.mainMenuContainer)

		this.containerQueue = new PIXI.Container();
		this.frontGridContainer.addChild(this.containerQueue)


		this.popLabel = new TutorialPopLabel(true);
		this.frontGridContainer.addChild(this.popLabel)

		this.shootingGun = new PIXI.Sprite.fromFrame('shooting.png');
		this.frontGridContainer.addChild(this.shootingGun)

		let colorScheme = colorSchemes.getCurrentColorScheme().grid;
		this.backQueueShape = new PIXI.mesh.NineSlicePlane(
			PIXI.Texture.fromFrame(colorScheme.sprite), 20, 20, 20, 20)
		this.backQueueShape.width = CARD.width * 3
		this.backQueueShape.height = CARD.height
		this.containerQueue.addChild(this.backQueueShape);

		this.timerRect = new UIRectLabel(config.colors.yellow, 'time.png');
		this.bottomUINewContainer.addChild(this.timerRect)
		this.timerRect.icon.visible = false;

		this.movesRect = new UIRectLabel(config.colors.green, "progressBarSmall.png");
		this.bottomUINewContainer.addChild(this.movesRect)


		let sizeBar = { width: config.width, height: 30 }

		this.chargeBombBar = new ProgressBar(sizeBar, 16);
		this.chargeBombBar.currentChargeValue = 0;
		this.chargeBombBar.maxValue = 500;
		this.chargeBombBar.updateBackgroundColor(0, 0.2)
		this.fallBar = new ProgressBar(sizeBar, 16);
		this.bottomUINewContainer.addChild(this.chargeBombBar)

		this.scoreRect = new UIRectLabel(config.colors.red2, 'tile_1_' + (8 * 32 + 5) + '.png', false);
		this.scoreRect.backShape.visible = false;
		this.bottomUINewContainer.addChild(this.scoreRect)
		this.scoreRect.updateFontSize(20);
		this.gameContainer.addChild(this.fallBar)

		this.scoreRect.sortIconScale(0.5)

		this.fallBar.visible = false;


		let spaderIcon = new SprteSpritesheetAnimation()


		spaderIcon.addLayer("l0_spader_1_", { min: 1, max: 5 }, 0.15)
		spaderIcon.addLayer("l1_spader_1_", { min: 1, max: 5 }, 0.15)


		this.fallBar.icon = spaderIcon;

		spaderIcon.rotation = Math.PI / 2
		spaderIcon.scale.set(0.35)
		spaderIcon.x = 30


		this.fallBar.addChild(spaderIcon);


		this.chargeBombBar.visible = true;



		//bombIconTop.scale = bombIcon.scale

		let nuke = new SprteSpritesheetAnimation()


		nuke.addLayer("l0_nuke_", { min: 1, max: 5 }, 0.15)
		nuke.addLayer("l1_nuke_", { min: 1, max: 5 }, 0.15)

		//nuke.scale.set(0.25);


		this.chargeBombBar.icon = nuke;
		this.chargeBombBar.sin = 0;
		this.chargeBombBar.scaleOffset = { x: 0, y: 0 };

		this.chargeBombBar.readyLabel = new PIXI.Text("READY!", { font: '30px', fill: 0xFFFFFF, align: 'center', fontWeight: '800', fontFamily: window.STANDARD_FONT1 });

		this.chargeBombBar.readyLabel.x = this.chargeBombBar.width - this.chargeBombBar.readyLabel.width - 10
		this.chargeBombBar.readyLabel.y = 2
		this.chargeBombBar.addChild(this.chargeBombBar.readyLabel);


		// this.backButton = new UIButton1(config.colors.white, 'icons8-menu-48.png', config.colors.dark);
		// this.backButton.onClick.add(() => this.mainmenuState());


		this.inGameMenu = new InGameMenu(config.colors.green);
		this.UIInGame.addChild(this.inGameMenu)


		this.inGameMenu.onBack.add(() => this.mainmenuStateFromGame())
		this.inGameMenu.onRestart.add(() => this.resetGame())
		this.inGameMenu.onNextLevel.add(() => this.playNextLevel())
		this.inGameMenu.onPause.add(() => this.pauseGame())
		this.inGameMenu.onUnPause.add(() => this.onUnPause())

		this.gridContainer.alpha = 0;
		this.updateUI();

		this.mainMenuSettings = new MainMenu();
		this.addChild(this.mainMenuSettings)


		this.useBomb = new UIButton1(config.colors.white, "l0_nuke_1.png", config.colors.white);
		this.useBomb.resize(100, 100)
		this.bottomUINewContainer.addChild(this.useBomb)
		nuke.scale.set(0.5);
		this.useBomb.replaceIcon(nuke);
		nuke.x = -36
		nuke.y = -46
		this.useBomb.onClick.add(() => {
			if (this.currentLevelData.gameMode == 10) {
				this.onDestroyAllStartedCards();
				this.board.setFinalState();
			} else {
				this.replaceForBomb()
			}
		});
		this.useBomb.updateRotation(0);
		this.useBomb.addFrontShape()
		this.endGameScreenContainer.hide(true);

		this.shuffleButton = new UIButton1(config.colors.white, "fire-96x96-1408702.png", config.colors.white);
		this.shuffleButton.resize(100, 100)
		this.bottomUINewContainer.addChild(this.shuffleButton)
		this.shuffleButton.onClick.add(() => { this.shuffleAllLetters() });
		this.shuffleButton.visible = false;

		this.hashUsed = false;
		if (!this.hasHash) {
			this.mainmenuState();

		} else {
			setTimeout(() => {
				window.game.onTapUp();
			}, 60);
		}
		this.tutorialOverlay = new TutorialOverlay();
		this.addChild(this.tutorialOverlay);
		this.tutorialOverlay.visible = false;



		if (this.autoRedirectToLevelSelect) {
			this.autoRedirectToLevelSelect = false;
			setTimeout(() => {
				////console.log("AUTO REDIRECTH", this.autoRedirectData)
				this.mainmenuStateFromGame(false, this.autoRedirectData);
			}, 200);
		}

		window.COOKIE_MANAGER.onChangeColors.add(() => {
			this.updateColorScheme();
		})

		this.updateColorScheme();

		this.topUIContainer.x = this.gameCanvas.x
		this.topUIContainer.y = this.gameCanvas.y - 500
		this.bottomUIContainer.x = this.gameCanvas.x
		this.bottomUIContainer.y = window.innerHeight//this.gameCanvas.y + this.gameCanvas.height + 500
		this.bottomUIContainer.visible = false;
	}
	pauseGame() {
		//this.stopGameplay();
	}
	onUnPause() {
		//this.gameRunning = true;
	}
	openTutorial(id = 0) {
		this.tutorialOverlay.visible = true;
		this.tutorialOverlay.show(id)
		this.stopGameplay();

		this.colorTweenBomb.startTween(window.COOKIE_MANAGER.stats.colorPalletID)

		this.hideInGameElements();
	}
	updateColorScheme() {
		let colorScheme = colorSchemes.getCurrentColorScheme();
		this.timerRect.updateColor(colorScheme.fontColor);
		this.movesRect.updateColor(colorScheme.fontColor);
		this.scoreRect.updateTextColor(colorScheme.fontColor);
		this.movesRect.icon.tint = colorScheme.list[0].color
		this.useBomb.setColor(colorScheme.fontColor)
		this.shuffleButton.setColor(colorScheme.fontColor)

		let colorSchemeGrid = colorScheme.grid;
		this.backQueueShape.texture = PIXI.Texture.fromFrame(colorSchemeGrid.spriteRect)
		this.backQueueShape.width = CARD.width * 3 + 4
		this.backQueueShape.height = CARD.height + 4
		this.backQueueShape.x = -2
		this.backQueueShape.y = -2
		this.backQueueShape.tint = colorScheme.background;
		this.backQueueShape.alpha = 0.75;

		this.chargeBombBar.updateBackgroundColor(colorScheme.background)
		this.fallBar.updateBackgroundColor(colorScheme.background)

		this.scoreRect.addStroke(colorScheme.background, 4)

		this.chargeBombBar.readyLabel.style.stroke = colorScheme.background;
		this.chargeBombBar.readyLabel.style.strokeThickness = 4;

	}


	updateLabelsPosition() {

		let nameLevelSize = { width: this.timeLabelStatic.x - this.pointsLabel.x, height: 40 }
		nameLevelSize.width += this.timeLabelStatic.width

		this.timerRect.visible = true;

		if (this.currentLevelData.gameMode == 0) {
			this.movesRect.visible = true;
		} else {
			this.movesRect.visible = false;
		}

		this.timerRect.scale.set(this.bottomUICanvas.height / this.timerRect.backShape.height * 0.3)
		this.movesRect.scale.set(this.timerRect.scale.x)
		this.scoreRect.scale.set(this.bottomUICanvas.height / this.scoreRect.backShape.height * 0.5)
		this.chargeBombBar.scale.set(((this.bottomUICanvas.width - 20) * 0.85) / this.chargeBombBar.width * this.chargeBombBar.scale.x)
		this.fallBar.scale.set(this.scoreRect.scale.x)
		this.timerRect.x = this.bottomUICanvas.x + this.bottomUICanvas.width - this.timerRect.width - this.bottomUICanvas.height * 0.1



		// this.movesRect.x = this.bottomUICanvas.x + this.bottomUICanvas.width - this.timerRect.width - this.bottomUICanvas.height * 0.1
		// this.movesRect.y = this.bottomUICanvas.height - this.movesRect.height - this.bottomUICanvas.height * 0.1

		// this.movesRect.x = this.bottomUICanvas.x + this.bottomUICanvas.width - this.timerRect.width - this.bottomUICanvas.height * 0.1
		// this.movesRect.y = this.bottomUICanvas.height - this.movesRect.height - this.bottomUICanvas.height * 0.1


		this.scoreRect.y = this.bottomUICanvas.height * 0.5
		this.chargeBombBar.y = this.scoreRect.y - this.bottomUICanvas.height * 0.025 - this.scoreRect.height * 0.1//+ this.scoreRect.height / 2 - this.chargeBombBar.height * 0.12


		this.useBomb.scale.set(this.chargeBombBar.height / this.useBomb.height * 1.9 * this.useBomb.scale.y);

		this.chargeBombBar.x = this.bottomUICanvas.width / 2 - (this.chargeBombBar.width + this.useBomb.width + 5) / 2
		this.scoreRect.x = this.chargeBombBar.x + 10;

		//this.useBomb.scale.set((this.bottomUICanvas.width - 40) * 0.15 / this.useBomb.width * this.useBomb.scale.x);
		this.useBomb.visible = true;

		this.useBomb.x = this.chargeBombBar.x + this.chargeBombBar.width + this.useBomb.width / 2 + 5
		this.useBomb.y = this.chargeBombBar.y - this.useBomb.height / 2 + this.chargeBombBar.height

		this.shuffleButton.scale.set(this.useBomb.scale.x)
		this.shuffleButton.x = this.useBomb.x
		this.shuffleButton.y = this.useBomb.y - this.shuffleButton.height

		this.timerRect.x = this.useBomb.x - this.timerRect.width - this.useBomb.width / 2
		this.timerRect.y = this.useBomb.y - this.timerRect.height - 5
		this.scoreRect.y = this.timerRect.y

		this.movesRect.x = this.chargeBombBar.x + 8;
		this.movesRect.y = this.scoreRect.y - this.scoreRect.height

		// this.movesRect.x = this.useBomb.x //- this.useBomb.width * 0.5
		// this.movesRect.y = this.useBomb.y - 40

		this.fallBar.rotation = -Math.PI / 2;
		this.fallBar.x = this.topCanvas.x + this.gridContainer.x + this.gridContainer.width + (40 * this.scoreRect.scale.x);
		this.fallBar.y = this.gridContainer.y + this.grid.gridSprite.height - 5;
		this.fallBar.alpha = this.cardsContainer.alpha;


		if (this.gameRunning && this.cardQueue.length > 0) {


			this.shootingGun.scale.set(CARD.height / this.shootingGun.height * this.shootingGun.scale.y)
			if (this.currentCard) {
				this.shootingGun.x = this.currentCard.x
			}
			this.shootingGun.visible = false;
			this.shootingGun.y = this.trailHorizontal.y;
			this.containerQueue.visible = true;
			this.containerQueue.x = 0//this.bottomUICanvas.height * 0.1
			this.containerQueue.y = this.trailHorizontal.y + CARD.height//this.timerRect.y + 8//this.movesRect.y + this.movesRect.height - this.containerQueue.height
		} else {
			this.containerQueue.visible = false;
			this.shootingGun.visible = false;
		}

		////console.log()
		// // // // this.backButton.scale.set(this.topCanvas.height / (this.backButton.height / this.backButton.scale.y) * 0.7)// / this.backButton.scale.y)
		// // // this.backButton.x = this.topCanvas.x + this.topCanvas.width - this.backButton.width * 0.5 - this.backButton.width * 0.25;
		// // // this.backButton.y = this.backButton.height * 0.5 + this.backButton.width * 0.25

		let scaledWidth = this.inGameMenu.customWidth * this.inGameMenu.scale.x
		this.inGameMenu.scale.set(this.topCanvas.height / (this.inGameMenu.customWidth) * 0.5)// / this.inGameMenu.scale.y)
		this.inGameMenu.x = this.topCanvas.x + this.topCanvas.width - scaledWidth * 0.5 - scaledWidth * 0.5;
		this.inGameMenu.y = scaledWidth * 0.5 + scaledWidth * 0.5


		this.mainMenuSettings.scale.set(this.inGameMenu.scale.x);
		let toLoc = this.toLocal({ x: 0, y: 0 });
		this.mainMenuSettings.x = toLoc.x + this.innerResolution.width - scaledWidth;
		this.mainMenuSettings.y = toLoc.y + scaledWidth;



		//this.useBomb.scale.set(this.inGameMenu.scale.x);
		// this.useBomb.x = toLoc.x + scaledWidth;
		// this.useBomb.y = toLoc.y + scaledWidth;

	}
	hideInGameElements(delay = 0) {

		this.removeTrails();
		TweenMax.killTweensOf(this.cardsContainer);
		TweenMax.killTweensOf(this.gridContainer);

		TweenMax.to(this.cardsContainer, 0.5, { delay: delay, alpha: 0 })
		TweenMax.to(this.gridContainer, 0.5, { delay: delay, alpha: 0 })



		if (this.currentCard) {

			TweenMax.killTweensOf(this.currentCard);
			TweenMax.to(this.currentCard, 0.5, { alpha: 0 })
		}
	}

	showInGameElements() {
		TweenMax.killTweensOf(this.cardsContainer);
		TweenMax.killTweensOf(this.gridContainer);
		this.mainMenuSettings.visible = false;
		this.useBomb.visible = false;
		TweenMax.to(this.cardsContainer, 0.5, { delay: 1.25, alpha: 1 })
		TweenMax.to(this.gridContainer, 0.1, { alpha: 1 })
		if (this.currentCard) {
			TweenMax.killTweensOf(this.currentCard);
			TweenMax.to(this.currentCard, 0.1, { alpha: 1 })
		}
		this.mainMenuSettings.collapse();
	}
	mainmenuState(force = false) {
		this.removeTrails();

		//console.log("TO MAIN MENU ONE")

		window.SOUND_MANAGER.playMainMenu();
		this.endGameScreenContainer.hide(force);
		this.startScreenContainer.show(force, force ? 0.2 : 0.75);
		this.stopGameplay();
		this.mainMenuSettings.visible = true;
		this.useBomb.visible = false;
		this.startScreenContainer.showCloseButton();
		this.hideInGameElements();
		window.SOUND_MANAGER.speedUpSoundTrack(1);
		this.mainMenuSettings.collapse();
		this.removeEvents();
		this.colorTween.stopTween();



	}
	mainmenuStateFromGame(force = false, redirectData = null) {

		this.removeTrails();
		window.SOUND_MANAGER.playMainMenu();
		this.mainMenuSettings.collapse();
		this.endGameScreenContainer.hide(force);
		this.startScreenContainer.showFromGame(force, force ? 0.2 : 0.75, redirectData);
		this.stopGameplay();
		this.mainMenuSettings.visible = true;
		this.useBomb.visible = true;
		this.startScreenContainer.showCloseButton();
		this.hideInGameElements();
		window.SOUND_MANAGER.speedUpSoundTrack(1);

		this.colorTween.stopTween();
		this.removeEvents();

	}

	endGameState() {

		if (this.endGameLabel && this.endGameLabel.parent) {
			this.endGameLabel.parent.removeChild(this.endGameLabel);
		}
		this.stopGameplay();
		this.startScreenContainer.hide(true);
		let tempid = this.currentLevelID >= 0 ? this.currentLevelID : 0

		let targetPallet = this.currentLevelData.colorPalletId
		if (this.currentLevelData.customPallet && this.currentLevelData.customPallet > 0) {
			targetPallet = this.currentLevelData.customPallet;
		}

		let addPaddingOnImage = true;

		if (this.currentLevelData.splitData) {
			addPaddingOnImage = false;
		}
		let img = this.generateImage(this.currentLevelData, 24, 0, targetPallet, addPaddingOnImage);
		img = this.generateImage(this.currentLevelData, 24, 0, targetPallet, addPaddingOnImage);


		this.endGameScreenContainer.setStats(
			this.currentPoints,
			this.currentRound,
			utils.convertNumToTime(Math.ceil(this.currentTime)),
			img,
			this.currentLevelData);

		this.endGameScreenContainer.show(false, 2);
		this.hideInGameElements(2);
		this.removeEvents();
		this.mainMenuSettings.collapse();

		window.SOUND_MANAGER.speedUpSoundTrack(1);
		window.SOUND_MANAGER.play('endLevel');

		let mps = Math.ceil(this.currentTime) / this.currentRound;
		let cp = this.currentPoints / mps
		let actualScore = Math.round(this.currentPoints / this.currentRound)
		//console.log('moves per sec', mps, cp, actualScore)

		let isHighscore = window.COOKIE_MANAGER.saveLevel(
			this.currentLevelData,
			this.dataToSave.idSaveData,
			Math.ceil(this.currentTime),
			this.currentPoints,
			this.currentRound,
			actualScore,
			this.currentLevelData.totalBoardLife,
			this.currentSectionPiecesKilled)

		if (isHighscore) {
			this.endGameScreenContainer.showHighscore();
		} else {
			this.endGameScreenContainer.hideHighscore();
		}

		if (window.AUTO_PLAY_HARD) {

			if (this.currentRound < this.dataToSave.bestMoves) {
				this.dataToSave.bestMoves = this.currentRound;
			}

			if (this.currentTime < this.dataToSave.bestTime) {
				this.dataToSave.bestTime = this.currentTime;
			}

			if (this.currentPoints > this.dataToSave.bestScore) {
				this.dataToSave.bestScore = this.currentPoints;
			}

			this.dataToSave.wins++;

			if (this.dataToSave.wins > 10) {
				let toSave = this.dataToSave.levelName + "\n"
				toSave += "bestMoves :" + this.dataToSave.bestMoves + "\n"
				toSave += "bestTime :" + this.dataToSave.bestTime + "\n"
				toSave += "bestScore :" + this.dataToSave.bestScore + "\n"
				toSave += "wins :" + this.dataToSave.wins + "\n"
				toSave += "loses :" + this.dataToSave.loses + "\n"

				window.SAVE_DATA(toSave, this.dataToSave.levelName, 'text/plain');

				this.dataToSave = {
					levelName: "",
					wins: 0,
					loses: 0,
					bestTime: 999999999,
					bestMoves: 99999999,
					bestScore: 0
				}
			}

			//console.log("on Win Reset", this.currentRound, this.dataToSave)
			this.resetGame()
		}

		if (window.AUTO_PLAY) {
			window.TIME_SCALE = 1;
			window.AUTO_PLAY = false;
		}

		this.startScreenContainer.chooseLevelPanel.refreshNavButtons();
		////console.log("endGameState")
	}
	gameState() {


		this.forceResize = 3;
		setTimeout(() => {

			this.gameRunning = true;
		}, 500 / window.TIME_SCALE);

		this.currentTime = 0;
		this.showInGameElements();
		this.addEvents();
		this.endGameScreenContainer.hide();
		this.startScreenContainer.hide(true)
		this.board.startNewGame();


	}

	build() {
		super.build();

		let alphas = 0;


		this.changeLabelTimer = 0.1;

		this.background = new BackgroundEffects();
		this.addChild(this.background)

		this.gameContainer = new PIXI.Container();
		this.backFXContainer = new PIXI.Container();
		this.backGridContainer = new PIXI.Container();
		this.gridContainer = new PIXI.Container();
		this.cardsContainer = new PIXI.Container();
		this.frontGridContainer = new PIXI.Container();
		this.UIContainer = new PIXI.Container();
		this.topUIContainer = new PIXI.Container();
		this.bottomUIContainer = new PIXI.Container();

		this.topCanvas = new PIXI.Graphics().beginFill(0xFF00FF).drawRect(0, 0, 1, 1);
		this.topUIContainer.addChild(this.topCanvas);
		this.topCanvas.alpha = alphas

		this.bottomUICanvas = new PIXI.Graphics().beginFill(0x0000FF).drawRect(0, 0, 1, 1);
		this.bottomUIContainer.addChild(this.bottomUICanvas);
		this.bottomUICanvas.alpha = alphas


		this.addChild(this.gameContainer);

		this.gameContainer.addChild(this.backFXContainer);
		this.gameContainer.addChild(this.backGridContainer);
		this.gameContainer.addChild(this.gridContainer);
		this.gameContainer.addChild(this.cardsContainer);
		this.gameContainer.addChild(this.frontGridContainer);
		this.gameContainer.addChild(this.UIContainer);
		this.gameContainer.addChild(this.topUIContainer);
		this.gameContainer.addChild(this.bottomUIContainer);

		this.bottomUIContainer.y = config.height


		this.gameCanvas = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, 1, 1);
		this.addChild(this.gameCanvas);
		this.gameCanvas.alpha = alphas


		this.mousePosID = GRID.i / 2;

		this.grid.createGrid();
		this.gridContainer.addChild(this.grid);
		utils.centerObject(this.gridContainer, this.background.background);
		this.gridContainer.x = this.innerResolution.width / 2 - ((GRID.i + 1) * CARD.width) / 2// - this.gridContainer.width / 2;
		// this.gridContainer.y -= CARD.height;

		this.buildUI();

		this.cardsContainer.x = this.gridContainer.x;
		this.cardsContainer.y = this.gridContainer.y;

		this.buildTrails();

		this.initGridY = this.gridContainer.y;
		this.initGridAcc = 0;


		let tempPosRandom = []
		for (var i = 0; i < GRID.i; i++) {
			tempPosRandom.push(i);
		}
		//utils.shuffle(tempPosRandom);

		this.fxContainer = new FXContainer(this.backFXContainer);
		this.gameContainer.addChild(this.fxContainer);


		this.popUpOverlay = new PopUpOverlay();
		this.addChild(this.popUpOverlay);
		//this.popUpOverlay.show({text:'this is a test of the modal'})

		window.popUpOverlay = this.popUpOverlay;


		window.COOKIE_MANAGER.onToggleDebug.add(() => { this.toggleDebug() });


		this.debugLabel = new PIXI.Text("DEBUG", { font: '14px', fill: 0xFFFFFF, align: 'right', fontWeight: '300', fontFamily: window.STANDARD_FONT1 });
		this.toggleDebug();
		this.addChild(this.debugLabel)


	}
	toggleDebug() {
		let debugThumb = window.COOKIE_MANAGER.debug.showAllThumbs;

		if (debugThumb) {
			this.debugLabel.visible = false
			this.debugLabel.text = (
				'Normal: ~' + utils.convertNumToTime(Math.ceil(window.allEstimate)) +
				' Hard: ~' + utils.convertNumToTime(Math.ceil(window.allEstimateHard)) +
				' Total: ~' + utils.convertNumToTime(Math.ceil(window.allEstimate + window.allEstimateHard))
			);

		} else {
			this.debugLabel.visible = false;
		}
	}
	removeTrails() {
		if (this.trailMarker && this.trailMarker.parent) {
			this.trailMarker.parent.removeChild(this.trailMarker);
		}

		if (this.trailHorizontal && this.trailHorizontal.parent) {
			this.trailHorizontal.parent.removeChild(this.trailHorizontal);
		}
	}
	buildTrails() {

		this.removeTrails();

		let scheme = colorSchemes.getCurrentColorScheme().grid;

		let temp = new PIXI.Sprite.fromFrame(scheme.spriteTrail);

		let scl = 1;
		scl = (temp.width / GRID.width) * this.cardsContainer.scale.x

		//this.trailMarker = new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(0, 0, CARD.width, GRID.height, 10);
		this.trailMarker = new PIXI.Container()
		// new PIXI.mesh.NineSlicePlane(
		// 	PIXI.Texture.fromFrame(scheme.spriteTrail), 20, 20, 20, 20)

		this.trailMarker.positionSpringX = new Spring();
		this.trailMarker.positionSpringX.springiness = 0.3;
		this.trailMarker.positionSpringX.damp = 0.8;
		this.frontGridContainer.addChild(this.trailMarker);
		this.trailMarker.alpha = 0;


		//this.trailHorizontal = new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(0, 0, GRID.width, CARD.height, 10);
		this.trailHorizontal = new PIXI.mesh.NineSlicePlane(
			PIXI.Texture.fromFrame(scheme.spriteTrail), 20, 20, 20, 20)


		if (scheme.scaleTrail) {
			this.trailHorizontal.width = GRID.width / scl;
			this.trailHorizontal.height = CARD.height / scl;
			this.trailHorizontal.scale.set(scl);

			this.trailMarker.width = CARD.width / scl;
			this.trailMarker.height = (GRID.height + CARD.height) / scl;
			this.trailMarker.scale.set(scl);
		} else {

			this.trailHorizontal.width = GRID.width
			this.trailHorizontal.height = CARD.height
			this.trailMarker.width = CARD.width
			this.trailMarker.height = GRID.height + CARD.height
		}


		this.trailMarker.overShape = new PIXI.mesh.NineSlicePlane(
			PIXI.Texture.fromFrame(scheme.spriteTrail), 20, 20, 20, 20)

		this.trailMarker.addChild(this.trailMarker.overShape)




		this.trailMarker.overShape.width = CARD.width //* 0.75
		this.trailMarker.overShape.height = GRID.height + CARD.height
		this.trailMarker.overShape.x = CARD.width / 2 - this.trailMarker.overShape.width / 2
		this.trailMarker.overShape.margin = CARD.width - this.trailMarker.overShape.width;
		this.trailMarker.overShape.y = this.grid.backgroundOffset.y / 4

		this.trailMarker.arrowsUp = new PIXI.extras.TilingSprite(PIXI.Texture.fromImage('./assets/images/arrowsUp.png'), 128, 128)
		this.trailMarker.addChild(this.trailMarker.arrowsUp);

		this.frontGridContainer.addChild(this.trailHorizontal);
		this.trailHorizontal.alpha = 0;

		let colorScheme = colorSchemes.getCurrentColorScheme();
		this.trailMarker.arrowsUp.tint = colorScheme.arrowTrailColor;

		this.frontGridContainer.addChild(this.shootingGun)

		this.trailHorizontal.hitArea = new PIXI.Rectangle(this.trailHorizontal.x, this.trailHorizontal.y, this.trailHorizontal.width, this.trailHorizontal.height * 5);



	}
	shuffleAllLetters() {
		this.board.allCards.forEach(element => {
			if (element.addLetter) {
				element.addLetter(window.scrabbleManager.getRandomLetter());
			}
		});
	}
	replaceForBomb() {

		if (!this.currentCard) {
			return;
		}
		let wasMute = SOUND_MANAGER.isMute



		let data = { text: 'Would you like to watch a video and get a Nuke' }

		if (window.DISABLE_POKI) {
			data = { text: 'Would you like to activate the Nuke?' }
		}

		window.popUpOverlay.show(data, () => {
			if (window.DISABLE_POKI) {
				this.replaceForBombAfterBreak();
			} else {

				if (!wasMute) {
					SOUND_MANAGER.mute();
				}
				window.GAMEPLAY_STOP();
				PokiSDK.rewardedBreak().then(
					(success) => {
						if (success) {
							window.GAMEPLAY_START()
							this.replaceForBombAfterBreak();
							if (!wasMute) {
								SOUND_MANAGER.toggleMute();
							}
						} else {
							if (!wasMute) {
								SOUND_MANAGER.toggleMute();
							}
							this.replaceForBombAfterBreak();
						}
					}

				)
			}

		})


	}

	replaceForBombAfterBreak() {
		this.currentCard.isABomb();
		this.chargeBombBar.currentChargeValue = 0;
		this.chargeBombBar.setProgressBar2(0)

	}
	startNewLevel(data, isEasy) {
		this.currentLevelData = data;
		this.startScreenContainer.newLevelStarted();
		this.updateGridDimensions();
		this.gridContainer.x = config.width / 2 - ((GRID.i + 1) * CARD.width) / 2;
		this.cardsContainer.x = this.gridContainer.x;
		this.cardsContainer.y = this.gridContainer.y;
		this.resetGame();
		if (isEasy) {
			this.board.addCrazyCards2(GRID.i * GRID.j);
		}
	}
	playNextLevel() {
		if (this.currentLevelData.next) {
			this.startNewLevel(this.currentLevelData.next)
		} else {
			this.resetGame()
		}
	}
	spawnFireworks() {

		let w = this.innerResolution.width * 0.2;
		if (Math.random() < 1) {

			this.fxContainer.toLocal({ x: this.innerResolution.width / 2, y: this.innerResolution.height })

			let posX = this.bottomUIContainer.x + this.bottomUIContainer.width * Math.random()
			let dir = (posX < this.bottomUIContainer.x + this.bottomUIContainer.width / 2) ? 1 : -1
			this.fxContainer.startFireworks(
				{ x: posX, y: this.bottomUIContainer.y },
				Math.random() * this.innerResolution.width * 0.1 * dir, this.colorTween.currentColor)
		} else {
			this.fxContainer.startFireworks(
				this.toLocal({ x: Math.random() * this.innerResolution.width + this.innerResolution.width * 0.8, y: this.innerResolution.height }),
				Math.random() * -this.innerResolution.width * 0.1, this.colorTween.currentColor)

		}

		if (Math.random() < 0.5) {
			window.SOUND_MANAGER.play('fireworks', { volume: 0.005 + Math.random() * 0.01, speed: Math.random() * 0.3 + 0.6 })
		}
		this.fireworksTimer = Math.random() * 0.25 + 0.25
	}
	forceBottomArrow() {
		let toReturn = [[4, 5, 6], [4, 5, 6], [5, 6], [4, 6], [4, 5]];
		return toReturn[Math.floor(Math.random() * toReturn.length)];
	}
	resetGame() {

		//console.log(this.currentLevelData)


		// if (this.hasHash) {
		// 	this.currentLevelData.pieces = utils.scaleLevel(this.currentLevelData.pieces, 2, true)
		// 	this.updateGridDimensions();
		// 	utils.addBlockers(this.currentLevelData.pieces, 2, 19, true)
		// }
		//this.chargeBombBar.visible = true;
		this.updateColorScheme()
		this.bottomUIContainer.visible = true;
		this.chargeBombBar.sin = 0;
		this.chargeBombBar.scaleOffset = { x: 0, y: 0 };
		this.offsetCard = { x: 0, y: 0 }

		if (this.currentCard && this.currentCard.parent) {
			this.currentCard.parent.removeChild(this.currentCard)
		}

		this.topUIContainer.y = this.gameCanvas.y - 500
		this.bottomUIContainer.y = this.gameCanvas.y + this.gameCanvas.height - this.bottomUICanvas.height + 500


		this.chargeBombBar.setProgressBar2(0)
		this.chargeBombBar.currentChargeValue = 0;
		this.fallBar.setProgressBar2(0)
		this.fallBar.currentChargeValue = 0;

		this.blockGameTimer = 0;
		this.currentSectionPiecesKilled = 0;
		this.isFinalState = false;
		this.isFirstClick = true;

		let targetPallet = this.currentLevelData.colorPalletId
		if (this.currentLevelData.customPallet && this.currentLevelData.customPallet > 0) {
			targetPallet = this.currentLevelData.customPallet;
		}


		if (this.hasHash) {
			//console.log(this.currentLevelData)
			window.COOKIE_MANAGER.updateColorPallete(targetPallet);
		}
		//window.COOKIE_MANAGER.stats.latestColorPallete
		if (this.currentLevelData.colorPalletId != undefined)
			window.COOKIE_MANAGER.updateColorPallete(targetPallet);
		let scheme = targetPallet;

		//scheme = scheme == undefined ? 0 : scheme

		window.ENEMIES = colorSchemes.colorSchemes[scheme];

		this.background.updateColors(colorSchemes.colorSchemes[scheme].list)

		this.colorTweenBomb.startTween(targetPallet)

		this.fireworksTimer = 0;
		this.mainMenuSettings.collapse();

		this.grid.createGrid(this.currentLevelData);

		this.gameplayState = 0;
		this.cardQueueData = {
			latest: -1,
			counter: 0
		}

		for (let index = this.cardsContainer.children.length - 1; index >= 0; index--) {
			this.cardsContainer.removeChildAt(0);
		}


		this.gameState();
		if (this.currentLevelID < 0) {
			this.currentLevelID = 0;
		}
		this.currentTime = 0;
		this.currentPoints = 0;
		this.currentPointsLabel = 0;
		this.currentRound = 0;

		this.board.newGameFinished = true;
		this.board.destroyBoard();
		this.board.resetBoard();

		this.isTouchingDown = false;
		for (var i = this.cardQueue.length - 1; i >= 0; i--) {
			this.cardQueue[i].forceDestroy();
		}
		this.cardQueue = []
		if (this.currentCard) {

			if (this.currentCard.parent) {
				this.currentCard.parent.removeChild(this.currentCard);
			}
			this.currentCard.forceDestroy();
		}

		this.currentCard = null;

		this.dataToSave.levelName = this.currentLevelData.levelName;
		this.dataToSave.idSaveData = this.currentLevelData.idSaveData;

		let lastRow = [];

		let rows = [];

		//console.log(this.currentLevelData.pieces)

		if (this.currentLevelData.gameMode == 1 || this.currentLevelData.gameMode == 3) {
			for (let i = 0; i < GRID.i; i++) {
				for (let j = 0; j < GRID.j; j++) {
					lastRow.push({ j: i, i: j })
				}

			}
		} else {

			for (let index = 0; index < GRID.i; index++) {
				rows.push(-1);
			}

			for (let index = 0; index < rows.length; index++) {
				for (let line = GRID.j - 1; line >= 0; line--) {

					if (this.currentLevelData.pieces[line][index] >= 0 && rows[index] < 0) {
						rows[index] = line
					}
				}

			}
			for (let index = 0; index < rows.length; index++) {
				const element = rows[index];
				if (element > 0) {
					lastRow.push({ j: index, i: element })
				}

			}
		}


		let hasAddon = false;
		let countAdd = 0;
		this.specialCardsOnGrid = {
			cards: [],
			timer: 1,
			current: 0,
			timesShown: 0
		};

		for (var i = 0; i < this.currentLevelData.addOn.length; i++) {
			for (var j = 0; j < this.currentLevelData.addOn[i].length; j++) {
				let id = this.currentLevelData.addOn[i][j];
				if (id == 32) {
					hasAddon = true;
					countAdd++;
				} else if (id >= 33) {
					hasAddon = true;
				}
			}
		}
		if (hasAddon && !this.currentLevelData.addOnDirty) {
			//utils.trimMatrix(this.currentLevelData.addOn)
			let pad = { left: -this.currentLevelData.offset.left, top: -this.currentLevelData.offset.top, right: 0, bottom: 0 }
			utils.paddingMatrix(this.currentLevelData.addOn, pad)

			this.currentLevelData.addOnDirty = true;
		}

		let cardsCound = 0;
		for (var i = 0; i < this.currentLevelData.pieces.length; i++) {
			for (var j = 0; j < this.currentLevelData.pieces[i].length; j++) {
				if (this.currentLevelData.pieces[i][j] >= 0) {
					//console.log("block",this.currentLevelData.pieces[i][j], window.ENEMIES.block.id)
					//if (this.currentLevelData.pieces[i][j] == window.ENEMIES.block.id) {
					if (this.currentLevelData.pieces[i][j] == window.ENEMIES.block.id) {
						this.cardsContainer.addChild(this.placeBlock(j, i, false));
					} else if (hasAddon && this.specialCardsManager.isBlock(this.currentLevelData.addOn[i][j])) {
						this.cardsContainer.addChild(this.placeBlock(j, i));
					} else {
						let customData = null;
						//if theres a piece on last row, force arrows to point down
						lastRow.forEach(lastRow => {
							if (lastRow.i == i && lastRow.j == j) {
								customData = {
									order: this.forceBottomArrow()
								}
							}
						});

						if (hasAddon && this.currentLevelData.addOn[i][j] == 33) {
							//dont add if the addon remove
						} else {
							let card = this.placeCard(j, i, ENEMIES.list[this.currentLevelData.pieces[i][j]], customData, this.currentLevelData.pieces[i][j])
							this.cardsContainer.addChild(card);
							cardsCound++;
							if (this.currentLevelData.gameMode == 0) {
								this.grid.paintTile(card)
							}
							if (this.currentLevelData.gameMode == 10) {
								card.removeActionZones();

								if (cardsCound % 2 == 0) {

									card.addLetter(window.scrabbleManager.getVowel(cardsCound > 10 ? 0 : 1.5));
								} else {

									card.addLetter(window.scrabbleManager.getConsonant(cardsCound > 10 ? 0 : 1.5));
								}
								//	card.addLetter(window.scrabbleManager.getRandomLetter(cardsCound > 10 ? 0 : 1.5));
								//this.grid.paintTile(card)

							}
							if (hasAddon && this.currentLevelData.addOn[i][j] >= 32) {

								this.specialCardsManager.sortCardEffect(card, this.currentLevelData.addOn[i][j])
								//card.startCrazyMood();
								if (card.popUpMessage) {
									this.specialCardsOnGrid.cards.push(card);
								}
							}
						}
					}
				} else if (this.currentLevelData.pieces[i][j] == -2) {
					this.cardsContainer.addChild(this.placeBlock(j, i));
				}
			}
		}

		this.board.postProcessAddons();

		this.currentPoints = 0;
		this.currentPointsLabel = 0;
		this.currentRound = 0;

		// this.board.debugBoard();

		if (this.specialCardsOnGrid.cards.length) {
			utils.shuffle(this.specialCardsOnGrid.cards)
		}

		//console.log(this.specialCardsOnGrid)

		if (hasAddon) {
			setTimeout(() => {
				this.OnStartNextRound(null, true);
			}, Math.min(1500, 1200 + countAdd * 100));
		} else {
			setTimeout(() => {
				this.OnStartNextRound(null, true);
			}, 1200);
		}

		this.cardsContainer.alpha = 0;
		TweenMax.to(this.cardsContainer, 0.5, { delay: 2, alpha: 1 })
		TweenMax.to(this.gridContainer, 0.1, { alpha: 1, onComplete: () => { this.gameState() } })
		//TweenMax.to(this.UIInGame, 0.75, { y: 0, ease: Cubic.easeOut, onComplete: () => { this.gameState() } })

		this.startScreenContainer.hide();



		this.mousePosition = new PIXI.Point()

		let toGrid = this.gridContainer.toLocal(this.innerResolution.width / 2)
		this.mousePosID = Math.floor((toGrid.x) / CARD.width);

		this.latestShoot.id = Math.floor(GRID.i / 2);
		this.latestShoot.x = this.latestShoot.id * CARD.width


		this.colorTween.stopTween();

		this.buildTrails();
		//this.currentButtonLabel = 'RESET';
		//window.SOUND_MANAGER.volume('main-soundtrack', 1)

		window.SOUND_MANAGER.playInGame();
		window.SOUND_MANAGER.play('startLevel');

		//console.log(this.currentLevelData)

		if (this.currentLevelData.gameMode == 1 || this.currentLevelData.gameMode == 3) {
			this.fallBar.visible = true;

			this.fallBar.icon.tintLayer(0, colorSchemes.colorSchemes[scheme].list[0].color)
		} else {
			this.fallBar.visible = false;
		}

		window.GAMEPLAY_START()

	}
	setAddons() {

	}
	updateUI() {
		this.pointsLabel.text = utils.formatPointsLabel(Math.ceil(this.currentPointsLabel));
		this.roundsLabel.text = utils.formatPointsLabel(Math.ceil(this.currentRound));
		this.entitiesLabel.text = utils.formatPointsLabel(Math.ceil(this.board.totalCards));
		this.timeLabel.text = utils.convertNumToTime(Math.ceil(this.currentTime));



		this.timerRect.updateLavel(utils.convertNumToTime(Math.ceil(this.currentTime)))
		this.movesRect.updateLavel(this.grid.cardsStartedOnGrid, '', false, { x: -15, y: 0 })


		this.scoreRect.updateLavel(Math.ceil(this.currentPointsLabel), '', false, { x: -15, y: -8 })

	}
	addRandomPiece() {
	}
	addPoints(points) {
		this.currentPoints += points;
		this.chargeBombBar.currentChargeValue += points;

		let targetBar = Math.min(1, this.chargeBombBar.currentChargeValue / this.chargeBombBar.maxValue)

		//this.useBomb.visible = targetBar >= 1;
		this.chargeBombBar.setProgressBar2(targetBar)

		TweenMax.to(this, 0.2, {
			currentPointsLabel: this.currentPoints, onUpdate: function () {
				this.currentPointsLabel = Math.ceil(this.currentPointsLabel);
				this.updateUI();
			}.bind(this)
		});

	}

	updateQueue() {

		while (this.cardQueue.length < this.cardQueueSize) {
			let card;
			if (CARD_POOL.length) {
				card = CARD_POOL[0];
				CARD_POOL.shift();
			} else {
				card = new Card(this);
			}

			let nextLife = Math.random() < 1 - (this.currentRound % 3) * 0.17 ? 0 : Math.random() < 0.5 ? 2 : 1;
			let totalSides = Math.floor(Math.random() * ACTION_ZONES.length * 0.4) + 1;

			//try again to add more sides if is one
			if (totalSides <= 1) {
				totalSides = Math.floor(Math.random() * ACTION_ZONES.length * 0.4) + 1;
			}
			//console.log(nextLife,this.cardQueueData.counter)
			if (nextLife > 0) {
				if (this.cardQueueData.counter <= 0) {
					//change frequecy of high level cards
					this.cardQueueData.counter = 2 + Math.floor(Math.random() * 2)

					if (this.currentLevelData.gameMode != 0) {
						this.cardQueueData.counter += 3;
					}

					if (Math.random() < 0.1) {
						nextLife++;
					}
				} else {
					nextLife = 0;
				}
			}

			if (this.gameplayState == 1) {
				nextLife = 0;
				totalSides++;
			}

			if (this.cardQueueData.counter > 0) {
				this.cardQueueData.counter--;
			}


			card.life = nextLife;
			card.createCard(totalSides);


			//add extra up zones if life is more than 0
			if (nextLife > 0) {
				let extraZones = [[0], [1], [2], [0], [1], [2], [0, 1, 2]]
				card.addExtraZone(extraZones[Math.floor(Math.random() * extraZones.length)]);
			}
			card.updateSprite(card.life);

			card.type = 0;
			card.x = 0;
			this.containerQueue.addChild(card);
			this.cardQueue.push(card);
			card.setOnQueue();
			if (this.currentLevelData.gameMode == 10) {
				if (this.isFinalState) {
					card.isBomb = true;
				} else {
					card.removeActionZones();
				}
				card.addLetter(window.scrabbleManager.getRandomLetter());
			}
		}
		// for (var i = this.cardQueue.length - 1; i >= 0; i--) {
		for (var i = 0; i < this.cardQueue.length; i++) {
			TweenMax.to(this.cardQueue[i], 0.3, { x: CARD.width * (this.cardQueue.length - i - 1), ease: Back.easeOut })
			this.cardQueue[i].y = 0
			this.cardQueue[i].update(1 / 60)
			// this.cardQueue[i].y = ;
		}

		this.cardQueue[1].mark();
		this.cardQueue[1].update(1 / 60)

	}
	stopGameplay() {
		this.gameRunning = false;
		window.GAMEPLAY_STOP();
	}
	OnWin(card) {
		if (!this.gameRunning) {
			return;
		}
		this.stopGameplay();
		window.GAMEPLAY_STOP();
		this.board.removeAllStates();
		this.board.destroyAllCards();
		this.endGameState();
	}
	OnGameOver() {
		if (!this.gameRunning) {
			return;
		}
		this.stopGameplay();

		setTimeout(() => {
			let data = { text: 'Game Over, would you like to try again?' }
			window.popUpOverlay.show(data, () => {
				this.resetGame();
			}, () => {
				this.mainmenuStateFromGame(false);
			}, true)
		}, 750);
	}
	OnStartNextRound(card, first = false) {
		if (!this.gameRunning) {
			return;
		}
		this.newRound(first);
	}
	newRound(first = false) {

		//gamemode: 0 - standard
		//gamemode: 1 - fallpieces
		//gamemode: 2 - no tiles
		//gamemode: 3 - move limit
		//gamemode: 10 - letters
		//console.log("newRound", first);
		if (this.currentLevelData.gameMode == 0 || this.currentLevelData.gameMode == 2 || this.currentLevelData.gameMode == 10) {
			if (first) {
				this.getNextPieceRound(first);
			} else {

				if (this.board.updateCounters(1)) {
					setTimeout(() => {
						this.getNextPieceRound();
					}, 1100);
				} else {
					if (this.currentLevelData.gameMode == 10) {
						let quant = this.board.stickAllToTop();
						if (quant <= 0) {
							this.getNextPieceRound();
						} else {
							setTimeout(() => {
								this.getNextPieceRound();
							}, 500);
						}
					} else {

						this.getNextPieceRound();
					}
				}
			}
		} else if (this.currentLevelData.gameMode == 1 || this.currentLevelData.gameMode == 3) {
			if (first) {
				this.getNextPieceRound();
			} else {

				let t = this.currentRound % this.currentLevelData.fallTurns
				let turnN = t / this.currentLevelData.fallTurns

				this.fallBar.setProgressBar2(turnN)


				if (this.currentRound > 0 && this.currentRound % this.currentLevelData.fallTurns == 0) {

					if (this.currentLevelData.gameMode == 3) {
						this.fallBar.setProgressBar2(1);
						this.OnGameOver();

					} else {

						this.board.moveCardsDown();

						this.fallBar.setProgressBar2(1);
						setTimeout(() => {
							this.fallBar.setProgressBar2(0.01);
						}, 500);
						for (let index = 0; index < GRID.i; index++) {

							let card = this.placeCard(index, 0, ENEMIES.list[Math.floor(Math.random() * 2)])

							TweenMax.from(card.scale, 0.2, { x: 0, y: 0, ease: Back.easeOut, delay: index / GRID.i * 0.5 })

							this.cardsContainer.addChild(card);
						}
						setTimeout(() => {
							this.getNextPieceRound();
						}, 1000);
					}
				} else {
					this.getNextPieceRound();
				}
			}
		}
	}
	applyFinalState() {
		if (this.currentLevelData.gameMode == 10) {
			if (this.isFinalState) {
				this.currentCard.isBomb = true;
			}
		}
	}
	getNextPieceRound(first = false) {
		if (!this.gameRunning) {
			return;
		}
		let isBombPossible = (this.chargeBombBar.currentChargeValue / this.chargeBombBar.maxValue) >= 1

		if (!isBombPossible) {
			if (!first && this.board.findOutGameOver()) {
				return;
			}
		}
		this.blockGameTimer = 0.2;
		this.updateQueue();
		this.currentCard = this.cardQueue[0];

		this.applyFinalState();


		this.cardQueue.shift();
		this.mousePosID = this.latestShoot.id
		this.currentCard.x = this.latestShoot.x
		this.currentCard.scale.set(1)
		this.currentCard.alpha = 0;
		this.currentCard.updateCard(true);
		this.currentCard.visible = false;

		TweenMax.killTweensOf(this.offsetCard)
		TweenMax.killTweensOf(this.currentCard)
		setTimeout(() => {
			this.offsetCard.y = CARD.height * 3;
			if (this.currentCard) {

				this.currentCard.visible = true;
				TweenMax.to(this.offsetCard, 0.3, { y: 0, ease: Back.easeOut })
				TweenMax.to(this.currentCard, 0.3, { delay: 0.1, alpha: 1, y: this.grid.gridSprite.height + 20 })
			}
			this.frontGridContainer.addChild(this.currentCard);
		}, 150);


		this.firstLineShots = this.board.firstLineShots();


		if (first) {
			this.trailMarker.positionSpringX.x = this.currentCard.x;
			this.trailMarker.positionSpringX.tx = this.currentCard.x;
			this.updateTrailsPosition(true);
		}
		//this.board.findOutGameOver();

		if (!first) {

			// setTimeout(() => {
			// 	this.board.findOutGameOver();
			// }, 500);
		} else {

		}

		// if (this.firstLineShots == 0) {
		// 	//this.currentCard.isABomb();
		// 	//console.log("No moves")
		// 	this.OnGameOver();
		// }

		if (this.autoPlayTimeout) {
			clearTimeout(this.autoPlayTimeout);
		}
		//FIND BEST OPTION TO SHOOT
		if (window.AUTO_PLAY_HARD || window.AUTO_PLAY) {
			this.autoPlayTimeout = setTimeout(() => {
				this.playRandom();
			}, 500 / window.TIME_SCALE);
		}
	}
	playRandom() {
		this.mousePosID = this.board.findBestShoot(this.currentCard);
		if (this.mousePosID == -1 || this.currentRound > 1500) {

			this.dataToSave.loses++;
			this.resetGame();
			window.AUTO_PLAY = false;
		} else {
			this.onTapUp(null, this.mousePosID)
		}
	}
	placeCard(i, j, data, customData = {}, cardID = 0) {
		let card;
		if (CARD_POOL.length) {
			card = CARD_POOL[0];
			CARD_POOL.shift();
		} else {
			card = new Card(this);
		}

		//console.log(data)
		card.life = data.life;
		card.createCard(0, customData);

		card.updateSprite(data.life, data, cardID);
		card.x = i * CARD.width;
		card.y = j * CARD.height - CARD.height;
		// card.cardContainer.scale.set(1.2 - j * 0.05)
		TweenMax.killTweensOf(card);
		card.alpha = 1;
		card.y = j * CARD.height;
		//TweenMax.to(card, 0.5, { alpha: 1, delay: i * 0.05 + 1,ease: Back.easeOut })
		//TweenMax.to(card, 0.5, { alpha: 1, delay: Math.random() + 1,ease: Back.easeOut })

		//card.show(0.5, i * 0.05 + 0.75)

		card.pos.i = i;
		card.pos.j = j;
		card.updateCard(false, data);
		this.board.addCard(card);

		// this.CARD_POOL.push(card);
		return card;
	}

	placeBlock(i, j, visible = true) {
		//console.log("BLOCK")
		let block;
		block = new Block(this);
		block.x = i * CARD.width;
		block.y = j * CARD.height - CARD.height;
		block.alpha = 0;
		block.y = j * CARD.height
		TweenMax.to(block, 0.5, { alpha: 1, delay: i * 0.05 + 1, ease: Back.easeOut })
		block.pos.i = i;
		block.pos.j = j;
		block.visible = visible;
		this.board.addCard(block);
		return block;
	}

	update(delta) {
		this.mouseDirty = false;
		this.background.update(delta)
		this.grid.update(delta)
		this.startScreenContainer.update(delta)
		this.endGameScreenContainer.update(delta)
		this.inGameMenu.update(delta)
		this.mainMenuSettings.update(delta)
		this.fxContainer.update(delta)
		this.popLabel.update(delta)

		if (this.debugCardsContainer) {
			for (let index = 0; index < this.debugCardsContainer.children.length; index++) {
				const element = this.debugCardsContainer.children[index];
				if (element.update) {
					element.update(delta);
				}
			}
		}

		if (this.tutorialOverlay.visible) {
			this.tutorialOverlay.update(delta);
		}


		if (this.blockGameTimer > 0) {
			this.blockGameTimer -= delta;
		}
		///sort hash when load
		if (this.hasHash && !this.hashUsed) {

			if (this.currentLevelID < 0) {
				this.endGameState();
			} else {
				this.resetGame();
			}

			this.hashUsed = true;
		}
		// if (this.fireworksTimer <= 0) {
		// 	this.spawnFireworks();
		// } else {
		// 	this.fireworksTimer -= delta;
		// }
		if (this.colorTween.isActive) {
			if (this.fireworksTimer <= 0) {
				this.spawnFireworks();
			} else {
				this.fireworksTimer -= delta;
			}
			if (this.endGameLabel) {
				this.endGameLabel.tint = this.colorTween.currentColor;
			}

			if (this.endGameLabel.fallData.timeToFall > 0) {
				this.endGameLabel.fallData.timeToFall -= delta;
			} else if (this.endGameLabel.parent) {
				this.endGameLabel.x += this.endGameLabel.fallData.velocity.x * delta;
				this.endGameLabel.y += this.endGameLabel.fallData.velocity.y * delta;

				this.endGameLabel.fallData.velocity.y += this.endGameLabel.fallData.gravity * delta;
				this.endGameLabel.rotation += this.endGameLabel.fallData.angularVelocity * delta

				if (this.endGameLabel.fallData.timeToDie > 0) {
					this.endGameLabel.fallData.timeToDie -= delta;
					if (this.endGameLabel.fallData.timeToDie <= 0) {
						if (this.endGameLabel.parent) {
							this.endGameLabel.parent.removeChild(this.endGameLabel);
						}
					}
				}

			}
			this.board.updateAllCardsColors(this.colorTween.currentColor)
			if (this.currentCard) {
				this.currentCard.forceNewColor(this.colorTween.currentColor);
			} else {
				this.trailHorizontal.tint = this.colorTween.currentColor;
				this.trailMarker.arrowsUp.tint = this.trailHorizontal.tint;
			}
			this.cardQueue.forEach(element => {
				element.forceNewColor(this.colorTween.currentColor)
			});
		}

		if (!this.gameRunning) {
			this.topUIContainer.x = this.gameCanvas.x
			this.topUIContainer.y = utils.lerp(this.topUIContainer.y, this.gameCanvas.y - 500, 0.01)
			this.bottomUIContainer.x = this.gameCanvas.x
			this.bottomUIContainer.y = utils.lerp(this.bottomUIContainer.y, this.gameCanvas.y + this.gameCanvas.height - this.bottomUICanvas.height + 500, 0.01)

			if (this.currentCard) {
				this.currentCard.alpha = utils.lerp(this.currentCard.alpha, 0, 0.5)
			}
			this.popLabel.visible = false;
			return;
		}

		if (this.currentLevelData.gameMode == 10) {
			if (window.scrabbleManager) {
				window.scrabbleManager.update(delta);
			}
			this.shuffleButton.visible = true;
		} else {
			this.shuffleButton.visible = false;
		}
		this.popLabel.visible = true;

		let targetBar = Math.min(1, this.chargeBombBar.currentChargeValue / this.chargeBombBar.maxValue)
		// this.useBomb.visible = targetBar >= 1;
		for (let index = 0; index < this.cardQueue.length; index++) {
			const element = this.cardQueue[index];
			element.update(delta)
		}
		if (this.fallBar.visible) {
			this.fallBar.icon.update(delta)
		}
		if (this.chargeBombBar.visible) {

			if (!this.GAMBS) {
				this.GAMBS = true
				
			}
			if (targetBar >= 1) {
				this.chargeBombBar.icon.update(delta)
				this.chargeBombBar.icon.alpha = 1

				this.chargeBombBar.readyLabel.visible = true;
				//this.chargeBombBar.icon.tintLayer(0, this.colorTweenBomb.currentColor)
				this.useBomb.backShape.tint = this.colorTweenBomb.currentColor
				this.useBomb.backShapeBorder.tint = this.colorTweenBomb.currentColor

				if (!this.useBomb.interactive) {

					SOUND_MANAGER.play('magic')
					this.popLabel.popLabel({
						textBoxOffset: { x: -0.7, y: -2 },
						text: "I'm READY!",
						callback: null,
						target: this.useBomb,
						centerBox: { x: 1, y: 0 },
						delay: 0,
						autoHide: 8000,
						ingame: true
					});
				}

				this.useBomb.interactive = true
			} else {
				if(this.useBomb.interactive){
					let colorScheme = colorSchemes.getCurrentColorScheme();
					this.useBomb.setColor(colorScheme.fontColor)

					this.useBomb.backShapeBorder.tint = this.useBomb.backShape.tint;
				}

				this.chargeBombBar.readyLabel.visible = false;
				this.chargeBombBar.icon.alpha = 0.75
				this.useBomb.interactive = false
				this.chargeBombBar.icon.tintLayer(0, 0xDDDDDD)
			}
		}

		if (this.currentCard) {
			this.currentCard.update(delta)
			this.trailHorizontal.y = this.currentCard.y - this.offsetCard.y;

			this.containerQueue.y = this.trailHorizontal.y
			//console.log(this.trailHorizontal)
			this.trailHorizontal.tint = this.currentCard.currentColor;

			if (this.specialCardsOnGrid.cards.length && this.specialCardsOnGrid.timesShown <= 2) {
				if (this.specialCardsOnGrid.timer > 0) {
					this.specialCardsOnGrid.timer -= delta;
					if (this.specialCardsOnGrid.current >= this.specialCardsOnGrid.cards.length) {
						this.specialCardsOnGrid.current = 0;
						utils.shuffle(this.specialCardsOnGrid.cards);

						this.specialCardsOnGrid.timesShown++;
					}
					let targetCard = this.specialCardsOnGrid.cards[this.specialCardsOnGrid.current]
					if (this.specialCardsOnGrid.timer <= 0) {
						this.popLabel.popLabel({
							textBoxOffset: { x: 0, y: -1.1 },
							text: targetCard.popUpMessage,
							callback: null,
							target: targetCard,
							centerBox: { x: 0.5, y: 0 },
							delay: 0,
							autoHide: 4000,
							ingame: true
						});

						this.specialCardsOnGrid.current++;

						this.specialCardsOnGrid.timer = 10 + Math.random() * 10 + this.specialCardsOnGrid.timesShown * 5
					}
				}
			}

		}
		this.trailMarker.arrowsUp.tint = this.trailHorizontal.tint;

		// if(this.cardQueue){
		// 	this.cardQueue.forEach(element => {
		// 		element.update(delta);
		// 	});
		// }
		////console.log(this.mousePosition)
		this.currentTime += delta * window.TIME_SCALE * window.TIME_SCALE;

		if (!this.board.newGameFinished && this.board.totalCards <= 0) {
			this.endGameState();
			this.stopGameplay();
			return;
		}




		if (renderer.plugins.interaction.mouse.global) {
			this.mousePosition = renderer.plugins.interaction.mouse.global;

			let toGrid = this.gridContainer.toLocal(this.mousePosition)
			this.mousePosID = Math.floor((toGrid.x) / CARD.width);

			if (!window.isMobile) {

				this.latestShoot.id = this.mousePosID;
				if (this.latestShoot.id < 0) {
					this.latestShoot.id = Math.floor(GRID.i / 2)
				}
				this.latestShoot.x = this.mousePosition.x
			}
		}
		this.trailMarker.overShapeVisible = this.isTouchingDown

		if (this.trailMarker.overShapeVisible) {
			this.trailMarker.arrowsUp.alpha = utils.lerp(this.trailMarker.arrowsUp.alpha, 0.5, 0.2)

		} else {
			this.trailMarker.arrowsUp.alpha = utils.lerp(this.trailMarker.arrowsUp.alpha, 0, 0.05)
		}

		this.trailMarker.arrowsUp.tint = this.trailMarker.tint;
		this.trailMarker.overShape.tint = this.trailMarker.tint;

		this.initGridAcc += 0.05;

		if (this.board) {
			this.board.update(delta);

		}

		this.topUIContainer.x = this.gameCanvas.x
		this.topUIContainer.y = utils.lerp(this.topUIContainer.y, this.gameCanvas.y, 0.2)

		this.bottomUIContainer.x = this.gameCanvas.x
		this.bottomUIContainer.y = utils.lerp(this.bottomUIContainer.y, this.gameCanvas.y + this.gameCanvas.height - this.bottomUICanvas.height, 0.2)

		if (this.currentCard) {
			this.latestCardPosition = this.currentCard.x
		}

		this.updateTrailsPosition()

		this.trailMarker.arrowsUp.tilePosition.y -= 128 * delta;
		this.trailMarker.arrowsUp.tilePosition.y %= 128;


		this.updateLabelsPosition()
		this.updateUI();

		if (!window.isMobile) {
			this.updateMousePosition();
		} else {
		}


		//  else {
		// 	//this.updateMousePositionMobile();
		// }

	}
	updateTrailLenght() {
		let lastPossible = this.board.getLastCardPosition(this.mousePosID)
		if (lastPossible < 0) {
			this.trailMarker.overShape.height = 0
		} else {

			let targetHeight = GRID.height - (lastPossible * CARD.height) //+ CARD.height + this.trailMarker.overShape.margin + this.grid.backgroundOffset.y / 4
			this.trailMarker.overShape.height = targetHeight//utils.lerp(this.trailMarker.overShape.height, targetHeight, 0.5);
		}

		this.trailMarker.overShape.y = GRID.height - this.trailMarker.overShape.height// - this.trailMarker.overShape.height + CARD.height - this.trailMarker.overShape.margin * 0.5 + this.grid.backgroundOffset.y / 4
		this.trailMarker.arrowsUp.scale.set(this.trailMarker.overShape.width / this.trailMarker.arrowsUp.width)
		this.trailMarker.arrowsUp.height = this.trailMarker.overShape.height / this.trailMarker.arrowsUp.scale.y - this.grid.backgroundOffset.y / 4
		this.trailMarker.arrowsUp.y = this.trailMarker.overShape.y
	}
	updateTrailsPosition(force = false) {
		this.trailMarker.positionSpringX.update();
		if (this.latestCardPosition !== undefined && this.latestCardPosition >= 0) {
			this.trailMarker.positionSpringX.tx = this.latestCardPosition;
			this.trailMarker.x = utils.lerp(this.trailMarker.x, this.latestCardPosition, 0.5)
		}



		if (this.currentCard && this.mousePosID >= 0 && this.mousePosID < GRID.i) {

			this.updateTrailLenght();

			this.trailMarker.overShape.alpha = 0.5;



			this.trailMarker.tint = this.currentCard.enemySprite.tint
			this.trailHorizontal.tint = this.currentCard.enemySprite.tint
			if (force) {
				this.trailMarker.alpha = 0.65//utils.lerp(this.trailMarker.alpha, 0.35, 0.1)
				this.trailMarker.x = this.trailMarker.positionSpringX.tx;
			} else {
				this.trailMarker.alpha = utils.lerp(this.trailMarker.alpha, 0.65, 0.2)

			}
			this.trailHorizontal.alpha = this.trailMarker.alpha;

			this.latestShoot.id = this.mousePosID;

			this.currentCard.alpha = 1;
			if (this.currentCard) {
				if (this.mousePosID * CARD.width >= 0) {
					this.currentCard.moveX(this.mousePosID * CARD.width, 0.1);
				}
			}
		}
	}
	updateMousePositionMobile() {
		if (!this.currentCard) {
			this.trailMarker.alpha = utils.lerp(this.trailMarker.alpha, 0, 0.1);
			this.trailHorizontal.alpha = this.trailMarker.alpha;
			return;
		}
		let toGrid = this.gridContainer.toLocal(this.mousePosition)
		this.mousePosID = Math.floor((toGrid.x) / CARD.width);

		// this.latestShoot.id = this.mousePosID;
		// 		if (this.latestShoot.id < 0) {
		// 			this.latestShoot.id = Math.floor(GRID.i / 2)
		// 		}

		if (this.mousePosID < -990) {
			this.mousePosID = Math.floor(GRID.i / 2)
		}
		else if (this.mousePosID < 0) {
			this.mousePosID = 0
		} else {

			this.mousePosID = Math.min(Math.max(this.mousePosID, 0), GRID.i - 1);
		}
		this.latestShoot.id = this.mousePosID;
		this.updateTrailsPosition();

	}
	updateMousePosition() {
		if (!this.currentCard) {
			this.trailMarker.alpha = utils.lerp(this.trailMarker.alpha, 0, 0.1);
			this.trailHorizontal.alpha = this.trailMarker.alpha;
			return;
		}

		let toGrid = this.gridContainer.toLocal(this.mousePosition)
		this.mousePosID = Math.floor((toGrid.x) / CARD.width);

		if (this.mousePosID < 0) {
			if (window.isMobile || !this.isFirstClick) {
				this.mousePosID = 0
			} else {
				this.mousePosID = this.latestShoot.id
			}
		} else {

			this.mousePosID = Math.min(Math.max(this.mousePosID, 0), GRID.i - 1);
		}
		this.updateTrailsPosition();

	}

	transitionOut(nextScreen) {
		super.transitionOut(nextScreen);
	}
	transitionIn() {

		super.transitionIn();
	}
	destroy() {

	}
	scaleMousePosition() {
		if (!this.mousePosition || this.mouseDirty) {
			return;
		}
		if (this.mousePosition.x)
			this.mousePosition.x *= window.appScale.x
		if (this.mousePosition.y)
			this.mousePosition.y *= window.appScale.y

		this.mouseDirty = true;
	}

	popCircle(pos, color = 0xFFFFFF) {
		let convertedPosition = this.toLocal(pos)
		let realRadius = CARD.width / 2;// * this.game.gridContainer.scale.x * 0.25;
		if (!this.tapCircle) {
			this.tapCircle = new PIXI.Graphics().lineStyle(3, color).drawCircle(0, 0, realRadius);
			this.addChild(this.tapCircle);
		}
		this.tapCircle.x = convertedPosition.x;
		this.tapCircle.y = convertedPosition.y;

		this.tapCircle.scale.set(0.5)
		TweenMax.killTweensOf(this.tapCircle.scale);
		TweenMax.to(this.tapCircle.scale, 0.2, {
			x: 1.5, y: 1.5, onComplete: () => {
				this.tapCircle.scale.set(0);
			}
		})
	}

	onTapUp(event, customID) {
		if (!this.currentCard || !this.gameRunning || this.blockGameTimer > 0 || !this.isTouchingDown) {
			return;
		}

		if (window.isMobile) {
			this.isTouchingDown = false;
		}

		if (customID == undefined) {
			if (renderer.plugins.interaction.activeInteractionData) {
				for (const key in renderer.plugins.interaction.activeInteractionData) {
					const element = renderer.plugins.interaction.activeInteractionData[key];
					if (element.pointerType == "touch") {
						this.mousePosition = element.global;

					}
				}
			}
			else {
				this.mousePosition = renderer.plugins.interaction.mouse.global
			}
			// if (this.mousePosition.y < this.topUIContainer.position.y + config.height * 0.2) {
			// 	return;
			// }
			this.updateMousePosition();
		} else {
			this.mousePosID = customID;
		}


		if (!this.board.isPossibleShot(this.mousePosID)) {
			if (this.currentCard.isBomb) {
				let cardLast = this.board.getLastCardOnLane(this.mousePosID)
				//if player have bomb and theres no space to shoot
				if (cardLast) {
					this.board.canGoNext = true;
					cardLast.isABomb();
					this.board.explodeCard(cardLast);
					this.board.removeCardFromList(cardLast);
					cardLast.destroy();

					this.currentCard.destroy();
					this.currentCard = null;

					this.board.addTurnTime(0.3)

					this.isFirstClick = false;
					this.currentRound++;
				}
			}
			return;
		}


		this.isFirstClick = false;
		this.currentRound++;

		this.board.shootCard(this.mousePosID, this.currentCard);
		
		if (this.currentCard.isBomb) {
			SOUND_MANAGER.play('fireworks');
		}

		if (this.currentLevelData.gameMode == 10) {
			window.scrabbleManager.findWords(this.board, this.currentCard.pos);
		}


		this.cardsContainer.addChild(this.currentCard)

		window.fxSpeed = 5;
		this.inGameMenu.collapse();
		let normalDist = (this.currentCard.y - this.currentCard.pos.j * CARD.height) / GRID.height;
		this.currentCard.x = this.currentCard.pos.i * CARD.width
		this.latestShoot.x = this.currentCard.x

		this.latestCardPosition = this.currentCard.x

		this.latestShoot.id = this.mousePosID
		this.currentCard.move({
			x: this.currentCard.pos.i * CARD.width,
			y: this.currentCard.pos.j * CARD.height
		}, 0.5 * normalDist, 0, Back.easeIn);

		this.updateTrailLenght()
		this.currentCard = null;
		this.updateUI();
	}

	onTapDown() {
		if (!this.currentCard || !this.gameRunning) {
			return;
		}
		this.isTouchingDown = true;
		if (renderer.plugins.interaction.activeInteractionData[0]) {
			this.mousePosition = renderer.plugins.interaction.activeInteractionData[0].global

		}
		else {
			this.mousePosition = renderer.plugins.interaction.mouse.global

		}
		if (!window.isMobile) {
			//this.updateMousePositionMobile();
		} else {
			this.onTouchMove();
		}
	}

	onTouchMove() {
		if (renderer.plugins.interaction.activeInteractionData) {
			for (const key in renderer.plugins.interaction.activeInteractionData) {
				const element = renderer.plugins.interaction.activeInteractionData[key];
				if (element.pointerType == "touch") {
					this.mousePosition = element.global;
				}
			}
		}
		this.updateMousePositionMobile();

	}


	mouseOver() {
		this.isTouchingDown = true;
	}

	mouseOut() {
		this.isTouchingDown = false;
	}

	addEvents() {
		this.removeEvents();
		this.interactive = true;
		this.gridContainer.interactive = true;
		this.gridContainer.on('mousedown', this.onTapDown.bind(this)).on('touchstart', this.onTapDown.bind(this));
		this.on('mouseup', this.onTapUp.bind(this)).on('touchend', this.onTapUp.bind(this));

		this.trailHorizontal.interactive = true;
		this.trailHorizontal.on('mousedown', this.onTapDown.bind(this)).on('touchstart', this.onTapDown.bind(this));
		this.trailHorizontal.on('mouseup', this.onTapUp.bind(this)).on('touchend', this.onTapUp.bind(this));

		this.trailHorizontal.on('touchmove', this.onTouchMove.bind(this));
		this.gridContainer.on('touchmove', this.onTouchMove.bind(this));

		if (!window.isMobile) {
			this.gridContainer.on('mouseover', this.mouseOver.bind(this));
			this.trailHorizontal.on('mouseover', this.mouseOver.bind(this));

			this.gridContainer.on('mouseout', this.mouseOut.bind(this));
			this.trailHorizontal.on('mouseout', this.mouseOut.bind(this));
		}

		this.startScreenContainer.addEvents();
		this.endGameScreenContainer.addEvents();

	}
	removeEvents() {
		this.gridContainer.interactive = false;
		this.gridContainer.off('mousedown', this.onTapDown.bind(this)).off('touchstart', this.onTapDown.bind(this));
		this.gridContainer.off('mouseup', this.onTapUp.bind(this)).off('touchend', this.onTapUp.bind(this));

		this.trailHorizontal.interactive = false;
		this.trailHorizontal.off('mousedown', this.onTapDown.bind(this)).off('touchstart', this.onTapDown.bind(this));
		this.trailHorizontal.off('mouseup', this.onTapUp.bind(this)).off('touchend', this.onTapUp.bind(this));

		this.startScreenContainer.removeEvents();
		this.endGameScreenContainer.removeEvents();

	}
	resizeToFitAR(size, element, res) {
		if (!res) {
			res = element
		}
		let sclX = (size.width) / (res.width / res.scale.x);
		let sclY = (size.height) / (res.height / res.scale.y);
		let min = Math.min(sclX, sclY);
		element.scale.set(min)
	}
	resizeToFit(size, element) {
		let sclX = (size.width) / (element.width / element.scale.x);
		let sclY = (size.height) / (element.height / element.scale.y);
		let min = Math.min(sclX, sclY);
		element.scale.set(sclX, sclY)
	}
	resize(scaledResolution, innerResolution, force) {


		if (this.innerResolution && this.innerResolution.width != window.innerWidth || this.innerResolution.height != window.innerHeight) {
			//
		}

		//console.log(resolution, innerResolution)
		let offset = this.toLocal(new PIXI.Point())
		if (innerResolution) {
			this.innerResolution = innerResolution;
		}


		this.fxContainer.resize(innerResolution);
		this.backFXContainer.x = this.fxContainer.x
		this.backFXContainer.y = this.fxContainer.y
		this.backFXContainer.scale.x = this.fxContainer.scale.x
		this.backFXContainer.scale.y = this.fxContainer.scale.y


		let bottomCanvasPosition = this.gameCanvas.y + this.gameCanvas.height - this.bottomUICanvas.height;

		if (!this.bottomTest) {
			this.bottomTest = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, 10);
			this.bottomTest.alpha = 0;
			this.background.parent.addChild(this.bottomTest);

			this.bottomTest2 = new PIXI.Graphics().beginFill(0xFF00FF).drawCircle(0, 0, 10);
			this.bottomTest2.alpha = 0;
			this.background.parent.addChild(this.bottomTest2);
		} else {
			this.bottomTest.y = bottomCanvasPosition
		}

		let bottomGlobalPos = this.bottomTest.getGlobalPosition();
		let bottom2GlobalPos = this.toLocal({ x: 0, y: innerResolution.height * this.parent.parent.scale.y });

		this.bottomTest2.y = bottom2GlobalPos.y

		let bottomBgHeight = this.bottomTest2.y - this.bottomTest.y;

		this.background.resize(scaledResolution, innerResolution, bottomGlobalPos, bottomBgHeight)
		this.ratio = config.width / config.height;



		utils.scaleSize(this.gameCanvas, innerResolution, this.ratio)

		if (this.currentLevelData.gameMode == 10) {

			utils.resizeToFitAR({ width: this.gameCanvas.width * 0.95, height: this.gameCanvas.height * 0.5 }, this.gridContainer)
		} else {

			utils.resizeToFitAR({ width: this.gameCanvas.width * 0.95, height: this.gameCanvas.height * 0.735 }, this.gridContainer)
		}

		if (this.gridContainer.scale.x > 1) {
			this.gridContainer.scale.set(1)
		}


		utils.resizeToFit({ width: this.gameCanvas.width, height: this.gameCanvas.height * 0.06 }, this.topCanvas)
		utils.resizeToFit({ width: this.gameCanvas.width, height: this.gameCanvas.height * 0.110 }, this.bottomUICanvas)


		//console.log(this.bottomUICanvas.scale.y, this.bottomUICanvas.height)

		this.cardsContainer.scale.x = (this.gridContainer.scale.x)
		this.cardsContainer.scale.y = (this.gridContainer.scale.y)


		this.gameCanvas.x = offset.x + innerResolution.width / 2 - this.gameCanvas.width / 2//* window.appScale.x// (innerResolution.width / 2 * window.appScale.x)
		this.gameCanvas.y = offset.y + innerResolution.height / 2 - this.gameCanvas.height / 2

		this.background.x = innerResolution.width / 2 + offset.x//* window.appScale.x// (innerResolution.width / 2 * window.appScale.x)
		this.background.y = innerResolution.height / 2 + offset.y// * window.appScale.y

		this.gridContainer.x = this.gameCanvas.x + this.gameCanvas.width / 2 - (this.gridContainer.width) / 2 + this.grid.backgroundOffset.x / 4
		if (window.isMobile && this.currentLevelData.gameMode == 10) {
			this.gridContainer.y = this.gameCanvas.y + this.gameCanvas.height / 2 - this.gridContainer.height / 2 - this.topCanvas.height * 2 + CARD.height// this.gameCanvas.y + this.gameCanvas.height / 2 - this.gridContainer.height / 2 - this.topCanvas.height * 2//+ this.grid.backgroundOffset.y / 2
		} else {

			this.gridContainer.y = this.gameCanvas.y + this.gameCanvas.height / 2 - this.gridContainer.height / 2 - this.topCanvas.height * 2//+ this.grid.backgroundOffset.y / 2
		}
		this.gridContainer.y = Math.max(this.gameCanvas.y + this.topCanvas.height * 0.5, this.gridContainer.y)
		//utils.centerObject(this.gridContainer, this.gameCanvas)


		this.cardsContainer.x = this.gridContainer.x;
		this.cardsContainer.y = this.gridContainer.y;

		this.backGridContainer.x = this.gridContainer.x;
		this.backGridContainer.y = this.gridContainer.y;

		this.backGridContainer.scale.x = (this.gridContainer.scale.x)
		this.backGridContainer.scale.y = (this.gridContainer.scale.y)


		this.frontGridContainer.x = this.gridContainer.x;
		this.frontGridContainer.y = this.gridContainer.y;

		this.frontGridContainer.scale.x = (this.gridContainer.scale.x)
		this.frontGridContainer.scale.y = (this.gridContainer.scale.y)



		if (this.currentCard) {
			//13 is the width of the border on the grid
			this.currentCard.y = (this.grid.gridSprite.height + this.offsetCard.y + 4);//this.gridContainer.scale.y
		}


		this.popUpOverlay.resize(scaledResolution, innerResolution)
		this.popUpOverlay.scale.set(this.inGameMenu.scale.x * 1.5)
		this.popUpOverlay.x = this.gameCanvas.x + this.gameCanvas.width / 2
		this.popUpOverlay.y = this.gameCanvas.y + this.gameCanvas.height / 2

		this.startScreenContainer.resize(innerResolution, this.ratio)
		this.endGameScreenContainer.resize(innerResolution, this.ratio)

		this.debugLabel.x = this.gameCanvas.x + 20
		this.debugLabel.y = this.gameCanvas.y + this.gameCanvas.height - this.debugLabel.height - 20

		if (this.debugCardsContainer) {
			this.debugCardsContainer.x = this.gameCanvas.x + this.gameCanvas.width / 2
			this.debugCardsContainer.y = this.gameCanvas.y + this.gameCanvas.height / 2

		}

		this.updateLabelsPosition();

		if (this.tutorialOverlay.visible) {

			this.tutorialOverlay.resize(this.gameCanvas, innerResolution);
		}


	}

	closeApplication() {
		navigator.app.exitApp();
	}
	backKeyDown() {
		if (this.gameRunning) {
			this.mainmenuState();
		} else if (this.startScreenContainer.screenState == 2) {
			if (this.startScreenContainer.chooseLevelPanel.currentUISection <= 0) {
				this.startScreenContainer.startState(0);
			} else {
				this.startScreenContainer.chooseLevelPanel.onBack();
			}
		} else {
			navigator.app.exitApp();
		}
	}
}