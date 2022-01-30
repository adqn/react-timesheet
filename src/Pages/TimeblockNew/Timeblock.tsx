import { useCallback, useEffect, useMemo, useState } from "react";

import { editableKey, Row, TimeblockColumnType } from "./types";

import * as Styled from "./Timeblock.styled";

enum CellState {
  DEFAULT = "DEFAULT",
  ACTIVE = "ACTIVE",
}

const ActiveCell = (props: {
  value: string;
  setDefault: () => void;
  setValue: (value: string) => void;
  onKeyDown?: (ev: React.KeyboardEvent<unknown>) => void;
}) => {
  const [value, setValue] = useState(props.value);
  const keyListener = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (ev.key === "Enter") {
      props.setDefault();
      props.setValue(value);
    } else if (ev.key === "Tab") {
      props.setDefault();
      props.setValue(value);
    } else if (ev.key === "Escape") {
      props.setDefault();
    }

    if (props.onKeyDown) {
      props.onKeyDown(ev);
    }
  };

  return (
    <Styled.EditCell
      autoFocus
      value={value}
      onKeyDown={keyListener}
      onFocus={(ev) => {
        const val = ev.target.value;
        ev.target.value = "";
        ev.target.value = val;
      }}
      onBlur={() => {
        props.setValue(value);
        props.setDefault();
      }}
      onChange={(ev) => setValue(ev.target.value)}
    />
  );
};

const Cell = (props: {
  value: string;
  setValue: (value: string) => void;
  selected?: boolean;
  onKeyDown?: (ev: React.KeyboardEvent<unknown>) => void;
}) => {
  const [cellState, setCellState] = useState(CellState.DEFAULT);
  const value = useMemo(() => props.value, [props]);

  if (cellState === CellState.ACTIVE) {
    // TODO
    return (
      <ActiveCell
        value={value}
        setValue={(value: string) => {
          props.setValue(value);
          setCellState(CellState.DEFAULT);
        }}
        setDefault={() => setCellState(CellState.DEFAULT)}
        onKeyDown={(ev) => props.onKeyDown && props.onKeyDown(ev)}
      />
    );
  } else {
    return (
      <Styled.Cell
        selected={props.selected}
        onClick={() => {
          setCellState(CellState.ACTIVE);
          props.setValue(value);
        }}
        tabIndex={1}
        onKeyUp={(ev) => props.onKeyDown && props.onKeyDown(ev)}
      >
        {value}
      </Styled.Cell>
    );
  }
};

const ModifyTable = ({
  remove,
  type,
  action,
}: {
  remove?: true | undefined;
  type: string;
  action: () => void;
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
  );
};

const Table = (props: {}) => {
  const [data, setData] = useState<Array<Row>>([
    {
      key: 0,
      time: "0100",
      plan: "this timesheet",
      selected: [],
    },
    {
      key: 1,
      time: "0200",
      plan: "that timesheet",
      selected: [],
    },
  ]);
  const [lastSelected, setLastSelected] = useState<[number, editableKey]>()

  const setSelected = (row: Row, colIndex: editableKey) => {
    row.selected.push(colIndex);
    setLastSelected([row.key, colIndex]);
  }

  const keyListener = useCallback((ev: KeyboardEvent) => {
    if (!lastSelected || !["Enter"].includes(ev.key)) {
      return;
    }
    const newData: Row[] = [...data.map((row) => ({ ...row, selected: [] }))];
    if (ev.key === "Enter") {
      const row = newData[Math.min(lastSelected[0] + 1, newData.length - 1)];
      row.selected.push(lastSelected[1]);
    }
    setData(newData);
  }, [data]);


  useEffect(() => {
    window.addEventListener('keydown', keyListener);

    return () => {
      window.removeEventListener('keydown', keyListener);
    };
  }, [keyListener])

  const setDataAt = (
    rowIndex: number,
    dataIndex: editableKey,
    value: string
  ) => {
    const newData: Row[] = [...data.map((row) => ({ ...row, selected: [] }))];
    const row = newData[rowIndex];
    row[dataIndex] = value;
    setSelected(row, dataIndex)
    setData(newData);
  };

  const createTimeblockColumn: (
    dataIndex: editableKey,
    title: string
  ) => TimeblockColumnType = (dataIndex, title) => {
    return {
      title: <Cell setValue={() => null} value={title} />,
      dataIndex,
      key: dataIndex,
      render: (value: string, row, index: number) => (
        <Cell
          key={row.key}
          setValue={(value: string) => setDataAt(index, dataIndex, value)}
          value={value}
          selected={row.selected.includes(dataIndex)}
          onKeyDown={(ev) => console.log(ev)}
        />
      ),
      shouldCellUpdate: (row, prevRow) => {
        return (
          row[dataIndex] !== prevRow[dataIndex] ||
          row.selected.includes(dataIndex) !==
            prevRow.selected.includes(dataIndex)
        );
      },
    };
  };

  const [columns, setColumns] = useState<TimeblockColumnType[]>([
    createTimeblockColumn("time", "Time"),
    createTimeblockColumn("plan", "Activity"),
  ]);

  const addColumn = () => {
    const dataIndex = columns.length - 1;
    setData(
      data.map((row) => ({
        ...row,
        [dataIndex]: "",
      }))
    );
    setColumns([
      ...columns,
      createTimeblockColumn(dataIndex, `Revision ${dataIndex}`),
    ]);
  };

  const addRow = () => {
    const key = data.length;
    const newRow = columns.reduce(
      (acc: Row, curr) => {
        acc[curr.dataIndex] = "" + curr.dataIndex;
        return acc;
      },
      { key, time: "", plan: "", selected: [] }
    );
    setData([...data, newRow]);
  };

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
            const removeIndex = columns.length - 2;
            setColumns(columns.slice(0, columns.length - 1));
            setData(
              data.map((row) => {
                delete row[removeIndex];
                return row;
              })
            );
          }
        }}
        remove
      />
      <ModifyTable
        type={"row"}
        action={() => {
          if (data.length > 1) setData(data.slice(0, data.length - 1));
        }}
        remove
      />
      <Styled.NewTable columns={columns} dataSource={data} rowKey={"key"} />
    </div>
  );
};

export function Timeblock() {
  return <Table />;
}
