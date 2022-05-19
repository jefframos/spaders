export default {

    tutorialStandard: [
        {
            textBoxOffset: { x: 0, y: 0 },
            text: 'Hi',
            callback: null,
            requireSpecificAction: false,
            target: "backgroundInteractable",
            centerBox: { x: 0.5, y: 0.5 },
            delay: 0.5
        },
        {
            textBoxOffset: { x: 0, y: 0 },
            text: 'Welcome to Spaders!',
            callback: this.showFirstCard.bind(this, 0),
            requireSpecificAction: false,
            target: "backgroundInteractable",
            centerBox: { x: 0.5, y: 0.3 },
            delay: 0.5
        },
        {
            textBoxOffset: { x: 0, y: 0 },
            text: 'This are the Spaders',
            callback: null,
            requireSpecificAction: false,
            useGlobalScale: false,
            target: "backgroundInteractable",
            centerBox: { x: 0.5, y: 0.6 },
            delay: 0.5
        },
        {
            textBoxOffset: { x: 0, y: 0 },
            text: 'Every spader have\nfew attack arrows',
            callback: null,
            requireSpecificAction: false,
            useGlobalScale: false,
            target: "backgroundInteractable",
            centerBox: { x: 0.5, y: 0.65 },
            delay: 0.5
        },
        {
            textBoxOffset: { x: 0, y: 0 },
            text: 'And life',
            callback: null,
            requireSpecificAction: false,
            useGlobalScale: false,
            target: "backgroundInteractable",
            centerBox: { x: 0.77, y: 0.55 },
            delay: 0.5
        },
        {
            textBoxOffset: { x: 0, y: 0 },
            text: 'Life is also their attack power',
            callback: null,
            requireSpecificAction: false,
            useGlobalScale: false,
            target: "backgroundInteractable",
            centerBox: { x: 0.5, y: 0.55 },
            delay: 0.5
        },
        {
            textBoxOffset: { x: 0, y: 0 },
            text: "Let's see how it works",
            callback: this.startNewTutorial.bind(this, 0),
            requireSpecificAction: false,
            target: "backgroundInteractable",
            centerBox: { x: 0.5, y: 0.6 },
            delay: 0.5
        },
        {
            textBoxOffset: { x: 0, y: -1.25 },
            text: 'Every level has a board\nwith other Spaders',
            callback: null,
            requireSpecificAction: false,
            target: "gridContainer",
            centerBox: { x: 0.5, y: 0 },
            delay: 1.4
        },
        {
            textBoxOffset: { x: 0, y: -1.25 },
            text: 'Every starter spader\nhave a TILE behind',
            callback: null,
            requireSpecificAction: false,
            highlightElementParameters: [1, Math.PI],
            highlightElement: this.getFirstBoardPiece,
            target: "gridContainer",
            centerBox: { x: 0.5, y: 0 },
            delay: 0
        },
        {
            textBoxOffset: { x: 0, y: -1.25 },
            text: 'When you kill then,\ntheir TILE is removed',
            callback: this.shoot.bind(this),
            requireSpecificAction: false,
            hideNextButton: true,
            target: "gridContainer",
            centerBox: { x: 0.5, y: 0 },
            delay: 0
        },
        {
            textBoxOffset: { x: 0, y: -1.25 },
            text: 'If you attack and the other spader\nhave an opposite arrow,\nit will attack you back',
            callback: this.shoot.bind(this, true),
            requireSpecificAction: false,
            hideNextButton: true,
            target: "gridContainer",
            centerBox: { x: 0.5, y: 0 },
            delay: 1.5
        }, {
            textBoxOffset: { x: 0, y: -1.1 },
            text: 'By using the counter attack,\nyou wipe two at the same time',
            callback: null,
            requireSpecificAction: false,
            target: "gridContainer",
            centerBox: { x: 0.5, y: 0 },
            delay: 1
        },
        {
            textBoxOffset: { x: 0, y: -1.1 },
            text: 'First,\nyou should wipe all starters',
            callback: this.getNewPiece.bind(this),
            requireSpecificAction: false,
            target: "gridContainer",
            centerBox: { x: 0.5, y: 0 },
            delay: 0
        },
        {
            textBoxOffset: { x: 0, y: -1.1 },
            text: 'And then kill the leftovers',
            callback: this.shoot.bind(this, true),
            hideNextButton: true,
            requireSpecificAction: false,
            target: "gridContainer",
            centerBox: { x: 0.5, y: 0 },
            delay: 0
        },
        {
            textBoxOffset: { x: 0, y: -2 },
            text: 'Thats how you win',
            callback: this.startNewTutorial.bind(this, 1),
            requireSpecificAction: false,
            target: "gridContainer",
            delay: 1,
            centerBox: { x: 0.5, y: 0.5 }
        },
        // {
        //     textBoxOffset: { x: 0, y: -1.1 },
        //     text: 'Some spaders needs\nmore than one attack',
        //     callback: null,
        //     requireSpecificAction: false,
        //     target: "gridContainer",
        //     useGlobalScale: false,
        //     centerBox: { x: 0.5, y: 0 },
        //     delay: 1
        // },
        {
            textBoxOffset: { x: 0, y: -1.1 },
            text: 'Try to attack as much\nas you can in one move',
            callback: this.shootAndCrazy.bind(this),
            hideNextButton: true,
            requireSpecificAction: false,
            target: "gridContainer",
            useGlobalScale: false,
            centerBox: { x: 0.5, y: 0 },
            delay: 1
        },
        {
            textBoxOffset: { x: 0, y: -1.1 },
            text: 'High combos transform\nrandom spaders in bombs',
            callback: null,
            highlightElementParameters: [1, Math.PI * 0.25 + Math.PI],
            highlightElement: this.getFirstBoardPiece,
            requireSpecificAction: false,
            target: "gridContainer",
            centerBox: { x: 0.5, y: 0 },
            delay: 2
        },
        {
            textBoxOffset: { x: 0, y: -1.1 },
            text: 'If you kill them, they will explode\nand give +1 damage on\nall spaders around',
            callback: this.shoot.bind(this, true),
            highlightElementParameters: [1, Math.PI * 0.25 + Math.PI],
            highlightElement: this.getFirstBoardPiece,
            hideNextButton: true,
            requireSpecificAction: false,
            target: "gridContainer",
            centerBox: { x: 0.5, y: 0 },
            delay: 0
        },
        {
            textBoxOffset: { x: 0, y: 0 },
            text: 'For stronger Spaders...',
            callback: this.startNewTutorial.bind(this, 2),
            requireSpecificAction: false,
            target: "backgroundInteractable",
            centerBox: { x: 0.5, y: 0.5 },
            delay: 2
        },
        {
            textBoxOffset: { x: 0, y: -1.1 },
            text: 'Try to use their arrows\nto counter attack you',
            callback: this.shoot.bind(this, false),
            hideNextButton: true,
            requireSpecificAction: false,
            target: "gridContainer",
            centerBox: { x: 0.5, y: 0 },
            delay: 2
        },
        {
            textBoxOffset: { x: 0, y: -1.1 },
            text: 'This is the best way to\nkeep the board cleaner',
            callback: this.shoot.bind(this, false),
            hideNextButton: true,
            requireSpecificAction: false,
            target: "gridContainer",
            centerBox: { x: 0.5, y: 0 },
            delay: 2
        },
        {
            textBoxOffset: { x: 0, y: -1.1 },
            text: "Don't let spaders too close to the bottom\nyou might need pile your spaders\nto wipe those",
            callback: this.shoot.bind(this, true),
            hideNextButton: true,
            requireSpecificAction: false,
            target: "gridContainer",
            centerBox: { x: 0.5, y: 0.6 },
            delay: 2
        },
        {
            textBoxOffset: { x: 0, y: 0 },
            text: 'Have fun!',
            callback: null,
            requireSpecificAction: false,
            target: "gridContainer",
            centerBox: { x: 0.5, y: 0.5 },
            delay: 2
        }]
    ,
    tutorialPoki: [
        // {
        //     textBoxOffset: { x: 0, y: 0 },
        //     text: 'Hi',
        //     callback: null,
        //     requireSpecificAction: false,
        //     target: "backgroundInteractable",
        //     centerBox: { x: 0.5, y: 0.5 },
        //     delay: 0.5
        // }, {
        //     textBoxOffset: { x: 0, y: 0 },
        //     text: 'Welcome to Spaders!',
        //     callback: this.showFirstCard.bind(this, 0),
        //     requireSpecificAction: false,
        //     target: "backgroundInteractable",
        //     centerBox: { x: 0.5, y: 0.3 },
        //     delay: 0.5
        // },
        // {
        //     textBoxOffset: { x: 0, y: 0 },
        //     text: 'This are the Spaders',
        //     callback: null,
        //     requireSpecificAction: false,
        //     useGlobalScale: false,
        //     target: "backgroundInteractable",
        //     centerBox: { x: 0.5, y: 0.6 },
        //     delay: 0.5
        // },
        // {
        //     textBoxOffset: { x: 0, y: 0 },
        //     text: 'Every spader have\nfew attack arrows',
        //     callback: null,
        //     requireSpecificAction: false,
        //     useGlobalScale: false,
        //     target: "backgroundInteractable",
        //     centerBox: { x: 0.5, y: 0.65 },
        //     delay: 0.5
        // },
        // {
        //     textBoxOffset: { x: 0, y: 0 },
        //     text: 'And life',
        //     callback: null,
        //     requireSpecificAction: false,
        //     useGlobalScale: false,
        //     target: "backgroundInteractable",
        //     centerBox: { x: 0.77, y: 0.55 },
        //     delay: 0.5
        // },
        // {
        //     textBoxOffset: { x: 0, y: 0 },
        //     text: 'Life is also their attack power',
        //     callback: null,
        //     requireSpecificAction: false,
        //     useGlobalScale: false,
        //     target: "backgroundInteractable",
        //     centerBox: { x: 0.5, y: 0.55 },
        //     delay: 0.5
        // },
        {
            textBoxOffset: { x: 0, y: 0 },
            //text: "Let's see how it works",
            text: "How SPADERS works?",
            callback: this.startNewTutorial.bind(this, 0),
            requireSpecificAction: false,
            target: "backgroundInteractable",
            centerBox: { x: 0.5, y: 0.5 },
            delay: 0.5
        },
        // {
        //     textBoxOffset: { x: 0, y: -1.25 },
        //     text: 'Every level has a board\nwith other Spaders',
        //     callback: null,
        //     requireSpecificAction: false,
        //     target: "gridContainer",
        //     centerBox: { x: 0.5, y: 0 },
        //     delay: 1.4
        // },
        {
            textBoxOffset: { x: 0, y: -1.25 },
            text: 'Every starter spader\nhave a TILE behind',
            callback: null,
            requireSpecificAction: false,
            highlightElementParameters: [1, Math.PI],
            highlightElement: this.getFirstBoardPiece,
            target: "gridContainer",
            centerBox: { x: 0.5, y: 0 },
            delay: 0
        },
        {
            textBoxOffset: { x: 0, y: -1.25 },
            text: 'When you kill then,\ntheir TILE is removed',
            callback: this.shoot.bind(this),
            requireSpecificAction: false,
            hideNextButton: true,
            target: "gridContainer",
            centerBox: { x: 0.5, y: 0 },
            delay: 0
        },
        {
            textBoxOffset: { x: 0, y: -1.25 },
            text: 'If you attack and the other spader\nhave an opposite arrow,\nit will attack you back',
            callback: () => {
                this.shoot(true)
                this.getNewPiece()
            },
            requireSpecificAction: false,
            hideNextButton: true,
            target: "gridContainer",
            centerBox: { x: 0.5, y: 0 },
            delay: 1.5
        },
        // {
        //     textBoxOffset: { x: 0, y: -1.1 },
        //     text: 'By using the counter attack,\nyou wipe two at the same time',
        //     callback: null,
        //     requireSpecificAction: false,
        //     target: "gridContainer",
        //     centerBox: { x: 0.5, y: 0 },
        //     delay: 1
        // },
        // {
        //     textBoxOffset: { x: 0, y: -1.1 },
        //     text: 'First,\nyou should wipe all starters',
        //     callback: this.getNewPiece.bind(this),
        //     requireSpecificAction: false,
        //     target: "gridContainer",
        //     centerBox: { x: 0.5, y: 0 },
        //     delay: 0
        // },
        {
            textBoxOffset: { x: 0, y: -1.1 },
            text: 'And then kill the leftovers',
            callback: this.shoot.bind(this, true),
            hideNextButton: true,
            requireSpecificAction: false,
            target: "gridContainer",
            centerBox: { x: 0.5, y: 0 },
            delay: 0
        },
        {
            textBoxOffset: { x: 0, y: -2 },
            // text: 'Thats how you win',
            text: 'Erase the board to win',
            callback: this.startNewTutorial.bind(this, 1),
            requireSpecificAction: false,
            target: "gridContainer",
            delay: 1,
            centerBox: { x: 0.5, y: 0.5 }
        },
        // {
        //     textBoxOffset: { x: 0, y: -1.1 },
        //     text: 'Some spaders needs\nmore than one attack',
        //     callback: null,
        //     requireSpecificAction: false,
        //     target: "gridContainer",
        //     useGlobalScale: false,
        //     centerBox: { x: 0.5, y: 0 },
        //     delay: 1
        // },
        {
            textBoxOffset: { x: 0, y: -1.1 },
            text: 'Try to attack as much\nas you can in one move',
            callback: this.shootAndCrazy.bind(this),
            hideNextButton: true,
            requireSpecificAction: false,
            target: "gridContainer",
            useGlobalScale: false,
            centerBox: { x: 0.5, y: 0 },
            delay: 1
        },
        {
            textBoxOffset: { x: 0, y: -1.1 },
            text: 'High combos transform\nrandom spaders in bombs',
            callback: null,
            highlightElementParameters: [1, Math.PI * 0.25 + Math.PI],
            highlightElement: this.getFirstBoardPiece,
            requireSpecificAction: false,
            target: "gridContainer",
            centerBox: { x: 0.5, y: 0 },
            delay: 2
        },
        {
            textBoxOffset: { x: 0, y: -1.1 },
            text: 'If you kill them, they will explode\nand give +1 damage on\nall spaders around',
            callback: this.shoot.bind(this, true),
            highlightElementParameters: [1, Math.PI * 0.25 + Math.PI],
            highlightElement: this.getFirstBoardPiece,
            hideNextButton: true,
            requireSpecificAction: false,
            target: "gridContainer",
            centerBox: { x: 0.5, y: 0 },
            delay: 0
        },
        // {
        //     textBoxOffset: { x: 0, y: 0 },
        //     text: 'For stronger Spaders...',
        //     callback: this.startNewTutorial.bind(this, 2),
        //     requireSpecificAction: false,
        //     target: "backgroundInteractable",
        //     centerBox: { x: 0.5, y: 0.5 },
        //     delay: 2
        // },
        // {
        //     textBoxOffset: { x: 0, y: -1.1 },
        //     text: 'Try to use their arrows\nto counter attack you',
        //     callback: this.shoot.bind(this, false),
        //     hideNextButton: true,
        //     requireSpecificAction: false,
        //     target: "gridContainer",
        //     centerBox: { x: 0.5, y: 0 },
        //     delay: 2
        // },
        // {
        //     textBoxOffset: { x: 0, y: -1.1 },
        //     text: 'This is the best way to\nkeep the board cleaner',
        //     callback: this.shoot.bind(this, false),
        //     hideNextButton: true,
        //     requireSpecificAction: false,
        //     target: "gridContainer",
        //     centerBox: { x: 0.5, y: 0 },
        //     delay: 2
        // },
        // {
        //     textBoxOffset: { x: 0, y: -1.1 },
        //     text: "Don't let spaders too close to the bottom\nyou might need pile your spaders\nto wipe those",
        //     callback: this.shoot.bind(this, true),
        //     hideNextButton: true,
        //     requireSpecificAction: false,
        //     target: "gridContainer",
        //     centerBox: { x: 0.5, y: 0.6 },
        //     delay: 2
        // },
        {
            textBoxOffset: { x: 0, y: 0 },
            text: 'Have fun!',
            callback: null,
            requireSpecificAction: false,
            target: "gridContainer",
            centerBox: { x: 0.5, y: 0.5 },
            delay: 2
        }]


}