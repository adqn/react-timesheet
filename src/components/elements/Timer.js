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

export default function Timer({setTimerActivated}) {
  const [seconds, setSeconds] = useState('00')
  const [minutes, setMinutes] = useState('00')
  const [hours, setHours] = useState('00')
  
  return (
    <Container>
      <Numbers>{hours + ":" + minutes + ":" + seconds}</Numbers>
      <button>resume</button>
      <button>stop</button>
    </Container>
  )
}