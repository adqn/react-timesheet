import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import { makeServer } from './mirageServer'
import styled from 'styled-components'
import Sidebar from './components/Sidebar'
// import DailyView from './components/DailyView'
// import Metrics from './components/Metrics'
import './App.css';

// makeServer();

const ViewArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  margin: auto;
  margin-top: 10%;
  margin-left: 25%;
  background-color: white;
`

// Change to routes?
// const SidebarContent = [
//   {
//     id: 1,
//     title: "Daily overview",
//     route: "/daily",
//     content: <DailyView />,
//   },
//   {
//     id: 2,
//     title: "Projects",
//     route: "/projects",
//     content: "The projects",
//   },
//   {
//     id: 3,
//     title: "Metrics",
//     route: "/metrics",
//     content: <Metrics />,
//   }
// ]

const App = () => {
  // const [activeRoute, setActiveRoute] = useState(SidebarContent[0].route)
  // const [activeLink, setActiveLink] = useState(SidebarContent[0].title);
  // const [activeContent, setActiveContent] = useState(SidebarContent[0].content)

  return (
    <div className="App">
      {/* <Sidebar links={SidebarContent}
        activeRoute={activeRoute}
        activeLink={activeLink}
        setActiveRoute={setActiveRoute}
        setActiveLink={setActiveLink}
        setActiveContent={setActiveContent}
      /> */}
      <Sidebar />

      {/* <ViewArea> */}
        {/* Some default padding and niceness needs to accommodate non-table elements */}
        {/* {activeContent} */}
        {/* <Router>
          <Switch>
            <Route exact path="/daily">
              <DailyView />
            </Route>
            <Route exact path="/projects">
              The projects
            </Route>
            <Route exact path="/metrics">
              <Metrics />
            </Route>
          </Switch>
        </Router> */}
      {/* </ViewArea> */}
    </div>
  );
}

export default App;
