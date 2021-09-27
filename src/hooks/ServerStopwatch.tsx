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

interface TimerRequest {
  projectId: string,
  timerId: string,
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

export const useServerStopwatch = async ({ projectId, timerId }: { projectId: string, timerId: string }): Promise<StopwatchResult> => {
  // TODO: use API to know autostart and offset values
  const req = {
    method: 'POST',
    body: ''
  }

  const timerReq = {
    projectId,
    timerId,
    action: ''
  }

  const getTimer = async (): Promise<Me> => {
     return (await fetch('/api/test')).json();
   }

  const stopwatches = (await getTimer()).stopwatches
  const currentStopwatch = stopwatches[parseInt(timerId) - 1]

  const reactStopwatch = useStopwatch({ autoStart: false })

  const start = () => {
    // Just use reset here
    // Do server thing here where we start a timer with projectId and timerId
    // Check for existing timerId
    // Wait for response
    timerReq.action = 'start'
    reactStopwatch.start()
  }

  const pause = () => {
    // Do server thing here where we stop a timer with projectId and timerId
    timerReq.action = 'pause'
    reactStopwatch.pause()
  }

  const reset = (offsetTimestamp?: number, autoStart?: boolean) => {
    // Do server thing here where we stop a timer with projectId and timerId
    reactStopwatch.reset(offsetTimestamp, autoStart)
  }

  return {
    ...reactStopwatch,
    start,
    pause,
    reset,
  }
}