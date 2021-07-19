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
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  // background: green;
  // border: 1px solid black;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: -1px;
  // border: 1px solid black;
`

const Header = styled.div`
  font-size: 10pt;
  text-align: center;
  width: 100px;
  height: 20px;
  border: solid 1px lightgrey;
`

const Cell = styled.input`
  width: 100px;
  height: 20px;
  border: solid;
  margin-left: ${props => props.margin};
  margin-top: ${props => props.margin};
  margin-bottom: -1px;
  border-width: ${props => props.borderWidth};
  border-color: ${props => props.color};
  pointer-events: ${props => props.isActive};
`

const getColumns = (template, setActiveElement) => {
  let [time, plan, revisions] = [[], [], []]

  template.map((item, i) => {
    time.push(<InteractiveCell id={"time" + i} initialValue={item.time} setActiveElement={setActiveElement}/>)
    plan.push(<InteractiveCell id={"plan" + i} initialValue={item.planned} setActiveElement={setActiveElement} />)
  })

  const timeColumn =
    <Column>
      <Header>Time</Header>
      {time.map(cell => {
        return cell
      })}
    </Column>

  const plannedColumn = 
    <Column>
      <Header>Activity</Header>
      {plan.map(cell => {
        return cell
      })}
    </Column>

  // return [timeColumn, plannedColumn]
  return [time, plan]
}

const saveLayout = cols => {

}

const InteractiveCell = ({ id, initialValue, setActiveElement }) => {
  const inactiveColor = "black"
  const activeColor = "#3eadce"
  const [color, setColor] = useState(inactiveColor)
  const [borderWidth, setBorderWidth] = useState("1px")
  const [margin, setMargin] = useState("0px")
  const [active, setActive] = useState("none")
  const [readOnly, setReadOnly] = useState(true)
  const [value, setValue] = useState(initialValue)
  const [valueRegister, setValueRegister] = useState(value)

  function lockValue() {
    setActive("none")
    setColor(inactiveColor)
    setBorderWidth("1px")
    setMargin("0px")
    setReadOnly(true)
    setActiveElement(null)
  }

  function editValue(e) {
    const htmlString = e.currentTarget.innerHTML
    const cellValue = htmlString.match(/value=".+"/).toString().split(`"`)[1]

    let left = e.target.getBoundingClientRect().left
    let right = e.target.getBoundingClientRect().right
    let top = e.target.getBoundingClientRect().top
    let bottom = e.target.getBoundingClientRect().bottom

    // console.log(top, left, right, bottom)
    // console.log(e.clientX)

    // e.preventDefault()
    // setValueRegister(value)

    if (active === "none") {
      setActive("auto")
      setColor(activeColor)
      setBorderWidth("3px")
      setMargin("-2px")
      setReadOnly(false)
      setActiveElement(id)
    }

  }

  function listener(e) {
    if (e.key === "Enter") {
      lockValue()
    } else if (e.key === "Escape") {
      setValue(valueRegister)
      lockValue()
    }
  }

  return (
    <div
      id={id}
      onClick={(e) => editValue(e)} 
    >
      <Cell
        color={color}
        borderWidth={borderWidth}
        margin={margin}
        isActive={active}
        defaultValue={value}
        readOnly={readOnly}
        onBlur={() => lockValue()}
        onKeyDown={e => listener(e)}
      />
    </div>
  )
}

export default function Timeblock() {
  const [activeElement, setActiveElement] = useState(null)
  const [columns, setColumns] = useState([])
  const [timeColumn, plannedColumn] = getColumns(DefaultTemplate, setActiveElement)

  const unfocusElement = (e) => {
    if (activeElement) {
      if (e.currentTarget.id != activeElement) {
        // console.log("unfocused ", activeElement)
        setActiveElement(null)
      }
    }
  }

  window.addEventListener('mousedown', e => unfocusElement(e))

  return (
    <div>
      <Container>
        <Column>
          <Header>Time</Header>
          {timeColumn}
        </Column>

        <Column>
          <Header>Activity</Header>
          {plannedColumn}
        </Column>
      </Container>

      <br />
      <button>Save current layout</button>
    </div>
  )
}