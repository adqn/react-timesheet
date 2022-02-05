import styled from "styled-components";
import { Table, Input, Menu } from "antd";
import "antd/dist/antd.css";

import { TimeblockTableProps } from "./types";
import React from "react";

export const Cell = styled.div<{ selected?: boolean }>`
  padding: 16px;
  height: 100%;
  width: 100%;
  background: ${(props) => props.selected ? "rgb(51, 204, 255, .25)" : "white"};
  border: ${(props) => props.selected ? "solid 1px #0099ff" : "none"};
  &:hover {
    cursor: default;
  }
`;

export const EditCell = styled(Input.TextArea)<{}>`
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
  width: 25px;
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

export const DefaultButton = styled.div`
  border: 1px solid lightgrey;
  height: 30px;
  width: fit-content;
  padding: 2px;
  padding-left: 5px;
  padding-right: 5px;
  margin-left: 5px;
  margin-right: 5px;
  &:hover {
    cursor: pointer;
  }
  &:active {
    background: #f2f2f2;
  }
`

export const InputField = styled(Input)`
  width: 200px;
`

export const DefaultMenu = styled(Menu)`
  width: 200px;
`

export const MenuItem = styled(Menu.Item)`
`