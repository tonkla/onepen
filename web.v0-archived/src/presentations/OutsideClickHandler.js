import React from 'react'
import PropTypes from 'prop-types'

import { addEventListener } from 'consolidated-events'

const DISPLAY = {
  BLOCK: 'block',
  FLEX: 'flex',
  INLINE_BLOCK: 'inline-block',
}

const propTypes = {
  children: PropTypes.node.isRequired,
  onOutsideClick: PropTypes.func.isRequired,
  useCapture: PropTypes.bool,
  display: PropTypes.oneOf(Object.values(DISPLAY)),
  style: PropTypes.object,
}

const defaultProps = {
  // `useCapture` is set to true by default so that a `stopPropagation` in the
  // children will not prevent all outside click handlers from firing - maja
  useCapture: true,
  display: DISPLAY.BLOCK,
}

class OutsideClickHandler extends React.Component {
  componentDidMount() {
    this.addDownEventListeners(this.props.useCapture)
  }

  componentWillUnmount() {
    this.removeEventListeners()
  }

  // Use mousedown/mouseup or pointerdown/pointerup to enforce that clicks remain
  // outside the root's descendant tree, even when dragged. This should also get
  // triggered on touch devices.
  onMouseDown = e => {
    this.downHandler(e, 'removeMouseUp', 'mouseup', this.onMouseUp)
  }

  onPointerDown = e => {
    this.downHandler(e, 'removePointerUp', 'pointerup', this.onPointerUp)
  }

  // Use mousedown/mouseup or pointerdown/pointerup to enforce that clicks remain
  // outside the root's descendant tree, even when dragged. This should also get
  // triggered on touch devices.
  onMouseUp = e => {
    this.upHandler(e, 'removeMouseUp')
  }

  onPointerUp = e => {
    this.upHandler(e, 'removePointerUp')
  }

  setChildNodeRef = ref => {
    this.childNode = ref
  }

  downHandler = (e, removeUpHandlerName, eventName, callback) => {
    const isDescendantOfRoot = this.childNode && this.childNode.contains(e.target)
    if (!isDescendantOfRoot) {
      this[removeUpHandlerName] = addEventListener(document, eventName, callback, {
        capture: this.props.useCapture,
      })
    }
  }

  upHandler = (e, removeUpHandlerName) => {
    const isDescendantOfRoot = this.childNode && this.childNode.contains(e.target)
    if (this[removeUpHandlerName]) this[removeUpHandlerName]()
    this[removeUpHandlerName] = null

    if (!isDescendantOfRoot) {
      if (
        this.lastUpTimestamp === e.timeStamp &&
        this.lastUpRemoveHandlerName === 'removePointerUp' &&
        removeUpHandlerName === 'removeMouseUp'
      ) {
        return
      }
      this.props.onOutsideClick(e)
      this.lastUpTimestamp = e.timeStamp
      this.lastUpRemoveHandlerName = removeUpHandlerName
    }
  }

  addDownEventListeners(useCapture) {
    this.removeMouseDown = addEventListener(document, 'mousedown', this.onMouseDown, {
      capture: useCapture,
    })
    this.removePointerDown = addEventListener(document, 'pointerdown', this.onPointerDown, {
      capture: useCapture,
    })
  }

  removeEventListeners() {
    if (this.removeMouseDown) this.removeMouseDown()
    if (this.removeMouseUp) this.removeMouseUp()
    if (this.removePointerDown) this.removePointerDown()
    if (this.removePointerUp) this.removePointerUp()
  }

  render() {
    const { children, display } = this.props
    return (
      <div
        ref={this.setChildNodeRef}
        style={
          display !== DISPLAY.BLOCK && Object.values(DISPLAY).includes(display)
            ? { display, ...this.props.style }
            : undefined
        }
      >
        {children}
      </div>
    )
  }
}

OutsideClickHandler.propTypes = propTypes
OutsideClickHandler.defaultProps = defaultProps
export { OutsideClickHandler }
