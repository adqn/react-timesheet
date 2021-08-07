import React, { useState, useEffect } from 'react'
import * as d3 from 'd3'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  // flex-flow: column wrap;
  padding: 10px;
  min-width: 50%;
  height: fit-content;
  // background: green;
  // border: 1px solid black;
`

const Column = styled.div`
  flex: 1;
  flex-grow: 1;
  line-height: 30px;
  font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 14px;
  // width: ${props => props.width};
  padding-left: 10px;
  padding-right: 10px;
  margin-left: -1px;
  border: 1px solid lightgrey;
  border-left: ${props => props.omitLeftBorder ? "none" : "1px solid lightgrey"};
  border-right: ${props => props.omitRightBorder ? "none" : "1px solid lightgrey"};
`

const LeftColumn = styled(Column)`
  border-left: none;
`

const RightColumn = styled(Column)`
  border-right: none;
`

const Row = styled.div`
  display: flex;
  // width: fit-content;
  width: 100%;
  min-height: 30px;
  margin-left: -1px;
  margin-top: -1px;
  // border: 1px solid;
`

const HeaderCell = styled.div`
  flex: 1;
  // flex-grow: 1;
  line-height: 30px;
  font-size: .9em;
  font-weight: 100;
  text-align: left;
  padding-left: 10px;
  color: grey;
  height: 32px;
  margin-left: -1px;
  border: solid 1px lightgrey;
  border-left: ${props => props.omitLeftBorder ? "none" : "1px solid lightgrey"};
  border-right: ${props => props.omitRightBorder ? "none" : "1px solid lightgrey"};
  &:hover {
    background: #F1F1F1;
  }
`

const LeftHeader = styled(HeaderCell)`
  border-left: none;
`

const RightHeader = styled(HeaderCell)`
  border-right: none;
`

const CellResizeBar = styled.div`
  // visibility: hidden;
  display: inline-block;
  position: absolute;
  width: 5px;
  height: 34px;
  margin-top: -1px;
  margin-left: -12px;
  border: none;
  background: #27B7FF;
  opacity: 0;
  &:hover {
    cursor: col-resize;
  }
`

const cellSelectedOverlay = styled.div`
  visibility: hidden;
  position: absolute;
  width: 100;
  height: 100;
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
        content: `don't sleep actually also long long long long entry blab lahljkd ldakjfg lsdkfj klsdj f`
      },
      {
        id: 'plan1',
        content: 'sleep'
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
      },
      {
        id: 'plan2',
        content: 'wake up'
      }
    ]
  },
  {
    cols: [
      {
        content: "Well"
      },
      {
        content: "That was easier"
      },
      {
        content: "Than expected"
      },
      {
        content: "Well"
      }
    ]
  }
]

const getColumns = (template, setActiveElement) => {
  let rows = []
  let out = []

  for (let i = 0; i < template.length; i++) {
    let cols = template[i].cols.length
    rows.push([])

    for (let j = 0; j < cols; j++) {
      if (i === 0 && j === 0) rows[i].push(<Header omitLeftBorder>{template[i].cols[j].content}</Header>)
      else if (i === 0 && j < cols - 1) rows[i].push(<Header><CellResize />{template[i].cols[j].content}</Header>)
      else if (i === 0 && j === cols - 1) {
        rows[i].push(<Header omitRightBorder><CellResize />{template[i].cols[j].content}</Header>)
        out.push(<Row>{rows[i]}</Row>)
      }
      else if (i > 0 && j === 0) rows[i].push(<FlexCell omitLeftBorder value={template[i].cols[j].content} />)
      else if (i > 0 && j < cols - 1) rows[i].push(<FlexCell value={template[i].cols[j].content} />)
      else if (i > 0 && j === cols - 1) {
        rows[i].push(<FlexCell omitRightBorder value={template[i].cols[j].content} />)
        out.push(<Row>{rows[i]}</Row>)
      }
    }
  }

  return out
}

const saveLayout = cols => {
  let layout = []
}

const Header = (props) => {
  return (
    <HeaderCell
      omitLeftBorder={props.omitLeftBorder}
      omitRightBorder={props.omitRightBorder}
    >
      {props.children}
    </HeaderCell>
  )
}

const CellResize = () => {
  const thisRef = React.createRef(null)
  let bar

  useEffect(() => {
    bar = d3.select(thisRef.current)
    bar
      .on("mouseover", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", "1")
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", "0")
      })
  })

  return <CellResizeBar
    ref={thisRef}
        />
}

const FlexCell = (props) => {
  const [value, setValue] = useState(props.value)
  const [isEditing, setIsEditing] = useState(false)
  const [size, setSize] = useState({width: 0, height: 0})
  const [position, setPosition] = useState({x: 0, y: 0})
  const thisRef = React.createRef(null)
  const activeCellRef = React.createRef(null)
  let visibility 
  let thisX, 
    thisY,
    thisWidth,
    thisHeight

  function handleCellClick(e) {
    setIsEditing(true)
  }

  useEffect(() => {
    thisX = thisRef.current.getBoundingClientRect().x
    thisY = thisRef.current.getBoundingClientRect().y
    thisWidth = thisRef.current.offsetWidth
    thisHeight = thisRef.current.offsetHeight
    visibility = isEditing ? "visible" : "hidden"
    setSize({width: thisWidth, height: thisHeight})
    setPosition({x: thisX, y: thisY})
  }, [])

  return (
    <Column
      ref={thisRef}
      width={props.width}
      omitLeftBorder={props.omitLeftBorder}
      omitRightBorder={props.omitRightBorder}
      onClick={e => handleCellClick(e)}
    >
      {value}
      {isEditing ? <ActiveCell size={size} position={position} visibility={visibility}/> : null}
    </Column>
  ) 
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

const ActiveCell = ({ size, position, visibility}) => {
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
      .style("left", position.x + "px")
      .style("top", position.y + "px")
      .style("width", size.width + "px")
      .style("min-height", size.height + "px")

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
      onBlur={() => lockValue()}
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
      <Container>
        {rows}
      </Container>
      <br />

      <button>Save current layout</button>
    </div>
  )
}