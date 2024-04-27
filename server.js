const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

// Initialisation de l'application Next.js
const app = next({ dev });
const handler = app.getRequestHandler();

// Initialisation du serveur HTTP
app.prepare().then(() => {
  const httpServer = createServer(handler);

  // Initialisation de Socket.io
  const io = new Server(httpServer);

  let summonersData = {
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
  };

  // Configuration des événements Socket.io
  io.on("connection", (socket) => {
    console.log("Nouvelle connexion :", socket.id);

    // Gestion de l'événement "client-ready"
    socket.on("client-ready", () => {
      // Émission de l'événement "get-summoners-data" pour demander les données des invocateurs
      socket.emit("get-summoners-data");
    });

    // Gestion de l'événement "get-summoners-data"
    socket.on("get-summoners-data", () => {
      // Émission des données des invocateurs au client
      socket.emit("updateSummonerData", summonersData);
    });

    // Gestion de l'événement "updateSummonerData"
    socket.on("updateSummonerData", (newSummonersData) => {
      console.log("Données des invocateurs mises à jour :", newSummonersData);
      summonersData = newSummonersData;
      // Émission des données mises à jour à tous les clients connectés
      io.emit("updateSummonerData", newSummonersData);
    });
  });

  // Démarrage du serveur HTTP
  httpServer.listen(port, hostname, () => {
    console.log(`Serveur prêt sur http://${hostname}:${port}`);
  });

  // Gestion des erreurs
  httpServer.on("error", (err) => {
    console.error("Erreur de serveur :", err);
    process.exit(1);
  });
});
