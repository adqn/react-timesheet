import React from 'react';
import { useStopwatch } from 'react-timer-hook'

interface Stopwatch {
  id: string;
  projectId: string;
  date: number;
  duration: number;
  description: string
}

interface Me {
  projects2: Project[];
  tasks: Stopwatch[];
  daily: FIXME;
  daily2: FIXME;
}

interface TaskRequest {
  projectId: string,
  taskId: string,
  action: string
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

export const useServerStopwatch = ({ projectId, taskId }: { projectId: string, taskId: string }) => {
  // TODO: use API to know autostart and offset values
  // no offset? just create new task for each timer use
  const taskReq = {
    projectId,
    taskId,
  }

  const req = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      "Content-Type": "application/json"
    },
    body: JSON.stringify(taskReq)
  }

  const startTask = async (): Promise<Me> => {
    return (await fetch('http://localhost:5001/api/starttask', req)).json();
  }

  const stopTask = async (): Promise<Me> => {
    return (await fetch('http://localhost:5001/api/stoptask', req)).json();
  }
  // const tasks = (await getTask()).tasks
  // const currentTask = tasks[parseInt(taskId) - 1]

  const reactStopwatch = useStopwatch({ autoStart: false })

  const start = () => {
    // Just use reset here
    // Do server thing here where we start a task with projectId and taskId
    // Check for existing taskId
    // Wait for response
    startTask().then(res => console.log(res))
    reactStopwatch.start()
  }

  const reset = (offsetTimestamp?: number, autoStart?: boolean) => {
    stopTask()
    reactStopwatch.reset(offsetTimestamp, autoStart)
  }

  return {
    // currentTask,
    ...reactStopwatch,
    start,
    reset,
  }
}