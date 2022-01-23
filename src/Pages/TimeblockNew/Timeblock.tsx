import { Table } from 'antd';
import { useState } from 'react';

import * as Styled from './Timeblock.styled'

enum CellState {
    DEFAULT = "DEFAULT",
    SELECTED = "SELECTED",
    ACTIVE = "ACTIVE",
}

const ActiveCell = (props: {value: string, setDefault: () => void, setValue: React.Dispatch<React.SetStateAction<string>>}) => {
    const keyListener = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (ev.key === "Enter") {
            props.setDefault();
        } else if (ev.key === "Tab") {
            props.setDefault();
        } else if (ev.key === "Escape") {
            props.setDefault();
        }
    }

    return <Styled.EditCell
        autoFocus
        value={props.value}
        onKeyDown={keyListener}
        onFocus={(ev) => {
            const val = ev.target.value;
            ev.target.value = '';
            ev.target.value = val;
          }}
        onBlur={() => props.setDefault()}
    />
}

const Cell = (props: {value: string}) => {
    const [value, setValue] = useState(props.value)
    const [cellState, setCellState] = useState(CellState.DEFAULT)

    if (cellState === CellState.DEFAULT) {
        return <Styled.Cell onClick={() => setCellState(CellState.ACTIVE)}>{value}</Styled.Cell>
    } else if (cellState === CellState.SELECTED) {
        // TODO
        return <Styled.Cell>{value}</Styled.Cell>
    } else if (cellState === CellState.ACTIVE) {
        // TODO
        return <ActiveCell
          value={value}
          setValue={setValue}
          setDefault={() => setCellState(CellState.DEFAULT)}
        />
    } else {
        throw "Unrecognized state"
    }
}
  
  const columns = [
    { title: 'Time', dataIndex: 'time', key: 'date', render: (time: string) => <Cell value={time} /> },
    { title: 'Activity', dataIndex: 'plan', key: 'plan', render: (plan: string) => <Cell value={plan} /> }
  ]
  
  const data = [
    {
        key: 0,
        time: '0100',
        plan: 'this timesheet'
      },
      {
        key: 1,
        time: '0200',
        plan: 'that timesheet'
      }
    ]
  
  export function Timeblock() {
    return (
      <div>
        <Table
          columns={columns}
          dataSource={data}
        />
      </div>
    )
  }