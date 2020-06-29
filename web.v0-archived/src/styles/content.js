import styled from 'styled-components'

const StyledContentTitle = styled.div`
  order: 1;

  display: flex;
  flex-direction: column;

  .title {
    padding: 20px 25px;
    padding-bottom: 0;
    border: 0;
    outline: none;
    resize: none;
    font-family: 'Mali';
    font-size: 2.5em;
    font-weight: 700;
    line-height: 1.5em;
    color: rgba(0, 0, 0, 0.84);

    &::placeholder {
      color: #c0c0c0;
    }
  }
`

const StyledContentBody = styled.div`
  order: 2;

  display: flex;
  flex-direction: column;

  .content {
    flex: 1;
    padding: 20px 25px;
    padding-top: 15px;
    font-family: 'Mali';
    font-size: 1.25em;
    line-height: 1.5em;
    color: rgba(0, 0, 0, 0.84);
  }
`

export { StyledContentTitle, StyledContentBody }
