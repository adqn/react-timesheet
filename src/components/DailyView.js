import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  padding: 5px;
`

const Child = styled.div`
  border: 1px solid black;
  margin-left: -1px;
  padding: 5px;
`

const Entry = props =>
  props.data.map(row => 
    <Container key={row.id}>
      {/* <Child>{row.id}</Child> */}
      <Child>{row.user}</Child>
      <Child>{row.project}</Child>
      <Child>{row.progress}</Child>
      <Child>{row.date}</Child>
    </Container>
  )

const DailyView = () => {
  const [loading, setLoading] = useState(true)
  const [testData, setTestData] = useState(null)

  const getTestData = async () => {
    let timesheet_entries
    const test = await fetch('/api/test')
    timesheet_entries = JSON.parse(test._bodyText).daily
    setTestData(timesheet_entries)
    setLoading(false)
  }

  useEffect(() => {
    getTestData()
  }, [])

  return (
    <div>
      {loading ? "Loading..." : <Entry data={testData} />}
    </div>
  )

}

export default DailyView;