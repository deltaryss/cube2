// Ce fichier contient un template pour le fichier config.js
// Il faut le renommer en config.js et remplir les champs avec les informations de votre base de données

module.exports = {
    database: {
        host: '', // Adresse du serveur; String
        user: '', // Utilisateur; String
        password: '', // Mot de passe; String
        database: '', // Nom de la base de données; String
        port: 0, // Port du serveur; Number
    },
    api: {
        url: '' // URL de l'API (voir doc); String (url)
    },
    port: 0, // Port externe de l'API; Number
    table: "", // Nom de la table dans la base de données; String
    debug: false, // Affiche les logs dans la console; Boolean
};