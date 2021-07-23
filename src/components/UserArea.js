import React, { useState, useEffect } from 'react';
import { findRenderedComponentWithType } from 'react-dom/test-utils';
import styled from 'styled-components'
import customSelect from './elements/CustomSelect'
import "../App.css"

if (!Array.prototype.last) {
  Array.prototype.last = function () {
    return this[this.length - 1]
  }
}

const Select = styled.select`
  // display: none;
  border: 1px solid black;
`

const InputField = styled.div`
  display: inline;
`

const TextInput = styled.textarea`
  display: block;
  border: 1px solid black;
  width: 300px;
  height: 150px
`

const timeDropDown = (totalTime, timeUnit, setTime, parentTimeProp) => {
  timeUnit = timeUnit.toUpperCase()
  let timeDivisions = [];

  for (let i = 0; i < totalTime + 1; i++) {
    timeDivisions.push(i)
  }

  return (
    <InputField>
    {/* <div class="custom-select"> */}
      <label for={timeUnit}>{timeUnit}: </label>
      <Select
        name={timeUnit}
        id={timeUnit}
        value={parentTimeProp}
        onChange={e => setTime(e.target.value)}
      >
        {timeDivisions.map(num => {
          return <option value={num}>{num}</option>
        })}
      </Select>
    {/* </div> */}
      {" "}
    </InputField>
  )
}

const projectsDropDown = (projects, setProject) =>
  <InputField>
    {/* <div class="custom-select"> */}
      <Select
        name="projects"
        id="projects"
        onChange={e => setProject(e.target.value)}
      >
        {projects.map(project => {
          return <option value={project.name}>{project.name}</option>
        })}
      </Select>
    {/* </div> */}
    {" "}
  </InputField>

export default function UserArea() {
  const [projects, setProjects] = useState(null)
  const [project, setProject] = useState('')
  const [minutes, setMinutes] = useState(0)
  const [hours, setHours] = useState(0)
  const [description, setDescription] = useState('')
  const dummyProjects = [{
    name: "Getting projects..."
  }]

  const getProjects = async () => {
    let res;
    const data = await fetch('/api/test')
    res = JSON.parse(data._bodyText).projects
    setProjects(res)
    setProject(res[0].name)
  }

  const addEntry = () => {
    const entry = {
      project,
      description,
      hours,
      date: "2021-27-16",
      minutes
    }

    const req = {
      method: 'POST',
      body: JSON.stringify(entry)
    }

    fetch('/api/newentry', req)
      .then(() => {
        setProject(projects[0])
        setHours(0)
        setMinutes(0)
        setDescription('')
      })
  }

  useEffect(() => {
    getProjects()
    customSelect();
  }, [])

  return (
    <div>
      {projects ?
        projectsDropDown(projects, setProject) :
        projectsDropDown(dummyProjects, setProject)}
      {timeDropDown(12, "h", setHours, hours)}
      {timeDropDown(60, "m", setMinutes, minutes)}
      <br />
      Description/additional information:
      <TextInput
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={() => addEntry()}>Add entry</button>
    </div>
  )
}