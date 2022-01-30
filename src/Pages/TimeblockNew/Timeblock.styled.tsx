import styled from "styled-components";
import { Table, Input } from "antd";
import "antd/dist/antd.css";

import { TimeblockTableProps } from "./types";
import React from "react";

export const Cell = styled.div<{ selected?: boolean }>`
  padding: 16px;
  height: 100%;
  width: 100%;
  background: ${(props) =>
    props.selected ? "rgb(51, 204, 255, .25)" : "white"};
  border: ${(props) => (props.selected ? "solid 1px #0099ff" : "none")};
  &:hover {
    cursor: default;
  }
`;

export const EditCell = styled(Input)<{}>`
  width: 100%;
  height: 100%;
  word-wrap: break-word;
  word-break: break-all;
  &:hover {
    // cursor: default;
  }
`;

export const NewTable = styled<React.ComponentType<TimeblockTableProps>>(Table)`
  .ant-table-cell {
    padding: 0;
    width: 20%;
    min-height: 60px;
  }
`;

export const AddRemoveButton = styled.div`
  display: inline-block;
  height: fit-content;
  width: 20px;
  text-align: center;
  font: 1.5em bold;
  font-weight: 900;
  color: grey;
  padding-left: 5px;
  padding-right: 5px;
  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
  &:hover {
    background: #f4f4f4;
    cursor: pointer;
  }
`;