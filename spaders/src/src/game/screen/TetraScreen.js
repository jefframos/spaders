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

export default class TetraScreen extends Screen {
	constructor(label) {
		super(label);

		window.AUTO_PLAY_HARD = false;
		window.AUTO_PLAY = false;
		////console.log(levels)
		this.innerResolution = { width: config.width, height: config.height };

		let a = -1;
		let b = -2;

		this.colorTween = new ColorTweens();
		this.levels = window.levelData;//window.levelsJson.levels;

		console.log(this.levels)
		//console.log(this.levels)
		this.hasHash = false;
		this.currentLevelID = 0;
		this.currentLevelData = this.levels[this.currentLevelID];
		if (window.location.hash) {
			var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
			//console.log(hash)
			this.hasHash = true;
			if (hash == "a") {

				this.currentLevelID = -1;
			} else {
				if (hash < this.levels.length) {

					this.currentLevelID = hash;

					this.currentLevelData = this.levels[hash];
				}
			}
		}


		let tempid = this.currentLevelID >= 0 ? this.currentLevelID : 0

		this.updateGridDimensions();

		window.CARD_POOL = [];

		window.CARD_NUMBER = 0;

		this.grid = new Grid(this);
		this.grid.onDestroyAllStartedCards.add(() => this.onDestroyAllStartedCards());

		this.board = new Board(this);
		this.board.onDestroyCard.add((card) => this.onDestroyCard(card));

		this.totalLines = 6;

		this.currentPoints = 0;
		this.currentPointsLabel = 0;
		this.currentRound = 0;

		this.cardQueue = [];
		this.cardQueueSize = 4;

		this.currentButtonLabel = 'START';

		this.gameRunning = false;

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
	}
	onDestroyAllStartedCards() {
		this.colorTween.startTween();
		this.gameplayState = 1;

		//(pos, label, delay = 0, dir = 1, scale = 1, color = 0xFFFFFF, ease = Back.easeOut)
		////AREA ATTACK
		this.board.setFinalState();

		if (this.currentCard) {
			this.currentCard.setZeroLife();
		}
		this.cardQueue.forEach(element => {

			element.setZeroLife();
		});

		if (this.endGameLabel && this.endGameLabel.parent) {
			this.endGameLabel.parent.removeChild(this.endGameLabel);

			TweenMax.killTweensOf(this.endGameLabel);
		}


		this.spawnFireworks();

		this.endGameLabel = PIXI.Sprite.fromImage('./assets/images/finish/finish-them-all.png');
		this.endGameLabel.anchor.set(0.5)
		this.resizeToFitAR({ width: this.gameCanvas.width, height: this.gameCanvas.height }, this.endGameLabel);


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
		this.endGameLabel.y = this.gridContainer.y + this.gridContainer.height / this.gridContainer.scale.y / 2;
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
	}
	updateGridDimensions() {
		window.GRID = {
			i: this.currentLevelData.pieces[0].length,
			j: this.currentLevelData.pieces.length,
			height: this.innerResolution.width,
			width: this.innerResolution.height,
		}

		let min = 60//this.innerResolution.width / 6.5

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

		// window.CARD = {
		// 	width: GRID.width / GRID.i,
		// 	height: GRID.width / GRID.i,//GRID.height / GRID.j
		// }


		window.GRID.width = window.GRID.i * CARD.width;
		window.GRID.height = window.GRID.j * CARD.height;

		console.log(CARD.width)

		if (this.gridContainer) {
			this.buildTrails();
		}
	}
	getRect(size = 4, color = 0xFFFFFF) {
		return new PIXI.Graphics().beginFill(color).drawRect(0, 0, size, size);
	}
	getRect2(w = 4, h = 4, color = 0xFFFFFF) {
		return new PIXI.Graphics().beginFill(color).drawRect(0, 0, w, h);
	}
	getRoundRect2(w = 4, h = 4, color = 0xFFFFFF) {
		return new PIXI.Graphics().beginFill(color).drawRoundedRect(0, 0, w, h, 10);
	}
	getCircle(size = 4, color = 0xFFFFFF) {
		return new PIXI.Graphics().beginFill(color).drawCircle(0, 0, size * 0.5);
	}
	generateImage(level, size = 24, paddingBottom = 0) {
		let container = new PIXI.Container();
		let tempRect = null;



		let background = this.getRoundRect2(level[0].length * size + size, (level.length - 1) * size + size + paddingBottom, 0x222222)
		//background.x = size * 0.5
		//background.y -= size * 0.5
		container.addChild(background)
		for (var i = 0; i < level.length - 1; i++) {
			for (var j = 0; j < level[i].length; j++) {
				if (level[i][j] >= 0) {
					// this.cardsContainer.addChild(this.placeCard(j, i, ENEMIES.list[level[i][j]].life));

					if (ENEMIES.list[level[i][j]].isBlock) {
						tempRect = this.getRect(size, config.colors.dark)
						container.addChild(tempRect)
						tempRect.x = j * size + size * 0.5;
						tempRect.y = i * size + size * 0.5;
					} else {
						tempRect = this.getRect(size, ENEMIES.list[level[i][j]].color)
						container.addChild(tempRect)
						tempRect.x = j * size + size * 0.5;
						tempRect.y = i * size + size * 0.5;
					}
				} else if (level[i][j] == -2) {
					tempRect = this.getRect(size, config.colors.dark)
					container.addChild(tempRect)
					tempRect.x = j * size + size * 0.5;
					tempRect.y = i * size + size * 0.5;
				} else {
					tempRect = this.getRect(size, 0x111111)
					container.addChild(tempRect)
					tempRect.x = j * size + size * 0.5;
					tempRect.y = i * size + size * 0.5;
				}
			}
		}
		//container.cacheAsBitmap = true

		//let renderTexture = new PIXI.RenderTexture.create({ width: container.width, height: container.height });

		let texture = renderer.generateTexture(container);

		let sprite = new PIXI.Sprite()
		sprite.setTexture(texture)

		sprite.background = background;
		sprite.nodeSize = size;
		//window.game.renderer.render(container, {renderTexture});

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
		this.bottomUINewContainer.addChild(this.containerQueue)

		this.timerRect = new UIRectLabel(config.colors.yellow, './assets/images/time.png');
		this.bottomUINewContainer.addChild(this.timerRect)

		this.movesRect = new UIRectLabel(config.colors.green, './assets/images/newEnemies/pixil-layer-0.png');
		this.bottomUINewContainer.addChild(this.movesRect)

		this.scoreRect = new UIRectLabel(config.colors.red2, './assets/images/icons/icons8-star-48.png', false);
		this.UIInGame.addChild(this.scoreRect)


		this.backButton = new UIButton1(config.colors.white, './assets/images/icons/icons8-menu-48.png', config.colors.dark);
		this.backButton.onClick.add(() => this.mainmenuState());


		this.inGameMenu = new InGameMenu(config.colors.green);
		this.UIInGame.addChild(this.inGameMenu)




		//this.UIInGame.addChild(this.backButton)
		this.inGameMenu.onBack.add(() => this.mainmenuState())
		this.inGameMenu.onRestart.add(() => this.resetGame())

		this.gridContainer.alpha = 0;
		this.updateUI();

		this.mainMenuSettings = new MainMenu();
		this.addChild(this.mainMenuSettings)
		this.endGameScreenContainer.hide(true);

		this.hashUsed = false;
		if(!this.hasHash){
			this.mainmenuState();

		}
		
	}
	updateLabelsPosition() {

		let nameLevelSize = { width: this.timeLabelStatic.x - this.pointsLabel.x, height: 40 }
		nameLevelSize.width += this.timeLabelStatic.width


		this.timerRect.scale.set(this.bottomUICanvas.height / this.timerRect.backShape.height * 0.3)
		this.movesRect.scale.set(this.timerRect.scale.x)
		this.scoreRect.scale.set(this.timerRect.scale.x * 1.5)

		this.timerRect.x = this.bottomUICanvas.x + this.bottomUICanvas.width - this.timerRect.width - this.bottomUICanvas.height * 0.1
		this.movesRect.x = this.bottomUICanvas.x + this.bottomUICanvas.width - this.timerRect.width - this.bottomUICanvas.height * 0.1



		this.movesRect.y = this.bottomUICanvas.height - this.movesRect.height - this.bottomUICanvas.height * 0.1
		this.timerRect.y = this.movesRect.y - this.timerRect.height //- this.bottomUICanvas.height * 0.05


		//this.scoreRect.y = this.mainMenuContainer.y//this.movesRect.y + (this.movesRect.height / this.movesRect.scale.y) - (this.scoreRect.height / this.scoreRect.scale.y)
		this.scoreRect.x = this.topCanvas.x + 20;

		this.containerQueue.scale.set(this.bottomUICanvas.height / CARD.height * 0.5)
		this.containerQueue.x = this.bottomUICanvas.height * 0.1
		this.containerQueue.y = this.timerRect.y + 8//this.movesRect.y + this.movesRect.height - this.containerQueue.height

		//console.log()
		this.backButton.scale.set(this.topCanvas.height / (this.backButton.height / this.backButton.scale.y) * 0.7)// / this.backButton.scale.y)
		this.backButton.x = this.topCanvas.x + this.topCanvas.width - this.backButton.width * 0.5 - this.backButton.width * 0.25;
		this.backButton.y = this.backButton.height * 0.5 + this.backButton.width * 0.25

		let scaledWidth = this.inGameMenu.customWidth * this.inGameMenu.scale.x
		this.inGameMenu.scale.set(this.topCanvas.height / (this.inGameMenu.customWidth) * 0.5)// / this.inGameMenu.scale.y)
		this.inGameMenu.x = this.topCanvas.x + this.topCanvas.width - scaledWidth * 0.5 - scaledWidth * 0.5;
		this.inGameMenu.y = scaledWidth * 0.5 + scaledWidth * 0.5


		this.mainMenuSettings.scale.set(this.inGameMenu.scale.x);
		let toLoc = this.toLocal({ x: 0, y: 0 });
		this.mainMenuSettings.x = toLoc.x + this.innerResolution.width - scaledWidth;
		this.mainMenuSettings.y = toLoc.y + scaledWidth;

	}
	hideInGameElements(delay = 0) {
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
		TweenMax.to(this.cardsContainer, 0.1, { alpha: 1 })
		TweenMax.to(this.gridContainer, 0.1, { alpha: 1 })
		if (this.currentCard) {
			TweenMax.killTweensOf(this.currentCard);
			TweenMax.to(this.currentCard, 0.1, { alpha: 1 })
		}
		this.mainMenuSettings.collapse();
	}
	mainmenuState(force = false) {
		window.SOUND_MANAGER.playMainMenu();
		this.endGameScreenContainer.hide(force);
		this.startScreenContainer.show(force, force ? 0.2 : 0.75);
		this.gameRunning = false;
		this.mainMenuSettings.visible = true;
		this.startScreenContainer.showCloseButton();
		this.hideInGameElements();
		window.SOUND_MANAGER.speedUpSoundTrack(1);
		this.mainMenuSettings.collapse();
		this.removeEvents();
		this.colorTween.stopTween();

	}
	mainmenuStateFromGame(force = false) {

		window.SOUND_MANAGER.playMainMenu();
		this.mainMenuSettings.collapse();
		this.endGameScreenContainer.hide(force);
		this.startScreenContainer.showFromGame(force, force ? 0.2 : 0.75);
		this.gameRunning = false;
		this.mainMenuSettings.visible = true;
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
		this.gameRunning = false;
		this.startScreenContainer.hide(true);
		let tempid = this.currentLevelID >= 0 ? this.currentLevelID : 0
		this.endGameScreenContainer.setStats(this.currentPoints, this.currentRound, utils.convertNumToTime(Math.ceil(this.currentTime)), this.generateImage(this.currentLevelData.pieces), this.currentLevelData);
		this.endGameScreenContainer.show(false, 2);
		this.hideInGameElements(2);
		this.removeEvents();
		this.mainMenuSettings.collapse();

		window.SOUND_MANAGER.speedUpSoundTrack(1);
		window.SOUND_MANAGER.play('endLevel');

		let mps = Math.ceil(this.currentTime) / this.currentRound;
		let cp =  this.currentPoints / mps
		let actualScore =  Math.round(this.currentPoints / this.currentRound)
		console.log('moves per sec', mps, cp, actualScore)


		let isHighscore = window.COOKIE_MANAGER.saveLevel(
			this.dataToSave.levelName,
			Math.ceil(this.currentTime),
			this.currentPoints,
			this.currentRound,
			actualScore)

			if(isHighscore){
				this.endGameScreenContainer.showHighscore();
			}else{
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

			console.log("on Win Reset", this.currentRound, this.dataToSave)
			this.resetGame()
		}

		if (window.AUTO_PLAY) {
			window.TIME_SCALE = 1;
			window.AUTO_PLAY = false;
		}

		//console.log("endGameState")
	}
	gameState() {



		setTimeout(() => {

			this.gameRunning = true;
		}, 500 / window.TIME_SCALE);

		this.currentTime = 0;
		this.showInGameElements();
		this.addEvents();
		this.endGameScreenContainer.hide();
		this.startScreenContainer.hide()
		this.board.startNewGame();

		//console.log("gameState")
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

		//this.gameContainer.addChild(this.background);
		this.gameContainer.addChild(this.backFXContainer);
		this.gameContainer.addChild(this.backGridContainer);
		this.gameContainer.addChild(this.gridContainer);
		this.gameContainer.addChild(this.cardsContainer);
		this.gameContainer.addChild(this.UIContainer);
		this.gameContainer.addChild(this.topUIContainer);
		this.gameContainer.addChild(this.bottomUIContainer);

		this.bottomUIContainer.y = config.height


		this.gameCanvas = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, 1, 1);
		this.addChild(this.gameCanvas);
		this.gameCanvas.alpha = alphas


