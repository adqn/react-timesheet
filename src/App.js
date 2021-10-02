import React, { useState, useEffect } from 'react'
import { makeServer } from './mirageServer'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'
import Timer from './components/Timer'
import './App.css';

// makeServer();

const App = () => {
  const [timerActivated, setTimerActivated] = useState(false)
  const callbacks = {
    setTimerActivated,
  }

  return (
    <div className="App">
      {timerActivated ? <Timer /> : null}
      <Topbar />
      <Sidebar />
    </div>
  );
}

export default App;