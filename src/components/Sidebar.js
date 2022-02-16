import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect
} from "react-router-dom";
import '../App.css'
import { Timeblock } from '../Pages/Timeblock'

const routes = [
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
        <NavLink to="/timeblock" activeClassName="a active">Timeblock</NavLink>

        <Switch>
          <Route 
            exact
            path="/"
            render={()=><Redirect to="/timeblock" />}
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