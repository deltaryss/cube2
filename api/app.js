const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const config = require("./config.js");
const cors = require('cors');
const moment = require("moment");

const app = express();
app.use(bodyParser.json());
app.use(cors());
const debug = config.debug || false;

// Configuration de la base de données MySQL
const db = mysql.createConnection(config.database);

// Création de la table si elle n'existe pas
const createMesuresTableIfNotExists = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS ${config.table} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_record INT(11),
        id_sonde INT(11),
        temperature INT(11),
        humidite INT(11),
        batterie_voltage INT(11),
        rssi INT(11),
        date TIMESTAMP,
        raw_data TEXT
      )
    `;
    await db.query(query);
    console.log('Table "mesures" créée avec succès ou existe déjà.');
  } catch (error) {
    console.error('Erreur lors de la création de la table "mesures":', error);
  }
};
// Connexion à la base de données MySQL
const connectDb = db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err);
  } else {
    console.log("Connecté à la base de données MySQL");
    createMesuresTableIfNotExists();
  }
});
// Vérification de doublon de données
function checkDuplicateData(idReleve, hexData, callback) {
  const query =
    "SELECT COUNT(*) AS count FROM " +
    db.escapeId(config.table) +
    " WHERE id_record = ? OR raw_data = ?";

  db.query(query, [idReleve, hexData], (error, results) => {
    if (error) {
      return callback(error);
    }

    const count = results[0].count;

    if (count > 0) {
      // Doublon détecté, ne pas envoyer les données
      callback(null, true); // true indique un doublon
    } else {
      // Pas de doublon, les données peuvent être envoyées
      callback(null, false); // false indique pas de doublon
    }
  });
}
// Traitement des données hexadécimales
function parseHexData(hexString) {
  if (hexString.startsWith("545A") && hexString.endsWith("0D0A")) {
    var data = Buffer.from(hexString);

    const hexToInt = (hexx) => {
      var hex = parseInt(hexx, 16);
      return hex;
    };

    var dataLength = data.slice(4, 8);
    if (debug) console.log("dataLength: " + dataLength);

    // TAG starts at 76

    var TAG = data.slice(76, hexString.length - 12);
    if (debug) console.log("TAG: " + TAG);
    var TAGData = TAG.slice(10, TAG.length);
    if (debug) console.log("TAGData: " + TAGData);

    var idSonde = TAGData.slice(0, 8);
    if (debug) console.log("idSonde: " + idSonde);
    var batteryVoltage = hexToInt(TAGData.slice(10, 14));
    if (debug) console.log("batteryVoltage: " + batteryVoltage / 1000 + "V");
    var temperature = hexToInt(TAGData.slice(14, 18));
    if (debug) console.log("temperature: " + temperature / 10 + "°C");
    var humidity = hexToInt(TAGData.slice(18, 20));
    if (debug) console.log("humidity: " + humidity + "%");
    var rssi = hexToInt(TAGData.slice(20, 22));
    if (debug) console.log("rssi: " + rssi + "dBm");

    return {
      idSonde: idSonde,
      batteryVoltage: batteryVoltage,
      temperature: temperature,
      humidity: humidity,
      rssi: rssi,
    };
  } else {
    return false;
  }
}
// Envois des données à la base de données MySQL
const insertDataIntoDatabase = async (
  idRecord,
  idSonde,
  temperature,
  humidite,
  batterieVoltage,
  rssi,
  date,
  raw_data
) => {
  try {
    const query = `
      INSERT INTO ${config.table} (id_record, id_sonde, temperature, humidite, batterie_voltage, rssi, date, raw_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      idRecord,
      idSonde,
      temperature,
      humidite,
      batterieVoltage,
      rssi,
      date,
      raw_data,
    ];

    await db.query(query, values);
    if (debug) console.log("Données insérées dans la base de données");
  } catch (error) {
    console.error(
      "Erreur lors de l'insertion des données dans la base de données:",
      error
    );
  }
};
// Récupération et traitement des données depuis l'API
const fetchDataAndProcess = async () => {
  try {
    // Récupération des données depuis l'API
    const response = await axios.get(config.api.url);
    const rawData = response.data;

    // Traitement des données selon la documentation
    rawData.map(async (item) => {
      const [idReleve, hexData, dateReleve] = item;

      if (debug)
        console.log(
          "-------------------------------------------------------------------------------------------------------------------------------------"
        );
      if (debug) console.log("Récupération des données depuis l'API");
      if (debug) console.log("idReleve :", idReleve);
      if (debug) console.log("hexData :", hexData);
      if (debug) console.log("dateReleve :", dateReleve);

      checkDuplicateData(idReleve, hexData, (error, hasDuplicate) => {
        if (error) {
          console.error("Erreur lors de la vérification des doublons :", error);
          // Gérer l'erreur selon vos besoins
          return;
        }

        if (hasDuplicate) {
          if (debug) console.log("Doublon détecté, les données ne seront pas envoyées.");
          if (debug) console.log("idReleve :", idReleve, "hexData :", hexData);
          if (debug)
            console.log(
              "-------------------------------------------------------------------------------------------------------------------------------------"
            );
        } else {
          // Traitement des données
          const data = parseHexData(hexData);
          const formattedDate = moment(
            dateReleve,
            "ddd, DD MMM YYYY HH:mm:ss GMT"
          ).format("YYYY-MM-DD HH:mm:ss");

          // Insérer les données dans la base de données
          if (!data) {
            console.error('The "' + hexData + '" data is not valid');
          } else if (data.idSonde == undefined || data.idSonde == 0 || data.idSonde == null || data.idSonde == "" || data.idSonde == "NaN" || data.temperature == undefined || data.temperature == 0 || data.temperature == null || data.temperature == "" || data.temperature == "NaN" || data.humidity == undefined || data.humidity == 0 || data.humidity == null || data.humidity == "" || data.humidity == "NaN" || data.batteryVoltage == undefined || data.batteryVoltage == 0 || data.batteryVoltage == null || data.batteryVoltage == "" || data.batteryVoltage == "NaN" || data.rssi == undefined || data.rssi == 0 || data.rssi == null || data.rssi == "" || data.rssi == "NaN") {
            console.error('The "' + hexData + '" as not been parsed correctly');
          } else {
            insertDataIntoDatabase(
              idReleve,
              data.idSonde,
              data.temperature,
              data.humidity,
              data.batteryVoltage,
              data.rssi,
              formattedDate,
              hexData
            );
          }
          if (debug)
            console.log(
              "-------------------------------------------------------------------------------------------------------------------------------------"
            );
        }
      });
    });
  } catch (error) {
    console.error("Erreur lors du traitement des données :", error);
  }
};

