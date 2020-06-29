import styled from 'styled-components'

const StyledLogin = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
`

const StyledGoogleButton = styled.div`
  display: flex;
  align-items: center;

  width: 220px;
  height: 50px;
  background-color: #4285f4;
  padding: 1px;
  border-radius: 2px;

  &:hover {
    cursor: pointer;
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 2px;
  }
  div {
    flex-grow: 1;
    display: flex;
    justify-content: center;
  }
  span {
    color: #ffffff;
    font-family: Roboto;
    font-weight: 500;
  }
`

export { StyledLogin, StyledGoogleButton }
