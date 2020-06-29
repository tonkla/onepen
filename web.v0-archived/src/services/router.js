export const Router = {
  replace: (key, path) => {
    window.history.replaceState({}, key, path)
    window.dispatchEvent(new window.PopStateEvent('replacestate'))
  },
  goto: path => {
    window.location.href = path
  },
}
