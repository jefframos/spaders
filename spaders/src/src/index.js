import plugins from './plugins';
import config from './config';
import Game from './Game';
import GameData from './game/GameData';
import CookieManager from './game/CookieManager';
import GlobalGameView from './game/GlobalGameView';
import ScreenManager from './screenManager/ScreenManager';
import GameScreen from './game/screen/GameScreen';
import LoadScreen from './game/screen/LoadScreen';
import StartScreen from './game/screen/StartScreen';
import ChooseTeamScreen from './game/screen/ChooseTeamScreen';
import ChooseFieldScreen from './game/screen/ChooseFieldScreen';
import GameOverScreen from './game/screen/GameOverScreen';
import TetraScreen from './game/screen/TetraScreen';
import EffectLayer from './game/effects/EffectLayer';
import BackgroundEffects from './game/effects/BackgroundEffects';
import ChooseMatchScreen from './game/screen/ChooseMatchScreen';
import Pool from './game/core/Pool';



window.COOKIE_MANAGER = new CookieManager();
window.GAME_DATA = new GameData();

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
],

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

window.IMAGE_DATA.enemyBlockImages = ['./assets/images/newEnemies/block.png']

window.IMAGE_DATA.enemyImages = []

for (let index = 0; index < 10; index++) {
	window.IMAGE_DATA.enemyImages.push('./assets/images/newEnemies/pixil-layer-' + index + '.png');

}
window.IMAGE_DATA.enemyBlockImages.forEach(element => {
	PIXI.loader.add(element)
});
window.IMAGE_DATA.enemyImages.forEach(element => {
	PIXI.loader.add(element)
});

PIXI.loader
	.add('./data/levelSections.json')
	.add('./assets/fonts/stylesheet.css')
	.add('./assets/images/tvlines.png')
	.add('./assets/images/backLabel.png')
	.add('./assets/levels.json')
	.add('./assets/levelsRaw.json')
	.add('./assets/images/cancel.png')
	.add('./assets/images/cycle.png')
	.add('./assets/images/previous-button.png')
	.add('./assets/images/game_bg.png')
	.add('./assets/images/enemy.png')
	.add('./assets/images/glitch1.jpg')
	.add('./assets/images/glitch2.jpg')
	.add('./assets/images/particle1.png')
	.add('./assets/images/screen_displacement.jpg')
	.add('./assets/images/block.jpg')
	// .add('./assets/images/map.jpg')
	.load(loadJsons);

window.levelsJson = ""


const jsonPath = "./data/"

function loadJsons() {

	window.levelSections = PIXI.loader.resources[jsonPath + "levelSections.json"].data

	window.levelSections.sections.forEach(section => {
		section.levels.forEach(level => {
			PIXI.loader.add(jsonPath + level.dataPath)
		});

	});



	PIXI.loader.load(configGame);
	// .add('./data/levelSections.json')
	// .load(configGame);
}

function extractData(element) {
	if (element.visible) {

		let data = {}
		data.levelName = element.name;
		let i = element.width;
		let j = element.height;
		data.tier = 0;
		if (element.properties[0].name == "i") {
			i = element.properties[0].value;
		}
		if (element.properties[1].name == "j") {
			j = element.properties[1].value;
		}
		if (element.properties[2].name == "tier") {
			data.tier = element.properties[2].value;
		}
		let tempArr = [];
		let levelMatrix = [];
		for (let index = 0; index < element.data.length; index++) {
			const id = element.data[index];
			tempArr.push(id - 1)
			if (tempArr.length >= i) {
				index += element.width - i
				levelMatrix.push(tempArr)
				if (levelMatrix.length >= j) {
					break;
				}
				tempArr = []
			}
		}

		data.pieces = levelMatrix;
		return data
	}

}
function configGame() {


	window.levelSections.sections.forEach(section => {

		section.levels.forEach(level => {
			
			let res = PIXI.loader.resources[jsonPath + level.dataPath].data
			
			let sectionLevels = []
			res.layers.forEach(layer => {
				let data = extractData(layer);

				if (data) {
					sectionLevels.push(data);
					console.log(data)
				}
			});
			level.data = sectionLevels
		});
	});



	window.game = new Game(config);
	window.levelsRawJson = PIXI.loader.resources["./assets/levelsRaw.json"].data
	window.levelsJson = PIXI.loader.resources["./assets/levels.json"].data


	window.levelTiersData = [];
	for (let index = 0; index < 10; index++) {
		window.levelTiersData.push([]);
	}
	window.levelData = [];
	window.levelsRawJson.layers.forEach(element => {
		if (element.visible) {

			let data = {}
			data.levelName = element.name;
			let i = element.width;
			let j = element.height;
			data.tier = 0;
			if (element.properties[0].name == "i") {
				i = element.properties[0].value;
			}
			if (element.properties[1].name == "j") {
				j = element.properties[1].value;
			}
			if (element.properties[2].name == "tier") {
				data.tier = element.properties[2].value;
			}
			let tempArr = [];
			let levelMatrix = [];
			for (let index = 0; index < element.data.length; index++) {
				const id = element.data[index];
				tempArr.push(id - 1)
				if (tempArr.length >= i) {
					index += element.width - i
					levelMatrix.push(tempArr)
					if (levelMatrix.length >= j) {
						break;
					}
					tempArr = []
				}
			}

			data.pieces = levelMatrix;

			window.levelData.push(data)
			window.levelTiersData[data.tier].push(data);
		}

	});
	console.log(window.levelTiersData)
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


	// screenManager.filters = [this.pixelate]




}
