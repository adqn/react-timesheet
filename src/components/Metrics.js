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

const BarChart = () => {
  const d3plot = React.createElement("d3plot")
  
  function drawChart() {
    const data = [3, 5, 10, 2, 15, 2, 4, 20, 9]
    const w = 600,
      h = 300

    const svg = d3
      .select("d3plot")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
    
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 70)
      .attr("y", (d, i) => h - 10 * d)
      .attr("width", 65)
      .attr("height", (d, i) => d * 10)
      .attr("fill", "green")

    svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text(d => d)
      .attr("x", (d, i) => i * 70)
      .attr("y", (d, i) => h - (10 * d) - 3)
  }

  useEffect(() => {
    drawChart()
  }, [])

  return d3plot
}

const Metrics = () => {
  useEffect(() => {
  })

  return (
    <div>
      Some Github commits:
      <GitStats />
      D3: <br />
      <BarChart />
    </div>
  )
}

export default Metrics