//***********************************  DATABASE CONFIGURATION  ******************************** */
const env = {
    database: process.env.DB,
    username: process.env.USERNAMES,
    password: process.env.PASS,
    host: process.env.HOST,
    dialect: "mysql",


};
module.exports = env;
