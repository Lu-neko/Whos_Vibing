const id = window.location.href.split("/")[window.location.href.split("/").length-1];

const image_node = document.getElementById("image");

const link_button = document.createElement("button");
link_button.textContent = "Copy link";
link_button.onclick = ()=>{
    navigator.clipboard.writeText(window.location.href);
};

let socket = new WebSocket("wss://whos-vibing-websocket.luneko.repl.co/" + id);
let lovense_socket;

let basicSdkInstance;
let app_status = false;

let toy_list = []

let random;

let position_opponent = {
    x:0,
    y:0,
    direction:0
};

let qr_code;

fetch("https://whos-vibing-server.luneko.repl.co/get_token").then(data=>{return data.json()}).then(res=>{
    console.log(res);
    fetch(
        "https://api.lovense.com/api/basicApi/getSocketUrl",
        {
            method:"POST",
            body:JSON.stringify({
                platform: "Lovense Bot",
                authToken: res.authToken
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }
    ).then(data=>{return data.json()}).then(result=>{
        console.log(result)
        lovense_socket = io(result.data.socketIoUrl, { path: result.data.socketIoPath, transports: ['websocket'] })

        lovense_socket.emit('basicapi_get_qrcode_ts', {})

        lovense_socket.on('basicapi_get_qrcode_tc', res => {
            console.log("get qrcode")
            let resData = res ? JSON.parse(res) : {}
            if (resData.data) {
                console.log(resData)
                qr_code = document.createElement("img");
                qr_code.src = resData.data.qrcodeUrl
                image_node.appendChild(qr_code)
            }
        })

        lovense_socket.on('basicapi_update_device_info_tc', res => {
            let resData = res ? JSON.parse(res) : {}
            console.log("update_device_info")
            console.log(resData)
            if (toy_list != []) {
                lovense_socket.emit("basicapi_send_toy_command_ts", {
                    command: "Function",
                    action: "Vibrate:5",
                    timeSec: 1,
                    apiVer: 1
                });
            }
            toy_list = resData.toyList;
        })

        lovense_socket.on('basicapi_update_app_status_tc', res => {
            let resData = res ? JSON.parse(res) : {}
            console.log("update_app_status")
            console.log(resData)
            if (resData.status) image_node.removeChild(qr_code);
            else image_node.appendChild(qr_code);
        })

        lovense_socket.on('basicapi_update_app_online_tc', res => {
            let resData = res ? JSON.parse(res) : {}
            console.log("update_app_online")
            console.log(resData)
        })
    })

})

let message = document.getElementById("message_server")

socket.addEventListener("open", function (event) {
    message.textContent = "Waiting for someone else..";
    document.getElementById("infos").appendChild(link_button);
});

// Écouter les messages
socket.addEventListener("message", function (event) {
    //console.log(event.data)
    data = JSON.parse(event.data);
    switch(data.command){
        case 1:
            game.stopped = 0;
            message.style.display = "none";
            document.getElementById("infos").removeChild(link_button);
            console.log("baka");
            console.log(data.time*1000-Date.now())
            control = data.player;
            opponent = data.opponent;
            setTimeout((time)=>{
                console.log("biipp")
                console.log(performance.now())
                console.log(time-Date.now())
                console.log(time)
                console.log(Date.now())
                game.timer = performance.now() - (Date.now()-time);
                console.log("Timer : "+game.timer)
                random = new Math.seedrandom(data.seed);
                start();
            }, data.time*1000-Date.now(), data.time*1000);
            break;
        case 2:
            position_opponent.x = data.x;
            position_opponent.y = data.y;
            position_opponent.direction = data.direction;
            position_opponent.move = data.move;
            break;
        case 3:
            game.stopped = 1;
            message.style.display = "";

            const infos = document.getElementById("infos");

            infos.appendChild(link_button);

            let face = infos.getElementsByTagName("img")[0];
            if (face) infos.removeChild(face);
        case 4:
            shurikens.opponent.movements.direction = data.direction;
            shurikens.opponent.movements.x = data.x;
            shurikens.opponent.movements.y = data.y;
            shurikens.opponent.active = true;
    }
    //console.log('Message', data);
});

socket.addEventListener("close", function(event){
    console.log("closed")
});
