import * as d3 from 'd3'
import React, { useEffect, useState } from 'react'
import { isTemplateExpression } from 'typescript'
import Modal from '../../components/Modal'
import * as Styled from './Timeblock.styled'

import { ActiveCell } from './ActiveCell'
import { CellControlLayer } from './CellControlLayer'
import { SpreadsheetContext, Cell, Spreadsheet, newColumn, newRow } from './utils'

interface TemplateEntry {
  name: string;
  template: Spreadsheet;
}

const defaultTemplate: Spreadsheet = Array.apply(null, Array(49)).map((_, index) => [
  {
    id: `row${index+1}-col1`,
    width: Styled.cellWidth,
    height: index === 0 ? Styled.headerHeight : Styled.cellHeight,
    content: index === 0 ? 'Time' : `${index < 21 ? '0' : ''}${Math.floor((index - 1) / 2)}${index % 2 === 1 ? '00' : '30'}`
  },
  {
    id: `row${index+1}-col2`,
    width: Styled.cellWidth,
    height: index === 0 ? Styled.headerHeight : Styled.cellHeight,
    content: index === 0 ? 'Plan' : ''
  }
])

const ModifyRow = ({ remove, template, setTemplate }: { remove?: boolean, template: Spreadsheet, setTemplate: (t: Spreadsheet) => void }) => {
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
    <Styled.AddRemoveButton
      onClick={() => remove ? removeRow() : addRow()}
    >
      {remove ? "-" : "+"}
    </Styled.AddRemoveButton>
  )
}

const ModifyColumn = ({ remove, template, setTemplate }: { remove?: boolean | undefined, template: Spreadsheet, setTemplate: (t: Spreadsheet) => void }) => {
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
    <Styled.AddRemoveButton
      onClick={() => remove ? removeColumn() : addColumn()}
    >
      {remove ? "-" : "+"}
    </Styled.AddRemoveButton>
  )
}

const ColumnResize = ({ template, setTemplate }: { template: Spreadsheet, setTemplate: (t: Spreadsheet) => void }) => {
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

  return <Styled.ColumnResizeBar
    ref={thisRef}
  />
}

const Sheet = () => {
  const [template, setTemplate] = useState(defaultTemplate)
  const [cellSelectionLayerActive, setCellSelectionLayerActive] = useState(false)
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null)
  const [selectedCellProps, setSelectedCellProps] = useState({})
  const [action, setAction] = useState("save")
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(null)
  const [modalActive, setModalActive] = useState(false)
  const templateContext = {
    template,
    setTemplate,
    setCellSelectionLayerActive,
    setSelectedCellId,
    setSelectedCellProps,
    setIsEditing,
    tempValue,
    setTempValue
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
      <Styled.ControlContainer>
        <Styled.FlexContainer>
          <SpreadsheetContext.Provider value={templateContext}>
            {cellSelectionLayerActive ?
              <CellControlLayer
                template={template}
                isActive={cellSelectionLayerActive}
                selectedCellId={selectedCellId}
                setSelectedCellId={setSelectedCellId}
                selectedCellProps={selectedCellProps}
                setSelectedCellProps={setSelectedCellProps}
                onClick={null}
              />
              : null}
            {template.map((row, i) => (
              <Styled.Row key={i}>
                {row.map((cell, j) => (
                  <FlexCell key={j}
                    omitLeftBorder={j === 0}
                    omitRightBorder={j === row.length - 1}
                    cellType={i === 0 ? "header" : undefined}
                    id={cell.id}
                    initialWidth={cell.width}
                    initialHeight={cell.height}
                    value={cell.content}
                  />)
                )}
              </Styled.Row>
            ))}
          </SpreadsheetContext.Provider>
          <ModifyRow template={template} setTemplate={setTemplate} />
          <ModifyRow remove template={template} setTemplate={setTemplate} />
        </Styled.FlexContainer>
        <ModifyColumn template={template} setTemplate={setTemplate} />
        <ModifyColumn remove template={template} setTemplate={setTemplate} />
      </Styled.ControlContainer>
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
  const [tempValue, setTempValue] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [size, setSize] = useState({ width: props.initialWidth, height: props.initialHeight })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [coords, setCoords] = useState(position)
  const components = {
    header: Styled.HeaderCell,
    normal: Styled.Cell
  }
  const CellType = components[props.cellType || 'normal']
  const rowIdx = parseInt(props.id.split("-")[0].match(/\d+/)[0]) - 1
  const colIdx = parseInt(props.id.split("-")[1].match(/\d+/)[0]) - 1
  const thisRef = React.createRef()
  const context = React.useContext(SpreadsheetContext)
  let visibility
  let cellProps
  let winX,
    winY,
    thisX,
    thisY,
    thisWidth,
    thisHeight

  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      if (entry.target.offsetHeight != props.initialHeight) {
        // console.log(entry.target.offsetHeight)
        // const newSize = { ...size }
        // newSize.height = entry.target.offsetHeight
        // setSize(newSize)
      }
    }
  })

  function handleCellClick(e) {
    let winX = window.pageXOffset
    let winY = window.pageYOffset
    let scrollX = window.scrollX
    let scrollY = window.scrollY
    thisX = thisRef.current.getBoundingClientRect().x
    thisY = thisRef.current.getBoundingClientRect().y
    thisWidth = thisRef.current.offsetWidth
    thisHeight = thisRef.current.offsetHeight
    // set spawn size and position of ActiveCell
    setCoords({x: thisX, y: thisY})
    setSize({ width: thisWidth, height: thisHeight })
    setPosition({ x: winX + thisX - scrollX, y: winY + thisY - scrollY})
    setIsEditing(true)
    context.setCellSelectionLayerActive(false)
  }

  useEffect(() => {
    visibility = isEditing ? "visible" : "hidden"
    // resizeObserver.observe(thisRef.current)
  }, [])

  return (
    <CellType
      ref={thisRef}
      key={props.id}
      width={props.initialWidth}
      omitLeftBorder={props.omitLeftBorder}
      omitRightBorder={props.omitRightBorder}
      onClick={(e: any) => handleCellClick(e)}
    >
      {tempValue ? tempValue : value}
      {isEditing ?
        <ActiveCell
          parentKey={props.id}
          size={size}
          position={position}
          coords={coords}
          visibility={visibility}
          setIsEditing={setIsEditing}
          originalValue={value}
          setTempValue={setTempValue}
        />
        : null}
    </CellType>
  )
}

const SaveTemplateBox = ({ template, setModalActive }: { template: Spreadsheet, setModalActive: (b: boolean) => void }) => {
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
    <Styled.ModalDialog>
      <input
        ref={inputRef}
        placeholder={"Template name"}
        onChange={e => setName(e.target.value)}
        style={{ outline: 'none' }}
      />
      <button onClick={() => saveTemplate()}>Save</button>
      <br />
      {status}
    </Styled.ModalDialog>
  )
}

const LoadTemplateBox = ({ setTemplate, setModalActive }: { setTemplate: (t: Spreadsheet) => void, setModalActive: (b: boolean) => void }) => {
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
    <Styled.ModalDialog>
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
    </Styled.ModalDialog>
  )
}

export function Timeblock() {
  return (
    <div>
      <Sheet />
    </div>
  )
}