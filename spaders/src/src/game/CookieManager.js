export default class CookieManager {
	constructor() {
		//this.resetCookie();
		// window.localStorage.clear();

		let defaultSettings = {
			sound: true,
			tutorial: false
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
	}
	findLevel(name) {
		for (let index = 0; index < this.levelsCompleted.levels.length; index++) {
			const element = this.levelsCompleted.levels[index];
			if (element.name == name) {
				return element;
			}
		}
	}
	saveLevel(name, bestTime, highscore, bestMoves, normalScore) {

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
				if(element.bestTime > bestTime){
					element.bestTime = bestTime;
				}
		
				if(element.highscore < highscore){
					element.highscore = highscore;
					isHighscore = true;
				}
		
				if(element.bestMoves > bestMoves){
					element.bestMoves = bestMoves;
				}

				if(element.bestNormalScore > normalScore){
					element.bestNormalScore = normalScore;
				}

				found = true
				break;
			}
		}
		if(!found){
			this.levelsCompleted.levels.push(levelsCompleted);
			isHighscore = true;
		}

		this.storeObject("levelsCompleted", this.levelsCompleted);

		return isHighscore;
		
	}
	wipeData(){
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