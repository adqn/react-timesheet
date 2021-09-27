import React from 'react'

import * as Styled from './Timeblock.styled'

const CONTEXT_TITLE = 'Timeblock'
export const SpreadsheetContext = React.createContext(CONTEXT_TITLE)

export interface Cell {
  id: string;
  width: string;
  content: string;
}

export type Spreadsheet = Array<Array<Cell>>

export const newRow = (template: Spreadsheet) => {
  let temp = [...template]
  let newId, colId
  let rowId = template.length + 1
  let newRow = []
  let colTotal = template[0].length

  for (let i = 0; i < colTotal; i++) {
    colId = i + 1
    newId = `row${rowId}-col${colId}`
    newRow.push({ id: newId, width: Styled.cellWidth, height: Styled.cellHeight, content: "" })
  }

  temp.push(newRow)
  return temp
}

export const newColumn = (template: Spreadsheet) => {
  let temp = [...template]
  let newId, rowId;
  let colId = template[0].length + 1
  let rowTotal = template.length

  for (let i = 0; i < rowTotal; i++) {
    rowId = i + 1
    newId = `row${rowId}-col${colId}`
    temp[i].push({ id: newId, width: Styled.cellWidth, content: "" })
  }

  return temp
}