import React from 'react';
import styled from'styled-components'

export enum StatusType {
  success = "green",
  failure = "red",
  working = "yellow"
}

const StatusContainer = styled.div <{
  background: StatusType;
  visibility: string;
}>`
  visibility: ${props => props.visibility};
  position: absolute;
  width: fit-content;
  height: 30px;
  top: -40px;
  padding: 5px;
  border-radius: 5px;
  color: white;
  background: ${props => props.background};
  z-index: 1;
`

export const StatusAlert = (props: {visible: boolean, status: StatusType}) => {
  const statusMessages = {
    [StatusType.success]: "Action completed successfully",
    [StatusType.failure]: "Action failed",
    [StatusType.working]: "Working..."
  }

  return (
    <StatusContainer
      visibility={props.visible ? "visible" : "hidden"}
      background={props.status}
    >
      {statusMessages[props.status]}
    </StatusContainer>
  )
}