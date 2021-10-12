import autosize from 'autosize'
import React, { useEffect, useState } from 'react'

import Modal from '../../../components/Modal'

import * as Styled from '../Timeblock.styled'
import { SpreadsheetContext } from '../utils'

interface ActiveCellProps {
  parentKey: string;
  size: { width: number, height: number };
  position: { x: number, y: number };
  visibility: string | undefined;
  originalValue: string;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}

export const ActiveCell = ({ parentKey, size, position, coords, visibility, originalValue, setIsEditing, setTempValue}: ActiveCellProps) => {
  const [value, setValue] = useState(originalValue)
  const editCellRef = React.createRef()
  const context = React.useContext(SpreadsheetContext)
  const rowId = parseInt(parentKey.split("-")[0].match(/\d+/)[0])
  const colId = parseInt(parentKey.split("-")[1].match(/\d+/)[0])
  const cellProps = {
    x: position.x + window.scrollX,
    y: position.y + window.scrollY,
    height: size.height,
    width: 165, // FIXME
  }
  let thisHeight

  function updateTemplate(template: Spreadsheet) {
    let temp = [...template]
    // if (value === "") thisHeight = 36
    temp[rowId - 1][colId - 1].content = value
    // temp[rowId - 1][colId - 1].height = thisHeight
    temp.map((row) => row.map((col, i) => temp[rowId - 1][i].height = cellProps.height))
    context.setTemplate(temp)
  }

  function lockValue() {
    updateTemplate(context.template)
    setIsEditing(false)
  }

  function getCursorPosition(e?: any) {
    editCellRef.current.setSelectionRange(
      editCellRef.current.value.length,
      editCellRef.current.value.length
    )
  }

  function handleChange(e: any) {
    setTempValue(e.target.value)
    setValue(e.target.value)
  }

  function keyListener(e: any) {
    if (e.key === "Enter") {
      if (rowId < context.template.length) {
        const newParentKey = `row${rowId + 1}-col${colId}`
        cellProps.y += size.height - 1
        cellProps.height = (context.template[rowId][colId - 1].height) 

        if (rowId > 1) {
          context.setSelectedCellId(newParentKey)
          context.setSelectedCellProps(cellProps)
        }
      }
      lockValue()
    }

    else if (e.key === "Escape") {
      setTempValue(originalValue)
      setIsEditing(false)
    }
  }

  useEffect(() => {
    context.setSelectedCellId(parentKey)
    context.setSelectedCellProps(cellProps)
    editCellRef.current.focus()
    autosize(editCellRef.current)
    // thisHeight = editCellRef.current.offsetHeight
    // editCellRef.current.addEventListener('autosize:resized', function () {
    //   // add 8 to height because text input thing
    //   thisHeight = this.offsetHeight 
    //   console.log(this.offsetHeight)
    // })

    window.onclick = (e: any) => {
      if (e.target.id === "modal") {
        lockValue()
      }
    }

    return () => {
      if (rowId > 1) context.setCellSelectionLayerActive(true)
    }
  }, [])

  return (
    <Modal background="none">
      <Styled.EditCell
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
    </Modal>
  )
}