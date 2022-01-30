import { useCallback, useEffect, useMemo, useState } from "react"

import * as Styled from "./Timeblock.styled"

enum CellState {
  DEFAULT = "DEFAULT",
  SELECTED = "SELECTED",
  ACTIVE = "ACTIVE",
}

const ActiveCell = (props: {
  value: string
  setDefault: () => void
  setValue: (value: string) => void
}) => {
  const [value, setValue] = useState(props.value)
  const keyListener = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      props.setDefault()
      props.setValue(value)
    } else if (ev.key === "Tab") {
      props.setDefault()
      props.setValue(value)
    } else if (ev.key === "Escape") {
      props.setDefault()
    }
  }

  return (
    <Styled.EditCell
      autoFocus
      value={value}
      onKeyDown={keyListener}
      onFocus={(ev) => {
        const val = ev.target.value
        ev.target.value = ""
        ev.target.value = val
      }}
      onBlur={() => {
        props.setValue(value)
        props.setDefault()
      }}
      onChange={(ev) => setValue(ev.target.value)}
    />
  )
}

interface Selection {
  row: number
  column: number
}

type SetSelection = (selected: boolean) => void

const Cell = (props: { value: string; setValue: (value: string) => void, selection?: boolean, setSelection?: SetSelection}) => {
  const [oldvalue, setValue] = useState(props.value)
  const [cellState, setCellState] = useState(CellState.DEFAULT)

  const value = useMemo(() => props.value, [props])

  if (cellState === CellState.ACTIVE) {
    // TODO
    return (
      <ActiveCell
        value={value}
        setValue={(value: string) => {
          setValue(value)
          props.setValue(value)
          setCellState(CellState.SELECTED)
          if (!!props.setSelection) {
            props.setSelection(true)
          }
        }}
        setDefault={() => setCellState(CellState.DEFAULT)}
      />
    )
  } else {
    return (
      <Styled.Cell 
        selected={cellState === CellState.SELECTED}
        onClick={() => {
          setCellState(CellState.ACTIVE)
          if (!!props.setSelection) {
            props.setSelection(false)
          }
        }}
      >
        {value}
      </Styled.Cell>
    )  }
}

const ModifyTable = ({
  remove,
  type,
  action,
}: {
  remove?: true | undefined
  type: string
  action: () => void
}) => {
  return (
    <>
      <Styled.AddRemoveButton onClick={() => action()}>
        {remove ? "-" : "+"}
      </Styled.AddRemoveButton>
      <span style={{ paddingLeft: "10px" }}>
        {remove ? "Remove" : "New"} {type === "row" ? "row" : "column"}
      </span>
    </>
  )
}

interface Row {
  key: string
  selected: string
  time: string
  plan: string
  [revision: string]: string
}

const Table = (props: {}) => {
  const setDataAt = (rowIndex: number, dataIndex: string, value: string) => {
    const newData = [...data]
    newData[rowIndex][dataIndex] = value
    setData(newData.map((row) => {
      row[dataIndex] = value;
      return row;
    }))
  }

  const [selection, setSelection] = useState<Selection | undefined>()
  const isSelected = useCallback((rowIndex, colIndex) => {
    return selection?.row === rowIndex && selection?.column === colIndex
  }, [selection])

  const [columns, setColumns] = useState([
    {
      title: <Cell setValue={() => null} value={"Time"} />,
      dataIndex: "time",
      key: "date",
      render: (time: string, _: any, index: number) => (
        <Cell
          setValue={(value: string) => setDataAt(index, "time", value)}
          value={time}
          selection={isSelected(index, 0)}
          setSelection={(selected) => selected ? setSelection({row: index, column: 0}) : setSelection(undefined)}
        />
      ),
    },
    {
      title: <Cell setValue={() => null} value={"Activity"} />,
      dataIndex: "plan",
      key: "plan",
      render: (plan: string, _, index: number) => (
        <Cell
          setValue={(value: string) => setDataAt(index, "plan", value)}
          value={plan}
          selection={isSelected(index, 1)}
          setSelection={(selected) => selected ? setSelection({row: index, column: 1}) : setSelection(undefined)}
        />
      ),
    },
  ])

  const [data, setData] = useState<Array<Row>>([
    {
      key: "0",
      time: "0100",
      plan: "this timesheet",
      selected: "",
    },
    {
      key: "1",
      time: "0200",
      plan: "that timesheet",
      selected: "",
    },
  ])

  const addColumn = () => {
    const dataIndex = `revision${columns.length - 1}`
    setData(
      data.map((row) => ({
        ...row,
        [dataIndex]: "",
      }))
    )
    setColumns([
      ...columns,
      {
        title: (
          <Cell
            setValue={() => null}
            value={`Revision ${columns.length - 1}`}
          />
        ),
        dataIndex,
        key: dataIndex,
        render: (value: string, _, index) => (
          <Cell
            setValue={(value: string) => setDataAt(index, dataIndex, value)}
            value={value}
            selection={isSelected(index, columns.length - 1)}
            setSelection={(selected) => selected ? setSelection({row: index, column: columns.length - 1}) : setSelection(undefined)}
            />
        ),
      },
    ])
  }

  const addRow = () => {
    const key = "" + (Object.keys(data[0]).length - 1)
    const newRow = columns.reduce(
      (acc: Row, curr) => {
        acc[curr.dataIndex] = curr.dataIndex
        return acc
      },
      { key, time: "", plan: "", selected: "" }
    )
    setData([...data, newRow])
  }

  return (
    <div>
      <ModifyTable type={"column"} action={addColumn} />
      <ModifyTable type={"row"} action={addRow} />
      <br />
      <ModifyTable
        type={"column"}
        action={() => {
          if (columns.length > 2 && data.length > 1) {
            // This is before we remove column so it needs to be a minus 2
            const removeIndex = `revision${columns.length - 2}`
            setColumns(columns.slice(0, columns.length - 1))
            setData(
              data.map((row) => {
                delete row[removeIndex]
                return row
              })
            )
          }
        }}
        remove
      />
      <ModifyTable
        type={"row"}
        action={() => {
          if (data.length > 1) setData(data.slice(0, data.length - 1))
        }}
        remove
      />
      <Styled.NewTable columns={columns} dataSource={data} />
    </div>
  )
}

export function Timeblock() {
  return <Table />
}
