import React, { useState, useEffect } from 'react';
import styled from 'styled-components'
import customSelect from '../components/elements/CustomSelect'
import "../App.css"
import {
  SettingsButton,
  LittleBullet
} from '../components/styles/SomeWidgets'

import { useServerStopwatch } from '../hooks/ServerStopwatch';

const MutableUserBarFlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 99%;
  margin-top: 30px;
  margin-bottom: 20px;
  background: white;
  border: 1px solid grey;
  box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
`

const UserBarFlexContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 99%;
  margin-top: -180px;
  margin-bottom: 20px;
  background: white;
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

interface InputStyle {
  width: string;
  outline: string;
}

const UserBarInput = styled.input<InputStyle>`
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

const UserBarInfoItem = styled.div<{ width?: string; minwidth?: string | undefined; justify?: string | undefined, mediajustify?: string | undefined}>`
  display: flex;
  flex-direction: row;
  justify-content: ${props => props.justify || "none"};
  width: ${props => props.width};
  min-width: ${props => props.minwidth};
  // border: 1px solid;

  @media (max-width: 700px) {
    justify-content: ${props => props.mediajustify || "left"};
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

interface elementPosition {
  x: string;
  y: string
}

const ProjectMenuContainer = styled.div<{visibility: string, position: elementPosition}>`
  visibility: ${props => props.visibility};
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 200px;
  // height: 50px;
  margin-top: 12px;
  margin-left: -130px;
  border: none;
  border-radius: 3px;
  box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
  background: white;
`

const ProjectMenuInputField = styled.input`
  width: 80%; 
  line-height: 30px;
  margin-left: 10px; 
  padding-left: 10px;
  border: 1px solid grey;
  outline: none; 
`

const AddProjectButton = styled.div`
  position: relative;
  width: 100px;
  color: #008CBA;
  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;

  &:hover {
    cursor: pointer;
  }
