import React from 'react'
import styled from 'styled-components'

const size = "4px"

const SettingsButtonContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 10px;
  // border: 1px solid;

  &:hover {
    cursor: pointer;
  }
`

const SettingsButtonTopCharacter = styled.div`
  position: absolute;
  width: ${size};
  height: ${size};
  margin-bottom: 19px;
  border: 1px solid grey;
  border-radius: 100%;
`

const SettingsButtonMiddleCharacter = styled.div`
  position: absolute;
  width: ${size};
  height: ${size};
  border: 1px solid grey;
  border-radius: 100%;
`

const SettingsButtonBottomCharacter = styled.div`
  position: absolute;
  width: ${size};
  height: ${size};
  margin-top: 17px;
  border: 1px solid grey;
  border-radius: 100%;
`

export default function SettingsButton() {
  return (
    <SettingsButtonContainer>
      <SettingsButtonTopCharacter />
      <SettingsButtonMiddleCharacter />
      <SettingsButtonBottomCharacter />
    </SettingsButtonContainer>
  )
}