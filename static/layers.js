const map = {
    cols: 16,
    rows: 16,
    tsize: 16
};

const background = [
    [0,0], [0,1], [0,1], [0,1], [0,1], [0,1], [0,1], [0,1], [0,1], [0,1], [0,1], [0,1], [0,1], [0,1], [0,1], [0,2],
    [1,0], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,2],
    [1,0], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,2],
    [1,0], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,2],
    [1,0], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,2],
    [1,0], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,2],
    [1,0], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,2],
    [1,0], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,2],
    [1,0], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,2],
    [1,0], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,2],
    [1,0], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,2],
    [1,0], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,2],
    [1,0], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,2],
    [1,0], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,2],
    [1,0], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,1], [1,2],
    [2,0], [2,1], [2,1], [2,1], [2,1], [2,1], [2,1], [2,1], [2,1], [2,1], [2,1], [2,1], [2,1], [2,1], [2,1], [2,2]
]

let shurikens = {
    control: new Shuriken(),
    opponent: new Shuriken()
} 

class LayerManager {
    constructor(){
        this.promises = [];

        this.canva = document.createElement("canvas");
        this.canva.width = MAP_SIZE;
        this.canva.height = MAP_SIZE;
    }

    init(){}

    update(update_map){}
}

class BackgroundLayer extends LayerManager {
    constructor(){
        super();

        this.tiles = new Image();

        this.promises.push(new Promise(function(resolve, reject) {
            this.tiles.onload = function() {
                resolve(this.tiles);
            }.bind(this);

            this.tiles.onerror = function() {
                reject('Could not load image: ' + name);
            };
        }.bind(this)));

        this.tiles.src = "static/Assets/Backgrounds/TilesetFloor.png";
    }

    init(){
        let background_canva = this.canva.getContext("2d");
        for (let col = 0; col < map.cols; col++) {
            for (let row = 0; row < map.rows; row++) {
                let tile = background[row * map.cols + col];
                if (tile !== 0) { // 0 => empty tile
                    background_canva.drawImage(
                        this.tiles, // image
                        tile[1] * map.tsize, // source x
                        tile[0] * map.tsize, // source y
                        map.tsize, // source width
                        map.tsize, // source height
                        col * map.tsize,  // target x
                        row * map.tsize, // target y
                        map.tsize, // target width
                        map.tsize // target height
                    );
                }
            }
        }
    }
}

class CharactersLayer extends LayerManager {
    constructor(){
        super();

        this.characters = [];
        for (let name of characters_names){
            let character = new Character(name);
            this.characters.push(character);
            this.promises.push(...character.promises)
        }

        this.promises.push(...shurikens.control.promises)
        this.promises.push(...shurikens.opponent.promises)
        //document.body.appendChild(this.canva)
    }

    init(){
        for(let i in this.characters){
            this.characters[i].init(i==control, i==opponent);
        }
        shurikens.control.init(null);
        shurikens.opponent.init(this.characters[control]);
    }

    update(update_map){
        let context = null;
        if(update_map){
            context = this.canva.getContext("2d");
            context.clearRect(0, 0, MAP_SIZE, MAP_SIZE);
        }
        for(let character of this.characters){
            character.update();
            if(update_map) character.draw(context);
        }

        shurikens.control.update();
        shurikens.opponent.update();

        if(update_map){
            shurikens.control.draw(context);
            shurikens.opponent.draw(context);
        }
    }
}