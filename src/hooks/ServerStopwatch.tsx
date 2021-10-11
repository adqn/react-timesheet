import React, { useEffect } from 'react';
import { useStopwatch } from 'react-timer-hook'

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

export const useServerStopwatch = ({setTasks}: {setTasks: (tasks: Task[]) => void}) => {
  const fetchMe = async () => {
    return (await fetch('http://localhost:5001/api/tasks')).json();
  }

  const getTasks = async () => {
    const data = await fetchMe();
    setTasks(data)
  }

  const startTask = async (task: Task) => {
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

  const stopTask = async (task: Task) => {
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

  const reactStopwatch = useStopwatch({ autoStart: false })

  const start = (task: Task) => {
    startTask(task)
      .then(resp => {
        if (resp.status === 200) {
          reactStopwatch.start()
        }
      })
      .catch(err => console.log(err))
  }

  const stop = (task: Task) => {
    stopTask(task)
      .then(() => getTasks())
      .catch(err => console.log(err))
  }

  const reset = (offsetTimestamp?: Date, autoStart?: boolean) => {
    reactStopwatch.reset(offsetTimestamp, autoStart)
  }

  return {
    ...reactStopwatch,
    stop,
    start,
    reset,
  }
}