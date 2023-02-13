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

/*
Game.load = function () {
    return [
        Loader.loadImage('tiles', 'static/Assets/Backgrounds/TilesetFloor.png'),
        //Loader.loadImage('character', 'SpriteSheet.png')
    ];
};

Game.init = function () {
    this.canva = document.createElement("canvas");
    this.canva.width = 512;
    this.canva.height = 512;
    this.tileAtlas = [Loader.getImage('tiles')];
    this.characters = new CharactersCanva();
    this._drawLayer(0);
    //this.hero = {x: 128, y: 384, image: Loader.getImage('character')};
};

Game._drawLayer = function (layer) {
    let context = this.canva.getContext("2d");
    for (var c = 0; c < map.cols; c++) {
        for (var r = 0; r < map.rows; r++) {
            var tile = map.getTile(layer, c, r);
            if (tile !== 0) { // 0 => empty tile

                context.drawImage(
                    this.tileAtlas[layer], // image
                    tile[1] * map.tsize, // source x
                    tile[0] * map.tsize, // source y
                    map.tsize, // source width
                    map.tsize, // source height
                    c * map.tsize,  // target x
                    r * map.tsize, // target y
                    map.tsize, // target width
                    map.tsize // target height
                );
            }
        }
    }
};

Game.render = function (update_map) {
    // draw map background layer
    //if (update_map) this._drawLayer(0);
    // draw game sprites
    this.characters.update(update_map);
    //console.log(update_map);
    if (update_map){
        this.ctx.drawImage(this.canva, 0, 0)
        this.ctx.drawImage(this.characters.canva, 0, 0);
    }
    // draw map top layer
    //this._drawLayer(1);
};*/

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
        //document.body.appendChild(this.canva)
    }

    init(){
        for(let i in this.characters){
            this.characters[i].init(i==control, i==opponent);
        }
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
    }
}