// Démarrage du serveur
connectDb;
fetchDataAndProcess();
setInterval(fetchDataAndProcess, 60000);

// Endpoints
app.get("/data", (req, res) => {
  const query =
    "SELECT * FROM " + db.escapeId(config.table) + " ORDER BY id DESC LIMIT ?";
  const limit = parseInt(req.query.limit) || 10; // Paramètre optionnel pour le nombre de données à renvoyer

  db.query(query, [limit], (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.get("/data-sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const query = "SELECT * FROM " + db.escapeId(config.table) + " ORDER BY id DESC LIMIT 1";
  var previousData = 0;

  const updateData = () => {
    db.query(query, (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        if (previousData.id !== results[0].id) {
          sendUpdate(results[0]);
        }
        previousData = results[0];
      }
    });
  };

  const sendUpdate = (data) => {
    if (data !== 0) {
      var sendData = JSON.stringify(data)
      if (debug) console.log(sendData)
      if (debug) console.log("----------------------------------------------------------------------------------")
      res.write(sendData)
    };
  };

  updateData();
  const intervalId = setInterval(updateData, 60000); // Envoie une mise à jour toutes les 60 secondes

  req.on("close", () => {
    clearInterval(intervalId);
  });
});

app.get("/sondes", (req, res) => {
  const query = "SELECT DISTINCT id_sonde FROM " + db.escapeId(config.table);

  db.query(query, (error, results) => {
    if (error) throw error;
    const idSondes = results.map(result => result.id_sonde);
    res.json(idSondes);
  });
});

// Autres endpoints pour accéder aux données
const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
