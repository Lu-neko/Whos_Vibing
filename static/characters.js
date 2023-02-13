const characters_names = [
    'BlueNinja', 'BlueSamurai', 'Boy', 'Cavegirl', 'Cavegirl2', 'Caveman', 'Caveman2', 'DarkNinja', 'EggBoy', 'EggGirl', 'Eskimo', 'EskimoNinja', 'GoldKnight', 'GrayNinja', 'Greenman', 'GreenNinja', 'Inspector', 'Knight', 'Lion', 'MaskedNinja', 'MaskFrog', 'Master', 'Monk', 'Monk2', 'Noble', 'OldMan', 'OldMan2', 'OldMan3', 'Princess', 'RedNinja', 'RedNinja2', 'RedSamurai', 'Samurai', 'Skeleton', 'Villager', 'Villager2', 'Villager3', 'Villager4', 'Woman'
];

const animation_states = {
    STATIC: 0,
    RUN1: 1,
    RUN2: 2,
    RUN3: 3,
    ATTACK: 4
};

let control, opponent;

class Character {

    constructor(name){

        this.promises = [];
        this.animation_state = animation_states.STATIC;

        this.sprite = new Image();
        this.face = new Image();

        this.promises.push(new Promise(function(resolve, reject) {
            this.sprite.onload = function() {
                resolve(this.sprite);
            }.bind(this);

            this.sprite.onerror = function() {
                reject('Could not load image: ' + name);
            };
        }.bind(this)));

        this.promises.push(new Promise(function(resolve, reject) {
            this.face.onload = function() {
                resolve(this.face);
            }.bind(this);

            this.face.onerror = function() {
                reject('Could not load image: ' + name);
            };
        }.bind(this)));

        this.sprite.src = "static/Assets/Characters/" + name + "/SpriteSheet.png";
        this.face.src = "static/Assets/Characters/" + name + "/Faceset.png";
    }

    init(is_player, is_opponent){
        if (is_player) this.movements = new MovementPlayer();
        else if (is_opponent) this.movements = new MovementOpponent();
        else this.movements = new MovementAI();

        if (is_player){
            this.face.width *= 2;
            this.face.id = "face";
            document.getElementById("infos").appendChild(this.face)
        }
    }

    update(){
        this.movements.update();
        this.movements.movement();
    }

    draw(context){
        context.drawImage(this.sprite, this.movements.direction*SIZE, this.animation_state*SIZE, SIZE, SIZE, this.movements.x, this.movements.y, SIZE, SIZE);
    }
}

class Shuriken {
    constructor(){
        this.promises = [];
        this.active = false;

        this.sprite = new Image();

        this.promises.push(new Promise(function(resolve, reject) {
            this.sprite.onload = function() {
                resolve(this.sprite);
            }.bind(this);

            this.sprite.onerror = function() {
                reject('Could not load image: Shuriken');
            };
        }.bind(this)));

        this.sprite.src = "static/Assets/HUD/Shuriken.png";
    }

    init(destination){
        this.destination = destination;
        this.movements = new MovementManager();
        this.movements.move = 5;

        this.last = {x:-1, y:-1};
    }

    update(){
        if (this.active){
            this.movements.movement();
            if (this.movements.x == this.last.x && this.movements.y == this.last.y){
                this.active = false;
                return;
            }
            this.last.x = this.movements.x;
            this.last.y = this.movements.y;
            if (!this.destination) return;
            if (this.destination.movements.x <= this.last.x && this.destination.movements.x+SIZE >= this.last.x ||
                this.destination.movements.x <= this.last.x+SIZE && this.destination.movements.x+SIZE >= this.last.x+SIZE){
                if (this.destination.movements.y <= this.last.y && this.destination.movements.y+SIZE >= this.last.y ||
                    this.destination.movements.y <= this.last.y+SIZE && this.destination.movements.y+SIZE >= this.last.y+SIZE){
                    socket.send("END");
                    debuff += 2;
                    this.active = false;
                    return;
                }
            }
        }
    }

    draw(context){
        if (this.active){
            context.drawImage(this.sprite, 0, 0, SIZE, SIZE, this.movements.x, this.movements.y, SIZE, SIZE)
        }
    }
}