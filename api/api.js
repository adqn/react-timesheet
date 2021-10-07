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

// const psqlCreateNewTask = `INSERT INTO tasks (task) VALUES ($1)`
// const psqlGetLastTaskId = `SELECT task->'id' FROM tasks
//                           ORDER BY task->'id' DESC LIMIT 1`
// const psqlGetTasks = `SELECT task from tasks
//                       WHERE CAST (task->>'id' AS INTEGER) = ${taskId}
//                       AND CAST (task->>'projectId' AS INTEGER) = ${projectId}`
// const psqlUpdateTask = `UPDATE tasks 
//                         SET task = jsonb_set(task, '{start}', '${startTime}', false)
//                         WHERE CAST (task->>'id' AS INTEGER) = ${taskId}
//                         AND CAST (task->>'projectId' AS INTEGER) = ${projectId}`

// set first task's end time to the start time of next task in queue
// tasks go to queue before db update?
let taskQueue = []

const startTask = task => {
  const foundTaskIdx = taskQueue.findIndex(foundTask => foundTask.id === task.id
    && foundTask.projectId === task.projectId
    && foundTask.start === task.start
  )

  if (foundTaskIdx === -1) {
    // start new task and end first task in queue
    taskQueue.push(task)
    if (taskQueue.length > 1) {
      taskQueue[0].end = task.start
      stopTask(taskQueue[0])
    }
  } else stopTask(task)
  console.log(taskQueue)
}

const stopTask = task => {
  const psqlCreateNewTask = `INSERT INTO tasks (task) VALUES ($1)`
  const foundTaskIdx = taskQueue.findIndex(foundTask => foundTask.id === task.id
    && foundTask.projectId === task.projectId
    && foundTask.start === task.start
  )

  if (foundTaskIdx === -1) return

  pool.query(psqlCreateNewTask, [JSON.stringify(task)], (err, res) => {
    if (err) throw err
    else {
      let tempTaskQueue = []
      taskQueue.forEach((task, index) => { if (index !== foundTaskIdx) tempTaskQueue.push(task) })
      taskQueue = tempTaskQueue
      console.log("Successfully created new task")
    }
  })
}

const updateTask = task => {
  const psqlUpdateTaskDescriptionByTime = `UPDATE tasks 
                        SET task = jsonb_set(task, '{description}', '${task.description}', false)
                        WHERE task->>'start' = ${task.start}`
  const psqlUpdateTaskDescriptionById = `UPDATE tasks 
                        SET task = jsonb_set(task, '{description}', '${task.description}', false)
                        WHERE CAST (task->>'id' AS INTEGER) = ${task.id}`
  const psqlUpdateTaskDescriptionByProjectId = `UPDATE tasks 
                        SET task = jsonb_set(task, '{description}', '${task.description}', false)
                        WHERE CAST (task->>'projectId' AS INTEGER) = ${task.projectId}`
  const psqlUpdateTaskByProjectId = `UPDATE tasks 
                        SET task = jsonb_set(task, '{id}', '${task.id}', false)
                        WHERE CAST (task->>'projectId' AS INTEGER) = {task.projectId}`
  const psqlUpdateTaskById = `UPDATE tasks 
                        SET task = jsonb_set(task, '{projectId}', '${task.projectId}', false)
                        WHERE CAST (task->>'id' AS INTEGER) = {task.id}`

  if (!task.id) {
    if (!task.projectId) {
      pool.query(psqlUpdateTaskDescriptionByTime, (err, res) => {
        if (err) console.log(err)
        else console.log("Successfully updated task description")
      })
    } else {
      pool.query(psqlUpdateTaskByProjectId, (err, res) => {
        if (err) console.log(err)
        else console.log("Successfully updated task description")
      })
    }
  }
}

const newTemplate = template => {
  const psql = `INSERT INTO templates (template) VALUES ($1);`

  pool.query(psql, [template], err => {
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
  if (taskQueue.length <= 1) {
    const currentTime = Date.now()
    startTask(req.body)
  } else {
    for (let task of taskQueue) stopTask(task)
    res.send("clearTaskQueue")
  }
})

router.post("/stoptask", (req, res) => {
  const currentTime = Date.now()
  let attrs = req.body
  stopTask(req.body)
  res.sendStatus(200)
})

router.post("/updatetask", (req, res) => {
  updateTask(req.body)
})

router.get("/templates", (req, res) => {
  const psql = `SELECT * FROM templates;`

  pool.query(psql, (err, rows) => {
    if (err) throw err;
    res.send(rows.rows)
  })
})

router.post("/savetemplate", (req, res) => {
  newTemplate(req.body)
  res.sendStatus(200)
})

module.exports = router;