import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  border: 1px solid black;
`
const Numbers = styled.div`
  display: inline-block;
`

const StartButton = ({isRunning}) =>
  isRunning ? <button>resume</button> : <button>start</button>

export default function Timer({setTimerActivated}) {
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState('00')
  const [minutes, setMinutes] = useState('00')
  const [hours, setHours] = useState('00')

  function getElapsedTime() {
  }

  function toggleTimer() {
    setIsRunning(!isRunning)
  }

  useEffect(() => {
    if (isRunning) {
      getElapsedTime()
    } 
  }, [isRunning, seconds])
  
  return (
    <Container>
      <Numbers>{hours + ":" + minutes + ":" + seconds}</Numbers>
      {isRunning ? 
        <button onClick={() => toggleTimer()}>pause</button> :
        <button onClick={() => toggleTimer()}>start</button>}
    </Container>
  )
}