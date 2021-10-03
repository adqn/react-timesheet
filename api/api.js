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
  const sqlInsertNewTask = `INSERT INTO tasks (task) VALUES ($1)`
  const sqlGetLastTaskId = `SELECT task->'id' FROM tasks
                            ORDER BY task->'id' DESC LIMIT 1`
  const sqlGetTasks = `SELECT task from tasks
                       WHERE CAST (task->>'id' AS INTEGER) = ${taskId}
                       AND CAST (task->>'projectId' AS INTEGER) = ${projectId}`
  const sqlUpdateTask = `UPDATE tasks 
                         SET task = jsonb_set(task, '{start}', '${startTime}', false)
                         WHERE CAST (task->>'id' AS INTEGER) = ${taskId}
                         AND CAST (task->>'projectId' AS INTEGER) = ${projectId}`
                      
  // Check if we have the given task ID, if not then create new task
  // Project ID should always be valid, however
  pool.query(sqlGetTasks, (err, res) => {
      if (err) throw err
      else {
        // console.log(res.rows)
        if (res.rows.length === 0) {
          pool.query(sqlGetLastTaskId, (err, res) => {
            if (err) throw err
            else {
              const newTaskId = res.rows[0] ? (parseInt(res.rows[0]['?column?']) + 1).toString() : "1"
              const newTask = {
                id: newTaskId,
                projectId,
                start: startTime,
                end: null,
                description: null
              }

              pool.query(sqlInsertNewTask, [JSON.stringify(newTask)], (err, res) => {
                if (err) throw err
                else console.log("Successfully created new task")
              })
            }
          })
        } else {
          // do resume task thing
          // just create duplicate tasks with different start/end and combine durations?
          // but then removing tasks is ambiguous...
          // const taskIdx = tasks.find(task => task.id === taskId && task.projectId === projectId)
          // tasks[foundTaskIdx].start = startTime
          pool.query(sqlUpdateTask, err => {
            if (err) throw err
            else console.log("Successfully updated task")
          })
        }
      }
    })
}

const stopTask = (projectId, taskId, endTime) => {
  const sqlGetTasks = `SELECT task from tasks
                       WHERE CAST (task->>'id' AS INTEGER) = ${taskId}
                       AND CAST (task->>'projectId' AS INTEGER) = ${projectId}`
  const sqlUpdateTask = `UPDATE tasks 
                        SET task = jsonb_set(task, '{end}', '${endTime}', false)
                        WHERE CAST (task->>'id' AS INTEGER) = ${taskId}
                        AND CAST (task->>'projectId' AS INTEGER) = ${projectId}`
  pool.query(sqlGetTasks, (err, res) => {
    if (err) return err
    else {
      if (res.rows.length === 0) return
      else {
        pool.query(sqlUpdateTask, err => {
          if (err) throw err
          else console.log("Successfully ended task")
        })
      }
    }
  })
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
  // let attrs = JSON.parse(req.body)
  getTasks(res)
  // res.sendStatus(200)
})

router.get("/starttask", (req, res) => {
  const currentTime = Date.now()
  let attrs = JSON.parse(req.body)
  startTask(attrs.projectId, attrs.timerId, currentTime)
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