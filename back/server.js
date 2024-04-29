import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let summonersData = {
  defaultServer: {
    TOP: {
      isFlashed: false,
      lucidityBoots: false,
      cosmicInsight: false,
    },
    JUNGLE: {
      isFlashed: false,
      lucidityBoots: false,
      cosmicInsight: false,
    },
    MID: {
      isFlashed: false,
      lucidityBoots: false,
      cosmicInsight: false,
    },
    SUPPORT: {
      isFlashed: false,
      lucidityBoots: false,
      cosmicInsight: false,
    },
    ADC: {
      isFlashed: false,
      lucidityBoots: false,
      cosmicInsight: false,
    },
  },
};

// Configuration des événements Socket.io
io.on("connection", (socket) => {
  console.log("Nouvelle connexion :", socket.id);

  socket.on("join-room", (room) => {
    socket.emit("get-summoners-data", room);
    socket.join(room);
  });

  // Gestion de l'événement "get-summoners-data"
  socket.on("get-summoners-data", (room) => {
    // Émission des données des invocateurs au client
    socket.emit("updateSummonerData", summonersData[room], room);
  });

  // Gestion de l'événement "updateSummonerData"
  socket.on("updateSummonerData", (data, room) => {
    summonersData = {
      ...summonersData,
      [room]: data,
    };
    socket.in(room).emit("updateSummonerData", summonersData[room]);
  });
});

server.listen(3001, () => {
  console.log("✔️ Server listening on port 3001");
});
