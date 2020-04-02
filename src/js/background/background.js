/* eslint-disable no-undef */

function handleError (e) {
  console.error(`Error: ${e}`)
}

const state = {
  currentURL: undefined,
  currentHostName: undefined,
  extPaused: undefined,
  domainPaused: undefined
}

/* Handle messages received from the popup script */
function handleMessage (request) {
  if (request.re === 'init') {
    if (coverage.has(state.currentHostName)) {
      return Promise.resolve({ url: state.currentURL, host: state.currentHostName, ext: state.extPaused, domain: state.domainPaused, inject: true })
    } else {
      return Promise.resolve({ url: state.currentURL, host: state.currentHostName, ext: state.extPaused, domain: state.domainPaused, inject: false })
    }
  } else if (request.re === 'extPaused') {
    setExtPausedStorage(request.extPaused)
      .then(() => {
        refreshPage()
      })
  } else if (request.re === 'domainPaused') {
    setDomainPausedStorage(request.domainPaused)
      .then(() => {
        refreshPage()
      })
  }
}

/* Listen for events from the Tabs API */
browser.tabs.onUpdated.addListener(handleNewURL)

/* Listen for events from the Popup.js script */
browser.runtime.onMessage.addListener(handleMessage)

/* Update running state management */
function setCurrentURL (url) {
  state.currentURL = url
}

function setHostName (hostName) {
  state.currentHostName = hostName
}

function setDomainPaused (checked) {
  state.domainPaused = checked
}

function setExtPaused (checked) {
  state.extPaused = checked
}

/* Store data into local storage */
function setDomainPausedStorage (checked) {
  return new Promise((resolve, reject) => {
    setDomainPaused(checked)
    browser.storage.local.set({ [state.currentHostName]: checked })
      .then(() => {
        resolve()
      }, handleError)
  })
}

function setExtPausedStorage (checked) {
  return new Promise((resolve, reject) => {
    setExtPaused(checked)
    browser.storage.local.set({ paused: checked })
      .then(() => {
        resolve()
      }, handleError)
  })
}

/* Retrieve data from local storage */
function getDomainPausedStorage () {
  return new Promise((resolve, reject) => {
    browser.storage.local.get(state.currentHostName)
      .then((checked) => {
        setDomainPaused(checked[state.currentHostName])
        resolve()
      }, handleError)
  })
}

function getExtPausedStorage () {
  return new Promise((resolve, reject) => {
    browser.storage.local.get('paused')
      .then((checked) => {
        setExtPaused(checked.paused)
        resolve()
      }, handleError)
  })
}

/* Handle tab state */
function handleNewURL (tabID, changeInfo, tab) {
  extractURL(tab.url)
  getExtPausedStorage()
  getDomainPausedStorage()
}

function extractURL (newURL) {
  setCurrentURL(newURL)
  setHostName((new URL(newURL)).hostname)
}

function refreshPage () {
  if (state.currentURL.slice(0, 5) !== 'about') {
    browser.tabs.reload()
  }
}