`

interface Project {
  id: string,
  name: string,
  client: string,
  contributors: string[];
  tags: string[];
  tasks: ProjectTask[]
}

interface ProjectTask {
  id: string;
  date: string;
  start: string;
  end: string;
  duration: string;
  description: string;
}

type FIXME = any;

interface Me {
  projects: Project[];
  daily: FIXME;
  daily2: FIXME;
}

type Optional<T> = T | null;

interface Callbacks {
  [name: string]: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
}

const Stopwatch = ({ projectId, taskId, submitProjectData, setTotalTime }: { projectId: string, taskId: string, submitProjectData: () => void, setTotalTime: (t:string) => void}) => {
  const {
    currentTask,
    seconds,
    minutes,
    hours,
    isRunning,
    reset,
  } = useServerStopwatch({projectId: "1", taskId: "1"})

  function handleStop() {
    const totalTime = `${hours}:${minutes}:${seconds}`
    setTotalTime(totalTime)
    reset(undefined, false)
    submitProjectData()
  }

  function handleStart() {
    reset(undefined, true)
  }

  return (
    <div>
      <ElapsedTime>
        {hours ? hours < 10 ? "0" + hours : hours : "00"}:
        {minutes ? minutes < 10 ? "0" + minutes : minutes : "00"}:
        {seconds ? seconds < 10 ? "0" + seconds : seconds : "00"}
      </ElapsedTime>
      <StopwatchButton
        background={isRunning ? "orange" : "#008CBA"}
        onClick={isRunning ? handleStop : handleStart}
      >
        {isRunning ? "STOP" : "START"}
      </StopwatchButton>
    </div>
  )
}

const AddProject = ({ projects, setProjects }: {projects: Project[], setProjects: (p:Project[]) => void}) => {
  const [projectMenuActive, setProjectMenuActive] = useState(false)
  const [projectMenuPosition, setProjectMenuPosition] = useState<elementPosition>({x: "0px", y: "0px"})
  const thisRef = React.createRef()

  useEffect(() => {
    // window.onclick = (e: any) => {
    //   if (projectMenuActive) 
    //     if (e.target.className != "ProjectMenu") 
    //       setProjectMenuActive(false)
    // }
  })

  return (
    <div
      style={{ position: "relative", display: "inline-block"}}
    >
      <AddProjectButton
        ref={thisRef}
        onClick={() => projectMenuActive ? setProjectMenuActive(false) : setProjectMenuActive(true)}
      >
        + Project
      </AddProjectButton>
      {projectMenuActive ? <ProjectMenu projects={projects} projectMenuActive={projectMenuActive} /> : null}
    </div>
  )
}

const ProjectEntry = ({ project }: { project: Project }) =>
  <div>
    client: {project.client}
    <br />
      &bull; {project.name}
  </div>


const ProjectMenu = ({projects, projectMenuActive, setProjects}: {projects: Project[], projectMenuActive: boolean, setProjects: (p:Project[]) => void}) => {

  return (
    <ProjectMenuContainer
      className="ProjectMenu"
      visibility={projectMenuActive ? "visible" : "hidden"}
    >
      <UserBarInputHeader>
        <ProjectMenuInput
          projects={projects}
        />
      </UserBarInputHeader>
      {projects ? projects.map(project => <ProjectEntry project={project} />) : "No projects"}
    </ProjectMenuContainer>
  )
}

const ProjectMenuInput = ({ projects }: { projects: Project[] }) => {
  const [value, setValue] = useState("")
  const [foundProjects, setFoundProjects] = useState<Project[] | null>(null)

  function handleInput(e) {
    setValue(e.target.value)
    const results = projects.filter(project => project.name.toLowerCase().includes(value))
    if (results.length > 0) {
      setFoundProjects(results)
    }
  }

  return (
    <ProjectMenuInputField
      placeholder={"Find project or client"}
      value={value}
      onChange={e => handleInput(e)}
    />
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

const UserBar = ({ projects }: {projects: Project[] | null}) => {
  const [timerRunning, setTimerRunning] = useState(false)
  const [totalTime, setTotalTime] = useState("00:00:00")
  const [name, setName] = useState("")
  const [client, setClient] = useState("")
  const [contributors, setContributors] = useState([])
  const [tags, setTags] = useState("")
  const [tasks, setTasks] = useState<ProjectTask>()
  const [description, setDescription] = useState("")
  const [project, setProject] = useState<Project[]>([])

  const fetchMe = async (): Promise<Me> => {
    return (await fetch('/api/test')).json();
  }

  const submitProjectData = () => {
    const epoch = Date.now()

    const entry: Project = {
      name,
      client,
      contributors: [],
      tags: [],
      tasks: [],
    }

    const req = {
      method: 'POST',
      body: JSON.stringify(entry)
    }

    fetch('/api/newentry2', req)
  }
  
  return (
    <UserBarFlexContainer
      position={"fixed"}
    >
      {/* <UserBarHeader>
      </UserBarHeader> */}
      <UserBarInputHeader>
        <UserBarInput
          placeholder={"Current project"}
        />
        <AddProject
          projects={projects}
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
          <Stopwatch
            submitProjectData={submitProjectData} 
            setTotalTime={setTotalTime} />
        </UserBarInfoItem>
        <UserBarInfoItem
          // width={"25%"}
          minwidth={"30px"}
          justify={"right"}
          mediajustify={"center"}
        >
          <SettingsButton />
        </UserBarInfoItem>
      </UserBarTimer>
    </UserBarFlexContainer>
  )
}

const MutableUserBar = () => {
  return (
    <MutableUserBarFlexContainer>
      <UserBarHeader>

      </UserBarHeader>
    </MutableUserBarFlexContainer>
  )
}

export default function UserArea({callbacks}: {callbacks: Callbacks}) {
  const [submitting, setSubmitting] = useState(false)
  const [didSubmit, setDidSubmit] = useState(false)
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [project, setProject] = useState<string | null>(null)
  const [minutes, setMinutes] = useState(0)
  const [hours, setHours] = useState(0)
  const [description, setDescription] = useState('')

  const fetchMe = async (): Promise<Me> => {
    return (await fetch('/api/test')).json();
  }

  const getProjects = async () => {
    const data = await fetchMe();
    const res = data.projects
    setProjects(res)
  }

  useEffect(() => {
    getProjects()
    // callbacks.setTimerActivated(true)
  }, [])

  return (
    <div>
      <UserBar projects={projects} />

      <div
        style={{
          marginTop: "170px",
          // display: "flex",
          alignItems: "center"
        }}
      >
        {projects?.map(project => {
          return <MutableUserBar />
        })}
      </div>
      <br />
      {/* <br />
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
      {submitting ? <SubmitStatus didSubmit={didSubmit} /> : null} */}
    </div>
  )
}