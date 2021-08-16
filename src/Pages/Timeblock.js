import React, { useState, useEffect } from 'react'
import * as d3 from 'd3'
import styled from 'styled-components'
import autosize from 'autosize'
import Modal from '../components/Modal'

const SpreadsheetContext = React.createContext()

const ModalDialog = styled.div`
  position: absolute;
  top: 25%;
  left: 40%;
  // height: 300px;
  // width: 300px;
  // height: fit-content;
  // width: fit-content
  border-radius: 7px;
  background: white;
`

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  // flex-flow: column wrap;
  padding-left: 6px;
  min-width: 50%;
  height: fit-content;
  // border: 1px solid black;
`

const ControlContainer = styled.div`
  display: flex;
  width: fit-content;
  height: 100%;
  // border: 1px solid;
`

const Cell = styled.div`
  flex: 1;
  flex-grow: 1;
  // flex-shrink: 0;
  line-height: 20px;
  font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 14px;
  // width: ${props => props.width};
  width: 150px;
  max-width: 200px;
  min-height: 20px;
  // min-width: 100px;
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

const HeaderCell = styled.div`
  flex: 1;
  flex-grow: 1;
  line-height: 30px;
  font-size: .9em;
  font-weight: 100;
  text-align: left;
  padding-left: 10px;
  color: grey;
  height: 32px;
  min-width: 100px;
  margin-left: -1px;
  border: solid 1px lightgrey;
  border-left: ${props => props.omitLeftBorder ? "none" : "1px solid lightgrey"};
  border-right: ${props => props.omitRightBorder ? "none" : "1px solid lightgrey"};
  &:hover {
    cursor: default;
    background: #F1F1F1;
  }
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

const AddButton = styled.div`
  display: inline-block;
  height: fit-content;
  width: fit-content;
  font: 1.5em bold;
  font-weight: 900;
  color: grey;
  padding-left: 5px;
  padding-right: 5px;
  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
  &:hover {
    background: #F4F4F4;
    cursor: pointer;
  }
`

const ColumnResizeBar = styled.div`
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
  // visibility: hidden;
  position: absolute;
  width: ${props => props.width}
  height: ${props => props.height}
  border: 2px solid lightblue;
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

const defaultTemplate = [
  [
    {
      id: 'row1-col1',
      content: ''
    },
    {
      id: 'row1-col2',
      content: ''
    }
  ],
  [
    {
      id: 'row2-col1',
      content: ''
    },
    {
      id: 'row2-col2',
      content: ''
    }
  ]
]

const newRow = (temp) => {
  let template = [...temp]
  let newId, colId
  let rowId = template.length + 1
  let newRow = []
  let colTotal = template[0].length

  for (let i = 0; i < colTotal; i++) {
    colId = i + 1
    newId = `row${rowId}-col${colId}`
    newRow.push({ id: newId, content: "" })
  }

  template.push(newRow)
  return template
}

const newColumn = (temp) => {
  let template = [...temp]
  let newId, rowId;
  let colId = template[0].length + 1
  let rowTotal = template.length

  for (let i = 0; i < rowTotal; i++) {
    rowId = i + 1
    newId = `row${rowId}-col${colId}`
    template[i].push({ id: newId, content: "" })
  }

  return template
}

const AddRow = ({ template, setTemplate }) => {
  function addRow() {
    const updatedTemplate = newRow(template)
    setTemplate(updatedTemplate)
  }

  return (
    <AddButton
      onClick={() => addRow()}
    >
      +
    </AddButton>
  )
}

const AddColumn = ({ template, setTemplate }) => {
  function addColumn() {
    const updatedTemplate = newColumn(template)
    setTemplate(updatedTemplate)
  }

  return (
    <AddButton
      onClick={() => addColumn()}
    >
      +
    </AddButton>
  )
}

