import React, { useEffect, useState } from 'react'

import { SpreadsheetContext, Spreadsheet, newRow, newColumn } from '../utils'
import { ActiveCell } from '../ActiveCell'
import * as Styled from '../Timeblock.styled'
import * as d3 from 'd3'

export const ColumnResize = ({ template, setTemplate, initialPosition }: { template: Spreadsheet, setTemplate: (t: Spreadsheet) => void, initalPosition }) => {
  const [isActive, setIsActive] = useState(false)
  const [value, setValue] = useState(50)
  const minSliderValue = 150;
  const thisRef = React.createRef<React.ElementRef<typeof ColumnResize>>()
  let bar

  function updateWidth() {
  }

  function adjustSlider(e: any) {

  }

  // assuming each cell has a 'width' property 
  function resize(newWidth: number, colIdx: number = 0) {
    let temp = [...template]
    template.map((row, i) => 
      row.map((_, j) => { if (j === colIdx) temp[i][j].width = newWidth }))
    setTemplate(temp)
  }

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
    console.log(value)
    resize(parseInt(value) + 100) // fix this
  }, [value])

  return (
    <Styled.ColumnResizeContainer
      left={69}
    >
      <Styled.ColumnResizeBar
        ref={thisRef}
        onInput={e => setValue(e.target.value)}
        type="range"
        style={{
          width: "200px",
          min: "50",
          max: "200",
          val: value
        }}
      />
    </Styled.ColumnResizeContainer>
  )
}


// control layer for cell selection/navigation
export const CellControlLayer = (props) => {
  const [isActive, setIsActive] = useState(props.isActive)
  const [isEditing, setIsEditing] = useState(false)
  const [currentCell, setCurrentCell] = useState<null | number[]>(null)
  const [fromController, setFromController] = useState(false)
  const selectedCellRef = React.createRef()
  const context = React.useContext(SpreadsheetContext)
  const rowId = parseInt(props.selectedCellId.split("-")[0].match(/\d+/)[0])
  const colId = parseInt(props.selectedCellId.split("-")[1].match(/\d+/)[0])
  const newCellProps = { ...props.selectedCellProps }
  let newCellId = props.selectedCellId

  const handleKeyPress = (e: any) => {
    let winX = window.pageXOffset
    let winY = window.pageYOffset
    let scrollX = window.scrollX
    let scrollY = window.scrollY

    if (!isActive || isEditing) return
    // console.log(props.selectedCellId)

    if (e.key === "ArrowLeft") {
      e.preventDefault()
      if (colId > 1) {
        newCellId = `row${rowId}-col${colId - 1}`
        newCellProps.x -= props.template[rowId - 1][colId - 2].width
      }
    }

    else if (e.key === "ArrowRight") {
      e.preventDefault()
      if (colId < props.template[0].length) {
        newCellId = `row${rowId}-col${colId + 1}`
        newCellProps.x += props.template[rowId - 1][colId - 1].width
      } else {
        // may need to be setting cell position in template for cursor wraparound 
        // newCellId = `row${rowId + 1}-col${1}`
        // newCellProps.x += newCellProps.width - 1
      }
    }

    else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (rowId > 2) {
        newCellId = `row${rowId - 1}-col${colId}`
        newCellProps.y -= props.template[rowId - 2][colId - 1].height - 1 //- scrollY
        newCellProps.height = props.template[rowId - 2][colId - 1].height
      }
    }

    else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (rowId < props.template.length) {
        newCellId = `row${rowId + 1}-col${colId}`
        newCellProps.y += newCellProps.height - 1 //- scrollY
        newCellProps.height = props.template[rowId][colId - 1].height
        // newCellProps.y += newCellProps.height - 1
      }
    }

    else if (e.key === "Tab") {
      e.preventDefault()
      if (colId < props.template[0].length) {
        newCellId = `row${rowId}-col${colId + 1}`
        newCellProps.x += newCellProps.width - 1
      } else {
        const newTemplate = newColumn(props.template)
        context.setTemplate(newTemplate)
        newCellId = `row${rowId}-col${colId + 1}`
        newCellProps.x += newCellProps.width - 1
      }
    }

    else if (e.ctrlKey) {
      // add row
      if (e.key === "a") {
        e.preventDefault()
        const newTemplate = newRow(props.template)
        context.setTemplate(newTemplate)
      }

      // remove last row
      else if (e.key === "r") {
        e.preventDefault()
        const newTemplate = props.template.slice(0, -1)
        if (props.template.length > 2) {
          if (rowId > props.template.length - 1) {
            const newRowId = props.template.length - 1
            newCellProps.y -= Styled.cellHeight - 1
            newCellProps.height = props.template[newRowId - 1][colId - 1].height
            newCellId = `row${newRowId}-col${colId}`
            setCurrentCell([newRowId, colId])
            props.setSelectedCellId(newCellId)
          }
          props.setSelectedCellProps(newCellProps)
          context.setTemplate(newTemplate)
        }
      }
    }

    else if (e.key === "Enter") {
      e.preventDefault()
      // hmm
      // newCellProps.y -= 2 * window.scrollY
      // newCellProps.x -= 2 * window.scrollX
      props.selectedCellProps.y -= 2 * window.scrollY
      props.selectedCellProps.x -= 2 * window.scrollX
      setCurrentCell([rowId - 1, colId - 1])
      props.setSelectedCellId(newCellId)
      // props.setSelectedCellProps(newCellProps)
      setIsEditing(true)
    }

    else return

    props.setSelectedCellId(newCellId)
    props.setSelectedCellProps(newCellProps)
    console.log(newCellId, newCellProps)
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress);
  })

  return (
    <div>
      {isActive ?
        isEditing ?
          <ActiveCell
            parentKey={props.selectedCellId}
            size={{ width: props.selectedCellProps.width, height: props.selectedCellProps.height }}
            position={{ x: props.selectedCellProps.x, y: props.selectedCellProps.y }}
            setIsEditing={setIsEditing}
            originalValue={currentCell ? props.template[currentCell[0]][currentCell[1]].content : null}
            setTempValue={context.setTempValue}
          />
          :
          <div>
            <Styled.SelectedCell
              ref={selectedCellRef}
              width={props.selectedCellProps.width + 15} // account for padding
              height={props.selectedCellProps.height}
              top={props.selectedCellProps.y}
              left={props.selectedCellProps.x}
            />
          </div>
        : null}
    </div>
  )
}  