import TweenMax from "gsap";
import { Template } from "webpack";
import utils from "../../utils";

export default class ScrabbleManager {
    constructor(dataPath, dictionaryPath) {
        this.letters = PIXI.loader.resources[dataPath].data.letters
        this.dictionary = PIXI.loader.resources[dictionaryPath].data.words


        this.letters.sort(function (a, b) { return b.total - a.total });

        this.letterByTotal = [];
        this.letters.forEach(element => {
            for (let index = 0; index < element.total; index++) {
                this.letterByTotal.push(element);
            }
        });
        console.log(this.letters)
        this.game = null;

        this.currentWords = [];

    }

    popLetterCard(card, letter, delay, target, style) {
        let cardGlobal = card.getGlobalPosition({ x: 0, y: 0 });
        let hitOffset = {
            x: cardGlobal.x,
            y: cardGlobal.y
        }
        let label = this.popLabel(this.game.toLocal(hitOffset), letter.toUpperCase(), delay, 0.5, 1, style);
        
        return label
    }

    popLabel(pos, label, delay = 0, dir = 1, scale = 1, style = {}, ease = Back.easeOut, time = 0.5) {
        let tempLabel = null;
        if (window.LABEL_POOL.length > 0) {
            tempLabel = window.LABEL_POOL[0];
            window.LABEL_POOL.shift();
        } else {
        }
        tempLabel = new PIXI.Text(label);
        tempLabel.style = style;
        tempLabel.text = label;
        tempLabel.fill = style.color;

        this.game.frontGridContainer.addChild(tempLabel);
        tempLabel.x = pos.x;
        tempLabel.y = pos.y;
        tempLabel.pivot.x = tempLabel.width / 2;
        tempLabel.pivot.y = tempLabel.height / 2;
        tempLabel.scale.set(scale)
        tempLabel.alpha = 1

        return tempLabel
    }

    getRandomLetter(easy = 0) {
        let id = this.letterByTotal.length * Math.random();
        if (easy && id > this.letterByTotal.length / easy) {
            id = this.letterByTotal.length * Math.random();
        }
        return this.letterByTotal[Math.floor(id)];
    }

    findWords(board, cardPos) {
        this.game = board.game;
        this.board = board;
        var lettersStamp = []
        for (let index = 0; index < board.cards.length; index++) {
            const element = board.cards[index];
            let tempLine = []
            for (let j = 0; j < element.length; j++) {
                if (board.cards[index][j]) {
                    tempLine.push(board.cards[index][j].letterData.key)
                } else {
                    tempLine.push("")
                }
            }
            lettersStamp.push(tempLine)
        }
        let wordsFound = this.getPossibleWords(lettersStamp, cardPos)

        setTimeout(() => {
            wordsFound.forEach(element => {
                let wordLabel = {
                    labels: [],
                    targets: [],
                    inverted: false,
                }
                for (let index = 0; index < element.positions.length; index++) {
                    const positions = element.positions[index];

                    let card = board.cards[positions.i][positions.j]
                    let cardGlobal = card.position//getGlobalPosition({ x: 0, y: 0 });
                    let hitOffset = {
                        x: card.x,
                        y: card.y //+ CARD.height
                    }
                    let target = { x: CARD.width * index, y: -100 }
                    let label = this.popLetterCard(card, card.letterData.key, 0.5 + index * 0.2, target, window.textStyles.letterStandard);

                    label.scale.set(0)
                    TweenMax.to(label.scale, 0.5, { x: 1.2, y: 1.2, delay:0.5 + index * 0.2, ease:Back.easeOut })
                    label.x = card.x + card.width * card.scale.x
                    label.y = card.y + card.height* card.scale.x
                    label.velocity = { x: 0, y: 0 };
                    label.targetVelocity = { x: 0, y: -0.3 };
                    label.angle = Math.random() * 360;
                    label.startTimer = index * 0.1 + 0.5;
                    label.delay = Math.random()*0.5 + 0.2;
                    wordLabel.labels.push(label);
                    wordLabel.targets.push({ x: hitOffset.x, y: hitOffset.y });
                    wordLabel.inverted = element.inverted;
                }
                this.addNewWord(wordLabel);
            });
        }, 100);

        console.log(wordsFound)
        setTimeout(() => {
            wordsFound.forEach(element => {
                for (let index = 0; index < element.positions.length; index++) {
                    const positions = element.positions[index];
                    let card = board.cards[positions.i][positions.j]
                    let cardGlobal = card? card.getGlobalPosition() : positions.originalGlobalCardPosition
                    let hitOffset = {
                        x: cardGlobal.x,
                        y: cardGlobal.y + CARD.height
                    }
                    board.addStandardAttackParticles2(hitOffset, positions.originalCardPoints, 2);
                    if(card){
                        setTimeout(() => {
                            
                            board.attackCard(card, 100);
                        }, 10);
                    }
                    board.addTurnTime(1)
                }
            });
        }, 400);

        if(wordsFound.length > 0){
            board.addTurnTime(1)
        }

    }
    addNewWord(wordData) {
        this.currentWords.push(wordData)
        if (this.currentWords.length > 3) {
            this.currentWords[0].labels.forEach(element => {
                element.parent.removeChild(element);
                window.LABEL_POOL.push(element);
            });
            this.currentWords.shift()
        }
    }
    shortAngleDist(a0, a1) {
        var max = Math.PI * 2;
        var da = (a1 - a0) % max;
        return 2 * da % max - da;
    }

