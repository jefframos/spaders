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


window.SAVE_DATA = function (data, filename, type = 'text/plain') {
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


window.LOGO_FONT = "round_popregular"

//pixolletta8pxmedium
//retro_gamingregular
//pixellarimedium
//early_gameboyregular
window.STANDARD_FONT1 = "pixolletta8pxmedium"
window.STANDARD_FONT2 = "round_popregular"
window.COOKIE_MANAGER = new CookieManager();
window.GAME_DATA = new GameData();

var version = '[AIV]{version}[/AIV]';
console.log('version', version);
window.CARD_ID = 0;

window.imageThumbs = {};
window.tilemapRenders = {};

window.colorTweenManager = new ColorTweenManager();

window.allTiers = {};

let obj = {}
let acc = 0
let size = 64
obj.frames = {}
obj.meta = {
	image: 'tile_1.png',
	size: { w: size * 8, h: size * 8 },
	format: "RGBA8888",
	scale: 1
}

for (let i = 0; i < 32; i++) {
	for (let j = 0; j < 32; j++) {
		obj.frames["tile_1_" + acc + ".png"] = {}
		obj.frames["tile_1_" + acc + ".png"].frame = { x: size * j, y: size * i, w: size, h: size }
		obj.frames["tile_1_" + acc + ".png"].rotated = false
		obj.frames["tile_1_" + acc + ".png"].trimmed = false
		obj.frames["tile_1_" + acc + ".png"].spriteSourceSize = { x: 0, y: 0, w: size, h: size }
		obj.frames["tile_1_" + acc + ".png"].sourceSize = { w: size, h: size }
		acc++
	}
}


//
//window.SAVE_DATA(JSON.stringify(obj), "test.json")
window.getNextLevel = function (data) {
	console.log('getNextLevel', data)
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

window.getTier = function (ti) {
	let tier;
	window.levelSections.sections.forEach(section => {
		if (isNaN(ti)) {
			section.levels.forEach(element => {
				if (element.id == ti) {
					tier = element;
				}
			});
		} else {
			ti = Math.min(ti, section.levels.length - 1)
			tier = section.levels[ti]
		}
	});

	return tier;
}

window.getLevelData = function (sec, ti, lvl) {
	let section = null;
	let tier = null;
	let level = null;

	console.log(sec, ti, lvl)
	if (sec != undefined) {

		if (isNaN(sec)) {
			window.levelSections.sections.forEach(element => {
				if (element.id.toLowerCase() == sec) {
					section = element;
				}
			});
		} else {
			sec = Math.min(sec, window.levelSections.sections.length - 1)
			section = window.levelSections.sections[sec]
		}
	}

	if (ti != undefined) {
		if (section) {
			if (isNaN(ti)) {
				section.levels.forEach(element => {
					if (element.id == ti) {
						tier = element;
					}
				});
			} else {
				ti = Math.min(ti, section.levels.length - 1)
				tier = section.levels[ti]
			}
		} else {
			console.log("getLevelData -> No Section")
		}
	}

	if (lvl != undefined && tier) {
		if (isNaN(lvl)) {
			tier.data.forEach(element => {
				if (element.id == lvl) {
					level = element;
				}
			});
		} else {
			lvl = Math.min(lvl, tier.data.length - 1)
			level = tier.data[lvl]
		}
	} else {
		console.log("getLevelData -> No Tier")
	}

	if (!level) {
		console.log("getLevelData -> No Level")
	}
	// console.log("section", section)
	// console.log("tier", tier)
	// console.log("level", level)

	let toReturn = { section, tier, level }
	console.log(toReturn)
	return toReturn

}

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
	{ label: "TOP_LEFT", pos: { x: 0, y: 0 }, dir: { x: -1, y: -1 }, sprite: "arrowTopLeft.png", offsetRotation: Math.PI * 0.25 },
	{ label: "TOP_CENTER", pos: { x: 1, y: 0 }, dir: { x: 0, y: -1 }, sprite: "arrowUp.png", offsetRotation: 0 },
	{ label: "TOP_RIGHT", pos: { x: 2, y: 0 }, dir: { x: 1, y: -1 }, sprite: "arrowTopLeft.png", offsetRotation: Math.PI * 0.25 },
	{ label: "CENTER_RIGHT", pos: { x: 2, y: 1 }, dir: { x: 1, y: 0 }, sprite: "arrowUp.png", offsetRotation: 0 },
	{ label: "BOTTOM_RIGHT", pos: { x: 2, y: 2 }, dir: { x: 1, y: 1 }, sprite: "arrowTopLeft.png", offsetRotation: Math.PI * 0.25 },
	{ label: "BOTTOM_CENTER", pos: { x: 1, y: 2 }, dir: { x: 0, y: 1 }, sprite: "arrowUp.png", offsetRotation: 0 },
	{ label: "BOTTOM_LEFT", pos: { x: 0, y: 2 }, dir: { x: -1, y: 1 }, sprite: "arrowTopLeft.png", offsetRotation: Math.PI * 0.25 },
	{ label: "CENTER_LEFT", pos: { x: 0, y: 1 }, dir: { x: -1, y: 0 }, sprite: "arrowUp.png", offsetRotation: 0 }
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
	question: iconPath + 'question-mark-96x96-2194193.png'
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
		strokeThickness: 3
	},
	areaAttack: {
		font: '48px',
		fill: config.colors.purple,//yellow
		align: 'center',
		fontWeight: '800',
		fontFamily: window.STANDARD_FONT1,
		stroke: 0xFFFFFF,
		strokeThickness: 3
	},
	counter: {
		font: '48px',
		fill: config.colors.purple,//red
		align: 'center',
		fontWeight: '800',
		fontFamily: window.STANDARD_FONT1,
		stroke: 0x000000,
		strokeThickness: 3
	},
	explosion: {
		font: '52px',
		fill: config.colors.red,//red
		align: 'center',
		fontWeight: '800',
		fontFamily: window.STANDARD_FONT1,
		stroke: 0x000000,
		strokeThickness: 3
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

for (let index = 1; index <= 10; index++) {
	window.IMAGE_DATA.enemyImagesFrame.push('spader' + index + '.png');
	//window.IMAGE_DATA.enemyImagesFrame.push('spaderTest' + index + '.png');
	//window.IMAGE_DATA.enemyImagesFrame.push('pixil-layer-' + index + '.png');

}

const sManager = new SoundManager();
window.SOUND_MANAGER = sManager;


sManager.soundData.forEach(element => {
	PIXI.loader.add(element.src);
});
PIXI.loader
	.add('./data/colors.json')
	.load(setUpColors)

let mainColors = null;
function setUpColors() {

	let colors = PIXI.loader.resources['./data/colors.json']

	for (let index = 0; index < colors.data.colorPaths.length; index++) {
		const element = colors.data.colorPaths[index];
		PIXI.loader.add('./data/' + element);
	}

	mainColors = colors.data;
	colorSchemes.colorSchemes = colors.data.colorSchemes

	PIXI.loader.load(setUpSchemes)

}
function setUpSchemes() {

	colorSchemes.colorSchemes = [];
	for (let index = 0; index < mainColors.colorPaths.length; index++) {
		const element = mainColors.colorPaths[index];

		let pallet = PIXI.loader.resources['./data/' + element].data
		colorSchemes.colorSchemes.push(pallet.pallete[0]);
	}

	window.game = new Game(config);

	PIXI.loader
		//.add('./assets/images/backgrounds.json')
		.add('./assets/images/game-0.json')
		.add('./assets/images/game-1.json')
		//.add('./assets/images/logo.json')
		//.add('./assets/images/tilemap.json')
		.add('./assets/images/tilemap_1.json')
		.add('./assets/images/arrowsUp.png')
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
}
window.levelsJson = ""

window.TIME_SCALE = 1;
const jsonPath = "./data/"

function loadJsons() {



	window.levelSections = PIXI.loader.resources[jsonPath + "levelSections.json"].data

	PIXI.loader.add(jsonPath + window.levelSections.question.dataPath)

	let avoidRepetition = {}
	window.levelSections.sections.forEach(section => {
		if (section.imageSrc) {
			PIXI.loader.add('./assets/' + section.imageSrc)
		}
		if (section.tilemapPath) {
			if (!avoidRepetition[section.tilemapPath]) {
				PIXI.loader.add(jsonPath + section.tilemapPath)
				avoidRepetition[section.tilemapPath] = true;
			}
		}
		section.levels.forEach(level => {

			if (!avoidRepetition[level.levelOrderMap]) {
				PIXI.loader.add(jsonPath + level.levelOrderMap)
				avoidRepetition[level.levelOrderMap] = true;
			}
			PIXI.loader.add(jsonPath + level.dataPath)
		});

	});

	//levelOrderMap

	PIXI.loader.load(configGame).onProgress.add(() => {
		//console.log(PIXI.loader.progress);
		if (window.game) {
			window.game.updateProgress(75 + PIXI.loader.progress * 0.25);
		}
	});
	// .add('./data/levelSections.json')
	// .load(configGame);
}
function findPropertyValue(data, propertyName, defaultValue = 0) {
	let valueToReturn = defaultValue;

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
	if (element.type == "objectgroup") {
		return;
	}
	if (element.visible) {
		let data = {}
		data.levelName = element.name;

		let nameID = element.name;
		nameID = nameID.toLowerCase();
		nameID = nameID.split(' ').join('')
		nameID = nameID.replace(/\s/g, '')
		data.id = nameID;


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
		data.fallTurns = findPropertyValue(element.properties, "fallTurns")
		data.isFinal = findPropertyValue(element.properties, "isFinal", false)
		data.require = findPropertyValue(element.properties, "require", null)
		if (data.require) {
			data.require = data.require.split(",");
		} else {
			data.require = [-1];
		}
		data.splitData = null;
		if (findPropertyValue(element.properties, "split_i")) {
			data.splitData = {
				i: findPropertyValue(element.properties, "split_i"),
				j: findPropertyValue(element.properties, "split_j"),
				scale: findPropertyValue(element.properties, "split_scale"),
			}
		}

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

		if (data.splitData) {
			//console.log(data);
			splitables.push(data);
		} else {

			if (data.levelDataScale) {
				data.pieces = utils.scaleLevel(data.pieces, data.levelDataScale)
				data.scaled = true;
			} else {
				data.levelDataScale = 1;
			}

			//data.customPallet = element.customPallet;
			if (!element.isAddon) {
				utils.trimMatrix(data.pieces)
				utils.paddingMatrix(data.pieces, data.padding)
				let offset = utils.trimMatrix(matrixCopy)
				data.offset = offset
				let scalePadding = {
					left: data.padding.left * data.levelDataScale,
					right: data.padding.right * data.levelDataScale,
					top: data.padding.top * data.levelDataScale,
					bottom: data.padding.bottom * data.levelDataScale
				}
				utils.paddingMatrix(matrixCopy, scalePadding);

			}
		}
		data.colorPalletId = element.colorPalletId;
		//data.colorPalletId = colorSchemes.findPallet(element.colorPalletId);

		if (!element.isAddon && data.setAutoBlocker > 0) {
			//if(debug)
			// console.log("AddBlocker",data.colorPalletId)
			utils.addBlockers(data.pieces, data.setAutoBlocker, data.colorPalletId)
		}

		data.piecesToDraw = matrixCopy;
		return data
	}

}
let splitables = [];
window.allEstimate = 0;
window.allEstimateHard = 0;

function splitLargeImage(level) {
	let iTotal = level.pieces.length / level.splitData.i;
	let jTotal = level.pieces[0].length / level.splitData.j;

	let newLevels = []


	for (let i = 0; i < level.splitData.i; i++) {
		for (let j = 0; j < level.splitData.j; j++) {
			let clone = {};
			for (const key in level) {
				if (Object.hasOwnProperty.call(level, key)) {
					clone[key] = level[key];
				}
			}
			let tempSplit = []
			for (let isp = 0; isp < iTotal; isp++) {
				level.pieces[isp + iTotal * i];

				let tempLine = []
				for (let jip = 0; jip < jTotal; jip++) {
					tempLine.push(level.pieces[isp + iTotal * i][jip + jTotal * j]);
				}

				tempSplit.push(tempLine);
			}

			clone.addOn = [];
			clone.levelName += "#" + i + " , " + j

			let nameID = clone.levelName;
			nameID = nameID.toLowerCase();
			nameID = nameID.split(' ').join('')
			nameID = nameID.replace(/\s/g, '')
			clone.id = nameID;

			let idToSave = clone.sectionName + '-' + clone.tierName + '-' + clone.levelName;
			idToSave = idToSave.toLowerCase();
			idToSave = idToSave.split(' ').join('')
			idToSave = idToSave.replace(/\s/g, '')

			clone.idSaveData = idToSave;

			clone.pieces = tempSplit;
			clone.piecesToDraw = tempSplit;

			clone.levelDataScale = level.splitData.scale;

			//utils.trimMatrix(clone.pieces)
			clone.pieces = utils.scaleLevel(clone.pieces, level.splitData.scale)

			utils.paddingMatrix(clone.pieces, clone.padding)
			//clone.pieces = utils.paddingMatrix(clone.pieces, level.splitData.scale)

			calcEstimatedTime(clone)
			newLevels.push(tempSplit);

			level.tier.data.push(clone);

			level.tier.splitData = clone.splitData;
		}
	}
	level.tier.data.shift();


}
function calcEstimatedTime(data) {

	data.totalPieces = 0;
	data.totalEmptySpaces = 0;
	data.totalBoardLife = 0;
	for (let index = 0; index < data.pieces.length; index++) {
		for (let j = 0; j < data.pieces[index].length; j++) {
			const element = data.pieces[index][j];
			if (element >= 0) {
				data.totalPieces++;
				if (colorSchemes.colorSchemes[data.colorPalletId].list[element]) {

					let life = Math.floor(colorSchemes.colorSchemes[data.colorPalletId].list[element].life) + 1;
					if (life) {
						data.totalBoardLife += life;
					}
				}
			} else {
				data.totalEmptySpaces++;
			}
		}

	}

	data.estimateTime = data.totalBoardLife / 0.54 + 30;
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

}
function arrayToMatrix(array, i, j, mod = 136) {
	let levelMatrix = [];

	let tempArr = [];
	for (let index = 0; index < array.length; index++) {
		let id = array[index];
		tempArr.push(id % mod);
		if (tempArr.length >= j) {
			levelMatrix.push(tempArr)
			if (levelMatrix.length >= i) {
				break;
			}
			tempArr = []
		}
	}

	return levelMatrix
}

function extractMap(data) {

	let largeTilemap = 32 * 32
	let tilesData = data.tilesets[0].tiles;

	let usedTiles = []
	if (tilesData) {

		tilesData.forEach(element => {
			usedTiles.push(element.image.split('/').pop())
		});
	} else {

		usedTiles = []
		for (let index = 0; index < largeTilemap; index++) {
			usedTiles.push('tile_1_' + index + '.png')

		}
	}
	let mapData = {
		terrainLayers: [],
		pathLayers: [],
		levelLayers: [],
		tiles: usedTiles,
		width: data.width,
		height: data.height,
		name: ""
	}

	data.layers.forEach(element => {
		if (element.visible && element.name.toLowerCase().includes("terrain")) {
			let matrix = arrayToMatrix(element.data, data.height, data.width, tilesData ? tilesData.lenght : largeTilemap);
			let noColor = element.name.toLowerCase().includes("nocolor")
			mapData.terrainLayers.push({ tiles: matrix, offsetx: element.offsetx | 0, offsety: element.offsety | 0, noColor })
		}
		if (element.visible && element.name.toLowerCase().includes("path")) {
			let noColor = element.name.toLowerCase().includes("nocolor")
			let matrix = arrayToMatrix(element.data, data.height, data.width, tilesData ? tilesData.lenght : largeTilemap, noColor);

			mapData.pathLayers.push({ tiles: matrix, offsetx: element.offsetx | 0, offsety: element.offsety | 0 })
		}
		if (element.visible && element.name.toLowerCase().includes("level")) {

			let matrix = arrayToMatrix(element.data, data.height, data.width, tilesData ? tilesData.lenght : largeTilemap);

			for (let j = 0; j < matrix.length; j++) {
				for (let i = 0; i < matrix[j].length; i++) {
					if (matrix[j][i] > 0) {

						let id = matrix[j][i]// % 136

						mapData.levelLayers.push({ id, i, j })
					}

				}
			}

			mapData.levelLayers.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))

		}
	});

	return mapData

}
function configGame() {



	window.questionMark = extractData(PIXI.loader.resources[jsonPath + window.levelSections.question.dataPath].data.layers[0])


	window.levelSections.sections.forEach(section => {

		//show the main sections

		if (section.tilemapPath) {
			section.mapData = extractMap(PIXI.loader.resources[jsonPath + section.tilemapPath].data);
			section.mapData.name = section.name + Math.random();
		}

		let nameID = section.name;
		nameID = nameID.toLowerCase();
		nameID = nameID.split(' ').join('')
		nameID = nameID.replace(/\s/g, '')
		section.id = nameID;


		let palletID = colorSchemes.findPallet(section.colorPalletId);
		//console.log("PALLET", palletID)
		let customPallet = -1;

		if (palletID === undefined) {
			palletID = 0;
		}
		section.colorPalletId = palletID;
		////////////level is tier
		section.levels.forEach(level => {


			let res = PIXI.loader.resources[jsonPath + level.dataPath].data

			let sectionLevels = []
			level.customPallet = -1;
			res.properties.forEach(property => {
				if (property.name == "sectionName") {
					level.name = property.value;
				}

				if (property.name == "coverID") {
					level.coverID = property.value;
				}

				if (property.name == "customPallet") {
					level.customPallet = property.value;
				}
			});

			let nameID = level.name;
			nameID = nameID.toLowerCase();
			nameID = nameID.split(' ').join('')
			nameID = nameID.replace(/\s/g, '')
			level.id = nameID;
			level.order = level.order;


			if (level.coverID == undefined) {
				level.coverID = 0;
			}
			customPallet = level.customPallet;
			level.sectionName = section.name;
			level.section = section;

			level.idSaveData = section.id + "-" + nameID;

			if (!window.allTiers[level.idSaveData]) {
				window.allTiers[level.idSaveData] = level;
			}

			if (level.levelOrderMap) {
				level.mapData = extractMap(PIXI.loader.resources[jsonPath + level.levelOrderMap].data);
				level.mapData.name = level.name + Math.random();
			}

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
					data.tier = level;


					////console.log(level.name)

					data.sectionName = section.name;

					if (customPallet >= 0 || isNaN(customPallet)) {
						data.colorPalletId = colorSchemes.findPallet(customPallet);
					} else {

						data.colorPalletId = palletID
					}


					calcEstimatedTime(data);

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

			//console.log(level.colorPalletId)

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


	window.levelsJson = PIXI.loader.resources["./assets/levels.json"].data

	console.log("SECTIONS", window.levelSections.sections)
	let targetColorPallet = 0;
	window.levelSections.sections.forEach(element => {
		element.levels.forEach(dataLevel => {
			if (rawData.includes(dataLevel.dataPath)) {
				// console.log(dataLevel)
				targetColorPallet = colorSchemes.findPallet(dataLevel.colorPalletId);
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

	console.log("ALL DATA", window.levelSections)


	splitables.forEach(element => {
		splitLargeImage(element)
	});

	window.levelSections.sections.forEach(sections => {
		sections.levels.forEach(levels => {
			levels.data.forEach(levelsData => {
				//console.log(levelsData)
				//let max = Math.max(levelsData.pieces[0].length, levelsData.pieces.length);
				if (levelsData.pieces[0].length > 10 || levelsData.pieces.length > 12) {
					//console.log(levelsData.tierName + ' - ' + levelsData.levelName, levelsData.pieces[0].length + ' x ' + levelsData.pieces.length);
				}
			});
		});
	});


	game.onCompleteLoad();

	let screenManager = game.screenManager;
	let gameScreen = new TetraScreen('GameScreen');

	//game.stage.addChild(screenManager);

	screenManager.addScreen(gameScreen);
	//change to init screen
	screenManager.forceChange('GameScreen');

	window.EFFECTS = new EffectLayer(screenManager);
	game.stage.addChild(EFFECTS);



	game.addTapToStart();
}


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
	if (!window.game) {
		return
	}
	window.game.screenManager.backKeyDown();
}