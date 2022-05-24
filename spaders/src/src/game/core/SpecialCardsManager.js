import * as PIXI from 'pixi.js';
import config  from '../../config';
import utils  from '../../utils';
export default class SpecialCardsManager{
	constructor(){
        this.effects = {
            _32:{
                cardFunction:"startCrazyMood",
                parameter:null
            },
            _34:{
                isBlock:true,
            },
            _35:{
                cardFunction:"itCannotDie",
            },
            _36:{
                cardFunction:"itEndGameIfDie",
            },
            _37:{
                cardFunction:"blockHorizontalPivot",
            },
            _38:{
                cardFunction:"blockVerticalPivot",
            },
            _40:{
                cardFunction:"setCountdown",
                parameter:9
            },
            _41:{
                cardFunction:"setCountdown",
                parameter:8
            },
            _42:{
                cardFunction:"setCountdown",
                parameter:7
            },
            _43:{
                cardFunction:"setCountdown",
                parameter:6
            },
            _44:{
                cardFunction:"setCountdown",
                parameter:5
            },
            _45:{
                cardFunction:"setCountdown",
                parameter:4
            },
            _46:{
                cardFunction:"setCountdown",
                parameter:3
            },
            _47:{
                cardFunction:"setCountdown",
                parameter:2
            }
        }
	}
    isBlock(id){
        let element = this.effects["_"+id]
        if(element){
            return element.isBlock;
        }
        return false;
    }
    sortCardEffect(card, id){
        let element = this.effects["_"+id]
        if(element){
            if(card[element.cardFunction]){
                if(element.parameter){
                    card[element.cardFunction](element.parameter)
                }else{
                    card[element.cardFunction]()
                }
            }
        }
    }
}