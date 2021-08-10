import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const ModalOverlay = styled.div`
  display: inline-block;
  position: absolute:
  z-index: 100;
  width: 100%;
  height: 100%;
  background: black;
  opacity: .7; 
`

export default function Modal() {
  return <ModalOverlay />
}