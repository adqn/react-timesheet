import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  // border: 1px solid red;
`

const Row = styled.div`
  display: flex;
  // flex-direction: row;
  flex-wrap: nowrap;
  // align-content: center;
  justify-content: space-between;
  width: 100%;
  padding: 5px;
  margin-top: -1px;
  border: 1px solid lightgrey;
`

const RowHeader = styled(Row)`
  background: #E9E9E9;
`

const FirstItem = styled.div`
  flex: 1;
  // border: 1px solid black;
  // margin-left: -1px;
  padding: 5px;
`

const Item = styled(FirstItem)`
  text-align: right;
  margin-left: auto
`

const ItemDesc = styled(FirstItem)`
  flex-grow: 2;
  margin-left: 50px;
  margin-right: -50px;
  text-align: left;
  // border: 1px solid red;
`

const Entry = ({data}) =>
  data.map(row =>
    <Row key={row.id}>
      {/* <Item>{row.id}</Item> */}
      <FirstItem>{row.user}</FirstItem>
      <FirstItem>{row.project}</FirstItem>
      <ItemDesc>{row.description}</ItemDesc>
      {/* <Item>{row.progress}</Item> */}
      <Item>{row.hours}h {row.minutes}m</Item>
      <Item>{row.date}</Item>
    </Row>
  )

const DailyView = () => {
  const [loading, setLoading] = useState(true)
  const [testData, setTestData] = useState(null) // Cache this on load

  const getTestData = async () => {
    let timesheet_entries
    const test = await fetch('/api/test')
    timesheet_entries = JSON.parse(test._bodyText).daily2
    setTestData(timesheet_entries)
    setLoading(false)
  }

  useEffect(() => {
    getTestData()
  }, [])

  return (
    <Container>
      <RowHeader>Daily overview</RowHeader>
      {loading ? "Loading..." : <Entry data={testData} />}
    </Container>
  )

}

export default DailyView;