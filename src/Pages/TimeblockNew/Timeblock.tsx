import { useCallback, useEffect, useMemo, useState } from "react";
import { editableKey, Row, Column, TimeblockColumnType } from "./types";
import * as Styled from "./Timeblock.styled";
import Modal from '../../components/Modal'
import { StatusAlert, StatusType } from '../../components/StatusAlert'
import { usePrevious } from "./utils";

enum CellState {
  DEFAULT = "DEFAULT",
  ACTIVE = "ACTIVE",
}

interface TableData {
  name: string;
  rows: Row[];
  cols: Column[];
}

const SaveTableInput = (props: {
  rows: Row[];
  cols: Column[];
  exportTable: (
    rows: Row[],
    cols: Column[],
    name?: string | "undefined"
  ) => void
  setInputVisibility: (visibility: string) => void;
}) => {
  const [value, setValue] = useState<string | undefined>();

  const toggleVisibility = (ev: any) => {
    if (ev.target.id != "SaveTableInput") {
      props.setInputVisibility("hidden");
    }
  }

  // useEffect(() => {
  //   window.addEventListener("click", toggleVisibility)
  //   return () => window.removeEventListener("click", toggleVisibility)
  // }, [])

  return (
    <Styled.InputField
      id="SaveTableInput"
      style={{
        position: 'absolute',
        top: '37px',
        right: '0px',
        marginRight: '5px',
        zIndex: 1
      }}
      autoFocus
      placeholder={"Enter table name"}
      onChange={(ev) => setValue(ev.target.value)}
      onKeyDown={(ev) => {
        if (ev.key !== "Enter") return
        props.exportTable(props.rows, props.cols, value);
        props.setInputVisibility("hidden")
      }}
    />
  )
}

const ServerButtons = (props: {
  rows: Row[];
  cols: Column[];
  setData: (rows: Row[]) => void;
  setColumns: (columns: Column[]) => void;
}) => {
  const [tables, setTables] = useState<Array<TableData> | undefined>([])
  const [value, setValue] = useState<string | undefined>();
  const [inputVisibility, setInputVisibility] = useState("hidden");
  const [menuVisibility, setMenuVisibility] = useState("hidden");
  const [statusVisible, setStatusVisible] = useState(true);
  const [status, setStatus] = useState<StatusType>(StatusType.success);
  const exportTable = (
    rows: Row[],
    cols: Column[],
    name: string = "untitled") => {
    const req = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        rows: props.rows,
        cols: props.cols
      })
    }
    fetch('http://localhost:5001/api/savetemplate', req)
      .then((res) => console.log('Table saved')) 
      .catch((err) => {
        console.log(err);
        setStatus(StatusType.failure);
        setStatusVisible(true);
      });
  }

  const getTables = async () => {
    return (await fetch('http://localhost:5001/api/templates')).json()
  }

  const copyAsMarkdown = async () => {
    const ret: string[] = [];
    
    ret.push(`|${props.cols.map((c) => c.title).join("|")}|`);
    ret.push(`|${props.cols.map((_, col) => col === 0 ? ":-:" : "-").join("|")}|`)
    props.rows.forEach((_row, index) => {
      const row = props.cols.map((col) => _row[col.dataIndex]);

      ret.push(`|${row.join("|")}|`);
    })
    await navigator.clipboard.writeText(ret.join("\n"));
    console.log("Copied to clipboard");
  };

  const LoadTableMenu = () => 
    <Styled.DefaultMenu
      style={{
        visibility: `${menuVisibility === "hidden" ? "hidden" : "visible"}`,
        position: 'absolute',
        top: '37px',
        right: '0px',
        marginRight: '5px',
        zIndex: 1
      }}
    >
      {tables?.map((table, i) => {
        return (
          <Styled.MenuItem
            key={i}
            onClick={() => {
              props.setData(table.rows);
              props.setColumns(table.cols);
              setMenuVisibility("hidden");
            }}
          >{table.name}</Styled.MenuItem>
        )
      })}
    </Styled.DefaultMenu>

  return (
    <div
      style={{
        display: "inline-block",
        position: "absolute",
        right: "0px"
      }}>
      <Styled.DefaultButton
        id="SaveTableButton"
        style={{ display: "inline-block" }}
        onClick={copyAsMarkdown}
      >
        Copy as markdown
      </Styled.DefaultButton>
      <Styled.DefaultButton
        id="SaveTableButton"
        style={{ display: "inline-block" }}
        onClick={() => {
          inputVisibility === "visible" ? setInputVisibility("hidden") : setInputVisibility("visible")
        }}
      >
        Save table
      </Styled.DefaultButton>
      <Styled.DefaultButton
        style={{display: "inline-block"}}
        onClick={() => {
          if (menuVisibility === "visible") {
            setMenuVisibility("hidden")
          }
          else {
            getTables()
              .then(res => setTables(new Array(res.length).fill(0).map((_, i) => res[i].template)))
            setMenuVisibility("visible")
          }
        }}
      >
        Load table
      </Styled.DefaultButton>
      {inputVisibility === "visible" ?
        <SaveTableInput
          rows={props.rows}
          cols={props.cols}
          exportTable={exportTable}
          setInputVisibility={setInputVisibility}
        /> : null}
      {menuVisibility === "visible" ? <LoadTableMenu /> : null}
      <StatusAlert visible={statusVisible} status={status} />
    </div>
  )
}

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
      <span style={{ paddingLeft: "10px" }}>
        <Styled.AddRemoveButton
          onClick={() => action()}>
          {remove ? "-" : "+"}
        </Styled.AddRemoveButton>
        {remove ? "Remove" : "New"} {type === "row" ? "row" : "column"}
      </span>
    </>
  );
};

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

