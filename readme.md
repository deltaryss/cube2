# Guide de lancement de l'application:  
## API:  
Pour lancer l'api, il faut suivre les étapes suivantes:  
- Se placer dans le dossier api  
- Lancer la commande: npm install  
- Ajouter le fichier "config.js" avec le contenu suivant:  

```  
module.exports = {  
database: {  
host: '+++', // Adresse du serveur (localhost si le serveur est local)  
user: '+++', // Utilisateur de la base de données  
password: '+++', // Mot de passe de l'utilisateur  
database: '+++' // Nom de la base de données  
port: +++ // Port de la base de données  
},  
api: {  
url: '+++' // Url de l'api (retrouvable dans le fichier "Groupes_et_API_Key.xlsx")  
}  
port: +++ // Port sur lequel l'api sera lancée (nombre) (facultatif)  
table: "+++" // Nom de la table dans la base de données  
debug: +++ // Affiche les logs de debug dans la console (true/false) (facultatif)  
}  
```
***remplacer les `+++` par les valeurs souhaitées***  
  
- Lancer la commande: npm start  
- L'api est lancée sur le port 3000 par défaut (modifiable dans le fichier config.js)  
- Par défaut, l'api est lancée sans le mode debug (affichage des logs dans la console) (modifiable dans le fichier config.js)

## Application web:
placeholder

# Notes de developpement:
## API:
- L'api est développée en NodeJS avec le framework ExpressJS
- L'api peux générer automatiquement la table de la base de données si l'utilisateur de la base de données a les droits suffisants
- Un template du fichier de configuration est disponible dans le dossier "api" sous le nom de "config-template.js"

## Database:
- La base de données contient pour l'instant une seule table. Le nom de cette table est défini dans le fichier config.js et la table est générée automatiquement si l'utilisateur de la base de données a les droits suffisants.
- La table de la base de données contient les collones suivantes:
```  
id INT AUTO_INCREMENT PRIMARY KEY, // Identifiant unique de la ligne
id_record INT(11), // Identifiant du relevé
id_sonde INT(11), // Identifiant de la sonde
temperature INT(11), // Température en °C * 10 (ex: 25.7°C = 257)
humidite INT(11), // Humidité en % 
batterie_voltage INT(11), // Tension de la batterie en mV (ex: 3.664V = 3664)
rssi INT(11), // Force du signal en dBm
date TIMESTAMP, // Date du relevé
raw_data TEXT // Données brutes du relevé
```