import * as PIXI from 'pixi.js';

export default class ScreenManager extends PIXI.Container
{
    constructor()
    {
        super();
        this.prevScreen = null;
        this.currentScreen = null;
        this.screenList = [];
        this.screensContainer = new PIXI.Container();
        this.addChild(this.screensContainer);
        this.timeScale = 1;
        this.resolution = { width: 10, height: 10 };
    }
    addScreen(screen)
    {
        this.screenList.push(screen);
        this.currentScreen = screen;
        screen.screenManager = this;
        if (screen.onAdded)
        {
            screen.onAdded();
        }
    }
    backScreen()
    {
        this.change(this.prevScreen);
    }
    change(screenLabel, param)
    {
        let tempScreen;

        for (let i = 0; i < this.screenList.length; i++)
        {
            if (this.screenList[i].label == screenLabel)
            {
                tempScreen = this.screenList[i];
            }
        }
        if (this.currentScreen)
        {
            this.currentScreen.transitionOut(tempScreen, param);
        }
    }
    // change between screens
    forceChange(screenLabel, param)
    {
        if (this.currentScreen && this.currentScreen.parent)
        {
            this.screensContainer.removeChild(this.currentScreen);
            this.prevScreen = this.currentScreen.label;
        }
        let tempScreen;

        for (let i = 0; i < this.screenList.length; i++)
        {
            if (this.screenList[i].label == screenLabel)
            {
                tempScreen = this.screenList[i];
            }
        }
        this.currentScreen = tempScreen;
        this.currentScreen.build(param);
        if (this.resolution && this.innerResolution)
        { this.currentScreen.resize(this.resolution, this.innerResolution); }
        this.currentScreen.transitionIn();
        this.screensContainer.addChild(this.currentScreen);
    }
    resize(resolution, innerResolution)
    {
        this.resolution = resolution;
        this.innerResolution = innerResolution;

		this.screensContainer.pivot.x = innerResolution.width / 2
		this.screensContainer.pivot.y = innerResolution.height / 2

		this.screensContainer.x = innerResolution.width / 2
		this.screensContainer.y = innerResolution.height / 2

        if (this.screenList.length)
        {
            this.currentScreen.resize(this.resolution, this.innerResolution);
        }
    }
    // update manager
    update(delta)
    {
        if (this.screenList.length)
        {
            this.currentScreen.update(delta * this.timeScale);
        }
    }
}