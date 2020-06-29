import styled from 'styled-components'

const StyledContainer = styled.div`
  display: flex;
  height: 100%;
`

const StyledDrawer = styled.div`
  order: 1;
  height: 100%;

  display: flex;
  position: relative;

  .wrapper {
    display: flex;
  }

  &.close {
    width: 1px;
  }
`

const StyledPane1 = styled.div`
  order: 1;
  height: 100%;
  width: 220px;
  border-right: 1px solid #efefef;

  display: flex;
  flex-direction: column;
  justify-content: center;
`

const StyledPane2 = styled.div`
  order: 2;
  width: 280px;
  height: 100%;
  border-right: 1px solid #efefef;
`

const StyledContent = styled.div`
  order: 2;
  flex-grow: 1;
  height: 100%;

  display: flex;
  flex-direction: column;

  &.fullscreen {
    padding: 0 100px;
  }
`

export { StyledContainer, StyledDrawer, StyledPane1, StyledPane2, StyledContent }
