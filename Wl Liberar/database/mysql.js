const Sequelize = require("sequelize");
const config = require('../config.json')

var db = config.mysql.database
var user = config.mysql.user
var port = config.mysql.port
var host = config.mysql.host
var pass = config.mysql.password

const connection = new Sequelize(db,user,pass,{
    host: host,
    port: port,
    dialect: 'mysql',
    logging: false
});

module.exports = connection;