const ColumnResize = () => {
  const [isActive, setIsActive] = useState(false)
  const [sliderValue, setSliderValue] = useState(150)
  const minSliderValue = 50;
  const thisRef = React.createRef(null)
  let bar

  function adjustSlider(e) {

  }

  useEffect(() => {
    bar = d3.select(thisRef.current)
    bar
      .on("mouseover", function () {
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

  return <ColumnResizeBar
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

const Spreadsheet = () => {
  const [template, setTemplate] = useState(defaultTemplate)
  // Reducer here?
  const [action, setAction] = useState("save")
  const [modalActive, setModalActive] = useState(false)
  const templateContext = {
    template,
    setTemplate
  }

  return (
    <div>
      <ControlContainer>
        <FlexContainer>
          <SpreadsheetContext.Provider value={templateContext}>
            {template.map((row, i) => (
              <Row key={i}>
                {row.map((cell, j) => (
                  <FlexCell key={j}
                    omitLeftBorder={j === 0}
                    omitRightBorder={j === row.length - 1}
                    cellType={i === 0 ? "header" : undefined}
                    id={cell.id}
                    value={cell.content} />)
                )}
              </Row>
            ))}
          </SpreadsheetContext.Provider>
          <AddRow template={template} setTemplate={setTemplate} />
        </FlexContainer>
        <AddColumn template={template} setTemplate={setTemplate} />
      </ControlContainer>
      <br />
      <button
        onClick={() => { setAction("save"); setModalActive(true) }}
      >
        Save current template
        </button>
      <br />
      <button
        onClick={() => { setAction("load"); setModalActive(true) }}
      >
        Load template
        </button>
      {modalActive ?
        <Modal visibility={"visible"}>
          {action === "save" ?
            <SaveTemplateBox template={template} setModalActive={setModalActive} />
            :
            <LoadTemplateBox setTemplate={setTemplate} setModalActive={setModalActive} />
          }
        </Modal>
        : null}
    </div>
  )
}

const FlexCell = (props) => {
  const value = props.value
  const [isEditing, setIsEditing] = useState(false)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const components = {
    header: HeaderCell,
    normal: Cell
  }
  const CellType = components[props.cellType || 'normal']
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
    // set spawn size and position of ActiveCell
    setSize({ width: thisWidth, height: thisHeight })
    setPosition({ x: winX + thisX, y: winY + thisY })
    setIsEditing(true)
  }

  useEffect(() => {
    visibility = isEditing ? "visible" : "hidden"
  }, [])

  return (
    <CellType
      ref={thisRef}
      key={props.id}
      width={props.width}
      omitLeftBorder={props.omitLeftBorder}
      omitRightBorder={props.omitRightBorder}
      onClick={e => handleCellClick(e)}
    >
      {value}
      {isEditing ?
        <ActiveCell
          parentKey={props.id}
          size={size}
          position={position}
          visibility={visibility}
          setIsEditing={setIsEditing}
          value={value}
        />
        : null}
    </CellType>
  )
}

const ActiveCell = ({ parentKey, size, position, visibility, value: originalValue, setIsEditing }) => {
  const [value, setValue] = useState(originalValue)
  const editCellRef = React.createRef(null)
  const context = React.useContext(SpreadsheetContext)
  let container

  function updateTemplate(temp) {
    let template = [...temp]
    let row, col

    row = parentKey.split("-")[0].match(/\d/)[0] - 1
    col = parentKey.split("-")[1].match(/\d/)[0] - 1

    template[row][col].content = value
    context.setTemplate(template)
  }

  function lockValue(e) {
    updateTemplate(context.template)
    setIsEditing(false)
  }

  function getCursorPosition(e) {
    editCellRef.current.setSelectionRange(
      editCellRef.current.value.length,
      editCellRef.current.value.length
    )
  }

  function handleChange(e) {
    // setTempValue(e.target.value)
    setValue(e.target.value)
  }

  function keyListener(e) {
    if (e.key === "Enter") {
      lockValue()
    }
    // if (e.key === "Escape") {
    //   setIsEditing(false)
    // }
  }

  useEffect(() => {
    container = d3.select(editCellRef.current)
    editCellRef.current.focus()
    autosize(editCellRef.current)
  }, [])

  return (
    <EditCell
      ref={editCellRef}
      visibility={visibility}
      left={position.x + 3 + "px"}
      top={position.y + 3 + "px"}
      width={size.width + "px"}
      minheight={size.height + "px"}
      height={size.height + "px"}
      value={value}
      onFocus={e => getCursorPosition(e)}
      onBlur={(e) => lockValue(e)}
      onKeyDown={(e) => keyListener(e)}
      // onChange={e => setValue(e.target.value)}
      onChange={e => handleChange(e)}
    />
  )
}

const SaveTemplateBox = ({ template, setModalActive }) => {
  const [status, setStatus] = useState("")
  const [name, setName] = useState("Untitled")
  const inputRef = React.createRef(null)

  function saveTemplate() {
    const newTemplate = {
      name,
      template
    }

    const req = {
      method: 'POST',
      body: JSON.stringify(newTemplate)
    }

    fetch('/api/savetemplate', req)
      .then(() => {
        setStatus("Template saved!");
        setTimeout(() => setModalActive(false), 2000)
      })
  }

  useEffect(() => {
    inputRef.current.focus()
    window.onclick = e => {
      if (e.target.id === "modal") setModalActive(false)
    }
  }, [])

  return (
    <ModalDialog>
      <input
        ref={inputRef}
        placeholder={"Template name"}
        onChange={e => setName(e.target.value)}
        style={{ outline: 'none' }}
      />
      <button onClick={() => saveTemplate()}>Save</button>
      <br />
      {status}
    </ModalDialog>
  )
}

const LoadTemplateBox = ({ setTemplate, setModalActive }) => {
  const [templates, setTemplates] = useState(null)
  const dialogRef = React.createRef(null)

  async function getTemplates() {
    return (await fetch('/api/test')).json()
  }

  useEffect(async () => {
    const data = await getTemplates()
    const res = data.templates
    setTemplates(res)
    window.onclick = e => {
      if (e.target.id === "modal") setModalActive(false)
    }
  }, [])

  return (
    <ModalDialog>
      {templates ? templates.map((template, idx) => {
        return (
          <button
            key={idx}
            onClick={() => setTemplate([...template.template])}
            style={{ display: 'block' }}
          >
            {template.name}
          </button>
        )
      }) : "Loading templates..."}
    </ModalDialog>
  )
}

export default function Timeblock() {
  return (
    <div>
      <Spreadsheet />
    </div>
  )
}