import asyncio
import re
import websockets
import time
import secrets
import json
import random

async def send_start(websocket):
  players = random.sample(range(39), 2)
  
  message = {
    "command": 1,
    "time": int(time.time()) + 2,
    "seed": secrets.token_urlsafe(),
    "player": players[0],
    "opponent": players[1]
  }
  
  await websocket.send(json.dumps(message))
  
  message["player"] = players[1]
  message["opponent"] = players[0]
  await websocket.friend.send(json.dumps(message))

async def connect(websocket, path):
  websocket.friend = None
  
  if path in clients:
    websocket.friend = clients[path]
    websocket.friend.friend = websocket
    del clients[path]

    await send_start(websocket)
  else:
    clients[path] = websocket
  

clients = {}

JOIN_PATH = re.compile("^/[0-9]{6}$")


async def connection(websocket):
  print("path", websocket.path)
  if not JOIN_PATH.match(websocket.path):
    return await websocket.close()
  path = int(websocket.path.replace("/", ""))

  await connect(websocket, path)

  async for message in websocket:
    if message == "END":
      await websocket.send(json.dumps({
        "command":3
      }));
      await websocket.friend.send(json.dumps({
        "command":3
      }));
      await send_start(websocket);
      continue
    if websocket.friend:
      if websocket.friend.closed:
        await websocket.send(json.dumps({
          "command":3
        }));
        websocket.friend = None;
        clients[path] = websocket
      else:
        try:
          await websocket.friend.send(message)
        except websockets.exceptions.ConnectionClosedOK:
          await websocket.send(json.dumps({
            "command":3
          }));
          websocket.friend = None
          clients[path] = websocket

  if (websocket.friend == None):
    del clients[path]
  else:
    await websocket.friend.send(json.dumps({
      "command":3
    }));
    await connect(websocket.friend, path)

  await websocket.close()


async def main():
  print("Starting..")
  async with websockets.serve(connection, "127.0.0.1", 3438):
    await asyncio.Future()  # run forever


asyncio.run(main())
