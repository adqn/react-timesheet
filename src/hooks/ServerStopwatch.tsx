import React, { useEffect } from 'react';
import { useStopwatch } from 'react-timer-hook'
import { StopwatchContext } from '../Pages/UserArea/utils'

interface Stopwatch {
  id: string;
  projectId: string;
  date: number;
  duration: number;
  description: string
}

interface Task {
  id: string;
  projectId: string;
  date: string;
  start: number;
  end: number;
  duration: string;
  description: string;
}

interface StopwatchResult {
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: (offsetTimestamp?: number, autoStart?: boolean) => void;
}

//TODO: figure out good way to alert current timer of task queue and stop on new request 
// Context might be useful here and elsewhere for API stuff
export const useServerStopwatch = ({task}: {task: Task}) => {
  const context = React.useContext(StopwatchContext)
  const fetchMe = async () => {
    return (await fetch('http://localhost:5001/api/tasks')).json();
  }

  const getTasks = async () => {
    const data = await fetchMe();
    context.setTasks(data)
    // setTasks(data)
  }

  const startTask = async (task) => {
    const req = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json"
      },
      body: JSON.stringify(task)
    }
    
    return (await fetch('http://localhost:5001/api/starttask', req))
  }

  const stopTask = async (task) => {
    const req = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json"
      },
      body: JSON.stringify(task)
    }
    
    return (await fetch('http://localhost:5001/api/stoptask', req))
  }

  // const tasks = (await getTask()).tasks
  // const currentTask = tasks[parseInt(taskId) - 1]

  const reactStopwatch = useStopwatch({ autoStart: false })

  const start = () => {
    console.log(task)
    const startTime = Date.now()
    task.start = startTime
    startTask(task).then(res => console.log(res))
    reactStopwatch.start()
  }

  const reset = (offsetTimestamp?: number, autoStart?: boolean, noSubmit) => {
    if (noSubmit === false) {
      const endTime = Date.now()
      task.end = endTime
      stopTask(task)
        .then(res => console.log(res))
        .then(() => getTasks())
    }

    reactStopwatch.reset(offsetTimestamp, autoStart)
  }

  return {
    // currentTask,
    ...reactStopwatch,
    start,
    reset,
  }
}