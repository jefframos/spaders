import config from './config';
export default {
    
    colorSchemes:[],
    //  [
    //     {
    //         name:"standard",
    //         block: { id: 19, hasWhite: false, isBlock: true, color: config.colors.block },
    //         list: [
    //             { hasWhite: false, isBlock: false, color: config.colors.blue, life: 0 },
    //             { hasWhite: false, isBlock: false, color: config.colors.red, life: 1 },
    //             { hasWhite: false, isBlock: false, color: config.colors.yellow, life: 2 },
    //             { hasWhite: false, isBlock: false, color: config.colors.green, life: 3 },
    //             { hasWhite: false, isBlock: false, color: config.colors.blue2, life: 4 },
    //             { hasWhite: false, isBlock: false, color: config.colors.pink, life: 5 },
    //             { hasWhite: false, isBlock: false, color: config.colors.red2, life: 6 },
    //             { hasWhite: false, isBlock: false, color: config.colors.purple, life: 7 },
    //             { hasWhite: false, isBlock: false, color: config.colors.white, life: 8.1 },
    //             { hasWhite: 0xFFFFFF, isBlock: false, color: config.colors.dark, life: 4.1 },
    //             { hasWhite: false, isBlock: false, color: config.colors.grey, life: 5.1 },
    //             { hasWhite: false, isBlock: false, color: config.colors.whiteSkin, life: 6.2 },
    //             { hasWhite: false, isBlock: false, color: config.colors.darkSkin, life: 6.3 },
    //             { hasWhite: false, isBlock: false, color: config.colors.darkSkin, life: 5.3 },
    //             { hasWhite: false, isBlock: false, color: config.colors.darkSkin, life: 6.3 },
    //             { hasWhite: false, isBlock: false, color: config.colors.darkSkin, life: 7.3 },
    //             { hasWhite: false, isBlock: false, color: config.colors.darkSkin, life: 8.3 },
    //             { hasWhite: false, isBlock: false, color: config.colors.darkSkin, life: 4.3 },
    //             { hasWhite: false, isBlock: false, color: config.colors.darkSkin, life: 3.3 },
    //         ],
    //         dark: 0x111111,
    //         fillBarColor: config.colors.green,
    //         fillBarCompleteColor: config.colors.purple,
    //         background: 0x151515,
    //         fontColor: 0xFFFFFF,
    //         arrowTrailColor: 0xFFFFFF,
    //         buttonData: {
    //             fontColor: 0xFFFFFF,
    //             levelCompleteColor: config.colors.blue2,
    //             tierCompleteColor: config.colors.purple,
    //             buttonStandardColor: 0x333333,
    //             buttonStandardDarkColor: 0x111111,
    //         },
    //         grid: {
    //             color: 0xFFFFFF,
    //             sprite: "largeCard.png",
    //             spriteTile: "largeCard.png",
    //             spriteTrail: "largeCard.png",
    //             spriteRect: "largeCard.png",
    //             scaleTrail: false,
    //             minAlpha: 0,
    //             extraTileAlpha: 0
    //         }
    //     },
    //     {
    //         name:"synth",
    //         block: { id: 32, hasWhite: false, isBlock: true, color: config.colors.block },
    //         list: [//syinth
    //             { hasWhite: false, isBlock: false, color: 0xffd319, life: 0 },
    //             { hasWhite: false, isBlock: false, color: 0xff901f, life: 1 },
    //             { hasWhite: false, isBlock: false, color: 0xff2975, life: 2 },
    //             { hasWhite: false, isBlock: false, color: 0xf222ff, life: 3 },
    //             { hasWhite: false, isBlock: false, color: 0x8c1eff, life: 4 },
    //             { hasWhite: false, isBlock: false, color: 0x6df1d8, life: 5 },
    //             { hasWhite: false, isBlock: false, color: 0x5c2c6d, life: 6 },
    //             { hasWhite: 0xffffff, isBlock: false, color: 0x3c345c, life: 7 },//8

    //             { hasWhite: false, isBlock: false, color: 0xffffff, life: 8 },
    //             { hasWhite: 0xffffff, isBlock: false, color: 0x333333, life: 9 },
    //             { hasWhite: false, isBlock: false, color: 0xb8aec8, life: 9.1 },
    //             { hasWhite: false, isBlock: false, color: 0x5da4a6, life: 9.2 },
    //             { hasWhite: false, isBlock: false, color: 0xd30cb8, life: 5.3 },
    //             { hasWhite: false, isBlock: false, color: 0xef281e, life: 5.3 },
    //             { hasWhite: false, isBlock: false, color: 0xff6861, life: 6.3 },
    //             { hasWhite: false, isBlock: false, color: 0xee5dc0, life: 7.3 },//16

    //             { hasWhite: false, isBlock: false, color: 0x844f58, life: 7.3 },
    //             { hasWhite: false, isBlock: false, color: 0x831732, life: 5.3 },
    //             { hasWhite: false, isBlock: false, color: 0xff3b72, life: 4.3 },
    //             { hasWhite: false, isBlock: false, color: 0xff5c8f, life: 3.3 },
    //             { hasWhite: false, isBlock: false, color: 0xfc92cf, life: 2.3 },
    //             { hasWhite: 0xfc92cf, isBlock: false, color: 0x300837, life: 9.3 },
    //             { hasWhite: 0x8ad2f4, isBlock: false, color: 0x1e1a69, life: 8.3 },
    //             { hasWhite: false, isBlock: false, color: 0x524977, life: 7.3 },//24

    //             { hasWhite: false, isBlock: false, color: 0x3484f5, life: 4.3 },
    //             { hasWhite: false, isBlock: false, color: 0x8ad2f4, life: 3.3 },
    //             { hasWhite: false, isBlock: false, color: 0xf4d28a, life: 3.3 },
    //             { hasWhite: false, isBlock: false, color: 0x98e826, life: 3.3 },

    //         ],
    //         dark: 0x111111,
    //         fillBarColor: 0xffd319,
    //         fillBarCompleteColor: 0xFFFFFF,
    //         background: 0x151515,
    //         fontColor: 0xFFFFFF,
    //         arrowTrailColor: 0xFFFFFF,
    //         buttonData: {
    //             fontColor: 0xFFFFFF,
    //             levelCompleteColor: config.colors.blue2,
    //             tierCompleteColor: config.colors.purple,
    //             buttonStandardColor: 0x333333,
    //             buttonStandardDarkColor: 0x030303,
    //         },
    //         grid: {
    //             color: 0xFFFFFF,
    //             sprite: "pixelSquare.png",
    //             spriteTile: "pixelSquare.png",
    //             spriteTrail: "pixelSquare.png",
    //             spriteRect: "pixelSquare.png",
    //             scaleTrail: false,
    //             minAlpha: 0,
    //             extraTileAlpha: 0
    //         },
    //         backgroundAssets: {
    //             bottomBackground: "game_bg.png",
    //             bottomBackgroundPosition: -0.2,
    //             alpha:0,
    //         }
    //     },
    //     {
    //         name:"gameboy",
    //         block: { id: 19, hasWhite: false, isBlock: true, color: config.colors.block },
    //         list: [//gb
    //             { hasWhite: false, isBlock: false, color: 0x85cd6e, life: 0 },
    //             { hasWhite: false, isBlock: false, color: 0x89c077, life: 1 },
    //             { hasWhite: false, isBlock: false, color: 0x4da350, life: 2 },
    //             { hasWhite: false, isBlock: false, color: 0x65b26f, life: 3 },
    //             { hasWhite: false, isBlock: false, color: 0x3f7e5d, life: 4 },
    //             { hasWhite: false, isBlock: false, color: 0x37764a, life: 5 },
    //             { hasWhite: false, isBlock: false, color: 0x224939, life: 6 },
    //             { hasWhite: false, isBlock: false, color: 0x285746, life: 7 },
    //             { hasWhite: false, isBlock: false, color: 0xbad1b8, life: 8 },
    //             { hasWhite: 0xbad1b8, isBlock: false, color: 0x252b25, life: 5.1 },
    //             { hasWhite: false, isBlock: false, color: 0x555a56, life: 9.1 },
    //             { hasWhite: false, isBlock: false, color: 0xddd3ab, life: 9.2 },
    //             { hasWhite: 0xbad1b8, isBlock: false, color: 0x3b3c2e, life: 9.3 },
    //             { hasWhite: false, isBlock: false, color: 0x37b05b, life: 5.3 },
    //             { hasWhite: false, isBlock: false, color: 0x7552cf, life: 6.3 },
    //             { hasWhite: false, isBlock: false, color: 0x3b3c2e, life: 7.3 },
    //             { hasWhite: false, isBlock: false, color: 0x3b3c2e, life: 8.3 },
    //             { hasWhite: false, isBlock: false, color: 0x3b3c2e, life: 4.3 },
    //             { hasWhite: false, isBlock: false, color: 0x3b3c2e, life: 3.3 },
    //         ],
    //         dark: 0x182018,
    //         fillBarColor: 0x85cd6e,
    //         fillBarCompleteColor: 0xFFFFFF,
    //         background: 0xCADCA0,
    //         fontColor: 0x182018,
    //         arrowTrailColor: 0x182018,
    //         buttonData: {
    //             fontColor: 0xFFFFFF,
    //             levelCompleteColor: 0x89c077,
    //             tierCompleteColor: 0x65b26f,
    //             buttonStandardColor: 0x3f7e5d,
    //             buttonStandardDarkColor: 0x252b25,
    //         },
    //         grid: {
    //             color: 0x182018,
    //             sprite: "gbGridTile.png",
    //             spriteTile: "gbGrid.png",
    //             spriteTrail: "gbGrid.png",
    //             spriteRect: "gbGrid.png",
    //             scaleTrail: false,
    //             minAlpha: 0.5,
    //             extraTileAlpha: 0.5
    //         },
    //         backgroundAssets: {
    //             bottomBackground: "gbBackground.png",
    //             bottomBackgroundPosition: 0.01,
    //             alpha: 0.75,
    //         }
    //     },
    //     {
    //         name:"pokemon",
    //         block: { id: 19, hasWhite: false, isBlock: true, color: config.colors.block },
    //         list: [//poke
    //             { hasWhite: false, isBlock: false, color: 0x4890a8, life: 0 },
    //             { hasWhite: false, isBlock: false, color: 0xf06060, life: 1 },
    //             { hasWhite: false, isBlock: false, color: 0xf0d818, life: 2 },
    //             { hasWhite: false, isBlock: false, color: 0x75bf8b, life: 3 },
    //             { hasWhite: false, isBlock: false, color: 0x1471b0, life: 4 },
    //             { hasWhite: false, isBlock: false, color: 0xe9bbe9, life: 5 },
    //             { hasWhite: false, isBlock: false, color: 0xf07848, life: 6 },
    //             { hasWhite: false, isBlock: false, color: 0xc078d8, life: 7 },
    //             { hasWhite: false, isBlock: false, color: 0xd8d8d8, life: 8 },
    //             { hasWhite: 0xFFFFFF, isBlock: false, color: 0x333333, life: 9 },
    //             { hasWhite: false, isBlock: false, color: 0x888888, life: 9.1 },
    //             { hasWhite: false, isBlock: false, color: 0xcfbda9, life: 9.2 },
    //             { hasWhite: false, isBlock: false, color: 0x786048, life: 9.3 },
    //             { hasWhite: false, isBlock: false, color: 0x37b05b, life: 5.3 },
    //             { hasWhite: false, isBlock: false, color: 0x7552cf, life: 6.3 },
    //             { hasWhite: false, isBlock: false, color: 0x7b7caf, life: 7.3 },
    //             { hasWhite: false, isBlock: false, color: 0xeee19b, life: 8.3 },
    //             { hasWhite: false, isBlock: false, color: 0x786048, life: 4.3 },
    //             { hasWhite: false, isBlock: false, color: 0x786048, life: 3.3 },
    //         ],
    //         dark: 0x333333,
    //         fillBarColor: 0x4890a8,
    //         fillBarCompleteColor: 0xFFFFFF,
    //         background: 0x333333,
    //         fontColor: 0xFFFFFF,
    //         arrowTrailColor: 0xFFFFFF,
    //         buttonData: {
    //             fontColor: 0xFFFFFF,
    //             levelCompleteColor: config.colors.blue2,
    //             tierCompleteColor: config.colors.purple,
    //             buttonStandardColor: 0x444444,
    //             buttonStandardDarkColor: 0x333333,
    //         },
    //         grid: {
    //             color: 0xFFFFFF,
    //             sprite: "largeCard.png",
    //             spriteTile: "largeCard.png",
    //             spriteTrail: "largeCard.png",
    //             spriteRect: "largeCard.png",
    //             scaleTrail: false,
    //             minAlpha: 0,
    //             extraTileAlpha: 0
    //         }
    //     },
    //     {
    //         name:"videogames",
    //         block: { id: 32, hasWhite: false, isBlock: true, color: config.colors.block },
    //         list: [
    //             { hasWhite: false, isBlock: false, color: 0x71bf45, life: 0 },
    //             { hasWhite: false, isBlock: false, color: 0x00a1e5, life: 1 },
    //             { hasWhite: false, isBlock: false, color: 0xffde00, life: 2 },
    //             { hasWhite: false, isBlock: false, color: 0xed145b, life: 3 },
    //             { hasWhite: false, isBlock: false, color: 0x8c1eff, life: 4 },
    //             { hasWhite: false, isBlock: false, color: 0xff3ffd, life: 5 },
    //             { hasWhite: false, isBlock: false, color: 0xff5600, life: 6 },
    //             { hasWhite: false, isBlock: false, color: 0xffffff, life: 7 },

    //             { hasWhite: false, isBlock: false, color: 0x9ee078, life: 8.1 },
    //             { hasWhite: false, isBlock: false, color: 0x41bbee, life: 4.1 },
    //             { hasWhite: false, isBlock: false, color: 0xfff192, life: 5.1 },
    //             { hasWhite: false, isBlock: false, color: 0xf35d8e, life: 6.2 },
    //             { hasWhite: false, isBlock: false, color: 0xac61fb, life: 6.3 },
    //             { hasWhite: false, isBlock: false, color: 0xfa7df9, life: 5.3 },
    //             { hasWhite: false, isBlock: false, color: 0xff6861, life: 6.3 },
    //             { hasWhite: false, isBlock: false, color: 0x777777, life: 7.3 },
                
    //             { hasWhite: false, isBlock: false, color: 0x4f8b2d, life: 8.3 },
    //             { hasWhite: false, isBlock: false, color: 0x066d99, life: 4.3 },
    //             { hasWhite: false, isBlock: false, color: 0xa38e03, life: 3.3 },
    //             { hasWhite: false, isBlock: false, color: 0xb21146, life: 3.3 },
    //             { hasWhite: false, isBlock: false, color: 0x551995, life: 3.3 },
    //             { hasWhite: false, isBlock: false, color: 0x9b249a, life: 3.3 },
    //             { hasWhite: false, isBlock: false, color: 0xb44208, life: 3.3 },
    //             { hasWhite: 0xffffff, isBlock: false, color: 0x231f20, life: 3.3 },
                
    //             { hasWhite: false, isBlock: false, color: 0x654d33, life: 3.3 },
    //             { hasWhite: false, isBlock: false, color: 0xe4c39c, life: 3.3 },
    //             { hasWhite: false, isBlock: false, color: 0xff1f1f, life: 3.3 },
    //         ],
    //         dark: 0x231f20,
    //         fillBarColor: 0x71bf45,
    //         fillBarCompleteColor: 0x00a1e5,
    //         background: 0x151515,
    //         fontColor: 0xFFFFFF,
    //         arrowTrailColor: 0xFFFFFF,
    //         buttonData: {
    //             fontColor: 0xFFFFFF,
    //             levelCompleteColor: 0x00a1e5,
    //             tierCompleteColor: 0x8c1eff,
    //             buttonStandardColor: 0x333333,
    //             buttonStandardDarkColor: 0x111111,
    //         },
    //         grid: {
    //             color: 0xFFFFFF,
    //             sprite: "largeCard.png",
    //             spriteTile: "largeCard.png",
    //             spriteTrail: "largeCard.png",
    //             spriteRect: "largeCard.png",
    //             scaleTrail: false,
    //             minAlpha: 0,
    //             extraTileAlpha: 0
    //         }
    //     },
    // ],
    getColorScheme(id) {
        return this.colorSchemes[id];
    },
    getCurrentColorScheme() {
        let scheme = window.COOKIE_MANAGER.stats.colorPalletID;

        return this.colorSchemes[scheme];

    },
    findPallet(id){

        let toReturn = id;
        if(isNaN(id)){
			for (let index = 0; index < this.colorSchemes.length; index++) {
                const element = this.colorSchemes[index];
                if(element.name == id){
                    toReturn = index
                }            
            }
		}
        //console.log(id,toReturn, this.colorSchemes)
        return toReturn;
    },

}
