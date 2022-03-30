export default class TileDesigner {
    constructor() {
        this.tilesID = {
            TOP_LEFT: 'tile_1_0.png',
            TOP: 'tile_1_1.png',
            TOP_RIGHT: 'tile_1_2.png',
            CENTER_LEFT: 'tile_1_32.png',
            CENTER: 'tile_1_33.png',
            CENTER_RIGHT: 'tile_1_34.png',
            BOTTOM_LEFT: 'tile_1_64.png',
            BOTTOM: 'tile_1_65.png',
            BOTTOM_RIGHT: 'tile_1_66.png',
            DEBUG: 'tile_1_97.png',
            DEBUG2: 'tile_1_5.png',
        }

        this.tilesIDBorder = {
            TOP_LEFT: 'tile_1_'+(0+18)+'.png',
            TOP: 'tile_1_'+(1+18)+'.png',
            TOP_RIGHT: 'tile_1_'+(2+18)+'.png',
            CENTER_LEFT: 'tile_1_'+(32+18)+'.png',
            CENTER: 'tile_1_'+(33+18)+'.png',
            CENTER_RIGHT: 'tile_1_'+(34+18)+'.png',
            BOTTOM_LEFT: 'tile_1_'+(64+18)+'.png',
            BOTTOM: 'tile_1_'+(65+18)+'.png',
            BOTTOM_RIGHT: 'tile_1_'+(66+18)+'.png',
            DEBUG: 'tile_1_97.png',
            DEBUG2: 'tile_1_5.png',
        }
    }
    getTileSprite(j, i, pieces, baseLayer = false) {
        if (pieces[i][j] != 32) {



            let offsetUp = { i: i - 1, j: j }
            let offsetDown = { i: i + 1, j: j }
            let offsetLeft = { i: i, j: j - 1 }
            let offsetRight = { i: i, j: j + 1 }

            let theresUp = this.onBounds(offsetUp, pieces);
            let theresDown = this.onBounds(offsetDown, pieces);
            let theresLeft = this.onBounds(offsetLeft, pieces);
            let theresRight = this.onBounds(offsetRight, pieces);

            console.log(theresRight)

            if (!theresRight) {
            } else {
               // console.log(i, j)

            }
            let targetAssets = baseLayer? this.tilesID : this.tilesIDBorder
            if (!theresUp) {
                if (!theresLeft) {
                    return targetAssets.TOP_LEFT;
                } else if (!theresRight) {

                    return targetAssets.TOP_RIGHT;
                } else {
                    return targetAssets.TOP;
                }
            } else if (!theresDown) {
                if (!theresLeft) {
                    return targetAssets.BOTTOM_LEFT;
                } else if (!theresRight) {
                    return targetAssets.BOTTOM_RIGHT;
                } else {
                    return targetAssets.BOTTOM;
                }
            }else if (!theresRight){
                return targetAssets.CENTER_RIGHT;
            }else if (!theresLeft){
                return targetAssets.CENTER_LEFT;
            }

            return targetAssets.CENTER;

        } else {

            return null;
        }
        //console.log(i,j,pieces[i][j])

    }
    onBounds(offset, pieces) {
        let onBounds = this.onBoundsI(offset.i) && this.onBoundsJ(offset.j);

        if (onBounds) {
            return pieces[offset.i][offset.j] != 32;
        } else {
            return onBounds;
        }
    }
    onBoundsI(i) {
        return (i >= 0 && i <= GRID.j - 1)
    }
    onBoundsJ(j) {
        return (j >= 0 && j <= GRID.i - 1)
    }
}