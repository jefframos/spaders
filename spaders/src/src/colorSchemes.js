import config from './config';
export default {

    colorSchemes: [
        {
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
                { isBlock: false, color: config.colors.darkSkin, life: 9.3 },
                { isBlock: true, color: config.colors.block }
            ],
            dark:0x111111
        },
        {
            list: [
                { isBlock: false, color: 0xffd319, life: 0 },
                { isBlock: false, color: 0xff901f, life: 1 },
                { isBlock: false, color: 0xff2975, life: 2 },
                { isBlock: false, color: 0xf222ff, life: 3 },
                { isBlock: false, color: 0x8c1eff, life: 4 },
                { isBlock: false, color: 0x6df1d8, life: 5 },
                { isBlock: false, color: 0x5c2c6d, life: 6 },
                { isBlock: false, color: 0x3c345c, life: 7 },
                { isBlock: false, color: 0xffffff, life: 8 },
                { isBlock: false, color: 0x333333, life: 9 },
                { isBlock: false, color: 0xb8aec8, life: 9.1 },
                { isBlock: false, color: 0x5da4a6, life: 9.2 },
                { isBlock: false, color: 0xd30cb8, life: 9.3 },
                { isBlock: true, color: config.colors.block }
            ],
            dark:0x111111
        }
    ]

}
