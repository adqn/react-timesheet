import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const ModalOverlay = styled.div`
  visibility: ${props => props.visibility};
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: black;
  background-color: rgba(0,0,0,0.4);
`

export default function Modal(props) {
  return <ModalOverlay
    id="modal"
    visibility={props.visibility}>{props.children}</ModalOverlay>
}