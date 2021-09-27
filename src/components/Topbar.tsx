import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import * as d3 from 'd3'

const TopbarContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  height: 50px;
  background: white;
  box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
  z-index: 2;
`

const TempMenuIndicator = styled.h1`
  position: relative;
  margin-left: 10px;
  color: black;
  -webkit-text-fill-color: white;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;

  &:hover {
    cursor: pointer;
  }
`

export default function Topbar() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  function collapseSidebar() {
    const sidebarElem = d3.select(".Sidebar")
    sidebarElem
      .transition()
      .duration(300)
      .style("left", "-160px")
    setSidebarCollapsed(true)
  }

  function expandSidebar() {
    const sidebarElem = d3.select(".Sidebar")
    sidebarElem
      .transition()
      .duration(300)
      .style("left", "0px")
    setSidebarCollapsed(false)
  }

  useEffect(() => {
    window.onclick = (e: any) => {
      if (!sidebarCollapsed) 
        if (e.target.className != "Sidebar" || e.target.tagName.toLowerCase() === 'a')
          collapseSidebar() 
    }
  })

  return (
    <TopbarContainer>
      <TempMenuIndicator
        onClick={sidebarCollapsed ? () => expandSidebar() : () => collapseSidebar()}
      >
        {sidebarCollapsed ? ">" : "<"}
      </TempMenuIndicator>
    </TopbarContainer>
  )
}