		this.mousePosID = GRID.i / 2;
		// this.currentCard = this.createCard();
		// this.cardsContainer.addChild(this.currentCard)
		// utils.centerObject(this.currentCard, this.background)



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

	}
	buildTrails() {

		if (this.trailMarker && this.trailMarker.parent) {
			this.trailMarker.parent.removeChild(this.trailMarker);
		}

		if (this.trailHorizontal && this.trailHorizontal.parent) {
			this.trailHorizontal.parent.removeChild(this.trailHorizontal);
		}

		this.trailMarker = new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(0, 0, CARD.width, GRID.height, 10);
		this.gridContainer.addChild(this.trailMarker);
		this.trailMarker.alpha = 0;


		this.trailHorizontal = new PIXI.Graphics().beginFill(0xFFFFFF).drawRoundedRect(0, 0, GRID.width, CARD.height, 10);
		this.cardsContainer.addChild(this.trailHorizontal);
		this.trailHorizontal.alpha = 0;

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
		if (Math.random() < 0.5) {

			this.fxContainer.startFireworks(
				this.toLocal({ x: Math.random() * this.innerResolution.width, y: this.innerResolution.height }),
				Math.random() * this.innerResolution.width * 0.1, this.colorTween.currentColor)
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
	resetGame() {

		this.fireworksTimer = 0;
		this.mainMenuSettings.collapse();
		this.grid.createGrid();

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

		for (var i = this.cardQueue.length - 1; i >= 0; i--) {
			this.cardQueue[i].forceDestroy();
		}
		this.cardQueue = []
		if (this.currentCard)
			this.currentCard.forceDestroy();
		this.currentCard = null;

		this.dataToSave.levelName = this.currentLevelData.levelName;

		for (var i = 0; i < this.currentLevelData.pieces.length; i++) {
			for (var j = 0; j < this.currentLevelData.pieces[i].length; j++) {
				if (this.currentLevelData.pieces[i][j] >= 0) {
					if (ENEMIES.list[this.currentLevelData.pieces[i][j]].isBlock) {
						this.cardsContainer.addChild(this.placeBlock(j, i));
					} else {
						this.cardsContainer.addChild(this.placeCard(j, i, ENEMIES.list[this.currentLevelData.pieces[i][j]].life));
					}
				} else if (this.currentLevelData.pieces[i][j] == -2) {
					this.cardsContainer.addChild(this.placeBlock(j, i));
				}
			}
		}

		this.currentPoints = 0;
		this.currentPointsLabel = 0;
		this.currentRound = 0;

		// this.board.debugBoard();


		this.newRound();

		TweenMax.to(this.cardsContainer, 0.1, { alpha: 1 })
		TweenMax.to(this.gridContainer, 0.1, { alpha: 1, onComplete: () => { this.gameState() } })
		//TweenMax.to(this.UIInGame, 0.75, { y: 0, ease: Cubic.easeOut, onComplete: () => { this.gameState() } })

		this.startScreenContainer.hide();



		this.mousePosition = new PIXI.Point()

		let toGrid = this.gridContainer.toLocal(this.innerResolution.width / 2)
		this.mousePosID = Math.floor((toGrid.x) / CARD.width);

		this.latestShoot.id = 2//this.mousePosID;
		this.latestShoot.x = this.mousePosition


		this.colorTween.stopTween();

		this.buildTrails();
		//this.currentButtonLabel = 'RESET';
		//window.SOUND_MANAGER.volume('main-soundtrack', 1)

		window.SOUND_MANAGER.playInGame();
		window.SOUND_MANAGER.play('startLevel');

	}

	updateUI() {
		this.pointsLabel.text = utils.formatPointsLabel(Math.ceil(this.currentPointsLabel));
		this.roundsLabel.text = utils.formatPointsLabel(Math.ceil(this.currentRound));
		this.entitiesLabel.text = utils.formatPointsLabel(Math.ceil(this.board.totalCards));
		this.timeLabel.text = utils.convertNumToTime(Math.ceil(this.currentTime));

		this.timerRect.updateLavel(utils.convertNumToTime(Math.ceil(this.currentTime)))
		this.movesRect.updateLavel(utils.formatPointsLabel(Math.ceil(this.currentRound)))
		this.scoreRect.updateLavel(Math.ceil(this.currentPointsLabel), '', false)
	}
	addRandomPiece() {
	}
	addPoints(points) {
		this.currentPoints += points;
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

			//console.log(nextLife,this.cardQueueData.counter)
			if (nextLife > 0) {
				if (this.cardQueueData.counter <= 0) {
					//change frequecy of high level cards
					this.cardQueueData.counter = 3 + Math.floor(Math.random() * 3)
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
			card.updateSprite(card.life);
			card.type = 0;
			card.x = 0;
			this.containerQueue.addChild(card);
			this.cardQueue.push(card);
			card.setOnQueue();
		}
		// for (var i = this.cardQueue.length - 1; i >= 0; i--) {
		for (var i = 0; i < this.cardQueue.length; i++) {
			TweenMax.to(this.cardQueue[i], 0.3, { x: CARD.width * (this.cardQueue.length - i - 1), ease: Back.easeOut })
			this.cardQueue[i].y = 0
			// this.cardQueue[i].y = ;
		}

		this.cardQueue[1].mark();

	}
	newRound() {
		this.updateQueue();
		this.currentCard = this.cardQueue[0];
		this.cardQueue.shift();
		this.mousePosID = this.latestShoot.id
		this.currentCard.x = this.latestShoot.x
		this.currentCard.scale.set(1)
		this.currentCard.alpha = 0;
		TweenMax.to(this.currentCard, 0.3, { alpha: 1, y: this.gridContainer.height + 20, ease: Elastic.easeOut })
		this.currentCard.updateCard(true);
		this.cardsContainer.addChild(this.currentCard);


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
	placeCard(i, j, level = 0) {
		let card;
		if (CARD_POOL.length) {
			card = CARD_POOL[0];
			CARD_POOL.shift();
		} else {
			card = new Card(this);
		}
		card.life = level;
		card.createCard();
		card.updateSprite(level);
		card.x = i * CARD.width;
		card.y = j * CARD.height - CARD.height;
		// card.cardContainer.scale.set(1.2 - j * 0.05)
		card.alpha = 0;
		TweenMax.to(card, 0.5, { alpha: 1, delay: i * 0.05, y: j * CARD.height, ease: Back.easeOut })

		card.show(0.5, i * 0.05 + 0.75)

		card.pos.i = i;
		card.pos.j = j;
		card.updateCard();
		this.board.addCard(card);
		this.grid.paintTile(card)
		// this.CARD_POOL.push(card);
		return card;
	}

	placeBlock(i, j) {
		let block;
		block = new Block(this);
		block.x = i * CARD.width;
		block.y = j * CARD.height - CARD.height;
		block.alpha = 0;
		TweenMax.to(block, 0.5, { alpha: 1, delay: i * 0.05, y: j * CARD.height, ease: Back.easeOut })
		block.pos.i = i;
		block.pos.j = j;
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


		///sort hash when load
		if (this.hasHash && !this.hashUsed) {
			if (this.currentLevelID < 0) {
				this.endGameState();
			} else {
				this.resetGame();
			}

			this.hashUsed = true;
		}

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
			}
			this.cardQueue.forEach(element => {
				element.forceNewColor(this.colorTween.currentColor)
			});
		}

		if (!this.gameRunning) {
			this.topUIContainer.x = this.gameCanvas.x
			this.topUIContainer.y = utils.lerp(this.topUIContainer.y, this.gameCanvas.y - 500, 0.1)
			this.bottomUIContainer.x = this.gameCanvas.x
			this.bottomUIContainer.y = utils.lerp(this.bottomUIContainer.y, this.gameCanvas.y + this.gameCanvas.height - this.bottomUICanvas.height + 500, 0.2)

			if (this.currentCard) {
				this.currentCard.alpha = 0;
			}

			return;
		}



		if (this.currentCard) {
			this.currentCard.update(delta)
			this.trailHorizontal.y = this.currentCard.y;

			//console.log(this.trailHorizontal)
		}
		////console.log(this.mousePosition)
		this.currentTime += delta * window.TIME_SCALE * window.TIME_SCALE;

		if (!this.board.newGameFinished && this.board.totalCards <= 0) {
			this.endGameState();
			this.gameRunning = false;
			return;
		}

		if (renderer.plugins.interaction.mouse.global) {
			this.mousePosition = renderer.plugins.interaction.mouse.global;

			let toGrid = this.gridContainer.toLocal(this.mousePosition)
			this.mousePosID = Math.floor((toGrid.x) / CARD.width);

			this.latestShoot.id = this.mousePosID;
			if (this.latestShoot.id < 0) {
				this.latestShoot.id = Math.floor(GRID.i / 2)
			}
			this.latestShoot.x = this.mousePosition
		}


		this.initGridAcc += 0.05;

		if (this.board) {
			this.board.update(delta);

		}

		this.topUIContainer.x = this.gameCanvas.x
		this.topUIContainer.y = utils.lerp(this.topUIContainer.y, this.gameCanvas.y, 0.2)

		this.bottomUIContainer.x = this.gameCanvas.x
		this.bottomUIContainer.y = utils.lerp(this.bottomUIContainer.y, this.gameCanvas.y + this.gameCanvas.height - this.bottomUICanvas.height, 0.2)


		this.updateLabelsPosition()
		this.updateUI();
		this.updateMousePosition();

	}

	updateMousePosition() {
		if (!this.currentCard) {
			this.trailMarker.alpha = utils.lerp(this.trailMarker.alpha, 0, 0.1);
			this.trailHorizontal.alpha = this.trailMarker.alpha;
			return;
		}


		let toLocalMouse = this.toLocal(this.mousePosition)

		let toGrid = this.gridContainer.toLocal(this.mousePosition)
		this.mousePosID = Math.floor((toGrid.x) / CARD.width);

		if (this.mousePosID < 0) {
			this.mousePosID = this.latestShoot.id
		}

		// this.trailMarker.alpha = 0;
		if (this.mousePosID >= 0 && this.mousePosID < GRID.i) {
			TweenMax.to(this.trailMarker, 0.1, { x: this.mousePosID * CARD.width });
			this.trailMarker.tint = this.currentCard.enemySprite.tint
			this.trailMarker.alpha = utils.lerp(this.trailMarker.alpha, 0.15, 0.1)
			this.trailHorizontal.tint = this.currentCard.enemySprite.tint
			this.trailHorizontal.alpha = this.trailMarker.alpha;
			this.currentCard.alpha = 1;
			//this.trailHorizontal.y = this.currentCard.y
			if (this.currentCard) {
				if (this.mousePosID * CARD.width >= 0) {
					// console.log("MOUSE MOVE");
					this.currentCard.moveX(this.mousePosID * CARD.width, 0.1);
				}
			}
		}
		// else {
		// 	this.mousePosition = this.innerResolution.width / 2
		// 	this.mousePosID = Math.floor(GRID.i / 2);

		// 	this.currentCard.moveX(this.mousePosID * CARD.width, 0.1);
		// 	this.trailMarker.x = this.currentCard.x
		// 	this.trailMarker.tint = this.currentCard.enemySprite.tint
		// 	this.trailMarker.alpha = 0.15;

		// }
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
	onTapUp(event, customID) {
		if (!this.currentCard || !this.gameRunning) {
			return;
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
			if (this.mousePosition.y < this.topUIContainer.position.y + config.height * 0.2) {
				return;
			}
			this.updateMousePosition();
		} else {
			this.mousePosID = customID;
		}



		if (!this.board.isPossibleShot(this.mousePosID)) {
			console.log("isPossibleShot")
			return;
		}



		this.currentRound++;
		let nextRoundTimer = this.board.shootCard(this.mousePosID, this.currentCard);
		let normalDist = (this.currentCard.y - this.currentCard.pos.j * CARD.height) / GRID.height;
		this.currentCard.x = this.currentCard.pos.i * CARD.width
		this.latestShoot.x = this.currentCard.x
		this.latestShoot.id = this.mousePosID
		this.currentCard.move({
			x: this.currentCard.pos.i * CARD.width,
			y: this.currentCard.pos.j * CARD.height
		}, 0.1 * normalDist);

		this.currentCard = null;
		this.updateUI();
		// console.log(0.1 * normalDist * 100);
		setTimeout(function () {
			this.newRound();
		}.bind(this), 0.1 * normalDist + nextRoundTimer / window.TIME_SCALE);

		// console.log(nextRoundTimer);
	}

	onTapDown() {
		if (!this.currentCard || !this.gameRunning) {
			return;
		}
		if (renderer.plugins.interaction.activeInteractionData[0]) {
			this.mousePosition = renderer.plugins.interaction.activeInteractionData[0].global

		}
		else {
			this.mousePosition = renderer.plugins.interaction.mouse.global

		}
		this.updateMousePosition();
	}

	removeEvents() {
		this.gameContainer.interactive = false;
		this.gameContainer.off('mousedown', this.onTapDown.bind(this)).off('touchstart', this.onTapDown.bind(this));
		this.gameContainer.off('mouseup', this.onTapUp.bind(this)).off('touchend', this.onTapUp.bind(this));
		this.startScreenContainer.removeEvents();
		this.endGameScreenContainer.removeEvents();

	}
	addEvents() {
		this.removeEvents();
		this.gameContainer.interactive = true;
		this.gameContainer.on('mousedown', this.onTapDown.bind(this)).on('touchstart', this.onTapDown.bind(this));
		this.gameContainer.on('mouseup', this.onTapUp.bind(this)).on('touchend', this.onTapUp.bind(this));
		this.startScreenContainer.addEvents();
		this.endGameScreenContainer.addEvents();

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
	resize(scaledResolution, innerResolution) {
		//console.log(resolution, innerResolution)
		let offset = this.toLocal(new PIXI.Point())
		this.innerResolution = innerResolution;


		this.fxContainer.resize(innerResolution);
		this.backFXContainer.x = this.fxContainer.x
		this.backFXContainer.y = this.fxContainer.y
		this.backFXContainer.scale.x = this.fxContainer.scale.x
		this.backFXContainer.scale.y = this.fxContainer.scale.y

		this.background.resize(scaledResolution, innerResolution)
		this.ratio = config.width / config.height;



		utils.scaleSize(this.gameCanvas, innerResolution, this.ratio)

		//this.resizeToFitAR({width:this.bottomUICanvas.width * 0.8, height:this.bottomUICanvas.height * 0.4},this.containerQueue)
		this.resizeToFitAR({ width: this.gameCanvas.width * 0.9, height: this.gameCanvas.height * 0.73 }, this.gridContainer)

		if (this.gridContainer.scale.x > 1) {
			this.gridContainer.scale.set(1)
		}


		this.resizeToFit({ width: this.gameCanvas.width, height: this.gameCanvas.height * 0.08 }, this.topCanvas)
		this.resizeToFit({ width: this.gameCanvas.width, height: this.gameCanvas.height * 0.125 }, this.bottomUICanvas)


		//console.log(this.bottomUICanvas.scale.y, this.bottomUICanvas.height)

		this.cardsContainer.scale.x = (this.gridContainer.scale.x)
		this.cardsContainer.scale.y = (this.gridContainer.scale.y)


		this.gameCanvas.x = offset.x + innerResolution.width / 2 - this.gameCanvas.width / 2//* window.appScale.x// (innerResolution.width / 2 * window.appScale.x)
		this.gameCanvas.y = offset.y + innerResolution.height / 2 - this.gameCanvas.height / 2

		this.background.x = innerResolution.width / 2 + offset.x//* window.appScale.x// (innerResolution.width / 2 * window.appScale.x)
		this.background.y = innerResolution.height / 2 + offset.y// * window.appScale.y


		this.gridContainer.x = this.gameCanvas.x + this.gameCanvas.width / 2 - (this.gridContainer.width) / 2
		this.gridContainer.y = this.gameCanvas.y + this.gameCanvas.height / 2 - this.gridContainer.height / 2 - this.topCanvas.height//* 0.1125
		//utils.centerObject(this.gridContainer, this.gameCanvas)

		this.cardsContainer.x = this.gridContainer.x;
		this.cardsContainer.y = this.gridContainer.y;

		this.backGridContainer.x = this.gridContainer.x;
		this.backGridContainer.y = this.gridContainer.y;

		this.backGridContainer.scale.x = (this.gridContainer.scale.x)
		this.backGridContainer.scale.y = (this.gridContainer.scale.y)

		if (this.currentCard) {
			//13 is the width of the border on the grid
			this.currentCard.y = ((this.gridContainer.height) / this.gridContainer.scale.y);
		}

		this.startScreenContainer.resize(innerResolution, this.ratio)
		this.endGameScreenContainer.resize(innerResolution, this.ratio)
		this.updateLabelsPosition();

	}
	shuffleText(label) {
		let rnd1 = String.fromCharCode(Math.floor(Math.random() * 20) + 65);
		let rnd2 = Math.floor(Math.random() * 9);
		let rnd3 = String.fromCharCode(Math.floor(Math.random() * 20) + 65);
		let tempLabel = label.split('');
		let rndPause = Math.random();
		if (rndPause < 0.2) {
			let pos1 = Math.floor(Math.random() * tempLabel.length);
			let pos2 = Math.floor(Math.random() * tempLabel.length);
			if (tempLabel[pos1] != '\n')
				tempLabel[pos1] = rnd2;
			if (tempLabel[pos2] != '\n')
				tempLabel[pos2] = rnd3;
		} else if (rndPause < 0.5) {
			let pos3 = Math.floor(Math.random() * tempLabel.length);
			if (tempLabel[pos3] != '\n')
				tempLabel[pos3] = rnd3;
		}
		let returnLabel = '';
		for (var i = 0; i < tempLabel.length; i++) {
			returnLabel += tempLabel[i];
		}
		return returnLabel
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