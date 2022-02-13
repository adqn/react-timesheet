import React, { useState, useEffect } from 'react';
import { Row, Column, TableData } from '../Pages/Timeblock/types';
import { StatusAlert, StatusType } from './StatusAlert';
import * as Styled from '../Pages/Timeblock/Timeblock.styled';

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

export const ServerButtons = (props: {
  rows: Row[];
  cols: Column[];
  setData: (rows: Row[]) => void;
  setColumns: (columns: Column[]) => void;
}) => {
  const [tables, setTables] = useState<Array<TableData> | undefined>([])
  const [value, setValue] = useState<string | undefined>();
  const [inputVisibility, setInputVisibility] = useState("hidden");
  const [menuVisibility, setMenuVisibility] = useState("hidden");
  const [statusVisible, setStatusVisible] = useState(false);
  const [status, setStatus] = useState<StatusType>(StatusType.success);
  const [statusMessage, setStatusMessage] = useState<string>("");
  let toggleStatus: NodeJS.Timeout;

  const showStatus = (status: StatusType, message: string) => {
    setStatusMessage(message);
    setStatus(status);
    setStatusVisible(true);

    if (statusVisible) {
      clearTimeout(toggleStatus);
      toggleStatus = setTimeout(() => setStatusVisible(false), 3000);
    } else {
      toggleStatus = setTimeout(() => setStatusVisible(false), 3000);
    }
  }

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
        showStatus(StatusType.failure, "Failed to save table");
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
    await navigator.clipboard.writeText(ret.join("\n"))
      .then(() => showStatus(StatusType.success, "Copied to clipboard"));
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
              showStatus(StatusType.success, "Loaded table");
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
              .then(res => {
                setTables(new Array(res.length).fill(0).map((_, i) => res[i].template));
              })
              .catch(() => showStatus(StatusType.failure, "Couldn't fetch from server"));
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
      {statusVisible ? <StatusAlert
        visible={statusVisible}
        status={status}
        message={statusMessage}
      /> : null}
    </div>
  )
}
