import express from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import cors from "cors";
import type { ClientMessage, ServerMessage } from "./types.js";

const app = express();
app.use(cors());

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

const rooms = new Map<string, Set<WebSocket>>();

wss.on("connection", (socket: WebSocket) => {
  console.log("A new client connected!");

  socket.on("message", (rawMessage) => {
    try {
      const message = JSON.parse(rawMessage.toString()) as ClientMessage;

      switch (message.type) {
        case "create": {
          const roomId = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

          rooms.set(roomId, new Set([socket]));
          const response: ServerMessage = { type: "room_created", roomId };

          socket.send(JSON.stringify(response));
          console.log(`Room ${roomId} created by ${message.senderName}`);
          break;
        }

        case "join": {
          const targetRoom = rooms.get(message.roomId);

          if (targetRoom) {
            targetRoom.add(socket);

            const broadcast: ServerMessage = {
              type: "system",
              text: `${message.senderName} has joined the chat!`,
            };

            targetRoom.forEach((client) => {
              client.send(JSON.stringify(broadcast));
            });

            console.log(`${message.senderName} joined room ${message.roomId}`);
          } else {
            const errorRes: ServerMessage = {
              type: "error",
              message: "Room not found!",
            };
            socket.send(JSON.stringify(errorRes));
          }
          break;
        }

        case "chat": {
          const targetRoom = rooms.get(message.roomId);

          if (targetRoom) {
            const broadcast: ServerMessage = {
              type: "chat",
              senderName: message.senderName,
              text: message.text,
              timestamp: Date.now(),
            };

            targetRoom.forEach((client) => {
              client.send(JSON.stringify(broadcast));
            });
          }
          break;
        }

        case "leave": {
          const targetRoom = rooms.get(message.roomId);

          if (targetRoom) {
            targetRoom.delete(socket);

            const alert: ServerMessage = {
              type: "system",
              text: `${message.senderName} has left the room!`,
            };
            targetRoom.forEach((client) => {
              client.send(JSON.stringify(alert));
            });

            if (targetRoom.size === 0) {
              rooms.delete(message.roomId);
              console.log("Room is deleted");
            }
          }
          break;
        }
      }
    } catch (error) {
      console.error("Received invalid JSON or data");
    }
  });

  socket.on("close", () => {
    console.log("client disconnected");

    rooms.forEach((clientsInRoom, roomId) => {
      if (clientsInRoom.has(socket)) {
        clientsInRoom.delete(socket);

        const alert: ServerMessage = {
          type: "system",
          text: "A user has left the chat.",
        };

        clientsInRoom.forEach((client) => {
          client.send(JSON.stringify(alert));
        });
      }

      if (clientsInRoom.size === 0) {
        rooms.delete(roomId);
        console.log(`Room ${roomId} is empty and has been deleted.`);
      } else {
        console.log(
          `A user left room ${roomId}. ${clientsInRoom.size} users remaining.`,
        );
      }
    });
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
