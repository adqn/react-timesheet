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
  stopwatches: Stopwatch[];
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

export const useServerStopwatch = async ({ projectId, taskId }: { projectId: string, taskId: string }): Promise<StopwatchResult> => {
  // TODO: use API to know autostart and offset values
  const req = {
    method: 'POST',
    body: ''
  }

  const taskReq = {
    projectId,
    taskId,
    action: ''
  }

  const getTask = async (): Promise<Me> => {
    return (await fetch('/api/test')).json();
  }

  const stopwatches = (await getTask()).stopwatches
  const currentStopwatch = stopwatches[parseInt(taskId) - 1]

  const reactStopwatch = useStopwatch({ autoStart: false })

  const start = () => {
    // Just use reset here
    // Do server thing here where we start a task with projectId and taskId
    // Check for existing taskId
    // Wait for response
    taskReq.action = 'start'
    reactStopwatch.start()
  }

  const pause = () => {
    // Do server thing here where we stop a task with projectId and taskId
    taskReq.action = 'pause'
    reactStopwatch.pause()
  }

  const reset = (offsetTimestamp?: number, autoStart?: boolean) => {
    // Do server thing here where we stop a task with projectId and taskId
    reactStopwatch.reset(offsetTimestamp, autoStart)
  }

  return {
    ...reactStopwatch,
    start,
    pause,
    reset,
  }
}