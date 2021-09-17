import autosize from 'autosize'
import * as d3 from 'd3'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { isTemplateExpression } from 'typescript'
import Modal from '../components/Modal'

const SpreadsheetContext = React.createContext()

const cellWidth: string = "150px"

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
  // min-width: 50%;
  // width: fit-content;
  // height: fit-content;
  // border: 1px solid black;
`

const ControlContainer = styled.div`
  display: flex;
  width: fit-content;
  height: 100%;
  // border: 1px solid;
`

interface CellStyles {
  width: number;
  omitLeftBorder: boolean;
  omitRightBorder: boolean;
}

const Cell = styled.div<CellStyles>`
  flex: 1;
  flex-grow: 1;
  // flex-shrink: 0;
  line-height: 20px;
  font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 14px;
  width: ${props => props.width};
  // width: 150px;
  // max-width: 200px;
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

const HeaderCell = styled.div<CellStyles>`
  flex: 1;
  flex-grow: 1;
  line-height: 30px;
  font-size: .9em;
  font-weight: 100;
  text-align: left;
  padding-left: 10px;
  color: grey;
  height: 32px;
  // width: 150px;
  width: ${props => props.width};
  // min-width: fit-content;
  // min-width: 50px;
  margin-left: -1px;
  border: solid 1px lightgrey;
  border-left: ${props => props.omitLeftBorder ? "none" : "1px solid lightgrey"};
  border-right: ${props => props.omitRightBorder ? "none" : "1px solid lightgrey"};
  &:hover {
    cursor: default;
    background: #F1F1F1;
  }
`

// Crazy offsets that I'm not sure will work on every device???
const SelectedCell = styled.div`
  position: absolute;
  top: ${props => props.top - 80 + "px"};
  left: ${props => props.left - 6 + "px"};
  height: ${props => props.height - 4 + "px"};
  width: ${props => props.width - 4 + "px"};
  border: solid 2px #33ccff;
  background: #33ccff;
  opacity: .3;
  z-index: 1;
`

const Row = styled.div`
  display: flex;
  // width: fit-content;
  // min-width: 420px;
  // width: 100%;
  min-height: 30px;
  margin-left: -1px;
  margin-top: -1px;
  // border: 1px solid;
`

const AddRemoveButton = styled.div`
  display: inline-block;
  height: fit-content;
  width: 20px;
  text-align: center;
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

const ColumnResizeBar = styled.input`
  visibility: visible;
  // display: inline-block;
  display: block;
  position: absolute;
  width: 5px;
  height: 34px;
  margin-top: -1px;
  // margin-left: -12px;
  border: none;
  background: #27B7FF;
  opacity: 1;
  &:hover {
    cursor: col-resize;
  }
`

// const cellSelectedOverlay = styled.div`
//   // visibility: hidden;
//   position: absolute;
//   width: ${props => props.width}
//   height: ${props => props.height}
//   border: 2px solid lightblue;
// `

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

interface EditCellStyles {
  visibility: string;
  left: string;
  top: string;
  width: string;
  minheight: string;
  height: string;
}

