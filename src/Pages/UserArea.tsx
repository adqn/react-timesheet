import React, { useState, useEffect } from 'react';
// import { findRenderedComponentWithType } from 'react-dom/test-utils';
import styled from 'styled-components'
import customSelect from '../components/elements/CustomSelect'
import "../App.css"

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

interface Project {
  name: string,
  contributors: string[]
}

interface Callbacks {
  [name: string]: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
}

const timeDropDown = (totalTime: number, timeUnit: string, setTime: (t:number) => void, parentTimeProp: number) => {
  timeUnit = timeUnit.toUpperCase()
  let timeDivisions = [];

  for (let i = 0; i < totalTime + 1; i++) {
    timeDivisions.push(i)
  }

  return (
    <InputField>
    {/* <div class="custom-select"> */}
      <label htmlFor={timeUnit}>{timeUnit}: </label>
      <Select
        name={timeUnit}
        id={timeUnit}
        value={parentTimeProp}
        onChange={e => setTime(parseInt(e.target.value))}
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

const projectsDropDown = (projects: Project[], setProject: (s:string) => void) =>
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

const SubmitStatus = ({ didSubmit }: { didSubmit: boolean }) =>
  didSubmit ? <div>Entry submitted!</div> : <div>Submitting...</div>

type FIXME = any;

interface Me {
  projects: Project[];
  daily: FIXME;
  daily2: FIXME;
}

type Optional<T> = T | null;

export default function UserArea({callbacks}: {callbacks: Callbacks}) {
  const [submitting, setSubmitting] = useState(false)
  const [didSubmit, setDidSubmit] = useState(false)
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [project, setProject] = useState<string | null>(null)
  const [minutes, setMinutes] = useState(0)
  const [hours, setHours] = useState(0)
  const [description, setDescription] = useState('')

  const dummyProjects = [{
    name: "Getting projects...",
    contributors: []
  }]

  const fetchMe = async (): Promise<Me> => {
    return (await fetch('/api/test')).json();
  }

  const getProjects = async () => {
    const data = await fetchMe();
    const res = data.projects
    setProjects(res)
    setProject(res[0].name)

  }

  const addEntry = () => {
    const epoch = Date.now()

    const entry = {
      project,
      description,
      hours,
      date: epoch,
      minutes
    }

    const req = {
      method: 'POST',
      body: JSON.stringify(entry)
    }

    setSubmitting(true)
    fetch('/api/newentry', req)
      .then(() => {
        setProject(projects?.[0].name ?? null)
        setHours(0)
        setMinutes(0)
        setDescription('')
        setDidSubmit(true)
      })
  }

  useEffect(() => {
    getProjects()
    customSelect()
    callbacks.setTimerActivated(true)
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
      {submitting ? <SubmitStatus didSubmit={didSubmit} /> : null}
    </div>
  )
}