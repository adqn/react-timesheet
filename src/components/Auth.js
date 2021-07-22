import React, { useState } from 'react';

export default function Auth() {
  const [token, getToken] = (localStorage.getItem(`token`) || null)
  function getAuth() {
    
  }

  return (
    <div>
      <button
        text="Login"
        onClick={() => getAuth()}
      >
      login
      </button>
    </div>
  )
}