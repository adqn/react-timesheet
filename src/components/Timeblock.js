import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
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

const Row = styled.div`
  display: flex;
  flex-direction: row;
  // margin-left: -1px;
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
// just index by rows?
const BetterTemplate = [
  {
    cols: [
      {
        id: 'time0',
        content: 'Time'
      },
      {
        id: 'plan0',
        content: 'Activity'
      },
      {
        id: 'rev0',
        content: 'Revision 1'
      }
    ]
  },
  {
    cols: [
      {
        id: 'time1',
        content: '0000'
      },
      {
        id: 'plan1',
        content: 'sleep'
      },
      {
        id: 'rev1',
        content: `don't sleep actually`
      }
    ]
  },
  {
    cols: [
      {
        id: 'time2',
        content: '0800'
      },
      {
        id: 'plan2',
        content: 'wake up'
      }
    ]
  }
]

const getColumns = (template, setActiveElement) => {
  let rows = [];

  for (let i = 0; i < template.length; i++) {
    rows.push([])

    for (let j = 0; j < template[i].cols.length; j++) {
      if (i === 0) rows[i].push(<Header>{template[i].cols[j].content}</Header>)
      else rows[i].push(<InteractiveCell id={template[i].cols[j].id} initialValue={template[i].cols[j].content} setActiveElement={setActiveElement}/>)
    }
  }

  return rows
}

const saveLayout = cols => {
  let layout = []
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
  // const [layout, setLayout] = useState(DefaultTemplate)
  const [activeElement, setActiveElement] = useState(null)
  const [columns, setColumns] = useState([])
  // const [timeColumn, plannedColumn] = getColumns(DefaultTemplate, setActiveElement)
  const rows = getColumns(BetterTemplate, setActiveElement)

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
        {rows.map(cols => {
          return <Row>{cols}</Row>
        })}
      </Container>

      <br />
      <button>Save current layout</button>
    </div>
  )
}