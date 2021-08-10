import React, { useState, useEffect, useLayoutEffect } from 'react'
import * as d3 from 'd3'
import styled from 'styled-components'
import autosize from 'autosize'
import Modal from '../components/Modal'

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  // flex-flow: column wrap;
  padding-left: 6px;
  min-width: 50%;
  height: fit-content;
  // background: green;
  // border: 1px solid black;
`

const ControlContainer = styled.div`
  width: 100%;
  height: 100%;
`

const Column = styled.div`
  flex: 1;
  flex-grow: 1;
  line-height: 20px;
  font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 14px;
  // width: ${props => props.width};
  min-height: 20px;
  min-width: 50px;
  padding: 7px;
  // padding-left: 10px;
  // padding-right: 10px;
  margin-left: -1px;
  border: 1px solid lightgrey;
  border-left: ${props => props.omitLeftBorder ? "none" : "1px solid lightgrey"};
  border-right: ${props => props.omitRightBorder ? "none" : "1px solid lightgrey"};
  overflow-wrap: anywhere;
  &:hover {
    cursor: default;
  }
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
  min-width: 420px;
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

const AddButton = styled.div`
  display: inline;
  width: fit-content;
  font: 1.5em bold;
  font-weight: 900;
  color: grey;
  padding: 5px;
  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
  &:hover {
    // background: #F4F4F4;
    cursor: pointer;
  }
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

const EditCell = styled.textarea`
  visibility: ${props => props.visibility};
  position: absolute;
  left: ${props => props.left};
  top: ${props => props.top};
  font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 14px;
  // font-weight: 60;
  line-height: 20px;
  width: ${props => props.width};
  min-height: ${props => props.minheight};
  height: ${props => props.height};
  padding: 4px;
  white-space: pre-wrap;
  word-break: break-word;
  // margin-top: 2px;
  // margin-left: 2px;
  box-sizing: border-box;
  // border: solid 1px grey;
  border: none;
  border-radius: 3px;
  box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
  background: white;
  overflow: hidden;
  outline: none;
  resize: none;
`

const BetterTemplate = [
  {
    cols: [
      {
        id: 'row1-col1',
        content: 'Time'
      },
      {
        id: 'row1-col2',
        content: 'Activity'
      },
      {
        id: 'row1-col3',
        content: 'Revision 1'
      }
    ]
  },
  {
    cols: [
      {
        id: 'row2-col1',
        content: '0000'
      },
      {
        id: 'row2-col2',
        content: 'sleep'
      },
      {
        id: 'row2-col3',
        content: `don't sleep actually also long long long long entry blab lahljkd ldakjfg lsdkfj klsdj f`
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
      }
    ]
  }
]

function getRows(template) {
  let rows = []
  let out = []

  for (let i = 0; i < template.length; i++) {
    let cols = template[i].cols.length
    rows.push([])

    for (let j = 0; j < cols; j++) {
      if (i === 0) {
        if (j === 0) rows[i].push(<Header omitLeftBorder>{template[i].cols[j].content}</Header>)
        else if (j < cols - 1) rows[i].push(<Header>{template[i].cols[j].content}</Header>)
        else {
          rows[i].push(<Header omitRightBorder>{template[i].cols[j].content}</Header>)
          out.push(<Row>{rows[i]}</Row>)
        }
      }

      if (i > 0) {
        if (j === 0) rows[i].push(<FlexCell omitLeftBorder value={template[i].cols[j].content} />)
        else if (j < cols - 1) rows[i].push(<FlexCell value={template[i].cols[j].content} />)
        else {
          rows[i].push(<FlexCell omitRightBorder value={template[i].cols[j].content} />)
          out.push(<Row>{rows[i]}</Row>)
        }
      }
    }
  }

  return out
}

const newRow = (template) => {
  let id;
  let newRow = {cols: []}
  let colTotal = template[0].cols.length

  for (let i = 0; i < colTotal; i++) {
    // really need to ID/key every element
    // id = cols - 1
    newRow.cols.push({content: ""})
  }

  template.push(newRow)
  return template
}

const saveLayout = cols => {
  let layout = []
}

const Spreadsheet = (props) => { 
  const [template, setTemplate] = useState(BetterTemplate)
  const [rows, setRows] = useState(
    getRows(template)
  )

  return (
    <ControlContainer>
      <FlexContainer>
        {rows}
      </FlexContainer>
      <AddRow template={template} setRows={setRows} />
    </ControlContainer>
  )
}

const AddRow = ({ template, setRows }) => {
  function addRow() {
    const updatedTemplate = newRow(template)
    const updatedRows = getRows(updatedTemplate)
    setRows(updatedRows)
  }

  return (
    <AddButton
      onClick={() => addRow()}
    >
      +
    </AddButton>
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

const Column_ = (props) => {
  const [width, setWidth] = useState(props.width)
}

const Row_ = ({ cells }) => {

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
    let winX = window.pageXOffset
    let winY = window.pageYOffset
    thisX = thisRef.current.getBoundingClientRect().x
    thisY = thisRef.current.getBoundingClientRect().y
    thisWidth = thisRef.current.offsetWidth
    thisHeight = thisRef.current.offsetHeight
    setSize({width: thisWidth, height: thisHeight})
    setPosition({x: winX + thisX, y: winY + thisY})
    setIsEditing(true)
  }

  useEffect(() => {
    visibility = isEditing ? "visible" : "hidden"
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
      {isEditing ?
        <ActiveCell
          size={size}
          position={position}
          visibility={visibility}
          setIsEditing={setIsEditing}
          value={value}
          setValue={setValue}
        />
        : null}
    </Column>
  ) 
}

const ActiveCell = ({ size, position, visibility, value, setValue, setIsEditing }) => {
  const [tempValue, setTempValue] = useState(value)
  const editCellRef = React.createRef(null)
  let container

  function getCursorPosition(e) {
    editCellRef.current.setSelectionRange(
      editCellRef.current.value.length,
      editCellRef.current.value.length
    )
  }

  function lockValue(e) {
    setValue(tempValue)
    setIsEditing(false)
  }

  function keyListener(e) {
    if (e.key === "Enter") {
      lockValue()
    }
    if (e.key === "Escape") {
      setIsEditing(false)
    }
  }

  useEffect(() => {
    container = d3.select(editCellRef.current)
    editCellRef.current.focus()
    autosize(editCellRef.current)
  })

  return (
    <EditCell
      ref={editCellRef}
      visibility={visibility}
      left={position.x + 3 + "px"}
      top={position.y + 3 + "px"}
      width={size.width + "px"}
      minheight={size.height + "px"}
      height={size.height + "px"}
      defaultValue={value}
      value={tempValue}
      onFocus={e => getCursorPosition(e)}
      onBlur={(e) => lockValue(e)}
      onKeyDown={(e) => keyListener(e)}
      onChange={e => setTempValue(e.target.value)}
    />
  )
}

export default function Timeblock() {
  const [template, setTemplate] = useState(BetterTemplate)
  const thisRef = React.createRef(null)

  useEffect(() => {
    // const newTemplate = newRow(template)
    // setTemplate(newTemplate)
  }, [])

  return (
    <div>
      <Spreadsheet template={template} />
      <br />
      <button>Save current layout</button>
    </div>
  )
}