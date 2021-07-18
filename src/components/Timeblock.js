import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

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
  border: solid;
  border-width: ${props => props.borderWidth};
  border-color: ${props => props.color};
  pointer-events: ${props => props.isActive};
`

const InteractiveCell = ({ initialValue }) => {
  const inactiveColor = "black"
  const activeColor = "#3eadce"
  const [color, setColor] = useState(inactiveColor)
  const [borderWidth, setBorderWidth] = useState("1px")
  const [active, setActive] = useState("none")
  const [readOnly, setReadOnly] = useState(true)
  const [value, setValue] = useState(initialValue)

  function lockValue() {
    setActive("none")
    setColor(inactiveColor)
    setBorderWidth("1px")
    setReadOnly(true)
  }

  function editValue(e) {
    if (active === "none") {
      setActive("auto")
      setColor(activeColor)
      setBorderWidth("3px")
      setReadOnly(false)
    }
  }

  function listener(e) {
    if (e.key === "Enter") {
      lockValue()
    }
  }

  return (
    <div
      onClick={() => editValue()} 
    >
      <Cell
        color={color}
        borderWidth={borderWidth}
        isActive={active}
        defaultValue={initialValue}
        readOnly={readOnly}
        onBlur={() => lockValue()}
        onKeyDown={e => listener(e)}
      />
    </div>
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
      <InteractiveCell onClick={() => {
        console.log('click');
      }}
        initialValue={"Stuff"} />
    </div>
  )
}