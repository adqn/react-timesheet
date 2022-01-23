import styled from 'styled-components'
import 'antd/dist/antd.css'

export const Cell = styled.div<{}>`
  padding: 0px;
  height: 100%;
  width: 100%;
  &:hover {
    cursor: default;
  }
`

export const EditCell = styled.textarea<{}>`
  &:hover {
    // cursor: default;
  }
`