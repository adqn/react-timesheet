import { TableProps } from "antd"
import { ColumnType } from "antd/lib/table"

export interface TableData {
  name: string;
  rows: Row[];
  cols: Column[];
}

interface SelectableColumns {
    time: string
    plan: string
    [revision: number]: string
}

export type editableKey = keyof SelectableColumns

interface MetaParameters {
    key: number
}

export interface Row extends SelectableColumns, MetaParameters {
}


export interface Column {
  dataIndex: editableKey;
  title: string;
}

export type TimeblockTableProps = TableProps<Row>
export interface TimeblockColumnType extends ColumnType<Row> {
    dataIndex: keyof SelectableColumns
}