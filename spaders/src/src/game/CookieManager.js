export default class CookieManager {
	constructor() {
		//this.resetCookie();
		// window.localStorage.clear();
		let defaultStats = {
			totalMatchesPlayed: 0,
			totalLevelsFinished: 0,
			totalMoves: 0,
			totalLevelsPlayTime: 0,
			totalShardsCollected: 0,
			totalBombsExploded: 0,
			totalCombos: 0, 
			colorPalletID: 0, 
			timesLoaded: 0
		}
		let defaultSettings = {
			sound: true,
			tutorial: false
		}
		let defaultDebug = {
			showAllThumbs: false
		}
		let stats = this.getCookie("stats");
		if (stats) {
			this.stats = stats;

			for (const key in defaultStats) {
				const element = defaultStats[key];
				if (this.stats[key] === undefined) {
					this.stats[key] = element;
					this.storeObject("stats", this.stats)
				}
			}
		} else {
			this.stats = defaultStats

			this.storeObject("stats", this.stats)
		}

		let debug = this.getCookie("debug");
		if (debug) {
			this.debug = debug;

			for (const key in defaultDebug) {
				const element = defaultDebug[key];
				if (this.debug[key] === undefined) {
					this.debug[key] = element;
					this.storeObject("debug", this.debug)
				}
			}
		} else {
			this.debug = defaultDebug

			this.storeObject("debug", this.debug)
		}

		let settings = this.getCookie("settings");
		if (settings) {
			this.settings = settings;

			for (const key in defaultSettings) {
				const element = defaultSettings[key];
				if (this.settings[key] === undefined) {
					this.settings[key] = element;
					this.storeObject("settings", this.settings)
				}
			}
		} else {
			this.settings = defaultSettings

			this.storeObject("settings", this.settings)
		}

		this.levelsCompleted = this.getCookie("levelsCompleted");
		if (!this.levelsCompleted) {
			this.levelsCompleted = {
				levels: []
			}
		}

		this.storeObject("levelsCompleted", this.levelsCompleted)

		this.stats.timesLoaded++
		this.storeObject("stats", this.stats)
	}
	updateColorPallete(id){
		this.stats.colorPalletID = id;
		this.storeObject("stats", this.stats);
	}
	addCombo() {
		this.stats.totalCombos++
		this.storeObject("stats", this.stats)
	}
	addExplosion() {
		this.stats.totalBombsExploded++
		this.storeObject("stats", this.stats)
	}
	findLevel(name) {
		for (let index = 0; index < this.levelsCompleted.levels.length; index++) {
			const element = this.levelsCompleted.levels[index];
			if (element.name == name) {
				return element;
			}
		}
	}
	saveLevel(name, bestTime = 50, highscore = 50, bestMoves = 60, normalScore = 100) {

		let levelsCompleted = {
			name: name,
			bestTime: bestTime,
			highscore: highscore,
			bestMoves: bestMoves,
			bestNormalScore: normalScore
		}
		let isHighscore = false;
		let found = false;

		for (let index = 0; index < this.levelsCompleted.levels.length; index++) {
			const element = this.levelsCompleted.levels[index];
			if (element.name == name) {
				if (element.bestTime > bestTime) {
					element.bestTime = bestTime;
				}

				if (element.highscore < highscore) {
					element.highscore = highscore;
					isHighscore = true;
				}

				if (element.bestMoves > bestMoves) {
					element.bestMoves = bestMoves;
				}

				if (element.bestNormalScore > normalScore) {
					element.bestNormalScore = normalScore;
				}

				found = true
				break;
			}
		}
		if (!found) {
			this.levelsCompleted.levels.push(levelsCompleted);
			isHighscore = true;
		}

		this.storeObject("levelsCompleted", this.levelsCompleted);


		this.stats.totalMoves += bestMoves
		this.stats.totalLevelsPlayTime += bestTime
		this.stats.totalShardsCollected += highscore

		this.stats.totalMatchesPlayed++;
		this.stats.totalLevelsFinished = this.levelsCompleted.levels.length;

		this.storeObject("stats", this.stats)

		return isHighscore;

	}
	wipeData() {
		this.resetCookie();
		window.localStorage.clear();

		window.location.reload();
	}
	updateSettings(data) {
		for (const key in data) {
			const element = data[key];
			this.settings[key] = element;
		}
		this.storeObject("settings", this.settings);
	}
	createCookie(name, value, days) {
		let sValue = JSON.stringify(value);
		try {
			window.localStorage.setItem(name, sValue)
		} catch (e) {
			// alert(sValue)
			//  	alert(e)
		}
	}
	getCookie(name) {
		return JSON.parse(window.localStorage.getItem(name))//(result === null) ? null : result[1];
	}
	storeObject(name, value) {
		window.localStorage.setItem(name, JSON.stringify(value))
	}
	resetCookie() {
		for (var i in window.localStorage) {
			window.localStorage.removeItem(i);
		}
	}
}