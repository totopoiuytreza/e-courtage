var path = require('path');
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');


/* Initialize all routers */
var authRouter = require('./routes/auth');
var demande_clientRouter = require('./routes/demande_client');
var demande_banqueRouter = require('./routes/demande_banque');
var documentRouter = require('./routes/document');
var banqueRouter = require('./routes/banque');

var cors = require('cors')

const app = express();
const PORT = process.env.PORT || 3000;
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
    next();
});


app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);

/* BEGIN firebase initialization */
const Firebase = require('./firebase.connection');
const bucket = Firebase.bucket;
/* END firebase initialization */
bucket.getFiles().then(([files]) => files.forEach(file => console.log(file.name)))


/* Use all routers */
app.use('/auth', authRouter);
app.use('/document', documentRouter);
app.use('/demande_client', demande_clientRouter);
app.use('/demande_banque', demande_banqueRouter);
app.use('/banque', banqueRouter);


/* BEGIN db initialization */
const Sequelize = require('./db.connection');
const connection = Sequelize.connection;
/* END db initialization */


try{ 
    connection.authenticate()
}
catch(error){
    console.log("Unable to connect to the database:", error);
}


/* Synchronize database */

const Banque = require("./models/banque.model.js")(connection, Sequelize.library);
const Client = require("./models/client.model.js")(connection, Sequelize.library);
const Demande = require("./models/demande.model.js")(connection, Sequelize.library);
const Document = require("./models/document.model.js")(connection, Sequelize.library);
const Accepter = require("./models/accepter.model.js")(connection, Sequelize.library);
const SessionClient = require("./models/sessionClient.model.js")(connection, Sequelize.library);
const SessionBanque = require("./models/sessionBanque.model.js")(connection, Sequelize.library);

/* Add db relations */
Demande.sync({force: false}, {alter: true});
Client.sync({force: false}, {alter: true});
Document.sync({force: false}, {alter: true});
Banque.sync({force: false}, {alter: true});
SessionClient.sync({ force: false, alter: true });
SessionBanque.sync({ force: false, alter: true });


Demande.belongsToMany(Document, {as: "document", through: "contient", foreignKey: "id_demande", timestamps: false});
Demande.belongsToMany(Banque, {as:"banque", through: Accepter, foreignKey: "id_demande"});
Demande.belongsTo(Client, {as: "owner", foreignKey: "id_client"});

Client.hasMany(Demande, {as: "demande", foreignKey: "id_client"});

Document.belongsToMany(Demande, {as:"demandes", through: "contient", foreignKey: "id_document", timestamps: false});

Banque.belongsToMany(Demande, {as:"accepted", through: Accepter, foreignKey: "id_banque"});

SessionClient.belongsTo(Client, {as: "user", foreignKey: "id_client"});
SessionBanque.belongsTo(Banque, {as: "user", foreignKey: "id_banque"});

connection.sync()
/* END db relations */


module.exports = app;


