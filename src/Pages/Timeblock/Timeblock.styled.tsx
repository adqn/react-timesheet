import styled, { css } from 'styled-components'

export const cellWidth: number = 150 
export const cellHeight: number = 36
export const headerHeight: number = 32

export const ModalDialog = styled.div`
  position: absolute;
  top: 25%;
  left: 40%;
  // height: 300px;
  // width: 300px;
  // height: fit-content;
  // width: fit-content
  border-radius: 7px;
  background: white;
`

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  // flex-flow: column wrap;
  padding-left: 6px;
  // min-width: 50%;
  // width: fit-content;
  // height: fit-content;
  // border: 1px solid black;
`

export const ControlContainer = styled.div`
  display: flex;
  width: fit-content;
  height: 100%;
  // border: 1px solid;
`

interface CellStyles {
  width: number;
  omitLeftBorder: boolean;
  omitRightBorder: boolean;
}

export const Cell = styled.div<CellStyles>`
  flex: 1;
  flex-grow: 1;
  // flex-shrink: 0;
  line-height: 20px;
  font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 14px;
  width: ${props => props.width + "px"};
  // min-width: 150px;
  // max-width: 200px;
  min-height: 20px;
  min-width: 100px;
  padding: 7px;
  // padding-left: 10px;
  // padding-right: 10px;
  margin-left: -1px;
  border: 1px solid lightgrey;
  border-left: ${props => props.omitLeftBorder ? "none" : "1px solid lightgrey"};
  border-right: ${props => props.omitRightBorder ? "none" : "1px solid lightgrey"};
  overflow-wrap: anywhere;
  user-select: none; 
  -webkit-user-select: none; 
  -khtml-user-select: none; 
  -moz-user-select: none; 
  -ms-user-select: none; 
  &:hover {
    cursor: default;
  }
`

export const HeaderCell = styled.div<CellStyles>`
  flex: 1;
  flex-grow: 1;
  line-height: 30px;
  font-size: .9em;
  font-weight: 100;
  text-align: left;
  padding-left: 10px;
  color: grey;
  height: 32px;
  // width: 150px;
  width: ${props => props.width + "px"};
  // min-width: fit-content;
  min-width: 100px;
  margin-left: -1px;
  border: solid 1px lightgrey;
  border-left: ${props => props.omitLeftBorder ? "none" : "1px solid lightgrey"};
  border-right: ${props => props.omitRightBorder ? "none" : "1px solid lightgrey"};
  user-select: none; 
  -webkit-user-select: none; 
  -khtml-user-select: none; 
  -moz-user-select: none; 
  -ms-user-select: none; 
  &:hover {
    cursor: default;
    background: #F1F1F1;
  }
`

// Crazy offsets that I'm not sure will work on every device???
export const SelectedCell = styled.div`
  position: absolute;
  top: ${props => props.top + "px"};
  left: ${props => props.left + "px"};
  height: ${props => props.height - 2 + "px"};
  width: ${props => props.width - 1 + "px"};
  // width: ${props => props.width + "px"};
  border: solid 1px #0099ff;
  background: rgb(51, 204, 255, .25);
  // opacity: .3;
  z-index: 1;
  pointer-events: none;
`

export const Row = styled.div`
  display: flex;
  // width: fit-content;
  // min-width: 420px;
  // width: 100%;
  min-height: 30px;
  margin-left: -1px;
  margin-top: -1px;
  // border: 1px solid;
`

export const AddRemoveButton = styled.div`
  display: inline-block;
  height: fit-content;
  width: 20px;
  text-align: center;
  font: 1.5em bold;
  font-weight: 900;
  color: grey;
  padding-left: 5px;
  padding-right: 5px;
  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
  &:hover {
    background: #F4F4F4;
    cursor: pointer;
  }
`
const trackH = "0.2em";
const thumbD = "1.5em";

const thumb = css`
  box-sizing: border-box;
  border: 1px;
  width: ${thumbD};
  height: ${thumbD};
  background: #2EAADC;
`;

export const ColumnResizeContainer = styled.div`
  position: absolute;
  left: ${props => props.left + "px"}
`

export const ColumnResizeBar = styled.input`
  visibility: visible;
  // border: 1px solid black;
  width: 5px;
  // height: 34px;
  // margin-top: -1px;
  // margin-left: -12px;
  z-index: 1;
  &,
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
  }

  &:focus {
    outline: none;
  }

  margin: 0;
  padding: 0;
  height: ${thumbD};
  background: transparent;
  font: 1em/1 arial, sans-serif;


  &::-webkit-slider-thumb {
    ${thumb};
  }

  &::-moz-range-thumb {
    ${thumb};
  }

  &::-ms-thumb {
    margin-top: 0;
    ${thumb};
  }

  &::-ms-tooltip {
    display: none;
  }

  &::-moz-focus-outer {
    border: 0;
  } 
`

// export const cellSelectedOverlay = styled.div`
//   // visibility: hidden;
//   position: absolute;
//   width: ${props => props.width}
//   height: ${props => props.height}
//   border: 2px solid lightblue;
// `

export const CellLayer = styled.div`
  display: inline-block;
  width: 100%;
  height: 100%;
  // border: 1px solid lightblue;
  border: none;
  // margin-left: -1px;
  // margin-top: -1px; 
  background: white;
  -webkit-appearance: none;
  -moz-appearance: none;
`

interface EditCellStyles {
  visibility: string;
  left: string;
  top: string;
  width: string;
  minheight: string;
  height: string;
}

export const EditCell = styled.textarea<EditCellStyles>`
  visibility: ${props => props.visibility};
  position: absolute;
  left: ${props => props.left};
  top: ${props => props.top};
  font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 14px;
  // font-weight: 60;
  line-height: 20px;
  width: ${props => props.width};
  min-height: ${props => props.minheight};
  height: ${props => props.height};
  padding: 4px;
  white-space: pre-wrap;
  word-break: break-word;
  // margin-top: 2px;
  // margin-left: 2px;
  box-sizing: border-box;
  // border: solid 1px grey;
  border: none;
  border-radius: 3px;
  box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
  background: white;
  overflow: hidden;
  outline: none;
  resize: none;
`
