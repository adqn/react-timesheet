import React, { useState, useEffect } from 'react'
import { Octokit } from 'octokit';
import Plot from 'react-plotly.js'
import * as d3 from 'd3'
import styled from 'styled-components'
import { GitStats } from './GitStats'

// const token = localStorage.getItem(`token`);
// const octokit = new Octokit({auth: token});

// octokit.rest.users.getAuthenticated().then((response) => {
//   console.log(response);
// });


// scale factor is arbitrary but 10 seems good for h = 300px
// so maybe standard scaling something like h/30 or h/25?
// not quite - need a general formula
const coordNorm = (h, y, scale=false) => {
  if (scale) return h - (y * scale)
  else return h - (y * (h/30))
}

const BarChart = () => {
  const d3plot = React.createElement("d3plot")
  const plotInfo = React.createElement("plotInfo")
  
  function drawChart() {
    const data = [3, 5, 10, 2, 15, 2, 4, 20, 9]
    const w = 600,
      h = 300

    const svg = d3
      .select("d3plot")
      .append("svg")
      .style("border", "1px solid black")
      .attr("width", w)
      .attr("height", h)
    
    
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 70)
      .attr("y", (d, i) => coordNorm(h, d)) // rect height within container (but then why second height??)
      .attr("width", 65)
      .attr("height", (d, i) => d * 10)
      .attr("fill", "green")
    
    svg.selectAll("rect")
      .on("mouseover", function () {
        d3.select(this)
          .style("fill", "orange")
      })
      .on("mouseout", function () {
        d3.select(this)
          .style("fill", "green")
      })

    // svg.selectAll("text")
    //   .data(data)
    //   .enter()
    //   .append("text")
    //   .text(d => d)
    //   .attr("x", (d, i) => i * 70)
    //   .attr("y", (d, i) => h - (10 * d) - 3)
  }

  useEffect(() => {
    drawChart()
  }, [])

  return d3plot
}

const D3test = () => {
  const d3test = React.createElement("d3test")
  const data = [1, 2, 3]
  let expanded = false;

  function drawTest() {
    d3.select("d3test")
      // .data(data)
      .html("<div>What</div>")
      .style("width", "100px")
      .style("border", "1px solid black")
      .style("text-align", "center")
      .style("display", "inline-block")
      .style("opacity", "0")
      .on("mousedown", function () {
        if (!expanded) {
          expanded = !expanded
          d3.select(this)
            .transition()
            .duration(1000)
            .style("width", "500px")
        } else {
          expanded = !expanded
          d3.select(this)
            .transition()
            .duration(1000)
            .style("width", "100px")
        }
      })

    d3.select("d3test")
      .data(["some data", "more data yo"])
      .append("div")
      .style("display", "block")
      .style("margin-left", "2px")
      .text(d => d)

    d3.select("d3test")
      .transition()
      .duration(2000)
      .style("opacity", "1")
  }

  useEffect(() => drawTest())

  return d3test
}

const Metrics = () => {
  useEffect(() => {
  })

  return (
    <div>
      <GitStats />
      <D3test />
      <br />
      <BarChart />
    </div>
  )
}

export default Metrics