    angleLerp(a0, a1, t) {
        return a0 + this.shortAngleDist(a0, a1) * t;
    }
    destroyAllWords(){
        while (this.currentWords.length) {
            this.currentWords[0].labels.forEach(element => {
                element.parent.removeChild(element);
                window.LABEL_POOL.push(element);
            });
            this.currentWords.shift()
        }
    }
    update(delta) {
        let speed = 450;
        let slotSize = CARD.width / 2
        for (let j = 0; j < this.currentWords.length; j++) {
            let wordData = this.currentWords[j]
            for (let index = 0; index < wordData.targets.length; index++) {
                const element = wordData.targets[index];
                let lenght = (slotSize * (4 / wordData.targets.length))
                element.x = index * lenght + lenght * 0.5
                element.y = this.game.topCanvas.y + j * slotSize - slotSize * 3

                const label = wordData.labels[index];
                let distance = utils.distance(element.x, element.y, label.x, label.y);
                if (distance <= speed * delta) {
                    label.x = element.x;
                    label.y = element.y;
                } else {
                    if (label.delay > 0) {
                        label.delay -= delta;

                    } else {

                        if (label.startTimer <= 0) {

                            let angle = Math.atan2(element.y - label.y, element.x - label.x);

                            label.angle = this.angleLerp(label.angle, angle, 0.2);
                            label.targetVelocity.x = Math.cos(label.angle) * speed * delta;
                            label.targetVelocity.y = Math.sin(label.angle) * speed * delta;
                        } else {
                            label.startTimer -= delta;

                            label.targetVelocity.x = Math.cos(label.angle) * 50 * delta;
                            label.targetVelocity.y += 3 * delta
                        }


                        label.velocity.x = utils.lerp(label.velocity.x, label.targetVelocity.x, 0.1);
                        label.velocity.y = utils.lerp(label.velocity.y, label.targetVelocity.y, 0.01);

                        label.x += label.velocity.x
                        label.y += label.velocity.y
                    }
                }
            }
        }
    }
    getPossibleWords(lettersStamp, cardPos) {

        let vertical = "";
        let horizontal = "";
        let diagonalBL = "";
        let diagonalBR = "";
        let diagonalTL = "";
        let diagonalTR = "";

        let verticalArrayPos = [];
        let horizontalArrayPos = [];
        let diagonalBLArrayPos = [];
        let diagonalBRArrayPos = [];
        let diagonalTLArrayPos = [];
        let diagonalTRArrayPos = [];

        for (let index = cardPos.j; index >= 0; index--) {
            let letter = lettersStamp[cardPos.i][index];
            if (letter == "") {
                break;
            } else {
                vertical += letter
                verticalArrayPos.push({ i: cardPos.i, j: index })
            }
        }

        if (cardPos.i > 0) {

            for (let index = cardPos.i - 1; index >= 0; index--) {
                let letter = lettersStamp[index][cardPos.j];
                if (letter == "" && index < cardPos.i) {
                    break
                } else if (letter != "") {
                    horizontal += letter
                    horizontalArrayPos.push({ i: index, j: cardPos.j })
                } else {
                    break
                }
            }
        }
        horizontal = this.reverseString(horizontal);
        horizontalArrayPos = this.reverseArray(horizontalArrayPos)
        for (let index = cardPos.i; index < lettersStamp.length; index++) {
            let letter = lettersStamp[index][cardPos.j];
            if (letter == "" && index < cardPos.i) {
                break
            } else if (letter != "") {
                horizontal += letter
                horizontalArrayPos.push({ i: index, j: cardPos.j })
            } else {
                break
            }
        }
        let dg = 0;
        for (let index = cardPos.j; index >= 0; index--) {
            let next = cardPos.i - dg
            if (lettersStamp.length > next && next >= 0) {
                let letter = lettersStamp[next][index];
                if (letter == "") {
                    break;
                } else {
                    diagonalBL += lettersStamp[next][index];
                    diagonalBLArrayPos.push({ i: next, j: index })

                    dg++
                }
            }
        }
        dg = 0;
        for (let index = cardPos.j; index >= 0; index--) {
            let next = cardPos.i + dg
            if (lettersStamp.length > next && next >= 0) {
                let letter = lettersStamp[next][index];
                if (letter == "") {
                    break;
                } else {
                    diagonalBR += lettersStamp[next][index];
                    diagonalBRArrayPos.push({ i: next, j: index })

                    dg++
                }
            }
        }

        dg = 0;
        for (let index = cardPos.j; index < lettersStamp[cardPos.i].length; index++) {
            let next = cardPos.i - dg
            if (lettersStamp.length > next && next >= 0) {
                let letter = lettersStamp[next][index];
                if (letter == "") {
                    break;
                } else {
                    diagonalTL += lettersStamp[next][index];
                    diagonalTLArrayPos.push({ i: next, j: index })

                    dg++
                }
            }
        }
        dg = 0;
        for (let index = cardPos.j; index < lettersStamp[cardPos.i].length; index++) {
            let next = cardPos.i + dg

            if (lettersStamp.length > next && next >= 0) {
                let letter = lettersStamp[next][index];
                if (letter == "") {
                    break;
                } else {
                    diagonalTR += lettersStamp[next][index];
                    diagonalTRArrayPos.push({ i: next, j: index })

                    dg++
                }
            }
        }

        diagonalBL = this.reverseString(diagonalBL)
        diagonalBR = this.reverseString(diagonalBR)

        diagonalBLArrayPos = this.reverseArray(diagonalBLArrayPos)
        diagonalBRArrayPos = this.reverseArray(diagonalBRArrayPos)

        diagonalTR = diagonalTR.slice(1, diagonalTR.length)
        diagonalTL = diagonalTL.slice(1, diagonalTL.length)

        diagonalTRArrayPos = diagonalTRArrayPos.slice(1, diagonalTRArrayPos.length)
        diagonalTLArrayPos = diagonalTLArrayPos.slice(1, diagonalTLArrayPos.length)

        let cross1 = diagonalBR + diagonalTL
        let cross2 = diagonalBL + diagonalTR

        let cross1ArrayPos = diagonalBRArrayPos.concat(diagonalTLArrayPos)
        let cross2ArrayPos = diagonalBLArrayPos.concat(diagonalTRArrayPos)



        let allwords = []
        let wordsFound = []

        let verticalData = { word: vertical, positions: verticalArrayPos }
        let verticalInvertData = { word: this.reverseString(vertical), positions: this.reverseArray(verticalArrayPos) }

        let findVertical1 = this.findWord(verticalData);
        let findVertical2 = null;
        if (!findVertical1) {
            findVertical1 = this.findWord(verticalInvertData);
        } else {
            findVertical2 = this.findWord(verticalInvertData);
        }
        if (findVertical1 && findVertical2) {
            if (findVertical1.length >= findVertical2.length) {
                allwords.push(findVertical1);
            } else {
                findVertical2.inverted = true;
                allwords.push(findVertical2);
            }
        } else if (findVertical1) {
            allwords.push(findVertical1);
        }

        let horizontalData = { word: horizontal, positions: horizontalArrayPos }
        let horizontalInvertData = { word: this.reverseString(horizontal), positions: this.reverseArray(horizontalArrayPos) }


        let findHorizontal1 = this.findWord(horizontalData);
        let findHorizontal2 = null;
        if (!findHorizontal1) {
            findHorizontal1 = this.findWord(horizontalInvertData);
        } else {
            findHorizontal2 = this.findWord(horizontalInvertData);
        }
        if (findHorizontal1 && findHorizontal2) {
            if (findHorizontal1.length >= findHorizontal2.length) {
                allwords.push(findHorizontal1);
            } else {
                findHorizontal2.inverted = true;
                allwords.push(findHorizontal2);
            }
        } else if (findHorizontal1) {
            allwords.push(findHorizontal1);
        }

        //allwords.push({ word: vertical, positions: verticalArrayPos })
        //allwords.push({word:this.reverseString(vertical), positions:this.reverseArray(verticalArrayPos)})

        // allwords.push({ word: horizontal, positions: horizontalArrayPos })
        // allwords.push({word:this.reverseString(horizontal), positions:this.reverseArray(horizontalArrayPos)})

        //allwords.push({word:cross1, positions:cross1ArrayPos})

        // console.log(cross1)
        //allwords.push({word:this.reverseString(cross1), positions:this.reverseArray(cross1ArrayPos)})

        //allwords.push({word:cross2, positions:cross2ArrayPos})
        //allwords.push({word:this.reverseString(cross2), positions:this.reverseArray(cross2ArrayPos)})

        // console.log(cardPos)
        // console.log(allwords)
        // let wordsFound = []
        allwords.forEach(word => {
            let addedAlready = false;
            for (let index = 0; index < word.positions.length; index++) {
                const element = word.positions[index];
                let card = this.board.cards[element.i][element.j]
                word.positions[index].originalCardPosition = {x:card.x, y:card.y}
                word.positions[index].originalGlobalCardPosition = card.getGlobalPosition({x:0, y:0});
                word.positions[index].originalCardPoints = card.letterData.points
                word.positions[index].originalCardKey = card.letterData.key
                if (!addedAlready && element.i == cardPos.i && element.j == cardPos.j) {
                    wordsFound.push(word)
                    addedAlready = true;
                }
            }
        });

        return wordsFound;
    }

    reverseString(str) {
        var newString = "";
        for (var i = str.length - 1; i >= 0; i--) {
            newString += str[i];
        }
        return newString;
    }

    reverseArray(array) {
        var newArray = [];
        for (var i = array.length - 1; i >= 0; i--) {
            newArray.push(array[i]);
        }
        return newArray;
    }

    findWord(testData) {
        let newWord = testData.word//.slice(0)
        let positions = testData.positions;

        while (newWord.length > 2) {
            if (this.dictionary[newWord]) {
                //console.log(newWord)
                return { word: newWord, positions };
            }

            newWord = newWord.slice(0, newWord.length - 1)
            positions = positions.slice(0, positions.length - 1)
        }
        return null;
    }
}