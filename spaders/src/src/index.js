import utils from './utils';
import ColorTweenManager from './color';
import config from './config';
import Game from './Game';
import GameData from './game/GameData';
import CookieManager from './game/CookieManager';
import TetraScreen from './game/screen/TetraScreen';
import EffectLayer from './game/effects/EffectLayer';
import Pool from './game/core/Pool';
import SoundManager from './game/SoundManager';
import colorSchemes from './colorSchemes';

window.LOGO_FONT = "round_popregular"
window.STANDARD_FONT1 = "pixolletta8pxmedium"
window.STANDARD_FONT2 = "round_popregular"
window.COOKIE_MANAGER = new CookieManager();
window.GAME_DATA = new GameData();

var version = '[AIV]{version}[/AIV]';
console.log('version', version);
window.CARD_ID = 0;

window.imageThumbs = {};

window.colorTweenManager = new ColorTweenManager();

window.ENEMIES = {
	list: [
		{ isBlock: false, color: config.colors.blue, life: 0 },
		{ isBlock: false, color: config.colors.red, life: 1 },
		{ isBlock: false, color: config.colors.yellow, life: 2 },
		{ isBlock: false, color: config.colors.green, life: 3 },
		{ isBlock: false, color: config.colors.blue2, life: 4 },
		{ isBlock: false, color: config.colors.pink, life: 5 },
		{ isBlock: false, color: config.colors.red2, life: 6 },
		{ isBlock: false, color: config.colors.purple, life: 7 },
		{ isBlock: false, color: config.colors.white, life: 8 },
		{ isBlock: false, color: config.colors.dark, life: 9 },
		{ isBlock: false, color: config.colors.grey, life: 9.1 },
		{ isBlock: false, color: config.colors.whiteSkin, life: 9.2 },
		{ isBlock: false, color: config.colors.darkSkin, life: 9.31 },
		{ isBlock: false, color: config.colors.darkSkin, life: 9.32 },
		{ isBlock: false, color: config.colors.darkSkin, life: 9.33 },
		{ isBlock: false, color: config.colors.darkSkin, life: 9.34 },
		{ isBlock: false, color: config.colors.darkSkin, life: 9.35 },
		{ isBlock: false, color: config.colors.darkSkin, life: 9.36 },
		{ isBlock: false, color: config.colors.darkSkin, life: 9.37 },
		{ isBlock: false, color: config.colors.darkSkin, life: 9.38 },
		{ isBlock: true, color: config.colors.block }
	]
}
window.ACTION_ZONES = [
	{ label: "TOP_LEFT", pos: { x: 0, y: 0 }, dir: { x: -1, y: -1 } },
	{ label: "TOP_CENTER", pos: { x: 1, y: 0 }, dir: { x: 0, y: -1 } },
	{ label: "TOP_RIGHT", pos: { x: 2, y: 0 }, dir: { x: 1, y: -1 } },
	{ label: "CENTER_RIGHT", pos: { x: 2, y: 1 }, dir: { x: 1, y: 0 } },
	{ label: "BOTTOM_RIGHT", pos: { x: 2, y: 2 }, dir: { x: 1, y: 1 } },
	{ label: "BOTTOM_CENTER", pos: { x: 1, y: 2 }, dir: { x: 0, y: 1 } },
	{ label: "BOTTOM_LEFT", pos: { x: 0, y: 2 }, dir: { x: -1, y: 1 } },
	{ label: "CENTER_LEFT", pos: { x: 0, y: 1 }, dir: { x: -1, y: 0 } }
]

