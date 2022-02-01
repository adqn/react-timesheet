import { useCallback, useEffect, useMemo, useState } from "react";

import { editableKey, Row, TimeblockColumnType } from "./types";

import * as Styled from "./Timeblock.styled";
import { usePrevious } from "./utils";

enum CellState {
  DEFAULT = "DEFAULT",
  ACTIVE = "ACTIVE",
}

const ActiveCell = (props: {
  value: string;
  setValue: (value: string) => void;
  onKeyDown?: (ev: React.KeyboardEvent<unknown>) => void;
}) => {
  const [value, setValue] = useState(props.value);
  const keyListener = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (ev.key === "Enter") {
      // TODO: check for shift here
      props.setValue(value);
    } else if (ev.key === "Tab") {
      props.setValue(value);
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
      }}
      onChange={(ev) => setValue(ev.target.value.trimStart())}
    />
  );
};

const Cell = (props: {
  value: string;
  setValue: (value: string) => void;
  selected?: boolean;
  editing?: boolean;
}) => {
  const value = useMemo(() => props.value, [props]);

  if (props.editing) {
    // TODO
    return (
      <ActiveCell
        value={value}
        setValue={(value: string) => {
          props.setValue(value);
        }}
      />
    );
  } else {
    return (
      <Styled.Cell
        selected={props.selected}
        onClick={() => {
          props.setValue(value);
        }}
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

const Table = () => {
  const [data, setData] = useState<Array<Row>>(
    new Array(48).fill(0).map((_, key) => ({
      key,
      time: (
        "" +
        (Math.floor(key / 2) * 100 +
          Math.round(60 * (key / 2 - Math.floor(key / 2))))
      ).padStart(4, "0"),
      plan: "",
    }))
  );
  const [selected, setSelected] = useState<
    [rowIndex: number, colIndex: editableKey][]
  >([]);
  const prevSelected = usePrevious(selected);
  const [currentSelected, setCurrentSelected] =
    useState<[rowIndex: number, colIndex: editableKey, editing: boolean]>();
  const lastSelected = usePrevious(currentSelected);

  const moveSelected = useCallback(
    (row: Row, colIndex: editableKey, editing: boolean) => {
      const newSelected: [number, editableKey][] = [];
      newSelected.push([row.key, colIndex]);
      setSelected(newSelected);
      setCurrentSelected([row.key, colIndex, editing]);
    },
    [selected]
  );

  const eventKeys = [
    "Enter",
    "Escape",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
  ]
  const keyListener = useCallback(
    (ev: KeyboardEvent) => {
      if (!currentSelected || !eventKeys.includes(ev.key)) {
        return;
      }
      if (ev.key === "Enter") {
        if (ev.shiftKey) {
          return;
        }
        const [rowIndex, dataIndex, editing] = currentSelected;
        const row =
          data[Math.min(rowIndex + (editing ? 1 : 0), data.length - 1)];
        moveSelected(row, dataIndex, !editing);
      }
      else if (ev.key == "ArrowUp") {
        const [rowIndex, dataIndex] = currentSelected;
        moveSelected(data[rowIndex > 0 ? rowIndex - 1 : rowIndex], dataIndex, false);
      }
      else if (ev.key == "ArrowDown") {
        const [rowIndex, dataIndex] = currentSelected;
        moveSelected(data[rowIndex < data.length - 1 ? rowIndex + 1 : rowIndex], dataIndex, false);
      }
      else if (ev.key == "ArrowLeft") {
        const [rowIndex, colIndex] = currentSelected;
        const currentColumn = columns.filter((col, i) => col.dataIndex === colIndex)[0]
        const currentColumnIndex = columns.indexOf(currentColumn)
        if (currentColumnIndex > 0) {
          moveSelected(data[rowIndex], columns[currentColumnIndex - 1].dataIndex, false);
        }
      }
      else if (ev.key == "ArrowRight") {
        const [rowIndex, colIndex] = currentSelected;
        const currentColumn = columns.filter((col, i) => col.dataIndex === colIndex)[0]
        const currentColumnIndex = columns.indexOf(currentColumn)
        if (currentColumnIndex < columns.length - 1) {
          moveSelected(data[rowIndex], columns[currentColumnIndex + 1].dataIndex, false);
        }
      }
      else {
        // This is when "Escape" is pressed
        // If currently editing, stop editing
        const [rowIndex, colIndex] = currentSelected;
        moveSelected(data[rowIndex], colIndex, false);
      }
    },
    [data, currentSelected]
  );

  useEffect(() => {
    window.addEventListener("keydown", keyListener);

    return () => {
      window.removeEventListener("keydown", keyListener);
    };
  }, [data, keyListener]);

  const setDataAt = useCallback(
    (rowIndex: number, dataIndex: editableKey, value: string) => {
      const newData: Row[] = [...data.map((row) => ({ ...row }))];
      const row = newData[rowIndex];
      row[dataIndex] = value;
      setData(newData);
    },
    [data]
  );

  const isEditing = (
    row: Row,
    dataIndex: editableKey,
    [rowIndex, columnIndex, editing]: [number, editableKey, boolean]
  ) => {
    return row.key === rowIndex && columnIndex === dataIndex && editing;
  };

  const createTimeblockColumn: (
    dataIndex: editableKey,
    title: string
  ) => TimeblockColumnType = useCallback(
    (dataIndex, title) => {
      const [rowIndex, columnIndex, editing] = currentSelected || [];
      return {
        title: <Cell setValue={() => null} value={title} />,
        dataIndex,
        key: dataIndex,
        render: (value: string, row, index: number) => (
          <div key={row.key} onClick={() => moveSelected(row, dataIndex, true)}>
            <Cell
              key={row.key}
              setValue={(value: string) => setDataAt(index, dataIndex, value)}
              value={value}
              selected={selected.some(
                ([r, c]) => row.key === r && dataIndex === c
              )}
              editing={
                row.key === rowIndex && dataIndex === columnIndex && !!editing
              }
            />
          </div>
        ),
        shouldCellUpdate: (row, prevRow) => {
          return !!(
            row[dataIndex] !== prevRow[dataIndex] ||
            selected.some(([r, c]) => (row.key === r && dataIndex) === c) !==
              prevSelected?.some(
                ([r, c]) => (row.key === r && dataIndex) === c
              ) ||
            (currentSelected &&
              lastSelected &&
              isEditing(row, dataIndex, currentSelected) !==
                isEditing(row, dataIndex, lastSelected))
          );
        },
      };
    },
    [data, selected, prevSelected, currentSelected, lastSelected]
  );

  const [columns, setColumns] = useState<
    { dataIndex: editableKey; title: string }[]
  >([
    { dataIndex: "time", title: "Time" },
    { dataIndex: "plan", title: "Activity" },
  ]);

  const displayColumns: TimeblockColumnType[] = useMemo(() => {
    return columns.map((c) => createTimeblockColumn(c.dataIndex, c.title));
  }, [data, columns, selected, prevSelected]);

  const addColumn = () => {
    const dataIndex = columns.length - 1;
    setData(
      data.map((row) => ({
        ...row,
        [dataIndex]: "",
      }))
    );
    setColumns([...columns, { dataIndex, title: `Revision ${dataIndex}` }]);
  };

  const addRow = () => {
    const key = data.length;
    const newRow = columns.reduce(
      (acc: Row, curr) => {
        acc[curr.dataIndex] = "" + curr.dataIndex;
        return acc;
      },
      { key, time: "", plan: "" }
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
      <Styled.NewTable
        columns={displayColumns}
        dataSource={data}
        rowKey={"key"}
        pagination={false}
      />
    </div>
  );
};

export function Timeblock() {
  return <Table />;
}
