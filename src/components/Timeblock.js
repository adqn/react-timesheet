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

// or columns?
const AnotherTemplate = [
  {
    id: 'time',
    content: "Time",
    rows: [
      {
        id: 'time1',
        content: '0000'
      },
      {
        id: 'time2',
        content: '0800'
      }
    ]
  },
  {
    id: 'plan',
    content: 'Plan',
    rows: [
      {
        id: 'plan1',
        content: 'sleep'
      },
      {
        id: 'plan2',
        content: 'wake up'
      }
    ]
  },
  {
    id: 'rev1',
    content: 'Revision 1',
    rows: [
      {
        id: 'rev1-1',
        content: ''
      },
      {
        id: 'rev1-2',
        content: `don't wake up`
      }
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
  let columns = [];

  template.map((item, i) => {
    time.push(<InteractiveCell id={"time" + i} initialValue={item.time} setActiveElement={setActiveElement}/>)
    plan.push(<InteractiveCell id={"plan" + i} initialValue={item.planned} setActiveElement={setActiveElement} />)
  })

  // for (let obj of template) {
  //   obj.rows.map(() => {

  //   })
  // }

  return [time, plan]
}

const saveLayout = cols => {
  let layout = []
}

const TheColumn = ({id, cells}) => {
  return (
    <div
      id={id}
    >
      {cells}
    </div>
  )
}

const InteractiveCell = ({ id, initialValue, setActiveElement, setLayout }) => {
  const inactiveColor = "black"
  const activeColor = "#3eadce"
  const [color, setColor] = useState(inactiveColor)
  const [borderWidth, setBorderWidth] = useState("1px")
  const [margin, setMargin] = useState("0px")
  const [active, setActive] = useState("none")
  const [readOnly, setReadOnly] = useState(true)
  const [value, setValue] = useState(initialValue)
  const [valueRegister, setValueRegister] = useState(value)

  const thisRef = React.useRef(null)

  function lockValue() {
    setActive("none")
    setColor(inactiveColor)
    setBorderWidth("1px")
    setMargin("0px")
    setReadOnly(true)
    setActiveElement(null)
  }

  function editValue(e) {
    // good for now but still need to trigger focus on second click instead
    // thisRef.current.focus();
    setValueRegister(value)
    setActiveElement(id)

    if (active === "none") {
      setActive("auto")
      setColor(activeColor)
      setBorderWidth("3px")
      setMargin("-2px")
      setReadOnly(false)
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
        ref={thisRef}
        color={color}
        borderWidth={borderWidth}
        margin={margin}
        isActive={active}
        value={value}
        readOnly={readOnly}
        onBlur={() => lockValue()}
        onKeyDown={e => listener(e)}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  )
}

export default function Timeblock() {
  const [layout, setLayout] = useState(DefaultTemplate)
  const [activeElement, setActiveElement] = useState(null)
  const [columns, setColumns] = useState([])
  const [timeColumn, plannedColumn] = getColumns(DefaultTemplate, setActiveElement)

  const unfocusElement = (e) => {
    if (activeElement) {
      if (e.target.id != activeElement) {
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