const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0Z6NjBPdmRIZXBTRFB1MUZxc3pxNkJOVldGMzVid1pFeERKK09kK0hIQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibWRiV0xTT2JnRzNlTVFYMWp1REh0alVFcWU1OWM0S09EejEySWJJU2hRQT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJpQ0ROQ1NDQU56Nlo4MStRQ014UkJXM0d3eS90dFZ6SFo5YWZRNDBoM1hZPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIzdGdwR3htZUFhUk9TSTl0bzJKM2VWNVBrRU1DL0R6MFNDQzJwU2dvR3cwPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InFPdlVRV0dPeWlnYm91T2JGNEpRcFVqK3YrRUpVTUxZNFRFY0k2RTB4VjQ9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IktXSmVqVkRJbkxmai9XQXBvUDZnNFM3WEtlei9aZkt3QjBYcXVFMEpIbE09In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiT0U2VFllSXlQOElEZHhneFQydit6Q2tpSFEzSms3bHlUN3dBS3lNQ2duST0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ2RRUnI0ZDE3dVVZUUJqUFQxWTI0RUFvYjAxUzNRbFdnSEhuUVp6WG1Ccz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ii9jRERkS1BubGYrT1pwOVdhWkVONU5FTFNIQWMvNjR6SHN2WUFSbEw3ZnFkcFBQR2xhRnFLMHZJc2VucWhycEJaNlpPSndqbS9Xby9lSlNlQ1dJaEJRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTc4LCJhZHZTZWNyZXRLZXkiOiJnZFJ5YnhpN3BZbHJHY3BRYjNGRVRtNWJnNWtjL3lKVlgvUFNQZTdvYW1zPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6NjEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjo2MSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJDWFhjd2NFMFJPcVpJZGl1M2xNS2ZBIiwicGhvbmVJZCI6IjNlOTZmYTlmLWM1MmItNDRhZC1iODU0LTZlMWMzNjg5YWU2NSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ0Z1NEeEZyNnZEQjJQdmorTHVuWllna1pEbXM9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUTNXVWdJZUU5MTVYY05hU0FtRCtKT0FyVm9BPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IjU1WTVUOFNQIiwibWUiOnsiaWQiOiIyMzQ3MDQ2NjI5MDIwOjY4QHMud2hhdHNhcHAubmV0IiwibmFtZSI6IuKAjuKAjsODw4fwnZG7w4/wnZG9w4t+8J2RrfCdkpkge+KAouKAmT4+4oCiXFwifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ01mRHJvWU5FTS9YaDdvR0dBa2dBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6InZnNy9GZnU1VFF1M3JtbmpZTXV2WjJKLzlxNjlIQi9MQUIwZW9pdHNZWFk9IiwiYWNjb3VudFNpZ25hdHVyZSI6ImpQWS9GMy9uU0NtQXo5R0J2bFZ4SHRERkpVeHlVVVZkaXNTUG5IdzhQRnc5UDBqcDkyZ3NRUFgvUWpIUGRHUlJoc2NHUGVrYzNLUE1HWGRrbGQ3bkRRPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJNRU1EZk9LZ1cyc3Z6YnltWWpRemF1cmdLc2g4KzQvd0IwWmt2amVaTVlGMDAzTDk1bEloQUh2L3FkQUU5c1VsZk15aTFpZUVOT1UxNnhpWXJQSVNCZz09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjIzNDcwNDY2MjkwMjA6NjhAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCYjRPL3hYN3VVMEx0NjVwNDJETHIyZGlmL2F1dlJ3Znl3QWRIcUlyYkdGMiJ9fV0sInBsYXRmb3JtIjoic21iaSIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTczMjM3MzQ2OSwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFQWW8ifQ==',
    PREFIXE: process.env.PREFIX || "+",
    OWNER_NAME: process.env.OWNER_NAME || "Ibrahim Adams",
    NUMERO_OWNER : process.env.NUMERO_OWNER || " Ibrahim Adams",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'BMW_MD',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/17c83719a1b40e02971e4.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
