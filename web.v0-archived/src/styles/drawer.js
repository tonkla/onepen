import styled from 'styled-components'

const BaseListItem = styled.li`
  list-style-type: none;
  padding: 10px;
  border-bottom: 1px solid #efefef;
  &.first {
    border-top: 1px solid #efefef;
  }

  display: flex;
  align-items: center;
  position: relative;

  .menuWrapper {
    position: absolute;
    top: 0;
    right: 10px;
    height: 100%;
    flex-grow: 1;
    display: flex;
    align-items: center;
  }

  .menuButton {
    width: 25px;
    height: 25px;
    background-color: #cddc39;
    border-radius: 50%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  label {
    padding-left: 5px;
    user-select: none;
    cursor: pointer;
    font-family: 'Mali';
    font-weight: 600;
  }

  &.active {
    background-color: #e6ee9c;
  }

  &:hover {
    cursor: pointer;
    background-color: #f0f4c3;
  }
`

const BaseMenu = styled.ul`
  position: absolute;
  top: 20px;
  right: 0;
  z-index: 1;
  padding: 5px 0;
  border: 1px solid #efefef;
  border-radius: 3px;
  background-color: white;

  li {
    list-style-type: none;
    padding: 5px 15px;
    font-size: 0.9em;

    &:hover {
      cursor: pointer;
      background-color: #f0f4c3;
    }
  }
`

const StyledProfile = styled.div`
  order: 1;
  height: 80px;
  position: relative;

  display: flex;
  justify-content: center;
`

const StyledProfileMenu = styled(BaseMenu)`
  top: 60px;
  right: 50px;
  width: 120px;
`

const StyledNotebookList = styled.div`
  order: 2;
  height: 100%;

  display: flex;
  flex-direction: column;

  h2 {
    text-align: center;
  }
`

const StyledNotebookItem = styled(BaseListItem)``

const StyledNotebookMenu = styled(BaseMenu)`
  width: 150px;
`

const StyledNoteList = styled.div`
  display: flex;
  flex-direction: column;

  h2 {
    padding-top: 20px;
    text-align: center;
  }
`

const StyledNoteItem = styled(BaseListItem)``

const StyledNoteMenu = styled(StyledNotebookMenu)`
  width: 150px;
`

const StyledAvatar = styled.img`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin: 5px;
  padding: 3px;

  &:hover {
    cursor: pointer;
    background-color: #f0f4c3;
  }
`

const StyledAddNotebookButton = styled.div`
  align-self: center;

  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
  padding: 10px 0;
  width: 190px;
  height: 25px;
  border-radius: 25px;
  background-color: #cddc39;
  user-select: none;

  label {
    margin-left: 5px;
    font-weight: 600;
    text-transform: uppercase;
    &:hover {
      cursor: pointer;
    }
  }

  &:hover {
    cursor: pointer;
    background-color: #e6ee9c;
  }
`

const StyledAddNoteButton = styled(StyledAddNotebookButton)`
  width: 150px;
`

const StyledDrawerButton = styled.div`
  z-index: 10;
  position: absolute;
  right: -20px;
  top: 500px;
  width: 50px;
  height: 50px;
  background-color: #cddc39;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;

  &.close {
    justify-content: flex-end;
    right: -22px;
  }

  &:hover {
    cursor: pointer;
    background-color: #e6ee9c;
  }
`

export {
  StyledProfile,
  StyledProfileMenu,
  StyledAvatar,
  StyledNotebookList,
  StyledNotebookItem,
  StyledNotebookMenu,
  StyledNoteList,
  StyledNoteItem,
  StyledNoteMenu,
  StyledAddNotebookButton,
  StyledAddNoteButton,
  StyledDrawerButton,
}