window.colorsOrder = [
	config.colors.blue,
	config.colors.red,
	config.colors.yellow,
	config.colors.green,
	config.colors.blue2,
	config.colors.pink,
	config.colors.red2,
	config.colors.purple,
	config.colors.white,
	config.colors.dark,
]
let iconPath = ''//'./assets/images/newIcons/'
window.iconsData = {
	cancel: iconPath + 'cancel-96x96-1214345.png',
	debugging: iconPath + 'debugging2.png',
	soundOn: iconPath + 'volume-up-96x96-1214272.png',
	soundOff: iconPath + 'mute-96x96-1214309.png',
	reload: iconPath + 'reload-96x96-1214298.png',
	settings: iconPath + 'setting-96x96-1214292.png',
	home: iconPath + 'home-96x96-1214326.png',
	back: iconPath + 'back-arrow.png',
	next: iconPath + 'next-arrow.png',
	highscore: iconPath + 'fire-96x96-1408702.png',
	wipeData: iconPath + 'recycle-bin-96x96-1214299.png',
	time: iconPath + 'time.png',
}
window.getStyle = function (type, color) {
	let style = window.textStyles[type];
	if (color) {
		style.fill = color;
	}
	return style;
}
window.textStyles = {
	normalAttack: {
		font: '32px',
		fill: 0xFFFFFF,
		align: 'center',
		fontWeight: '800',
		fontFamily: window.STANDARD_FONT1,
		stroke: 0x000000,
		strokeThickness: 4
	},
	areaAttack: {
		font: '48px',
		fill: config.colors.purple,//yellow
		align: 'center',
		fontWeight: '800',
		fontFamily: window.STANDARD_FONT1,
		stroke: 0xFFFFFF,
		strokeThickness: 5
	},
	counter: {
		font: '48px',
		fill: config.colors.purple,//red
		align: 'center',
		fontWeight: '800',
		fontFamily: window.STANDARD_FONT1,
		stroke: 0x000000,
		strokeThickness: 5
	},
	explosion: {
		font: '52px',
		fill: config.colors.red,//red
		align: 'center',
		fontWeight: '800',
		fontFamily: window.STANDARD_FONT1,
		stroke: 0x000000,
		strokeThickness: 5
	}
},

	window.config = config;
window.POOL = new Pool();

window.console.warn = function () { }
window.console.groupCollapsed = function (teste) { return teste }//('hided warnings')


window.shuffleText = function shuffleText(label, keepfirstandlast = false) {
	let rnd1 = String.fromCharCode(Math.floor(Math.random() * 20) + 65);
	let rnd2 = Math.floor(Math.random() * 9);
	let rnd3 = String.fromCharCode(Math.floor(Math.random() * 20) + 65);
	let tempLabel = label.split('');
	let rndPause = Math.random();

	let rand = keepfirstandlast ? tempLabel.length - 2 : tempLabel.length;

	if (rndPause < 0.2) {
		let pos1 = Math.floor(Math.random() * rand) + (keepfirstandlast ? 1 : 0);
		let pos2 = Math.floor(Math.random() * rand) + (keepfirstandlast ? 1 : 0);
		if (tempLabel[pos1] != '\n')
			tempLabel[pos1] = rnd2;
		if (tempLabel[pos2] != '\n')
			tempLabel[pos2] = rnd3;
	} else if (rndPause < 0.5) {
		let pos3 = Math.floor(Math.random() * rand) + (keepfirstandlast ? 1 : 0);
		if (tempLabel[pos3] != '\n')
			tempLabel[pos3] = rnd3;
	}
	let returnLabel = '';
	for (var i = 0; i < tempLabel.length; i++) {
		returnLabel += tempLabel[i];
	}
	return returnLabel
}

window.IMAGE_DATA = {}

window.IMAGE_DATA.enemyBlockImages = ['block.png']
window.IMAGE_DATA.enemyBombImages = ['bomb.png']

window.IMAGE_DATA.enemyImagesFrame = []

for (let index = 0; index < 10; index++) {
	window.IMAGE_DATA.enemyImagesFrame.push('pixil-layer-' + index + '.png');

}

window.SAVE_DATA = function (data, filename, type) {
	var file = new Blob([data], { type: type });
	if (window.navigator.msSaveOrOpenBlob) // IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	else { // Others
		var a = document.createElement("a"),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function () {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}

}

const sManager = new SoundManager();
window.SOUND_MANAGER = sManager;

// let tempTrailAdded = {}
// colorSchemes.colorSchemes.forEach(element => {
// 	if(!tempTrailAdded[element.grid.spriteTrail]){
// 		PIXI.loader.add(element.grid.spriteTrail);
// 		tempTrailAdded[element.grid.spriteTrail] = true;
// 	}
// });

