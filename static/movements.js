const SIZE = 16;
const MAP_SIZE = 256;

const movement_types = {
    AI: 0,
    MANUAL: 1,
    REMOTE: 2
}

const directions = {
    DOWN: 0,
    UP: 1,
    LEFT: 2,
    RIGHT: 3
};

const keyboard = {
    DOWN: "KeyS",
    UP: "KeyW",
    LEFT: "KeyA",
    RIGHT: "KeyD"
};

position_control = {
    x:0,
    y:0
}

class MovementManager {
    constructor(){
        this.x = Math.floor(random()*(MAP_SIZE-SIZE));
        this.y = Math.floor(random()*(MAP_SIZE-SIZE));

        this.move = 0;

        this.direction = directions.DOWN;
    }

    movement(){
        switch(this.direction){
            case directions.DOWN:
                if (this.y < MAP_SIZE-SIZE) this.y += this.move;
                break;
            case directions.UP:
                if (this.y > 0) this.y -= this.move;
                break;
            case directions.LEFT:
                if (this.x > 0) this.x -= this.move;
                break;
            case directions.RIGHT:
                if (this.x < MAP_SIZE-SIZE) this.x += this.move;
                break;
        }
    }
}

class MovementAI extends MovementManager {
    constructor(){
        super();
        this.timer = 0;
    }

    update(){
        this.timer -= 1;
        if (!(this.x > 0 && this.x < MAP_SIZE-SIZE && this.y > 0 && this.y < MAP_SIZE-SIZE)){
            this.timer -= 3;
        }
        if (this.timer < 0){
            this.move = Math.floor(random()*2);
            this.timer = Math.floor(random()*100);
            if (random()>0.4) this.direction = Math.floor(random()*4);
        }
    }
}

class MovementPlayer extends MovementManager {
    constructor(){
        super();
        this.keys = {
            "KeyS": 0,
            "KeyW": 0,
            "KeyA": 0,
            "KeyD": 0
        };

        this.timer = 0;

        window.addEventListener('keydown', this.keydown.bind(this));
        window.addEventListener('keyup', this.keyup.bind(this));
    }

    keydown(event){
        if (Object.keys(this.keys).includes(event.code)){
            this.keys[event.code] = 1;
        }
    }

    keyup(event){
        if (Object.keys(this.keys).includes(event.code)){
            this.keys[event.code] = 0;
        }
    }

    update(){

        /*
        this.move = 1;
        if (this.keys[keyboard.DOWN]) return this.direction = directions.DOWN;
        if (this.keys[keyboard.UP]) return this.direction = directions.UP;
        if (this.keys[keyboard.LEFT]) return this.direction = directions.LEFT;
        if (this.keys[keyboard.RIGHT]) return this.direction = directions.RIGHT;
        this.move = 0*/

        let keys = [keyboard.DOWN, keyboard.UP, keyboard.LEFT, keyboard.RIGHT];

        this.move = 0;

        for(let i in keys){
            if (this.keys[keys[i]]){
                if (this.direction != i){
                    this.direction = Object.values(directions)[i];
                    this.timer = 4;
                }
                if (this.timer > 0) this.timer--;
                else this.move = 1;
            }
        }
        socket.send(JSON.stringify({
            command:2,
            x:this.x,
            y:this.y,
            direction:this.direction,
            move:this.move
        }))
        position_control.x = this.x;
        position_control.y = this.y;
        //console.log(Math.max(0, Math.floor(20-Math.pow(Math.pow(this.x-position_opponent.x, 2)+Math.pow(this.y-position_opponent.y, 2), 0.5))))
    }
}

class MovementOpponent extends MovementManager {
    constructor(){
        super();
        position_opponent.x = this.x;
        position_opponent.y = this.y;
        position_opponent.direction = this.direction;
        position_opponent.move = this.move;
    }

    update(){
        //console.log(Math.abs(this.x - position_opponent.x))
        if (Math.abs(this.x - position_opponent.x) > 3){
            this.x = position_opponent.x;
        }
        if (Math.abs(this.y - position_opponent.y) > 3){
            this.y = position_opponent.y;
        }
        /*if (this.x != position_opponent.x)
            this.x = position_opponent.x;

        if (this.y != position_opponent.y)
            this.y = position_opponent.y;*/

        this.direction = position_opponent.direction;
        this.move = position_opponent.move;
    }
}