import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route, Link, BrowserRouter } from "react-router-dom";
import { makeServer } from './mirageServer'
import styled from 'styled-components'
import Sidebar from './components/Sidebar'
import Auth from './components/Auth'
import './App.css';

makeServer();

const App = () => {
  // const token = localStorage.getItem(`github_token`) || null
  // if (!token) return 

  return (
    <div className="App">
      <Sidebar />
    </div>
  );
}

export default App;