sManager.soundData.forEach(element => {
	PIXI.loader.add(element.src);
});
PIXI.loader
	.add('./assets/images/backgrounds.json')
	.add('./assets/images/game.json')
	.add('./assets/images/logo.json')
	.add('./data/levelSections.json')
	.add('./assets/fonts/stylesheet.css')
	.add('./assets/levels.json')
	.add('./assets/levelsRaw.json')
	.load(loadJsons)
	.onProgress.add(() => {
		//console.log(PIXI.loader.progress);
		if (window.game) {
			window.game.updateProgress(PIXI.loader.progress * 0.75);
		}
	});

window.levelsJson = ""

window.TIME_SCALE = 1;
const jsonPath = "./data/"

function loadJsons() {

	window.levelSections = PIXI.loader.resources[jsonPath + "levelSections.json"].data

	//window.questionMark = PIXI.loader.resources[jsonPath + "levelSections.json"].data.question

	PIXI.loader.add(jsonPath + window.levelSections.question.dataPath)


	for (let index = window.levelSections.sections.length - 1; index >= 0; index--) {
		const element = window.levelSections.sections[index];
		//console.log(element)
		if (element.ignore) {
			window.levelSections.sections.splice(index, 1)
		}

	}

	// console.log("--", window.levelSections)
	window.levelSections.sections.forEach(section => {
		//console.log(section)
		if (section.imageSrc) {
			PIXI.loader.add('./assets/' + section.imageSrc)
		}
		section.levels.forEach(level => {
			PIXI.loader.add(jsonPath + level.dataPath)
		});

	});



	PIXI.loader.load(configGame).onProgress.add(() => {
		//console.log(PIXI.loader.progress);
		if (window.game) {
			window.game.updateProgress(75 + PIXI.loader.progress * 0.25);
		}
	});
	// .add('./data/levelSections.json')
	// .load(configGame);
}
function findPropertyValue(data, propertyName) {
	let valueToReturn = 0;

	for (let index = 0; index < data.length; index++) {
		const element = data[index];
		if (element.name == propertyName) {

			valueToReturn = element.value;
			break;
		}
	}

	return valueToReturn;

}
function extractData(element, debug) {
	if (element.visible) {
		let data = {}
		data.levelName = element.name;
		let i = element.width;
		let j = element.height;
		data.tier = 0//findPropertyValue(element.properties, "tier");
		data.levelDataScale = findPropertyValue(element.properties, "scale")
		data.padding = {
			left: findPropertyValue(element.properties, "padding-left"), //| 0,
			right: findPropertyValue(element.properties, "padding-right"), //| 0,
			top: findPropertyValue(element.properties, "padding-top"), //| 0,
			bottom: findPropertyValue(element.properties, "padding-bottom") //| 0,
		}
		data.setAutoBlocker = findPropertyValue(element.properties, "autoPlaceBlockers")
		data.gameMode = findPropertyValue(element.properties, "gameMode")

		let tempArr = [];
		let levelMatrix = [];
		let levelMatrixDraw = [];

		let tempArrAddOn = [];
		let levelMatrixAddOn = [];

		for (let index = 0; index < element.data.length; index++) {
			let id = element.data[index];
			id %= 64;
			if (id < 32) {

				tempArr.push(id - 1)
				tempArrAddOn.push(- 1)
			} else {
				tempArr.push(- 1)
				tempArrAddOn.push(id - 1)

			}
			if (tempArr.length >= i) {
				index += element.width - i
				levelMatrix.push(tempArr)
				levelMatrixDraw.push(tempArr)
				levelMatrixAddOn.push(tempArrAddOn)
				if (levelMatrix.length >= j) {
					break;
				}
				tempArrAddOn = []
				tempArr = []
			}
		}

		data.addOn = levelMatrixAddOn;
		data.pieces = levelMatrix;


		let matrixCopy = [];

		for (let cc = 0; cc < levelMatrixDraw.length; cc++) {
			let cp = []
			for (let dd = 0; dd < levelMatrixDraw[cc].length; dd++) {
				cp.push(levelMatrixDraw[cc][dd])
			}
			matrixCopy.push(cp)
		}


		if (data.levelDataScale) {
			data.pieces = utils.scaleLevel(data.pieces, data.levelDataScale)
			data.scaled = true;
		} else {
			data.levelDataScale = 1;
		}

		data.colorPalletId = element.colorPalletId;
		if (!element.isAddon) {

			utils.trimMatrix(data.pieces)
			utils.paddingMatrix(data.pieces, data.padding)
			utils.trimMatrix(matrixCopy)
			let scalePadding = {
				left: data.padding.left * data.levelDataScale,
				right: data.padding.right * data.levelDataScale,
				top: data.padding.top * data.levelDataScale,
				bottom: data.padding.bottom * data.levelDataScale
			}
			utils.paddingMatrix(matrixCopy, scalePadding);

		}

		if (!element.isAddon && data.setAutoBlocker > 0) {
			//if(debug)
			// console.log("AddBlocker",data.colorPalletId)
			utils.addBlockers(data.pieces, data.setAutoBlocker, data.colorPalletId)
		}

		data.piecesToDraw = matrixCopy;
		return data
	}

}
window.getNextLevel = function(data) {
	console.log('getNextLevel',data)
	console.log(window.levelSections.sections)
	let section = null;
	let tier = null;
	window.levelSections.sections.forEach(element => {
		if (element.name == data.sectionName) {
			section = element;
		}
	});
	if (section) {
		section.levels.forEach(element => {
			if (element.name == data.tierName) {
				tier = element;
			}
		});
	}

	//find on tier.data if theres an unfinished level
	//if doesnt find nothing, finished the whole tier
	console.log(tier);
	//find on section.levels the next section
	//if doesnt find nothing, finished the whole section
	console.log(section);

}
window.allEstimate = 0;
window.allEstimateHard = 0;
function configGame() {

	window.questionMark = extractData(PIXI.loader.resources[jsonPath + window.levelSections.question.dataPath].data.layers[0])


	window.levelSections.sections.forEach(section => {

		//show the main sections



		let palletID = section.colorPalletId;

		if (palletID === undefined) {
			palletID = 0;
		}
		section.levels.forEach(level => {

			let res = PIXI.loader.resources[jsonPath + level.dataPath].data

			let sectionLevels = []

			res.properties.forEach(property => {
				if (property.name == "sectionName") {
					level.name = property.value;
				}

				if (property.name == "iconURL") {
					level.iconURL = property.value;
				}
			});

			level.sectionName = section.name;
			res.layers.forEach(layer => {

				let isAddon = layer.visible && layer.name.search("_ADDON") >= 0
				layer.isAddon = isAddon;
				let data = extractData(layer);

				if (layer.visible && sectionLevels.length == 1 && isAddon) {
					sectionLevels[0].addOn = data.addOn;
				}
				else if (sectionLevels.length > 1 && isAddon) {
					sectionLevels[sectionLevels.length - 1].addOn = data.addOn;
				} else if (data) {
					let idToSave = section.name + '-' + level.name + '-' + data.levelName;
					idToSave = idToSave.toLowerCase();
					idToSave = idToSave.split(' ').join('')
					idToSave = idToSave.replace(/\s/g, '')
					data.totalBoardLife = 0;
					data.idSaveData = idToSave;
					data.sectionName = section.name;
					data.tierName = level.name;
					data.sectionName = section.name;
					data.colorPalletId = palletID

					data.totalPieces = 0;
					data.totalEmptySpaces = 0;
					for (let index = 0; index < data.pieces.length; index++) {
						for (let j = 0; j < data.pieces[index].length; j++) {
							const element = data.pieces[index][j];
							if (element >= 0) {
								data.totalPieces++;
								if (colorSchemes.colorSchemes[palletID].list[element]) {

									let life = Math.floor(colorSchemes.colorSchemes[palletID].list[element].life) + 1;
									if (life) {
										data.totalBoardLife += life;
									}
								}
							} else {
								data.totalEmptySpaces++;
							}
						}

					}
					data.estimateTime = data.totalBoardLife / 0.45 + 30;
					data.estimateTimeHard = data.totalBoardLife / 0.4 + 30;
					data.emptySpaceByPieces = data.totalEmptySpaces / data.totalPieces;

					if (data.emptySpaceByPieces < 1) {
						data.estimateTimeHard /= Math.max(0.45, data.emptySpaceByPieces);
					}
					if (data.estimateTimeHard > 1200) {
						data.estimateTimeHard = Math.floor(data.estimateTimeHard / 300) * 300;
					} else {

						data.estimateTimeHard = Math.floor(data.estimateTimeHard / 30) * 30;
					}


					if (data.estimateTime > 1200) {
						data.estimateTime = Math.floor(data.estimateTime / 300) * 300;
					} else {

						data.estimateTime = Math.floor(data.estimateTime / 30) * 30;
					}
					data.estimateTime = Math.max(data.estimateTime, 60);
					data.estimateTime2 = utils.convertNumToTime(data.estimateTime);
					window.allEstimate += data.estimateTime;
					window.allEstimateHard += data.estimateTimeHard;
					sectionLevels.push(data);
				}

				if (isAddon) {
					utils.paddingMatrix(data.addOn, data.padding);
				}
			});
			level.colorPalletId = palletID
			level.data = sectionLevels

			//console.log(sectionLevels)

			sectionLevels.forEach(element => {
				if (element.scaled && element.addOn) {
					element.addOn = utils.scaleLevel(element.addOn, element.levelDataScale)
				}
			});

			for (let index = 0; index < level.data.length; index++) {
				let next = index + 1
				next %= level.data.length;
				level.data[index].next = level.data[next];
			}

		});


	});


	//let rawData = "./data/gameboy/gameboycreatures.json";
	let rawData = "./data/how-to-play/shapes-synt.json";
	window.levelsRawJson = PIXI.loader.resources[rawData].data
	//window.levelsRawJson = PIXI.loader.resources["./assets/levelsRaw.json"].data
	window.levelsJson = PIXI.loader.resources["./assets/levels.json"].data

	// console.log("SECTIONS", window.levelSections.sections)
	let targetColorPallet = 0;
	window.levelSections.sections.forEach(element => {
		element.levels.forEach(dataLevel => {
			if (rawData.includes(dataLevel.dataPath)) {
				// console.log(dataLevel)
				targetColorPallet = dataLevel.colorPalletId;
			}
		});
	});

	window.levelData = [];
	window.levelsRawJson.layers.forEach(element => {

		let isAddon = element.visible && element.name.search("_ADDON") >= 0
		element.isAddon = isAddon;
		element.colorPalletId = targetColorPallet
		let data = extractData(element, true);


		let dataa = null;
		if (window.levelData.length == 1 && isAddon) {
			window.levelData[0].addOn = data.addOn;
			dataa = window.levelData[0];
		}
		else if (window.levelData.length > 1 && isAddon) {
			window.levelData[window.levelData.length - 1].addOn = data.addOn;
			dataa = window.levelData[window.levelData.length - 1];
		} else if (data) {
			// console.log(data)
			data.colorPalletId = targetColorPallet;
			window.levelData.push(data)
		}

		if (isAddon) {
			utils.paddingMatrix(data.addOn, dataa.padding);
		}
	});

	console.log(window.levelData)

	window.levelData.forEach(element => {
		if (element.scaled && element.addOn) {
			element.addOn = utils.scaleLevel(element.addOn, element.levelDataScale)
		}
	});
	// utils.trimMatrix(window.levelData[0].pieces)
	// utils.paddingMatrix(window.levelData[0].pieces, { left: 3, right: 3, top: 2, bottom: 2 })
	// utils.addBlockers(window.levelData[0].pieces, 2)

	// console.log("ALL DATA", window.levelData)
	//console.log("ALL DATA", window.levelSections)
	//create screen manager

	game.onCompleteLoad();

	//window.BACKGROUND_EFFECTS = new BackgroundEffects()
	//add screens
	let screenManager = game.screenManager;
	let gameScreen = new TetraScreen('GameScreen');

	//game.stage.addChild(screenManager);

	screenManager.addScreen(gameScreen);
	//change to init screen
	screenManager.forceChange('GameScreen');

	window.EFFECTS = new EffectLayer(screenManager);
	game.stage.addChild(EFFECTS);



	game.addTapToStart();
	//game.update()

}

window.game = new Game(config);

document.addEventListener("deviceready", onDeviceReady, true);

window.addEventListener('resize', function (event) {
	if (window.game) {
		window.game.resize2();
	}
}, true);

window.isCordova = false;
function onDeviceReady() {
	window.isCordova = true;
	document.addEventListener("backbutton", onBackKeyDown, false);
}
function onBackKeyDown() {
	window.game.screenManager.backKeyDown();
}