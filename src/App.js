import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { makeServer } from './components/mirageServer'
import styled from 'styled-components'
import Sidebar from './components/Sidebar'
import './App.css';

const apiTest = "http://localhost:5001/api/testdata"

const ViewArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  margin: auto;
  margin-top: 15%;
  margin-left: 25%;
  border: 1px solid black;
  background-color: white;
`

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  padding: 5px;
`

const Child = styled.div`
  border: 1px solid black;
  margin-left: -1px;
  padding: 5px;
`

const populateTimeSheet = (json) => {
  // map json emp data to flexbox children
}

const SidebarLinks = [
  "Daily overview",
  "Projects",
  "Metrics"
]

const SidebarContent = [
  {
    title: "Daily overview",
    content: "The overview"
  },
  {
    title: "Projects",
    content: "The projects"
  },
  {
    title: "Metrics",
    content: "The metrics"
  }
]

const showContent = (links, activeLink) => {
  const found = links.find(link => link.title === activeLink)
  if (found != undefined) return <div>{found.content}</div>
}

const Entry = props =>
  props.data.map(row => 
    <Container>
      <Child>{row.id}</Child>
      <Child>{row.data.user}</Child>
      <Child>{row.data.entry.task}</Child>
      <Child>{row.data.entry.progress}</Child>
      <Child>{row.ts}</Child>
    </Container>
  )

const App = () => {
  const [testData, setTestData] = useState(null);
  const [activeLink, setActiveLink] = useState(SidebarContent[0].title);

  const getTestData = async () => {
    fetch(apiTest)
    .then(res => res.json())
    .then(res => {
      setTestData(res)
    })
    makeServer();
    const test = await fetch('/api/test');
    console.log(test);
  
  }

  useEffect(() => {
    getTestData();
  }, []);

  return (
    <div className="App">
      <Sidebar links={SidebarContent}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
      />

      <ViewArea>
        {showContent(SidebarContent, activeLink)}
        {/* {testData ? <Entry data={testData} /> : "Loading..."} */}
      </ViewArea>
    </div>
  );
}

export default App;
