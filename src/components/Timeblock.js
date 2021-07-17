import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

String.prototype.last = function() {return this[this.length - 1]}

const DefaultTemplate = [
  {
    time: '0000', 
    planned: 'sleep',
    revisions: [
      'not sleeping',
      'maybe sleeping'
    ]
  },
  {
    time: '0800',
    planned: 'wake up',
    revisions: [
      'snooze',
      'sleep'
    ]
  },
  {
    time: '0900',
    planned: 'breakfast',
    revisions: []
  },
  {
    time: '1200',
    planned: 'lunch',
    revisions: [
      'second breakfast'
    ]
  },
  {
    time: '1600',
    planned: 'video games',
    revisions: [
      'work'
    ]
  },
  {
    time: '1900',
    planned: 'sleep',
    revisions: [
      'video games'
    ]
  }
]

const Container = styled.div`
  width: 100%;
  border: 1px solid black;
`

const Cell = styled.input`
  width: 100px;
  height: 20px;
  border: 1px solid black;
  pointer-events: ${props => props.isActive}
`

const activeCell = styled(Cell)`
  pointer-events: auto;
`

const InteractiveCell = ({initialValue}) => {
  const [active, setActive] = useState("none")
  const [value, setValue] = useState(initialValue)

  function listener(e) {
    
  }

  function editValue(e) {
    if (active === "none") setActive("auto")
    else setActive("none")
  }

  return (
    <Cell
      isActive={active}
      onClick={() => editValue()}
    />
  )
}

const getColumns = template => {
  let [time, plan, revisions] = [[], [], []]
  // for (let item of template) {
  // }
}

export default function Timeblock() {
  const [columns, setColumns] = useState([])


  return (
    <div>       
      <InteractiveCell initialValue={"Stuff"} />
    </div>
  )
}