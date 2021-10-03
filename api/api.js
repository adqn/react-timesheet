const express = require("express");
const router = express.Router();
const { Pool, Client } = require('pg')

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
          // TODO: start/end applicable to grouped tasks, add "duration" property
          // requires duplicate records, which is OK in this case 
          // total task time (but not duration) based on earliest and latest duplicate entries
          // may need sub IDs? or delete tasks in groups based on timestamp?
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

  pool.query(sql, [template], err => {
    if (err) throw err
  })
}

const getTasks = callback => {
  pool.query(`SELECT * FROM tasks;`, (err, res) => {
    if (err) throw err
    else callback.send(res.rows)
  })
}

router.get("/tasks", (req, res) => {
  getTasks(res)
  // res.sendStatus(200)
})

router.post("/starttask", (req, res) => {
  const currentTime = Date.now()
  let attrs = req.body
  startTask(attrs.projectId, attrs.taskId, currentTime)
})

router.post("/stoptask", (req, res) => {
  const currentTime = Date.now()
  let attrs = req.body
  stopTask(attrs.projectId, attrs.taskId, currentTime)
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