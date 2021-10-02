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
  port: 5433
})

// interface Task {
//   id: string;
//   projectId: string;
//   start: DateTime;
//   end: DateTime | null;
//   description: string;
// }

const tasks = []

const startTask = (projectId, taskId, startTime) => { 
  const foundTaskIdx = tasks.findIndex(task => task.id === taskId && task.projectId === projectId)
  const sqlGetTasks = `SELECT task from tasks
                       WHERE CAST (task->>'id' AS INTEGER) = ${taskId}
                       AND CAST (task->>'projectId' AS INTEGER) = ${projectId}`
  const sqlGetLastTaskId = `SELECT task->'id' FROM tasks
                            ORDER BY task->'id' DESC LIMIT 1`
  const sqlUpdateTask = `UPDATE tasks 
                         SET task = jsonb_set(task, '{start}', '${startTime}', false)
                         WHERE CAST (task->>${taskId} AS INTEGER) = ${taskId}`
                      
pool.query(sqlGetTasks, (err, res) => {
    if (err) throw err
    else {
      console.log(res.rows)
      // Check if we have the given task ID, if not then create new task
      // Project ID should always be valid, however
      if (res.rows.length === 0) {
        pool.query(sqlGetLastTaskId, (err, res) => {
          if (err) throw err
          else {
            const newTaskId = (parseInt(res.rows[0]['?column?']) + 1).toString()
            const newTask = {
              id: newTaskId,
              projectId,
              start: startTime,
              end: null
            }
            const sqlInsertNewTask = `INSERT INTO tasks (task) VALUES ($1)`

            pool.query(sqlInsertNewTask, [JSON.stringify(newTask)], (err, res) => {
              if (err) throw err
            })

            console.log(newTask)
          }
        })
      } else {
        // do resume task thing
        // const taskIdx = tasks.find(task => task.id === taskId && task.projectId === projectId)
        // tasks[foundTaskIdx].start = startTime
        pool.query(sqlUpdateTask, (err, res) => {
          if (err) throw err
          else console.log("Successfully updated task")
        })
      }
    }
  })
}

const stopTask = (projectId, taskId, endTime) => {
  const foundTaskIdx = tasks.findIndex(task => task.id === taskId && task.projectId === projectId)
  if (!foundTaskIdx) return
  tasks[foundTaskIdx].end = endTime
}

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

const testTask = {
  id: "1",
  projectId: "1",
  start: "2021-08-23 10:17AM",
  end: "2021-08-23 10:19AM",
  description: "made good soup"
}

router.get("/starttask", (req, res) => {
  const currentTime = Date.now()
  // let attrs = JSON.parse(req.body)
  // startTask(attrs.projectId, attrs.timerId, currentTime)
  startTask("1", "3", currentTime)

  // const sql = `INSERT INTO tasks (task) VALUES ($1)` 
  // pool.query(sql, [JSON.stringify(testTask)], err => { if (err) throw err })
})

router.get("/stoptask", (req, res) => {
  const currentTime = Date.now()
  let attrs = JSON.parse(req.body)
  stopTask(attrs.projectId, attrs.timerId, currentTime)
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