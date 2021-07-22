import React, { useState, useEffect } from 'react'
import { Octokit } from 'octokit'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 200px;
  border: 1px solid lightgrey;
  border-radius: 7px 7px 0px 0px;
  padding: 5px;
  //background: #F7F7F7;
`

const Section = styled.div`
  display: inline-block;
  margin-left: 5px;
  margin-right: 5px;
  // background: red;
`

const Column = styled.div`
  //display: inline;
  // flex: 1
  // flex-direction: column;
`

const Name = styled.div`
  // flex: 1;
  // display: block;
  font-size: 10pt;
`

const Repo = styled.div`
  display: inline-block;
  font-size: 10pt;
  vertical-align: top;
  padding-left: 40px;
  // background: grey;
`

const Desc = styled.div`
  display: block;
  font-size: 10pt;
  // color: lightgrey;
`

const CommitFrequency = styled.div`
  display: inline-block;
  width: 13px;
  height: 13px;
  margin-right: 4px;
  // border: 1px solid black;
  border-radius: 3px 3px 3px 3px;
  background: ${props => props.freqColor || "lightgrey"};
`

const Divider = styled.div`
  display: block;
  border: 1px solid #DBDBDB;
  border-top: 0px;
  border-left: 0px;
  border-right: 0px;
  padding: 2px;
  width: 90%;
  margin: auto;
`

const Spacer = styled.div`
  display: inline-block;
  height: 20px;
  width: 50px;
  // background: red;
`

// commit frequency color buckets
const colorBuckets = [
  '#ebedf0',
  '#9be9a8',
  '#40c463',
  '#30a14e',
  '#216e39',
]

export const GitStats = () => {
  const [loading, setLoading] = useState(true)
  const [commits, setCommits] = useState([])
  const [contributorActivity, setContributorActivity] = useState([])
  const availColors = colorBuckets.length
  const token = localStorage.getItem(`github_token`)
  const octokit = new Octokit({ auth: token })
  const owner = 'adqn',
    repo = 'react-timesheet'
  
  async function fetchData() {
    // const CommitsByWeek = await octokit.request('GET /repos/{owner}/{repo}/stats/commit_activity', {
    //   owner, repo
    // })

    const ContributorActivity = await octokit.request('GET /repos/{owner}/{repo}/stats/contributors', {
      owner, repo
    })

    // setCommits(CommitsByWeek)
    setContributorActivity(ContributorActivity.data)
    setLoading(false)
    console.log(ContributorActivity.data)
  }

  const mapData = () => 
    <div>
      {contributorActivity.map(data => {
        let commitColorTotal = Math.ceil(data.total / availColors)
        let commitColorLatestWeek = Math.ceil(data.weeks[data.weeks.length - 1].c/availColors)

        if (commitColorTotal > 4) commitColorTotal = 4;
        if (commitColorLatestWeek > 4) commitColorLatestWeek = 4;

        return (
          <div>
            <Name>{data.author.login}</Name>

            <div>
            <Repo>{repo}</Repo> 
              <Section>
                <CommitFrequency
                  freqColor={colorBuckets[commitColorTotal]} />
                {data.total} <Desc>in total </Desc>
              </Section>

              <Section>
                <CommitFrequency
                  freqColor={colorBuckets[commitColorLatestWeek]} />
                {data.weeks[data.weeks.length - 1].c} <Desc>this week</Desc>
              </Section>
            </div>

            <Divider />
          </div>
        )
      })}
    </div>

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <Container>
      {loading ? "Loading..." : mapData()}
    </Container>
    )
}