import * as PIXI from 'pixi.js';
import ScreenManager from './screenManager/ScreenManager';
import config from './config';

export default class Game {

	constructor() {
		this.stage = new PIXI.Container();

		document.addEventListener('webkitfullscreenchange', (event) => {
			window.isFullScreen = false;
			if (document.webkitFullscreenElement !== null) {
				window.isFullScreen = true;
			}
		});
		document.addEventListener('fullscreenchange', (event) => {
			window.isFullScreen = false;
			if (document.fullscreenElement !== null) {
				window.isFullScreen = true;
			}
		});

		window.iOS = !!navigator.platform && (/iPad|iPhone|iPod/).test(navigator.platform);
		window.isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);

		this.resolution = {
			x: 0, y: 0,
			width: 10, height: 10,
		};

		this.innerResolution = {
			x: 0, y: 0,
			width: 10, height: 10,
		};

		this.desktopResolution = {
			width: config.width,
			height: config.height,
		};

		this.hScale = 1;

		if (window.isMobile) {
			this.resolution.width = window.innerWidth;
			this.resolution.height = window.innerHeight;
		}
		else {
			this.resolution.width = this.desktopResolution.width;
			this.resolution.height = this.desktopResolution.height;
		}

		this.gamb = 3;

		window.ASSET_URL = 'assets/';

	}
	// 	addFont(fontFace = 'londrina_solidregular', fontsrc = 'londrinasolid-regular-webfont') {
	// 		// console.log(`${window.ASSET_URL}font/${fontsrc}.woff2`);

	// 		return `\
	//   @font-face {\
	// 	  font-family: ${fontFace};\
	// 	  src: url(' ${window.ASSET_URL}font/${fontsrc}.woff2') format('woff2');\
	// 	  src: url('${window.ASSET_URL}font/${fontsrc}.woff') format('woff');\
	// 	  font-weight: normal;\
	// font-style: normal;\
	//   }\
	//   `;
	// 	}

	addScreenManager() {
		this.screenManager = new ScreenManager();
	}
	addManifest(manifest) {
		console.log(manifest);

		for (let index = 0; index < manifest.length; index++) {
			const element = manifest[index];

			this.loader.add(element);
			// this.loader.add(manifest);
		}
	}
	load() {
		this.loader.load(() => {
			this.onCompleteLoad();
		});
		this.loader.onProgress.add((progress) => {
			this.onProgress(progress);
		});
	}
	onProgress(progress) {
		// // console.log(progress.progress);
	}
	onCompleteLoad() {
		const newFont = document.createElement('style');

		//newFont.appendChild(document.createTextNode(this.addFont('pressstart2p', 'pressstart2p-webfont')));

		//document.head.appendChild(newFont);
		this.updateRes();

		let targetRes = !window.isMobile ? 3 : Math.min(window.devicePixelRatio, 2)
		this.app = new PIXI.Application(
			{
				width: this.desktopResolution.width,
				height: this.desktopResolution.height,
				resolution: targetRes,
				autoResize: false,
				backgroundColor: 0xFFFFFF,
			}
		);
		
		this.app.stage.addChild(this.stage);
		this.renderer = this.app.renderer;
		window.renderer = this.renderer
		document.body.appendChild(this.app.renderer.view);
		this.disableContextMenu(this.app.renderer.view);
		document.body.style.margin = 0;
		this.resize2()
		this.buildApplication();
	}
	buildApplication() {
		if (this.builded) {
			// console.log('Trying to build more than once');

			return;
		}
		this.builded = true;
		this.resize2();
		this.addScreenManager();
		this.stage.addChild(this.screenManager);


		//this.buildScreens();
		this.fixedFPS = 60;
		this.timestep = 1 / this.fixedFPS;

		this.fixedDelta = 0;
		this.lastFrameTimeMs = 0;

		this.elapsed = 0;
		this.start = Date.now();
		this.lag = 0;
		this.frameDuration = this.fixedFPS;
		// this.frameDuration = 1 / this.fixedFPS;

		this.update();
		//this.resize();
	}

	update() {
		let now = Date.now();
		this.dt = now - this.lastUpdate;
		this.lastUpdate = now;
		// if(this.dt < 30){
		// 	this.frameskip = 2;
		// }else{
		// 	this.frameskip = 1;
		// }
		this.dt /= 1000;
		this.resize2();
		this.screenManager.update(this.dt)
		this.renderer.render(this.stage);
		requestAnimationFrame(this.update.bind(this));
	}
	resize2() {
		//this.resolution = { width: window.outerWidth, height: window.outerHeight };
		this.resolution = { width: window.outerWidth, height: window.outerHeight };
		this.innerResolution = { width: window.innerWidth, height: window.innerHeight };

		this.renderer.view.style.width = `${this.innerResolution.width}px`;
		this.renderer.view.style.height = `${this.innerResolution.height}px`;



		if (this.screenManager) {
			 let sclX = config.width / this.innerResolution.width
			 let sclY = config.height / this.innerResolution.height

			//let sclX = this.innerResolution.width / config.width
			//let sclY = this.innerResolution.height / config.height

			this.renderer.view.style.width = `${this.innerResolution.width}px`;
			this.renderer.view.style.height = `${this.innerResolution.height}px`;

			window.appScale = { x: sclX, y: sclY };

			
			window.ratio = Math.min(sclX, sclY);

			this.resolution = { width: window.innerWidth / sclX, height: window.innerHeight / sclY };

			this.screenManager.scale.x = sclX//this.ratio
			this.screenManager.scale.y = sclY//this.ratio


			this.screenManager.pivot.x = this.innerResolution.width / 2 // this.screenManager.scale.x
			this.screenManager.pivot.y = this.innerResolution.height / 2 // this.screenManager.scale.y

			this.screenManager.x = this.innerResolution.width / 2 // this.screenManager.scale.x
			this.screenManager.y = this.innerResolution.height / 2 // this.screenManager.scale.y

			//console.log(window.appScale)

			this.screenManager.resize(this.resolution, this.innerResolution);
		}
	}
	resize() {
		// return;
		if (!isMobile) {
			const sclX = window.innerWidth < this.desktopResolution.width ? window.innerWidth / this.desktopResolution.width : 1;
			const sclY = window.innerHeight < this.desktopResolution.height ? window.innerHeight / this.desktopResolution.height : 1;

			const scl = Math.min(sclX, sclY);

			this.renderer.view.style.position = 'absolute';

			const newSize = {
				width: this.desktopResolution.width * scl,
				height: this.desktopResolution.height * scl,
			};

			// // console.log(newSize);

			this.renderer.view.style.width = `${newSize.width}px`;
			this.renderer.view.style.height = `${newSize.height}px`;

			if (newSize.height < window.innerHeight) {
				this.renderer.view.style.top = `${window.innerHeight / 2 - (newSize.height) / 2}px`;
			}
			if (newSize.width < window.innerWidth) {
				this.renderer.view.style.left = `${window.innerWidth / 2 - (newSize.width) / 2}px`;
			}

			// this.resolution.width = this.desktopResolution.width;
			// this.resolution.height = this.desktopResolution.height;

			// this.innerResolution.width = this.desktopResolution.width;
			// this.innerResolution.height = this.desktopResolution.height;

			if (this.screenManager) {
				this.screenManager.resize(this.resolution, this.innerResolution);
			}
			//

			//return;
		}

		this.updateRes();

		let deg = 0;
		let w = this.resolution.width;
		let h = this.resolution.height;
		let posX = (w - h) / 2;
		let posY = (w - h) / 2;
		const land = window.innerWidth > window.innerHeight;

		if (land) {
			const hNormal = w / window.screen.height;
			// let hNormal = w / window.screen.height;

			w = this.resolution.height;
			h = this.resolution.width;

			if (window.screen.width > window.screen.height) {
				posX = window.screen.width / 2 - h / 2; //* hNormal
				// alert(window.screen.height+' - '+ w)
				posY = window.innerHeight - window.screen.height;
			}
			else {
				posX = window.screen.width / 2 - w / 2;// window.screen.height / 2 - w / 2; //* hNormal
				// alert(window.screen.height+' - '+ w)
				posY = window.innerHeight - window.screen.width;
			}

			window.is90degree = false;
		}
		else {
			posX = this.innerResolution.x;
			posY = 0;
			// window.is90degree = true;
			deg = window.is90degree ? 90 : 0;

			if (window.isFullScreen) {
				// posX = (w - h) / 2;
				// posY = (w - h) / 2;
			}
		}
		this.renderer.view.style.webkitTransform = `rotate(${deg}deg) translate(${posX}px,${posY}px)`;
		this.renderer.view.style.mozTransform = `rotate(${deg}deg) translate(${posX}px,${posY}px)`;
		this.renderer.view.style.msTransform = `rotate(${deg}deg) translate(${posX}px,${posY}px)`;
		this.renderer.view.style.oTransform = `rotate(${deg}deg) translate(${posX}px,${posY}px)`;
		this.renderer.view.style.transform = `rotate(${deg}deg) translate(${posX}px,${posY}px)`;
		// alert('resize')
		if (this.screenManager) {
			this.screenManager.resize(this.resolution, this.innerResolution);
		}
	}

	updateRes() {
		let size;
		let innerSize;

		if (isMobile) {
			size = { width: window.screen.width, height: window.screen.height };

			innerSize = { width: window.innerWidth, height: window.innerHeight };

			// if (this.desktopResolution.width < this.desktopResolution.height)
			// {
			//     size = { height: window.screen.width, width: window.screen.height };
			//     innerSize = { height: window.innerWidth, width: window.innerHeight };

			// //     console.log(size);
			// //     console.log(size);
			// //     console.log(size);
			// //     console.log(size);
			// }
		}
		else {
			size = this.desktopResolution;
			innerSize = this.desktopResolution;
		}

		if (this.desktopResolution.width < this.desktopResolution.height) {
			// this.resolution.width = size.height;
			// this.resolution.height = size.width;
			this.resolution.width = size.width;
			this.resolution.height = size.height;
		}
		else {
			this.resolution.width = size.width;
			this.resolution.height = size.height;
		}

		if (this.desktopResolution.width < this.desktopResolution.height) {
			// this.innerResolution.width = innerSize.height;
			// this.innerResolution.height = innerSize.width;

			this.innerResolution.width = innerSize.width;
			this.innerResolution.height = innerSize.height;

			// this.innerResolution.x = this.resolution.width - this.innerResolution.width
		}
		else {
			this.innerResolution.width = innerSize.width;
			this.innerResolution.height = innerSize.height;
		}

		if (this.desktopResolution.width < this.desktopResolution.height) {
			// let temp = this.resolution.width;

			// this.resolution.width = this.resolution.height;
			// this.resolution.height = temp;

			// temp = this.innerResolution.width;
			// this.innerResolution.width = this.innerResolution.height;
			// this.innerResolution.height = temp;
		}
		// alert(`${this.resolution.width} - ${this.resolution.height}` + `\n${this.innerResolution.width} - ${this.innerResolution.height}`);
		this.innerResolution.x = this.resolution.width - this.innerResolution.width;
		this.innerResolution.y = this.resolution.height - this.innerResolution.height;

		// console.log(this);

		// this.hScale = 1;
	}
	getRealCenter() {
		const h = window.screen.height - this.innerResolution.height;

		// if (this.gamb > 0)
		// {
		//     alert(`${window.outerHeight} - ${window.screen.height}  ${h}${this.innerResolution.y}`);
		// }
		// this.gamb -= 3;

		// // console.log(window.innerHeight, this.innerResolution);

		return {
			x: this.innerResolution.x + this.innerResolution.width / 2,
			y: this.innerResolution.y + this.innerResolution.height / 2 - this.innerResolution.y,
		};
	}

	manageFullscreen() {
		return;
		if (document.body.mozRequestFullScreen) {
			// This is how to go into fullscren mode in Firefox
			// Note the "moz" prefix, which is short for Mozilla.
			document.body.mozRequestFullScreen();
		}
		else if (document.body.webkitRequestFullScreen) {
			// This is how to go into fullscreen mode in Chrome and Safari
			// Both of those browsers are based on the Webkit project, hence the same prefix.
			document.body.webkitRequestFullScreen();
		}
	}
	disableContextMenu(canvas) {
		canvas.addEventListener('contextmenu', (e) => {
			e.preventDefault();
		});
	}
	unPause() {
		// if (this.screenManager) { this.screenManager.timeScale = 1; }
		// SOUND_MANAGER.unmute();
		// console.log('UNPAUSEEEE');
	}

	pause() {
		// if (this.screenManager) { this.screenManager.timeScale = 0; }

		// console.log('PAUSEEEEE');

		// SOUND_MANAGER.mute();
	}
}
// export default class Game {
// 	constructor(config){
// 		const Renderer = (config.webgl) ? PIXI.autoDetectRenderer : PIXI.CanvasRenderer;
// 		//config.width = window.screen.width;

