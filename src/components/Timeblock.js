import React, { useState, useEffect } from 'react'
import * as d3 from 'd3'
import styled from 'styled-components'
// testing

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 300px;
  // background: green;
  // border: 1px solid black;
`

const Column = styled.div`
  flex: 1;
  height: 30px;
  // display: flex;
  // flex-direction: column;
  margin-left: -1px;
  border: 1px solid grey;
`

const Row = styled.div`
  display: flex;
  // flex-direction: row;
  margin-left: -1px;
  margin-top: -1px;
`

const Header = styled.div`
  font-size: 10pt;
  text-align: center;
  width: 100px;
  height: 20px;
  border: solid 1px lightgrey;
`

const TopAnchor = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  // border: 2px solid red;
  // visibility: hidden;
`

const CellLayer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  border: 1px solid lightblue;
  margin-left: -1px;
  margin-top: -1px; 
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

const EditCell = styled.input`
  visibility: ${props => props.visibility};
  position: absolute;
  // font-family: arial;
  // font-size: .95em;
  width: 170px;
  max-width: 200px;
  height: 30px;
  // line-height: 1px;
  padding: 10px;
  white-space: pre-wrap;
  word-break: break-word;
  box-sizing: border-box;
  border: solid 1px lightgrey;
  border-radius: 3px;
  // box-shadow: 1px 1px 8px black;
  box-shadow: rgba(0, 0, 0, 0.25) 2px 9px 15px;
  resize: none;
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
      else rows[i].push(<InteractiveCell id={template[i].cols[j].id} initialValue={template[i].cols[j].content} setActiveElement={setActiveElement} />)
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
  const wrapperRef = React.useRef(null)
  const cellRef = React.useRef(null)
  const [color, setColor] = useState(inactiveColor)
  const [borderWidth, setBorderWidth] = useState("1px")
  const [margin, setMargin] = useState("0px")
  const [selected, setSelected] = useState(false)
  const [active, setActive] = useState("none")
  const [readOnly, setReadOnly] = useState(true)
  const [value, setValue] = useState(initialValue)
  const [valueRegister, setValueRegister] = useState(value)

  let wrapper;

  function lockValue() {
    setActive("none")
    setColor(inactiveColor)
    setBorderWidth("1px")
    setMargin("0px")
    setReadOnly(true)
    setActiveElement(null)
  }

  function selectCell(e) {
    wrapper = d3.select(wrapperRef.current)

    if (selected) {
      setActive("auto")
      setReadOnly(false)
      cellRef.current.focus()
    } else {
      setSelected(true)

      wrapper
        .style("border", `3px solid ${activeColor}`)
        .style("margin-left", "-2px")
        .style("margin-top", "-2px")
    }

  }

  function deselectCell(e) {
    wrapper = d3.select(wrapperRef.current)
    wrapper
      .style("border", "none")
    setSelected(false)
    setReadOnly(true)
    cellRef.current.blur()
  }

  function editValue(e) {
    // good for now but still need to trigger focus on second click instead
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
      ref={wrapperRef}
      tabIndex={0}
      onClick={(e) => selectCell(e)}
      onBlur={() => deselectCell()}
    >
      <Cell
        ref={cellRef}
        color={color}
        borderWidth={borderWidth}
        margin={margin}
        isActive={active}
        value={value}
        readOnly={readOnly}
        // onBlur={() => lockValue()}
        onKeyDown={e => listener(e)}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  )
}

const ActiveCell = ({ x, y, visibility }) => {
  const [value, setValue] = useState('')

  const editCellRef = React.createRef(null)

  useEffect(() => {
    let container = d3.select(editCellRef.current)

    container
      .style("left", x + "px")
      .style("top", y + "px")
  })

  return (
    <EditCell
      ref={editCellRef}
      visibility={visibility}
      value={value}
      contentEditable={true}
      onChange={e => setValue(e.target.value)}
    />
  )
}

export default function Timeblock() {
  // const [layout, setLayout] = useState(DefaultTemplate)
  const [position, setPosition] = useState({x: 0, y: 0})
  const [activeElement, setActiveElement] = useState(null)
  const [visibility, setVisibility] = useState("hidden")
  const [columns, setColumns] = useState([])
  // const [timeColumn, plannedColumn] = getColumns(DefaultTemplate, setActiveElement)
  const rows = getColumns(BetterTemplate, setActiveElement)

  const thisRef = React.createRef(null)
  const cellLayerRef = React.createRef(null)
  const activeCellRef = React.createRef(null)

  const unfocusElement = (e) => {
    if (activeElement) {
      if (e.target.id != activeElement) {
        // console.log("unfocused ", activeElement)
        setActiveElement(null)
      }
    }
  }

  useEffect(() => {
    const thisX = thisRef.current.getBoundingClientRect().x
    const thisY = thisRef.current.getBoundingClientRect().y
    const cellLayer = d3.select(cellLayerRef.current)

    setPosition({x: thisX, y: thisY})
    cellLayer
      .on("mousedown", function () {
        if (visibility === "hidden") setVisibility("visible")
      })
  })

  return (
    <div
      ref={thisRef}
    >
      <ActiveCell
        x={position.x}
        y={position.y}
        visibility={visibility}
      />
      <Container>
        {/* {rows.map(cols => {
          return <Row>{cols}</Row>
        })} */}
        <Row>
          <Column>
            <CellLayer
              ref={cellLayerRef}
            />
          </Column>
          <Column></Column>
          <Column></Column>
        </Row>
        <Row>
          <Column></Column>
          <Column></Column>
          <Column></Column>
        </Row>
        <Row>
          <Column></Column>
          <Column></Column>
          <Column></Column>
        </Row>
        <Row>
          <Column></Column>
          <Column></Column>
          <Column></Column>
        </Row>
      </Container>

      <br />
      <button>Save current layout</button>
    </div>
  )
}