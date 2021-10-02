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

const getTasks = callback => {
  pool.query(`SELECT * FROM tasks;`, (err, res) => {
    if (err) throw err
    else callback.send(res.rows)
  })
}

router.get("/tasks", (req, res) => {
  let attrs = JSON.parse(req.body)
  getTasks(res)
  res.sendStatus(200)
})

router.get("/templates", (req, res) => {
  const sql = `SELECT * FROM templates;`

  pool.query(sql, (err, res) => {
    if (err) throw err;
    res.send(res.rows)
  })
})

router.post("/savetemplate", (req, res) => {
  newTemplate(req.body)
  res.sendStatus(200)
})

module.exports = router;