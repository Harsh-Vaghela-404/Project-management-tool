import { Client } from 'pg';
require("dotenv").config();

const client = new Client({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASS,
  port: 5432,
  database: process.env.DATABASE
})

export async function connectDb() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');
  } catch (err) {
    console.error('Error connecting to PostgreSQL database:', err);
  }
}

export async function queryDb(query: string) {
  try {
    const result = await client.query(query);
    return result.rows;
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  }
}
