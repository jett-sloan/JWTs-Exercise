/** Database connection for messagely. */


const { Client } = require("pg");

const client = new Client("postgres://postgres:sammydog12@localhost:5432/JWT");

client.connect();


module.exports = client;
