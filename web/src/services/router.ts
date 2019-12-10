const goto = (path: string) => {
  window.history.replaceState({}, '', path)
  window.dispatchEvent(new window.PopStateEvent('popstate'))
}

export default {
  goto,
}
