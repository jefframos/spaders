import config from './config';
export default {

    colorSchemes: [
        {
            block: { id: 19, hasWhite: false, isBlock: true, color: config.colors.block },
            list: [
                { hasWhite: false, isBlock: false, color: config.colors.blue, life: 0 },
                { hasWhite: false, isBlock: false, color: config.colors.red, life: 1 },
                { hasWhite: false, isBlock: false, color: config.colors.yellow, life: 2 },
                { hasWhite: false, isBlock: false, color: config.colors.green, life: 3 },
                { hasWhite: false, isBlock: false, color: config.colors.blue2, life: 4 },
                { hasWhite: false, isBlock: false, color: config.colors.pink, life: 5 },
                { hasWhite: false, isBlock: false, color: config.colors.red2, life: 6 },
                { hasWhite: false, isBlock: false, color: config.colors.purple, life: 7 },
                { hasWhite: false, isBlock: false, color: config.colors.white, life: 8 },
                { hasWhite: 0xFFFFFF, isBlock: false, color: config.colors.dark, life: 9 },
                { hasWhite: false, isBlock: false, color: config.colors.grey, life: 9.1 },
                { hasWhite: false, isBlock: false, color: config.colors.whiteSkin, life: 9.2 },
                { hasWhite: false, isBlock: false, color: config.colors.darkSkin, life: 9.3 },
                { hasWhite: false, isBlock: false, color: config.colors.darkSkin, life: 5.3 },
                { hasWhite: false, isBlock: false, color: config.colors.darkSkin, life: 6.3 },
                { hasWhite: false, isBlock: false, color: config.colors.darkSkin, life: 7.3 },
                { hasWhite: false, isBlock: false, color: config.colors.darkSkin, life: 8.3 },
                { hasWhite: false, isBlock: false, color: config.colors.darkSkin, life: 4.3 },
                { hasWhite: false, isBlock: false, color: config.colors.darkSkin, life: 3.3 },
            ],
            dark: 0x111111,
            fillBarColor: config.colors.green,
            background: 0x151515,
            fontColor: 0xFFFFFF,
            buttonData: {
                fontColor: 0xFFFFFF,
                levelCompleteColor: config.colors.blue2,
                tierCompleteColor: config.colors.purple,
                buttonStandardColor: 0x333333,
                buttonStandardDarkColor: 0x111111,
            },
            grid: {
                color: 0xFFFFFF,
                sprite: "largeCard.png",
                spriteTile: "largeCard.png",
                spriteTrail: "largeCard.png",
                scaleTrail: false,
                minAlpha: 0,
                extraTileAlpha: 0
            }
        },
        {
            block: { id: 32, hasWhite: false, isBlock: true, color: config.colors.block },
            list: [//syinth
                { hasWhite: false, isBlock: false, color: 0xffd319, life: 0 },
                { hasWhite: false, isBlock: false, color: 0xff901f, life: 1 },
                { hasWhite: false, isBlock: false, color: 0xff2975, life: 2 },
                { hasWhite: false, isBlock: false, color: 0xf222ff, life: 3 },
                { hasWhite: false, isBlock: false, color: 0x8c1eff, life: 4 },
                { hasWhite: false, isBlock: false, color: 0x6df1d8, life: 5 },
                { hasWhite: false, isBlock: false, color: 0x5c2c6d, life: 6 },
                { hasWhite: false, isBlock: false, color: 0x3c345c, life: 7 },
                { hasWhite: false, isBlock: false, color: 0xffffff, life: 8 },
                { hasWhite: 0xFFFFFF, isBlock: false, color: 0x333333, life: 9 },//10
                { hasWhite: false, isBlock: false, color: 0xb8aec8, life: 9.1 },
                { hasWhite: false, isBlock: false, color: 0x5da4a6, life: 9.2 },
                { hasWhite: false, isBlock: false, color: 0xd30cb8, life: 9.3 },
                { hasWhite: false, isBlock: false, color: 0xef281e, life: 5.3 },
                { hasWhite: false, isBlock: false, color: 0xff6861, life: 6.3 },
                { hasWhite: false, isBlock: false, color: 0xee5dc0, life: 7.3 },
                { hasWhite: false, isBlock: false, color: 0x844f58, life: 8.3 },
                { hasWhite: false, isBlock: false, color: 0x831732, life: 4.3 },
                { hasWhite: false, isBlock: false, color: 0xFFFFFF, life: 3.3 },
                { hasWhite: false, isBlock: false, color: 0xFF0000, life: 3.3 },//20
                { hasWhite: false, isBlock: false, color: 0x00FF00, life: 3.3 },
                { hasWhite: false, isBlock: false, color: 0x0000FF, life: 3.3 },
                { hasWhite: false, isBlock: false, color: 0xFFFF00, life: 3.3 },
                { hasWhite: false, isBlock: false, color: 0x00FFFF, life: 3.3 },
                { hasWhite: false, isBlock: false, color: 0xFF00FF, life: 3.3 },
                { hasWhite: false, isBlock: false, color: 0xd30cb8, life: 3.3 },
                { hasWhite: false, isBlock: false, color: 0xd30cb8, life: 3.3 },

            ],
            dark: 0x111111,
            fillBarColor: 0xffd319,
            background: 0x151515,
            fontColor: 0xFFFFFF,
            buttonData: {
                fontColor: 0xFFFFFF,
                levelCompleteColor: config.colors.blue2,
                tierCompleteColor: config.colors.purple,
                buttonStandardColor: 0x333333,
                buttonStandardDarkColor: 0x030303,
            },
            grid: {
                color: 0xFFFFFF,
                sprite: "largeCard.png",
                spriteTile: "largeCard.png",
                spriteTrail: "largeCard.png",
                scaleTrail: false,
                minAlpha: 0,
                extraTileAlpha: 0
            },
            backgroundAssets: {
                bottomBackground: "game_bg.png",
                bottomBackgroundPosition: -0.025,
            }
        },
        {
            block: { id: 19, hasWhite: false, isBlock: true, color: config.colors.block },
            list: [//gb
                { hasWhite: false, isBlock: false, color: 0x85cd6e, life: 0 },
                { hasWhite: false, isBlock: false, color: 0x89c077, life: 1 },
                { hasWhite: false, isBlock: false, color: 0x4da350, life: 2 },
                { hasWhite: false, isBlock: false, color: 0x65b26f, life: 3 },
                { hasWhite: false, isBlock: false, color: 0x3f7e5d, life: 4 },
                { hasWhite: false, isBlock: false, color: 0x37764a, life: 5 },
                { hasWhite: false, isBlock: false, color: 0x224939, life: 6 },
                { hasWhite: false, isBlock: false, color: 0x285746, life: 7 },
                { hasWhite: false, isBlock: false, color: 0xbad1b8, life: 8 },
                { hasWhite: 0xbad1b8, isBlock: false, color: 0x252b25, life: 5.1 },
                { hasWhite: false, isBlock: false, color: 0x555a56, life: 9.1 },
                { hasWhite: false, isBlock: false, color: 0xddd3ab, life: 9.2 },
                { hasWhite: 0xbad1b8, isBlock: false, color: 0x3b3c2e, life: 9.3 },
                { hasWhite: false, isBlock: false, color: 0x37b05b, life: 5.3 },
                { hasWhite: false, isBlock: false, color: 0x7552cf, life: 6.3 },
                { hasWhite: false, isBlock: false, color: 0x3b3c2e, life: 7.3 },
                { hasWhite: false, isBlock: false, color: 0x3b3c2e, life: 8.3 },
                { hasWhite: false, isBlock: false, color: 0x3b3c2e, life: 4.3 },
                { hasWhite: false, isBlock: false, color: 0x3b3c2e, life: 3.3 },
            ],
            dark: 0x182018,
            fillBarColor: 0x85cd6e,
            background: 0xCADCA0,
            fontColor: 0x182018,
            buttonData: {
                fontColor: 0xFFFFFF,
                levelCompleteColor: 0x89c077,
                tierCompleteColor: 0x65b26f,
                buttonStandardColor: 0x3f7e5d,
                buttonStandardDarkColor: 0x252b25,
            },
            grid: {
                color: 0x182018,
                sprite: "gbGridTile.png",
                spriteTile: "gbGrid.png",
                spriteTrail: "gbGrid.png",
                scaleTrail: false,
                minAlpha: 0.5,
                extraTileAlpha: 0.5
            },
            backgroundAssets: {
                bottomBackground: "gbBackground.png",
                bottomBackgroundPosition: 0.01,
            }
        },
        {
            block: { id: 19, hasWhite: false, isBlock: true, color: config.colors.block },
            list: [//poke
                { hasWhite: false, isBlock: false, color: 0x4890a8, life: 0 },
                { hasWhite: false, isBlock: false, color: 0xf06060, life: 1 },
                { hasWhite: false, isBlock: false, color: 0xf0d818, life: 2 },
                { hasWhite: false, isBlock: false, color: 0x75bf8b, life: 3 },
                { hasWhite: false, isBlock: false, color: 0x1471b0, life: 4 },
                { hasWhite: false, isBlock: false, color: 0xe9bbe9, life: 5 },
                { hasWhite: false, isBlock: false, color: 0xf07848, life: 6 },
                { hasWhite: false, isBlock: false, color: 0xc078d8, life: 7 },
                { hasWhite: false, isBlock: false, color: 0xd8d8d8, life: 8 },
                { hasWhite: 0xFFFFFF, isBlock: false, color: 0x333333, life: 9 },
                { hasWhite: false, isBlock: false, color: 0x888888, life: 9.1 },
                { hasWhite: false, isBlock: false, color: 0xcfbda9, life: 9.2 },
                { hasWhite: false, isBlock: false, color: 0x786048, life: 9.3 },
                { hasWhite: false, isBlock: false, color: 0x37b05b, life: 5.3 },
                { hasWhite: false, isBlock: false, color: 0x7552cf, life: 6.3 },
                { hasWhite: false, isBlock: false, color: 0x7b7caf, life: 7.3 },
                { hasWhite: false, isBlock: false, color: 0xeee19b, life: 8.3 },
                { hasWhite: false, isBlock: false, color: 0x786048, life: 4.3 },
                { hasWhite: false, isBlock: false, color: 0x786048, life: 3.3 },
            ],
            dark: 0x333333,
            fillBarColor: 0x4890a8,
            background: 0x333333,
            fontColor: 0xFFFFFF,
            buttonData: {
                fontColor: 0xFFFFFF,
                levelCompleteColor: config.colors.blue2,
                tierCompleteColor: config.colors.purple,
                buttonStandardColor: 0x444444,
                buttonStandardDarkColor: 0x333333,
            },
            grid: {
                color: 0xFFFFFF,
                sprite: "largeCard.png",
                spriteTile: "largeCard.png",
                spriteTrail: "largeCard.png",
                scaleTrail: false,
                minAlpha: 0,
                extraTileAlpha: 0
            }
        }
    ],
    getColorScheme(id) {
        return this.colorSchemes[id];
    },
    getCurrentColorScheme() {
        let scheme = window.COOKIE_MANAGER.stats.colorPalletID;

        return this.colorSchemes[scheme];

    },

}
