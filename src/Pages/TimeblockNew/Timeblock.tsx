import { useState } from 'react';

import * as Styled from './Timeblock.styled'

enum CellState {
    DEFAULT = "DEFAULT",
    SELECTED = "SELECTED",
    ACTIVE = "ACTIVE",
}

const ActiveCell = (props: {value: string, setDefault: () => void, setValue: React.Dispatch<React.SetStateAction<string>>}) => {
    const [value, setValue] = useState(props.value);
    const keyListener = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === "Enter") {
            props.setDefault();
            props.setValue(value);
        } else if (ev.key === "Tab") {
            props.setDefault();
            props.setValue(value);
        } else if (ev.key === "Escape") {
            props.setDefault();
        }
    }

    return <Styled.EditCell
        autoFocus
        value={value}
        onKeyDown={keyListener}
        onFocus={(ev) => {
            const val = ev.target.value;
            ev.target.value = '';
            ev.target.value = val;
          }}
        onBlur={() => {
            props.setValue(value);
            props.setDefault();
        }}
        onChange={(ev) => setValue(ev.target.value)}
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

const ModifyColumn = ({ remove, addColumn }: { remove?: boolean | undefined, addColumn: () => void }) => {
    return (
        <Styled.AddRemoveButton
        onClick={() => addColumn()}
        >
        {remove ? "-" : "+"}
        </Styled.AddRemoveButton>
    )
}

const Table = (props: {}) => {
    const [columns, setColumns] = useState([
        { title: <Cell value={'Time'} />, dataIndex: 'time', key: 'date', render: (time: string) => <Cell value={time} /> },
        { title: <Cell value={'Activity'} />, dataIndex: 'plan', key: 'plan', render: (plan: string) => <Cell value={plan} /> }
    ]);
    
    const [data, setData] = useState<Array<{
        key: number
        time: string,
        plan: string,
    }>>([
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
    ]);
      
    const addColumn = () => {
        const dataIndex = `revision${columns.length - 1}`;
        setData(data.map((row) => ({
            ...row,
            [dataIndex]: "",
        })));
        setColumns([
            ...columns,
            {
                title: <Cell value={`Revision ${columns.length - 1}`} />,
                dataIndex,
                key: dataIndex,
                render: (value: string) => <Cell value={value} />
            }
        ])
    }

    return (
        <div>
            <Styled.NewTable
                columns={columns}
                dataSource={data}
            />
            <ModifyColumn addColumn={addColumn} />
        </div>
    )
}

export function Timeblock() {
    return <Table />
}