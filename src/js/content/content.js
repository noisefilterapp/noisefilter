/* eslint-disable no-undef */

function handleError (e) {
  console.error(`Error: ${e}`)
}

/* Determine whether stylsheet needs to be injected on the current domain */
browser.runtime.sendMessage({
  re: 'init'
})
  .then((init) => {
    if ((init.inject) && (!init.ext) && (!init.domain)) {
      injectStyle()
    }
  }, handleError)

/* Inject stylesheet blocking comment section */
function injectStyle () {
  const style = document.createElement('link')
  style.rel = 'stylesheet'
  style.type = 'text/css'
  style.href = browser.extension.getURL('../../style/css/content.css')
  document.getElementsByTagName('head')[0].appendChild(style)
}
