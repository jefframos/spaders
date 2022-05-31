import { Template } from "webpack";

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

    }
    getRandomLetter(easy = 0) {
        let id = this.letterByTotal.length * Math.random();
        if (easy && id > this.letterByTotal.length / easy) {
            id = this.letterByTotal.length * Math.random();
        }
        return this.letterByTotal[Math.floor(id)];
    }

    findWords(board, cardPos) {
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

        console.log(wordsFound)
        setTimeout(() => {
            
            wordsFound.forEach(element => {
                element.positions.forEach(positions => {
                    board.attackCard(board.cards[positions.i][positions.j], 100);
                });
            });
        }, 500);
        
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
                verticalArrayPos.push({i:cardPos.i,j:index})
            }
        }

        for (let index = 0; index < lettersStamp.length; index++) {
            let letter = lettersStamp[index][cardPos.j];
            if (letter == "" && index < cardPos.i) {
                horizontal = "";
                horizontalArrayPos = [];
            } else if (letter != ""){
                horizontal += letter
                console.log(letter)
                horizontalArrayPos.push({i:index,j:cardPos.j})
            }else{
                horizontalArrayPos = [];
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
                    diagonalBLArrayPos.push({i:next,j:index})
                    
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
                    diagonalBRArrayPos.push({i:next,j:index})

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
                    diagonalTLArrayPos.push({i:next,j:index})

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
                    diagonalTRArrayPos.push({i:next,j:index})

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

        let cross1ArrayPos = diagonalBRArrayPos.concat( diagonalTLArrayPos)
        let cross2ArrayPos = diagonalBLArrayPos.concat( diagonalTRArrayPos)

        let allwords = []
        allwords.push({word:vertical, positions:verticalArrayPos})
        //allwords.push({word:this.reverseString(vertical), positions:this.reverseArray(verticalArrayPos)})
       
        allwords.push({word:horizontal, positions:horizontalArrayPos})
       // allwords.push({word:this.reverseString(horizontal), positions:this.reverseArray(horizontalArrayPos)})

        //allwords.push({word:cross1, positions:cross1ArrayPos})

       // console.log(cross1)
        allwords.push({word:this.reverseString(cross1), positions:this.reverseArray(cross1ArrayPos)})

        allwords.push({word:cross2, positions:cross2ArrayPos})
        //allwords.push({word:this.reverseString(cross2), positions:this.reverseArray(cross2ArrayPos)})
        console.log(cardPos)
        console.log(allwords)
        let wordsFound = []
        allwords.forEach(element => {
            let word = this.findWord(element)
            if(word){
                for (let index = 0; index < word.positions.length; index++) {
                    const element = word.positions[index];
                    if(element.i == cardPos.i && element.j == cardPos.j){
                        wordsFound.push(word)
                        break;
                    }
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
        
        while (newWord.length > 1) {
            if (this.dictionary[newWord]) {
                //console.log(newWord)
                return {word:newWord, positions};
            }

            newWord = newWord.slice(0, newWord.length-1)
            positions = positions.slice(0, positions.length-1)
        }

    }
}