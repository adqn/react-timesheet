import React, { useState, useEffect } from 'react'
import { Octokit } from 'octokit'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 200px;
  border: 1px solid black;
`

export const GitStats = () => {
  const [loading, setLoading] = useState(true);
  const [commits, setCommits] = useState([]);
  const token = localStorage.getItem(`token`)
  const octokit = new Octokit({ auth: token });
  const owner = 'adqn',
    repo = 'react-timesheet',
    perPage = 5;
  
  async function fetchData() {
    const CommitsByWeek = await octokit.request('GET /repos/{owner}/{repo}/stats/commit_activity', {
      owner, repo
    });

    setCommits(CommitsByWeek);
    setLoading(false)
    console.log(CommitsByWeek.data)
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <Container>
      
    </Container>
    )
}