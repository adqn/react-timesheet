import React from 'react';
import { useStopwatch} from 'react-timer-hook'

export const useServerStopwatch = () => {
    // TODO: use API to know autostart and offset values
    return useStopwatch({autoStart: false})
}