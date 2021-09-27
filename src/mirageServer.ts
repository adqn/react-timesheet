=import { createServer } from "miragejs";
import { Response } from "miragejs"

// import { Octokit } from "octokit";

// Maybe useful:
// https://github.com/miragejs/examples/blob/master/react-typescript/src/mirage/index.ts

let daily2 = [
  {
    user: "Test user",
    project: "React timesheet",
    description: "Some changes were made here, need approval",
    date: 1627059118345,
    hours: 1,
    minutes: 14
  },
  {
    user: "Test user",
    project: "React timesheet",
    description: "More changes were made, things were broken, God's wrath was invoked",
    date: 1627059373810,
    hours: 2,
    minutes: 1
  }
]

let templates = []

let projects = [
  {
    id: "1",
    name: "test project 1",
    client: "moose",
    contributors: ["a duck"],
    tags: [
      "duck_approved",
      "fried_duck",
      "not_geese"
    ]
  }
]

type DateTime = string | number;

interface Stopwatch {
  id: string;
  projectId: string;
  start: DateTime;
  end: DateTime | null;
  description: string;
}

const stopwatches: Stopwatch[] = [
  {
    id: "1",
    projectId: "1",
    start: "2021-08-23 10:17AM",
    end: "2021-08-23 10:19AM",
    description: "made good soup"
  }
]

const startTimer = (projectId: string, timerId: string, startTime: number) => { 
  const foundTimerIdx = stopwatches.findIndex(stopwatch => stopwatch.id === timerId && stopwatch.projectId === projectId)

  if (foundTimerIdx === -1) {
    // start new task
    const newTimerId: string = (stopwatches.length + 1).toString()
    const newTimer: Stopwatch = {
      id: newTimerId,
      projectId,
      start: startTime,
      end: null
    }

    stopwatches.push(newTimer)
  } else {
    // do resume timer thing
    const timerIdx = stopwatches.find(stopwatch => stopwatch.id === timerId && stopwatch.projectId === projectId)
    stopwatches[foundTimerIdx].start = startTime
  }
}

const stopTimer = (projectId: string, timerId: string, endTime: number) => {
  const foundTimerIdx = stopwatches.findIndex(stopwatch => stopwatch.id === timerId && stopwatch.projectId === projectId)
  if (!foundTimerIdx) return
  stopwatches[foundTimerIdx].end = endTime
}

export function makeServer() {
  // return {};
  return createServer({
    routes() {
      this.get("/api/test", () => ({
        daily: [
          {
            user: "Test User",
            project: "React timesheet",
            progress: "1%",
            date: "7-7-2021"
          },
          {
            user: "Test User",
            project: "React timesheet",
            progress: "1.4%",
            date: "7-8-2021"
          },
          {
            user: "Test User",
            project: "React timesheet",
            progress: "1.6%",
            date: "7-9-2021"
          }
        ],
        daily2,
        projects,
        templates
      }))

      this.post('/api/newentry', req => {
        let attrs = JSON.parse(req.requestBody)
        attrs.user = "Test user"
        daily2.push(attrs)
        console.log(attrs)
      })

      this.post('/api/newentry2', req => {
        let attrs = JSON.parse(req.requestBody)
        projects2.push(attrs)
        console.log(attrs)
      })

      // takes project and task ID
      this.post('/api/timer', req => {
        let attrs = JSON.parse(req.requestBody)
        const projectId = attrs.projectId
        const timerId = attrs.timerId 

        if (attrs.timerAction === 'start') {
          startTimer(projectId, timerId, attrs.startTime)
        }
        else stopTimer(projectId, timerId, attrs.endTime)
        return new Response(200)
      })

      this.post(`/api/savetemplate`, (schema, req) => {
        let attrs = JSON.parse(req.requestBody)
        templates.push(attrs)
      })

      this.passthrough('api.github.com')
    },
  });
}