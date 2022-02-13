import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components'

export enum StatusType {
  success = "green",
  failure = "red",
  working = "yellow"
}

const StatusContainer = styled.div <{
  background: StatusType;
  visible: boolean;
}>`
  // visibility: hidden;
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0);
  width: fit-content;
  height: 30px;
  bottom: 50px;
  padding: 5px;
  border-radius: 5px;
  color: white;
  background: ${props => props.background};
  opacity: 0;
  z-index: 2;
  user-select: none;

  ${props => props.visible && css`
    // visibility: visible;
    transition: opacity 0.3s;
    opacity: 1;
  `};
  ${props => !props.visible && css`
    transition: opacity 0.3s;
    opacity: 0;
    // visibility: hidden;
  `}
`;

export const StatusAlert = (props: {
  visible: boolean,
  status: StatusType,
  message: string
}) => {
  return (
    <StatusContainer
      visible={props.visible}
      background={props.status}
    >
      {props.message}
    </StatusContainer>
  )
}