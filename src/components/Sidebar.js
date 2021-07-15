import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect
} from "react-router-dom";
import styled from 'styled-components'
import DailyView from './DailyView'
import Metrics from './Metrics'
import UserArea from './UserArea'

const ViewArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  margin: auto;
  margin-top: 10%;
  margin-left: 25%;
  background-color: white;
`

const routes = [
  {
    path: "/daily",
    exact: true,
    sidebar: () => <a>Daily overview</a>,
    main: () => <DailyView />
  },
  {
    path: "/projects",
    exact: true,
    sidebar: () => <a>Projects</a>,
    main: () => <div>The projects</div>
  },
  {
    path: "/metrics",
    exact: true,
    sidebar: () => <a>Metrics</a>,
    main: () => <Metrics />
  },
  {
    path: "/userarea",
    exact: true,
    sidebar: () => <a>User area</a>,
    main: () => <UserArea />
  }
]

const Sidebar = () => {
  return (
    <Router>
      <div className="Sidebar">
        <NavLink to="/daily" activeClassName="a active">Daily overview</NavLink>
        <NavLink to="/projects" activeClassName="a active">Projects</NavLink>
        <NavLink to="/metrics" activeClassName="a active">Metrics</NavLink>
        <NavLink to="/userarea" activeClassName="a active">User area</NavLink>

        <Switch>
          <Route 
            exact
            path="/"
            render={()=><Redirect to="/daily" />}
            />
        </Switch>

        <Switch>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
            />
          ))}
        </Switch>
      </div>

      <ViewArea>
        <Switch>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              children={<route.main />}
            />
          ))}
        </Switch>
      </ViewArea>
    </Router>
  )
}

export default Sidebar;