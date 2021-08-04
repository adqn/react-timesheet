import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route, Link, BrowserRouter } from "react-router-dom";
import { makeServer } from './mirageServer'
import styled from 'styled-components'
import Sidebar from './components/Sidebar'
import Timer from './components/elements/Timer'
import Auth from './components/Auth'
import './App.css';

makeServer();

const App = () => {
  const [timerActivated, setTimerActivated] = useState(false)
  const callbacks = {
    setTimerActivated,
  }

  return (
    <div className="App">
      {timerActivated ? <Timer /> : null}
      <Sidebar callbacks={callbacks} />
    </div>
  );
}

export default App;