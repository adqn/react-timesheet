import React, { useState, useEffect } from 'react'
import * as d3 from 'd3'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  height: fit-content;
  // background: green;
  // border: 1px solid black;
`

const Column = styled.div`
  flex: 1;
  font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 14px;
  height: 30px;
  // display: flex;
  // flex-direction: column;
  margin-left: -1px;
  border: 1px solid lightgrey;
`

const LeftColumn = styled(Column)`
  border-left: none;
`

const RightColumn = styled(Column)`
  border-right: none;
`

const Row = styled.div`
  display: flex;
  // flex-direction: row;
  margin-left: -1px;
  margin-top: -1px;
`

const Header = styled.div`
  line-height: 30px;
  font-size: .9em;
  font-weight: 100;
  text-align: left;
  padding-left: 10px;
  color: grey;
  width: 100%;
  height: 30px;
  margin-left: -1px;
  border: solid 1px lightgrey;
`

const LeftHeader = styled(Header)`
  border-left: none;
`

const RightHeader = styled(Header)`
  border-right: none;
`

const TopAnchor = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  // border: 2px solid red;
  // visibility: hidden;
`

const CellLayer = styled.div`
  display: inline-block;
  width: 100%;
  height: 100%;
  // border: 1px solid lightblue;
  border: none;
  // margin-left: -1px;
  // margin-top: -1px; 
  background: white;
  -webkit-appearance: none;
  -moz-appearance: none;
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

const EditCell = styled.div`
  visibility: ${props => props.visibility};
  position: absolute;
  font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 14px;
  // font-weight: 60;
  line-height: 1.5;
  width: 170px;
  max-width: 200px;
  height: fit-content;
  padding: 4px;
  white-space: pre-wrap;
  word-break: break-word;
  box-sizing: border-box;
  // border: solid 1px grey;
  border-radius: 3px;
  box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
  background: white;
  outline: none;
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
      },
      {
        content: 'placeholder'
      }
    ]
  }
]

const getColumns = (template, setActiveElement) => {
  let rows = [];

  for (let i = 0; i < template.length; i++) {
    let cols = template[i].cols.length
    rows.push([])

    for (let j = 0; j < cols; j++) {
      if (i === 0 && j === 0) rows[i].push(<LeftHeader>{template[i].cols[j].content}</LeftHeader>)
      else if (i === 0 && j < cols - 1) rows[i].push(<Header>{template[i].cols[j].content}</Header>)
      else if (i === 0 && j === cols - 1) rows[i].push(<RightHeader>{template[i].cols[j].content}</RightHeader>)
      else if (i > 0 && j === 0) rows[i].push(<LeftColumn>{template[i].cols[j].content}</LeftColumn>)
      else if (i > 0 && j < cols - 1) rows[i].push(<Column>{template[i].cols[j].content}</Column>)
      else if (i > 0 && j === cols - 1) rows[i].push(<RightColumn>{template[i].cols[j].content}</RightColumn>)
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

const ActiveCell = ({ x, y, visibility}) => {
  const [value, setValue] = useState('')

  const editCellRef = React.createRef(null)
  let container

  function lockValue() {
    // setActive("none")
    // setColor(inactiveColor)
    // setBorderWidth("1px")
    // setMargin("0px")
    // setReadOnly(true)
    // setActiveElement(null)
  }

  useEffect(() => {
    container = d3.select(editCellRef.current)

    container
      .style("left", x + "px")
      .style("top", y + "px")

    // if (isActive) editCellRef.current.focus()
    if (visibility === "visible") {
      editCellRef.current.focus()
      document.execCommand('selectAll', false, null);
      document.getSelection().collapseToEnd();
    }
  })

  return (
    <EditCell
      ref={editCellRef}
      visibility={visibility}
      value={value}
      contentEditable={true}
      // onBlur={() => lockValue()}
      onChange={e => setValue(e.target.value)}
    />
  )
}

export default function Timeblock() {
  // const [layout, setLayout] = useState(DefaultTemplate)
  const [position, setPosition] = useState({x: 0, y: 0})
  const [isActive, setIsActive] = useState(false)
  const [visibility, setVisibility] = useState("hidden")
  const [isFocused, setIsFocused] = useState(false)
  const [columns, setColumns] = useState([])
  // const [timeColumn, plannedColumn] = getColumns(DefaultTemplate, setActiveElement)
  const rows = getColumns(BetterTemplate)

  const thisRef = React.createRef(null)
  const cellLayerRef = React.createRef(null)
  const activeCellRef = React.createRef(null)

  let cellLayer
  let thisX, thisY

  const handleCellClick = e => {
    thisX = e.target.getBoundingClientRect().x
    thisY = e.target.getBoundingClientRect().y

    setPosition({x: thisX, y: thisY})
    setVisibility("visible")
    setIsActive(true)
  }

  const unfocusElement = (e) => {
    e.preventDefault()
    if (isActive) {
      setVisibility("hidden")
      setIsActive(false)
    }
    // setPosition({x: 0, y: 0})
  }

  useEffect(() => {
    thisX = thisRef.current.getBoundingClientRect().x
    thisY = thisRef.current.getBoundingClientRect().y
    cellLayer = d3.select(cellLayerRef.current)
  }, [])

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
        <Row>
          <LeftHeader>Column name</LeftHeader>
          <Header>Column name</Header>
          <RightHeader>Column name</RightHeader>
        </Row>
        <Row>
          <LeftColumn>
            <CellLayer
              ref={cellLayerRef}
              tabIndex={0}
              onClick={e => handleCellClick(e)}
              // onBlur={e => unfocusElement(e)}
            />
          </LeftColumn>
          <Column>
            <CellLayer
              ref={cellLayerRef}
              tabIndex={0}
              onClick={e => handleCellClick(e)}
            />
          </Column>
          <RightColumn></RightColumn>
        </Row>
        <Row>
          <LeftColumn></LeftColumn>
          <Column></Column>
          <RightColumn></RightColumn>
        </Row>
        <Row>
          <LeftColumn></LeftColumn>
          <Column></Column>
          <RightColumn></RightColumn>
        </Row>
        <Row>
          <LeftColumn></LeftColumn>
          <Column></Column>
          <RightColumn></RightColumn>
        </Row>
      </Container>
      <br />
      {rows}
      <button>Save current layout</button>
    </div>
  )
}