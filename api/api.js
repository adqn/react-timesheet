// import { Pool, Client } from 'pg';
// ^ ES6 import (keep in mind);
const express = require("express");
const { Pool, Client } = require('pg')

const router = express.Router();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'testdb',
  password: 'testpw',
  port: 5432
})

// ;(async () => {
//   console.log('starting query')
  
//   pool.query(`SELECT info ->> 'thing' as thing FROM "test1"`, (err, res) => {
//     if (err) throw err;
//     console.log(res.rows[0]["thing"])
//   })
//   console.log('calling end')
//   await pool.end()
//   console.log('pool has been drained')
// })()

router.get("/testdata", (req, res) => {
  const sql = `
    SELECT * from timesheet_entries;  
  `
  pool.query(sql, (err, rows) => {
    if (err) throw err;
    res.send(rows.rows)
  })
})

module.exports = router;