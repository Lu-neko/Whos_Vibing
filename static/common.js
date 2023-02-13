let game;

class Game {
    constructor(){

        this.canva = document.getElementById("canva").getContext('2d');
        this.canva.scale(2, 2);

        this.timer = 0;
        this.ready = false;
        this.stopped = false;
        this.promises = [];

        this.layers = [];
        this.layers.push(new BackgroundLayer());
        this.layers.push(new CharactersLayer());

        for (let layer of this.layers){
            this.promises.push(...layer.promises);
        }

        Promise.all(this.promises).then(function(){
            this.ready = true;
        }.bind(this));
    }

    init(){
        while(!this.ready){};

        for (let layer of this.layers){
            layer.init();
        }

        window.requestAnimationFrame(this.tick.bind(this));
    }

    tick(elapsed){
        if (!this.stopped) window.requestAnimationFrame(this.tick.bind(this));

        while (this.timer < elapsed){
            if (Math.floor((this.timer+1000/40)/500) != Math.floor((this.timer)/500)){
                lovense_socket.emit("basicapi_send_toy_command_ts", {
                    command: "Function",
                    timeSec: 10,
                    action: "Vibrate:"+Math.max(0, Math.floor(20-Math.pow(Math.pow((position_control.x-position_opponent.x)/10, 2)+Math.pow((position_control.y-position_opponent.y)/10, 2), 0.5))),
                    apiVer: 1
                })
            }
            this.timer += 1000/40;
            if (elapsed-this.timer < 5000) this.canva.clearRect(0, 0, 512, 512);
            this.render(elapsed-this.timer < 5000);
        }
    }

    render(update_map){
        for (let layer of this.layers){
            layer.update(update_map);
            if (update_map){
                this.canva.drawImage(layer.canva, 0, 0)
            }
        }
    }
}

window.onload = function () {
    game = new Game();
}

function start() {
    game.init();
};