const Table = () => {
  const [data, setData] = useState<Array<Row>>(
    new Array(4).fill(0).map((_, key) => ({
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
      const newSelected: [rowIndex: number, colIndex: editableKey][] = [];
      newSelected.push([row.key, colIndex]);
      setSelected(newSelected);
      setCurrentSelected([row.key, colIndex, editing]);
    },
    [selected]
  );

  const eventKeys = [
    "Enter",
    "Escape",
    "Tab",
    "Control",
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
      const [rowIndex, dataIndex, editing] = currentSelected;
      if (ev.key === "Enter") {
        if (ev.shiftKey) {
          return;
        }
        const row =
          data[Math.min(rowIndex + (editing ? 1 : 0), data.length - 1)];
        moveSelected(row, dataIndex, !editing);
      }
      else if (ev.key === "Tab") {
        ev.preventDefault();
        const currentColumn = columns.filter((col, i) => col.dataIndex === dataIndex)[0]
        const currentColumnIndex = columns.indexOf(currentColumn)
        if (currentColumnIndex < columns.length - 1) {
          moveSelected(data[rowIndex], columns[currentColumnIndex + 1].dataIndex, false);
        } else {
          // Having issues with setState being asynchronous
          // addColumn();
          // moveSelected(data[rowIndex], columns[currentColumnIndex + 1].dataIndex, false);
        }
      }
      else if (ev.key === "Escape") {
        // This is when "Escape" is pressed
        // If currently editing, stop editing
        const [rowIndex, colIndex] = currentSelected;
        moveSelected(data[rowIndex], colIndex, false);
      }
      else {
        if (!editing) {
          if (ev.key === "ArrowUp") {
            moveSelected(data[rowIndex > 0 ? rowIndex - 1 : rowIndex], dataIndex, false);
          }
          else if (ev.key === "ArrowDown") {
            moveSelected(data[rowIndex < data.length - 1 ? rowIndex + 1 : rowIndex], dataIndex, false);
          }
          else if (ev.key === "ArrowLeft") {
            const currentColumn = columns.filter((col, i) => col.dataIndex === dataIndex)[0]
            const currentColumnIndex = columns.indexOf(currentColumn)
            if (currentColumnIndex > 0) {
              moveSelected(data[rowIndex], columns[currentColumnIndex - 1].dataIndex, false);
            }
          }
          else if (ev.key === "ArrowRight") {
            const currentColumn = columns.filter((col, i) => col.dataIndex === dataIndex)[0]
            const currentColumnIndex = columns.indexOf(currentColumn)
            if (currentColumnIndex < columns.length - 1) {
              moveSelected(data[rowIndex], columns[currentColumnIndex + 1].dataIndex, false);
            }
          }
        }
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

  const [columns, setColumns] = useState<Column[]>([
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
      {/*UI stuff*/}
      <div
        style={{
          display: 'inline-block',
          marginBottom: "10px"
        }}>
        <div>
          <ModifyTable type={"row"} action={addRow} />
          <ModifyTable type={"column"} action={addColumn} />
        </div>
        <div>
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
          <ServerButtons
            rows={data}
            cols={columns}
            setData={setData}
            setColumns={setColumns}
          />
        </div>
      </div>
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
