import { TableProps } from "antd"
import { ColumnType } from "antd/lib/table"

interface MetaParameters<N> {
    key: number
}

interface SelectableColumns {
    time: string
    plan: string
    [revision: number]: string
}

export type editableKey = keyof SelectableColumns | number

export interface Row extends SelectableColumns, MetaParameters<editableKey> {
}

export type TimeblockTableProps = TableProps<Row>
export interface TimeblockColumnType extends ColumnType<Row> {
    dataIndex: keyof SelectableColumns | number;
}