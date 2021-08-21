import React, { useState, useEffect } from 'react';
import { useStopwatch} from 'react-timer-hook'
import styled from 'styled-components'
import customSelect from '../components/elements/CustomSelect'
import "../App.css"

const UserBarFlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid grey;
  box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
`

const UserBarHeader = styled.div`
  // flex: 1;
  display: flex;
  flex-direction: row;
  height: 50px;
  border: none;
  border-bottom: 1px solid grey;
  background: lightgrey;
`

const UserBarInputHeader = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  border: none;
  border-bottom: 1px solid grey;
`

const UserBarInput = styled.input`
  width: 90%;
  line-height: 30px;
  margin-left: 10px; 
  padding-left: 10px;
  border: none;
  outline: none;
  caret-color: transparent;

  &:hover {
    margin-left: 9px;
    border: 1px solid grey;
  }

  &:focus {
    caret-color: black;
  }
`

const UserBarTimer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 50px;
  padding: 8px;
  border: none;
`

const UserBarInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 50px;
  padding: 8px;
  border: none;

  @media (max-width: 700px) {
    flex-direction: column;
    height: fit-content;
    align-items: start;
    justify-content: left;
  }
`

const UserBarInfoItem = styled.div<{ width?: string; minwidth?: string | undefined; justify?: string | undefined}>`
  display: flex;
  flex-direction: row;
  justify-content: ${props => props.justify || "none"};
  width: ${props => props.width};
  min-width: ${props => props.minwidth};
  // border: 1px solid;

  @media (max-width: 700px) {
    justify-content: left;
  }
`

const StopwatchButton = styled.button<{background: string}>`
  display: inline-block;
  height: 30px;
  color: white;
  text-align: center;
  padding: 7px;
  border: none;
  border-radius: 2px;
  background: ${props => props.background};
`

const ElapsedTime = styled.div`
  display: inline-block;
  padding-right: 10px;
  font-weight: 400;
  font-size: 1.2em;

  @media (max-width: 700px) {
    font-weight: 200;
    font-size: 1em;
  }
`

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

const Stopwatch = ({ setTotalTime }: { setTotalTime: (t:string) => void}) => {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({autoStart: false})

  return (
    <div>
      <ElapsedTime>
        {hours < 10 ? "0" + hours : hours}:
        {minutes < 10 ? "0" + minutes : minutes}:
        {seconds < 10 ? "0" + seconds : seconds}
      </ElapsedTime>
      <StopwatchButton
        background={isRunning ? "orange" : "#008CBA"}
        onClick={isRunning ? pause : start}
      >
        {isRunning ? "STOP" : "START"}
      </StopwatchButton>
      {/* <button onClick={pause}>Pause</button>
      <button onClick={() => reset()}>Reset</button> */}
    </div>
  )
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

const UserBar = ({current}: {current? : boolean | undefined}) => {
  const [totalTime, setTotalTime] = useState("00:00:00")

  return (
    <UserBarFlexContainer>
      {/* <UserBarHeader>
      </UserBarHeader> */}
      <UserBarInputHeader>
        <UserBarInput
          placeholder={"Current project"}
        />
      </UserBarInputHeader>
      <UserBarTimer>
        <UserBarInfoItem
          width={"35%"}
          justify={"center"}
        >
          Tags
        </UserBarInfoItem>
        <UserBarInfoItem
          width={"35%"}
          justify={"center"}
        >
          $
        </UserBarInfoItem>
        <UserBarInfoItem
          width={"25%"}
          minwidth={"130px"}
          justify={"right"}
        >
          <Stopwatch setTotalTime={setTotalTime} />
        </UserBarInfoItem>
      </UserBarTimer>
    </UserBarFlexContainer>
  )
}

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
    // callbacks.setTimerActivated(true)
  }, [])

  return (
    <div>
      <UserBar />
      <br />
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