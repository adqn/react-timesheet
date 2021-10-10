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

// set first task's end time to the start time of next task in queue
let taskQueue = []

// TODO: fix issue where this just flat out stops working
const startTask = task => {
  const foundTaskIdx = taskQueue.findIndex(foundTask => foundTask.id === task.id
    && foundTask.projectId === task.projectId
    && foundTask.start === task.start
  )

  // start new task and end first task in queue
  if (foundTaskIdx === -1) {
    taskQueue.push(task)
    console.log("task queue: ", taskQueue)
    if (taskQueue.length > 1) {
      taskQueue[0].end = task.start
      stopTask(taskQueue[0])
    }
  } else stopTask(task)
}

const stopTask = async (task) => {
  let tempTaskQueue = []
  const psqlCreateNewTask = `INSERT INTO tasks (task) VALUES ($1)`
  const foundTaskIdx = taskQueue.findIndex(foundTask => foundTask.id === task.id
    && foundTask.projectId === task.projectId
    && foundTask.start === task.start
  )

  if (foundTaskIdx === -1) return
  taskQueue.forEach((task, index) => { if (index !== foundTaskIdx) tempTaskQueue.push(task) })
  taskQueue = [...tempTaskQueue]

  await pool.query(psqlCreateNewTask, [JSON.stringify(task)], (err, res) => {
    if (err) throw err
    else {
      console.log("Successfully created new task: ", task)
    }
  })
}

// TODO: query by 24h buckets - only update tasks occurring on same day
// no standalone tasks - must have project ID; ungrouped if not
const updateTask = (task, query) => {
  const psqlUpdateTaskDescriptionByTime = `UPDATE tasks 
                        SET task = jsonb_set(task, '{description}', '${task.description}', false)
                        WHERE task->>'start' = ${task.start}`
  const psqlUpdateTaskDescriptionById = `UPDATE tasks 
                        SET task = jsonb_set(task, '{description}', '${task.description}', false)
                        WHERE CAST (task->>'projectId' AS INTEGER) = ${task.projectId}
                        AND CAST (task->>'id' AS INTEGER) = ${task.id}`
  const psqlUpdateTaskDescriptionByProjectId = `UPDATE tasks 
                        SET task = jsonb_set(task, '{description}', '${task.description}', false)
                        WHERE CAST (task->>'projectId' AS INTEGER) = ${task.projectId}`
  const psqlUpdateTaskByProjectId = `UPDATE tasks 
                        SET task = jsonb_set(task, '{id}', '${task.id}', false)
                        WHERE CAST (task->>'projectId' AS INTEGER) = ${task.projectId}`
  const psqlUpdateTaskById = `UPDATE tasks 
                        SET task = jsonb_set(task, '{projectId}', '${task.projectId}', false)
                        WHERE CAST (task->>'id' AS INTEGER) = ${task.id}`

  if (query === 'updateDescription') {
    if (!task.id) {
      if (!task.projectId) {
        pool.query(psqlUpdateTaskDescriptionByTime, (err, res) => {
          if (err) console.log(err)
          else console.log("Successfully updated task description")
        })
      } else {
        pool.query(psqlUpdateTaskDescriptionByProjectId, (err, res) => {
          if (err) console.log(err)
          else console.log("Successfully updated task description")
        })
      }
    } else {
      pool.query(psqlUpdateTaskDescriptionById, (err, res) => {
        if (err) console.log(err)
        else console.log("Successfully updated task description")
      })
    }
  }
  else if (query === 'updateProjectId') {
    pool.query(psqlUpdateTaskByProjectId, (err, res) => {
      if (err) console.log(err)
      else console.log("Successfully updated project")
    })
  }
  else if (query === 'updateTaskId') {
    pool.query(psqlUpdateTaskById, (err, res) => {
      if (err) console.log(err)
      else console.log("Successfully updated task")
    })
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
})

router.post("/starttask", (req, res) => {
  startTask(req.body)
  res.sendStatus(200)
})

router.post("/stoptask", (req, res) => {
  stopTask(req.body)
    .then(() => res.sendStatus(200))
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