// 	// 	width: 414,
// 	// height: 736,

// 		//config.height = window.screen.height;
// 		this.ratio = config.width / config.height;
// 		window.renderer = new Renderer(config.width || 800, config.height || 600, config.rendererOptions);
// 		document.body.appendChild(window.renderer.view);

// 		this.stage = new PIXI.Container();
// 		//this.animationLoop = new PIXI.AnimationLoop(window.renderer);
// 		//this.animationLoop.on('prerender', this.update.bind(this));
// 		this.resize();

// 		this.frameskip = 1;
// 		this.lastUpdate = Date.now();

// 		PIXI.ticker.shared.add( this._onTickEvent, this );

// 		this.update();



// 	}
// 	_onTickEvent( deltaTime ) {

// 		this.dt =  deltaTime / 60;
// 		// console.log( deltaTime / 60);
// 	}
// 	resize() {
// 		if (window.innerWidth / window.innerHeight >= this.ratio) {
// 			//var w = window.innerHeight * this.ratio;
// 			var w = window.innerHeight * this.ratio;
// 			var h = window.innerHeight;
// 		} else {
// 			var w = window.innerWidth;
// 			var h = window.innerWidth / this.ratio;
// 		}
// 		window.renderer.view.style.width = w + 'px';
// 		window.renderer.view.style.height = h + 'px';
// 	}

// 	update(){
// 		let now = Date.now();
// 	    this.dt = now - this.lastUpdate;
// 	    this.lastUpdate = now;
// 	    // if(this.dt < 30){
// 	    // 	this.frameskip = 2;
// 	    // }else{
// 	    // 	this.frameskip = 1;
// 	    // }
// 	    this.dt /= 1000;
// 		for (var i = this.frameskip - 1; i >= 0; i--) {
// 			for(let i = 0; i < this.stage.children.length; i++){
// 				if(this.stage.children[i].update){
// 					// this.stage.children[i].update(this.dt / this.frameskip);
// 					// this.stage.children[i].update(this.dt);
// 					if(this.dt <= 1/30){
// 						this.stage.children[i].update(1/60);
// 					}else{
// 						this.stage.children[i].update(1/30);
// 					}
// 				}
// 			}
// 		}
// 		window.renderer.render(this.stage);
// 		requestAnimationFrame(this.update.bind(this));
// 	}

// 	start(){
// 	//	this.animationLoop.start();
// 	}

// 	stop(){
// 	//	this.animationLoop.stop();
// 	}
// }
