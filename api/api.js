// import { Pool, Client } from 'pg';
// ^ ES6 import (keep in mind);
const express = require("express");
const { Pool, Client } = require('pg')

const router = express.Router();

const pool = new Pool({
  user: 'rory',
  host: 'localhost',
  database: 'timesheet-dev',
  password: 'local-setup',
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

const newTemplate = template => {
  const sql = `INSERT INTO templates (template) VALUES ($1);`

  // have to enclose in array !
  pool.query(sql, [template], err => {
    if (err) throw err
    else console.log("saved a template?")
  })
}

router.get("/testdata", (req, res) => {
  const sql = `
    SELECT * from accounts;  
  `
  pool.query(sql, (err, rows) => {
    if (err) throw err;
    console.log(rows.rows)
    res.send(rows.rows)
  })
})

router.get("/templates", (req, res) => {
  const sql = `SELECT * FROM templates;`

  pool.query(sql, (err, rows) => {
    if (err) throw err;
    res.send(rows.rows)
  })
})

router.post("/savetemplate", (req, res) => {
  newTemplate(req.body)
  res.sendStatus(200)
})

module.exports = router;