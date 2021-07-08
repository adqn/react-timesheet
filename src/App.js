import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { makeServer } from './components/mirageServer'
import styled from 'styled-components'
import Sidebar from './components/Sidebar'
import DailyView from './components/DailyView'
import './App.css';

makeServer();

const ViewArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  margin: auto;
  margin-top: 10%;
  margin-left: 25%;
  border: 1px solid black;
  background-color: white;
`

const SidebarContent = [
  {
    id: 1,
    title: "Daily overview",
    content: <DailyView />,
  },
  {
    id: 2,
    title: "Projects",
    content: "The projects",
  },
  {
    id: 3,
    title: "Metrics",
    content: "The metrics",
  }
]

const showContent = (links, activeLink) => {
  const found = links.find(link => link.title === activeLink)
  if (found != undefined) return <div>{found.content}</div>
}

const App = () => {
  const [activeLink, setActiveLink] = useState(SidebarContent[0].title);
  const [activeContent, setActiveContent] = useState(SidebarContent[0].content)

  return (
    <div className="App">
      <Sidebar links={SidebarContent}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
        setActiveContent={setActiveContent}
      />
      <ViewArea>
        {activeContent}
      </ViewArea>
    </div>
  );
}

export default App;
