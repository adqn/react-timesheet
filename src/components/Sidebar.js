import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect
} from "react-router-dom";
import '../App.css'
import styled from 'styled-components'
import * as d3 from 'd3'
import DailyView from '../Pages/DailyView'
import Metrics from '../Pages/Metrics'
import { UserArea } from '../Pages/UserArea'
import { Timeblock } from '../Pages/Timeblock'
import ResizeSidebar from '../components/elements/ResizeSidebar'
import { style } from 'd3';

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
    main: ({callbacks}) => <UserArea callbacks={callbacks} />
  },
  {
    path: "/timeblock",
    exact: true,
    sidebar: () => <a>Timeblock</a>,
    main: () => <Timeblock />
  },
]

const Sidebar = ({callbacks}) => {
  return (
    <Router>
      <div className="Sidebar">
        <NavLink to="/daily" activeClassName="a active">Daily overview</NavLink>
        <NavLink to="/projects" activeClassName="a active">Projects</NavLink>
        <NavLink to="/metrics" activeClassName="a active">Metrics</NavLink>
        <NavLink to="/userarea" activeClassName="a active">User area</NavLink>
        <NavLink to="/timeblock" activeClassName="a active">Timeblock</NavLink>

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

      <div className="ViewArea">
        <Switch>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              children={<route.main callbacks={callbacks} />}
            />
          ))}
        </Switch>
      </div>
    </Router>
  )
}

export default Sidebar;