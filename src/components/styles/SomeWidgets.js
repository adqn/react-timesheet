import React from 'react'
import styled from 'styled-components'

const settingsCharSize = "4px"

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
  width: ${settingsCharSize};
  height: ${settingsCharSize};
  margin-bottom: 19px;
  border: 1px solid grey;
  border-radius: 100%;
`

const SettingsButtonMiddleCharacter = styled.div`
  position: absolute;
  width: ${settingsCharSize};
  height: ${settingsCharSize};
  border: 1px solid grey;
  border-radius: 100%;
`

const SettingsButtonBottomCharacter = styled.div`
  position: absolute;
  width: ${settingsCharSize};
  height: ${settingsCharSize};
  margin-top: 17px;
  border: 1px solid grey;
  border-radius: 100%;
`

const LittleBulletFlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  color: ${props => props.color || "black"};
  font-size: 15px;
  font-weight: 350;
`

const LittleBulletContainer = styled.div`
  width: 20px;
  height: 15px;
  // border: 1px solid;
`

// size should be 4px default
const LittleBulletElement = styled.div`
  position: relative;
  top: 45%;
  left: 30%;
  width: ${props => props.size};
  height: ${props => props.size};
  border: 1px solid ${props => props.color || "black"};
  background: ${props => props.color || "black"};
  border-radius: 100%;
`

export function SettingsButton() {
  return (
    <SettingsButtonContainer>
      <SettingsButtonTopCharacter />
      <SettingsButtonMiddleCharacter />
      <SettingsButtonBottomCharacter />
    </SettingsButtonContainer>
  )
}

export function LittleBullet(props) {
  return (
    <LittleBulletFlexContainer
      color={props.color}
    >
      <LittleBulletContainer>
        <LittleBulletElement
          size={props.size}
          color={props.color}
        />
      </LittleBulletContainer>
        {props.children}
    </LittleBulletFlexContainer>
  )
}