import React, { useState, useEffect } from 'react'
import * as d3 from 'd3'
import styled from 'styled-components'

const CollapseControl = styled.div`
  position: absolute;
  width: 100%;
  height: 32px;
  background: black;
  bottom: 0px;
`

export default function ResizeSidebar({ parentClass, setCollapsed, collapseDirection }) {
  const [parentCollapsed, setParentCollapsed] = useState(false)
  parentClass = d3.select('.' + parentClass)

  function handleResize() {
    const windowHeight = window.innerHeight;

    if (!parentCollapsed) {
      if (collapseDirection === "left") {
        parentClass
          .transition()
          .duration(800)
          .style("left", "-200px")
      }
      else if (collapseDirection === "top") {
        parentClass
          .style("height", windowHeight + "px")
          .transition()
          .duration(800)
          .style("height", "30px")
      }
      setParentCollapsed(true)
    } else {
      parentClass
        .transition()
        .duration(800)
        .style("height", windowHeight + "px")
        .end()
        .then(() => {
          parentClass.style("height", "100%")
          setCollapsed(true)
        })
      setParentCollapsed(false)
    }
  }

  return (
    <CollapseControl
      onClick={() => handleResize()}
    >
    </CollapseControl>
  )
}