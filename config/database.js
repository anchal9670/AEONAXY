// app.js
const postgres = require('postgres');
require('dotenv').config({ path: __dirname + '/.env' });

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

async function getPgVersion() {
  try{
    const result = await sql`select version()`;
    console.log(result);
  }catch(error){
    console.log(error);
  }
}

getPgVersion();

module.exports = sql;