const EditCell = styled.textarea<EditCellStyles>`
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

interface Cell {
  id: string;
  width: string;
  content: string;
}

type Spreadsheet = Array<Array<Cell>>
// type Spreadsheet = Cell[][]

interface TemplateEntry {
  name: string;
  template: Spreadsheet;
}

const defaultTemplate: Spreadsheet = [
  [
    {
      id: 'row1-col1',
      width: cellWidth,
      content: ''
    },
    {
      id: 'row1-col2',
      width: cellWidth,
      content: ''
    }
  ],
  [
    {
      id: 'row2-col1',
      width: cellWidth,
      content: ''
    },
    {
      id: 'row2-col2',
      width: cellWidth,
      content: ''
    }
  ]
]

const newRow = (template: Spreadsheet) => {
  let temp = [...template]
  let newId, colId
  let rowId = template.length + 1
  let newRow = []
  let colTotal = template[0].length

  for (let i = 0; i < colTotal; i++) {
    colId = i + 1
    newId = `row${rowId}-col${colId}`
    newRow.push({ id: newId, width: cellWidth, content: "" })
  }

  temp.push(newRow)
  return temp
}

const newColumn = (template: Spreadsheet) => {
  let temp = [...template]
  let newId, rowId;
  let colId = template[0].length + 1
  let rowTotal = template.length

  for (let i = 0; i < rowTotal; i++) {
    rowId = i + 1
    newId = `row${rowId}-col${colId}`
    temp[i].push({ id: newId, width: cellWidth, content: "" })
  }

  return temp
}

const ModifyRow = ({ remove, template, setTemplate }: {remove?: boolean, template: Spreadsheet, setTemplate: (t: Spreadsheet) => void}) => {
  function addRow() {
    const updatedTemplate = newRow(template)
    setTemplate(updatedTemplate)
  }

  function removeRow() {
    if (template.length < 2) return
    const updatedTemplate = [...template].slice(0, -1)
    setTemplate(updatedTemplate)
  }

  return (
    <AddRemoveButton
      onClick={() => remove ? removeRow() : addRow()}
    >
      {remove ? "-" : "+"}
    </AddRemoveButton>
  )
}

const ModifyColumn = ({ remove, template, setTemplate }: {remove?: boolean | undefined, template: Spreadsheet, setTemplate: (t: Spreadsheet) => void}) => {
  function addColumn() {
    const updatedTemplate = newColumn(template)
    setTemplate(updatedTemplate)
  }

  function removeColumn() {
    if (template[0].length < 2) return
    const updatedTemplate = [...template]
    updatedTemplate.map((row, i) => updatedTemplate[i] = updatedTemplate[i].slice(0, -1))
    setTemplate(updatedTemplate)
  }

  return (
    <AddRemoveButton
      onClick={() => remove ? removeColumn() : addColumn()}
    >
      {remove ? "-" : "+"}
    </AddRemoveButton>
  )
}

const ColumnResize = ({template, setTemplate}: {template: Spreadsheet, setTemplate: (t: Spreadsheet) => void}) => {
  const [isActive, setIsActive] = useState(false)
  const [sliderValue, setSliderValue] = useState(150)
  const minSliderValue = 50;
  const thisRef = React.createRef<React.ElementRef<typeof ColumnResize>>()
  let bar

  function updateWidth() {
  }

  function adjustSlider(e: any) {

  }

  // assuming each cell has a 'width' property 
  // try not to use this
  // function resizeColumn(dx: number, colNum: number) {
  //   let temp = [...template]
  //   template.map((row, i) => 
  //     row.map((col, j) => { if (j === colNum) temp[i][j].width += dx }))
  //   setTemplate(temp)
  // }

  useEffect(() => {
    bar = d3.select(thisRef.current)
  //   bar
  //     .on("mouseover", function () {
  //       d3.select(this)
  //         .transition()
  //         .duration(200)
  //         .style("opacity", "1")
  //     })
  //     .on("mouseout", function () {
  //       d3.select(this)
  //         .transition()
  //         .duration(200)
  //         .style("opacity", "0")
  //     })
  })

  return <ColumnResizeBar
    ref={thisRef}
  />
}

// control layer for cell selection/navigation
// get cell ID also somehow enter active cell mode on keypress
const CellSelectionLayer = (props) => {
  const [isActive, setIsActive] = useState(props.isActive)
  const [isEditing, setIsEdition] = useState(false)
  const [selectedCell, setSelectedCell] = useState('')
  let cellProps
  isActive ? cellProps = {
    width: props.selectedCellProps.width,
    height: props.selectedCellProps.height,
    top: props.selectedCellProps.y,
    left: props.selectedCellProps.x
  } : cellProps = {}

  const selectedCellRef = React.createRef()

  function editSelectedCell() {

  }

  function getKeypress(e: any) {
    const rowId = props.selectedCellId.split("-")[0].match(/\d/)[0]
    const colId = props.selectedCellId.split("-")[1].match(/\d/)[0]

    if (e.key === "ArrowLeft") {
      if (colId > 0) {
        const newCellId = `row${rowId}-col${colId - 1}`
        setSelectedCell(colId)
      }
    }
    else if (e.key === "ArrowRight") {
      if (colId < props.template[0].length) {
        const newCellId = `row${rowId}-col${colId + 1}`
      }
    }
    else if (e.key === "ArrowUp") {
      if (rowId > 0) {}
    }
    else if (e.key === "ArrowDown") {
      if (rowId < props.template.length) {}
    }
  }

  useEffect(() => {
    if (props.isActive && props.selectedCellId != null) {
      // alert(props.selectedCellId)
      // document.getElementById(props.selectedCellId).innerHTML = "what"
    }
  })

  // just put Spreadsheet here?
  return (
    <div
      style={{position: "relative"}}
      id="CellSelectionLayer"
    >
      {isActive ?
        isEditing ?
          <ActiveCell 
            parentKey={props.selectedCellId}
            size={{width: cellProps.width, height: cellProps.height}}
            position={{x: cellProps.left, y: cellProps.top}}
          />
          :
      <div>
        <SelectedCell
          ref={selectedCellRef}
          width={cellProps.width}
          height={cellProps.height}
          top={cellProps.top}
          left={cellProps.left}
        />
        </div>
        : null}
      {props.children}
    </div>
  )  
}

const Spreadsheet = () => {
  const [template, setTemplate] = useState(defaultTemplate)
  const [cellSelectionLayerActive, setCellSelectionLayerActive] = useState(false)
  const [selectedCellId, setSelectedCellId] = useState(null)
  const [selectedCellProps, setSelectedCellProps] = useState(null)
  const [action, setAction] = useState("save")
  const [modalActive, setModalActive] = useState(false)
  const templateContext = {
    template,
    setTemplate,
    setCellSelectionLayerActive,
    setSelectedCellId,
    setSelectedCellProps
  }

  const copyAsMarkdown = async () => {
    const ret: string[] = [];
    template.forEach((row, index) => {
      ret.push(`|${row.map((cell) => cell.content).join("|")}|`);
      if (index === 0) {
        ret.push(`|${row.map((_, col) => col === 0 ? ":-:" : "-").join("|")}|`)
      }
    })
    await navigator.clipboard.writeText(ret.join("\n"));
    console.log("Copied to clipboard");
  };

  return (
    <div>
      <ControlContainer>
        <FlexContainer>
          <SpreadsheetContext.Provider value={templateContext}>
            <CellSelectionLayer
              template={template}
              isActive={cellSelectionLayerActive}
              selectedCellId={selectedCellId}
              selectedCellProps={selectedCellProps}
              onClick={null}
            >
              {template.map((row, i) => (
                <Row key={i}>
                  {row.map((cell, j) => (
                    <FlexCell key={j}
                      omitLeftBorder={j === 0}
                      omitRightBorder={j === row.length - 1}
                      cellType={i === 0 ? "header" : undefined}
                      id={cell.id}
                      width={cell.width}
                      value={cell.content} />)
                  )}
                </Row>
              ))}
            </CellSelectionLayer>
          </SpreadsheetContext.Provider>
          <ModifyRow template={template} setTemplate={setTemplate} />
          <ModifyRow remove template={template} setTemplate={setTemplate} />
        </FlexContainer>
        <ModifyColumn template={template} setTemplate={setTemplate} />
        <ModifyColumn remove template={template} setTemplate={setTemplate} />
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
      <br />
      <button
        onClick={copyAsMarkdown}
      >
        Copy as markdown
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
        <br />
      <ColumnResize template={template} setTemplate={setTemplate} />
    </div>
  )
}

const FlexCell = (props: any) => {
  const value = props.value
  const [isEditing, setIsEditing] = useState(false)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const components = {
    header: HeaderCell,
    normal: Cell
  }
  const CellType = components[props.cellType || 'normal']
  const thisRef = React.createRef()
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
      onClick={(e: any) => handleCellClick(e)}
    >
      {value}
      {isEditing ?
        <Modal
          background={"none"}
        >
          <ActiveCell
            parentKey={props.id}
            size={size}
            position={position}
            visibility={visibility}
            setIsEditing={setIsEditing}
            originalValue={value}
            />
        </Modal>
        : null}
    </CellType>
  )
}

interface ActiveCellProps {
  parentKey: string;
  size: { width: number, height: number };
  position: { x: number, y: number };
  visibility: string | undefined;
  originalValue: string;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>> 
}

const ActiveCell = ({ parentKey, size, position, visibility, originalValue, setIsEditing }: ActiveCellProps) => {
  const [value, setValue] = useState(originalValue)
  const editCellRef = React.createRef()
  const context = React.useContext(SpreadsheetContext)
  let container

  function updateTemplate(template: Spreadsheet) {
    let temp = [...template]
    let row
    let col

    row = parentKey.split("-")[0].match(/\d/)[0] - 1
    col = parentKey.split("-")[1].match(/\d/)[0] - 1

    temp[row][col].content = value
    context.setTemplate(temp)
  }

  function lockValue(e?: any) {

    window.onclick = (e: any) => {
      if (e.target.id === "modal") {
        const cellProps = {
          x: position.x,
          y: position.y,
          height: size.height,
          width: size.width
        }

        context.setSelectedCellId(parentKey)
        context.setSelectedCellProps(cellProps)
        context.setCellSelectionLayerActive(true)
        updateTemplate(context.template)
        setIsEditing(false)
        // make currently active cell target of selection 
        // drop into cell selection mode here somehow (?)
      }
    }
  }

  function getCursorPosition(e?: any) {
    editCellRef.current.setSelectionRange(
      editCellRef.current.value.length,
      editCellRef.current.value.length
    )
  }

  function handleChange(e: any) {
    // setTempValue(e.target.value)
    setValue(e.target.value)
  }

  function keyListener(e: any) {
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

const SaveTemplateBox = ({ template, setModalActive }: {template: Spreadsheet, setModalActive: (b: boolean) => void}) => {
  const [status, setStatus] = useState("")
  const [name, setName] = useState("Untitled")
  const inputRef = React.createRef<React.ElementRef<typeof SaveTemplateBox>>()

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
    if (inputRef) inputRef.current.focus()
    window.onclick = (e: any) => {
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

const LoadTemplateBox = ({ setTemplate, setModalActive }: {setTemplate: (t: Spreadsheet) => void, setModalActive: (b: boolean) => void}) => {
  const [templates, setTemplates] = useState<TemplateEntry[] | null>(null)

  interface TestData {
    daily: any;
    daily2: any;
    projects: any;
    templates: TemplateEntry[]
  }

  async function getData(): Promise<TestData> {
    return (await fetch('/api/test')).json()
  }

  useEffect(() => {
    getData().then(res => setTemplates(res.templates))
    window.onclick = (e: any) => {
      if (e.target.id === "modal") setModalActive(false)
    }
  }, [])

  return (
    <ModalDialog>
      {templates ? templates.map((templateEntry, idx) => {
        return (
          <button
            key={idx}
            onClick={() => setTemplate([...templateEntry.template])}
            style={{ display: 'block' }}
          >
            {templateEntry.name}
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