import React, { useState, useEffect } from 'react';
import { findRenderedComponentWithType } from 'react-dom/test-utils';
import styled from 'styled-components'

if (!Array.prototype.last) {
  Array.prototype.last = function () {
    return this[this.length - 1]
  }
}

const InputField = styled.div`
  display: inline;
`

// Typescript would be useful here
const timeDropDown = (totalTime, timeUnit, setTime) => {
  timeUnit = timeUnit.toUpperCase()
  let timeDivisions = [];

  for (let i = 0; i < totalTime + 1; i++) {
    timeDivisions.push(i)
  }

  return (
    <InputField>
      <label for={timeUnit}>{timeUnit}: </label>
      <select
        name={timeUnit}
        id={timeUnit}
        onChange={e => setTime(e.target.value)}
      >
        {timeDivisions.map(num => {
          return <option value={num}>{num}</option>
        })}
      </select>
      {" "}
    </InputField>
  )
}

const projectsDropDown = (projects, setProjects) => 
  <InputField>
    <select
      name="projects"
      id="projects"
      onChange={e => setProjects(e.target.value)}
    >
      {projects.map(project => {
        return <option value={project.name}>{project.name}</option>
      })}
    </select>
    {" "}
  </InputField>

export default function UserArea() {
  const [projects, setProjects] = useState(null)
  const [minutes, setMinutes] = useState(0)
  const [hours, setHours] = useState(0)
  const dummyProjects = [{
    name: "Getting projects..."
  }]

  const getProjects = async () => {
    let res;
    const data = await fetch('/api/test')
    res = JSON.parse(data._bodyText).projects
    setProjects(res)
  }

  useEffect(() => {
    getProjects()
  })

  return (
    <div>
      {projects ? projectsDropDown(projects, setProjects) : projectsDropDown(dummyProjects, setProjects)}
      {timeDropDown(12, "h", setMinutes)}  
      {timeDropDown(60, "m", setHours)} 
    </div>
  )
}