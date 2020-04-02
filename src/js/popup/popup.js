/* eslint-disable no-undef */

function handleError (e) {
  console.error(`Error: ${e}`)
}

/* Label settings */
const labelChar = {
  limit: 18,
  adjust: 15
}

const tooltipInfo = {
  coverageActive: 'Domain coverage is active',
  coveragePaused: 'Domain coverage is paused',
  noCoverage: 'No coverage for the current domain'
}

const iconClass = 'hideIcon'

/* UI management */
const button = {
  pauseExt: undefined,
  playExt: undefined,
  domainToggle: undefined,
  info: undefined
}

const uiSwitch = {
  label: undefined,
  tooltip: undefined
}

function getDomElementRefs () {
  button.pauseExt = document.getElementById('pauseExt')
  button.playExt = document.getElementById('playExt')
  button.domainToggle = document.getElementById('switchRoundedSuccess')
  button.info = document.getElementById('infoTool')
  uiSwitch.label = document.getElementById('switchLabel')
  uiSwitch.tooltip = document.getElementById('fieldTooltip')
}

/* Running user state management */
const pausedState = {
  ext: undefined,
  domain: undefined,
  coverage: undefined
}

const tooltipState = {
  currentMsg: tooltipInfo.noCoverage,
  isDisplayed: false
}

/* Application flow */
document.addEventListener('DOMContentLoaded', () => {
  getDomElementRefs()
  getPopupInitData()
  initPauseBTN()
  initPlayBTN()
  initDomainToggle()
  initInfoClick()
  initInfoHover()
})

/* Enable user interaction */
function initPauseBTN () {
  button.pauseExt.addEventListener('click', (event) => {
    if (!pausedState.ext) {
      pauseExt()
    }
  })
}

function initPlayBTN () {
  button.playExt.addEventListener('click', (event) => {
    if (pausedState.ext) {
      unpauseExt()
    }
  })
}

function initDomainToggle () {
  button.domainToggle.addEventListener('change', (event) => {
    switchDomainToggle()
  })
}

function initInfoClick () {
  button.info.addEventListener('click', (event) => {
    if (!tooltipState.isDisplayed) {
      if (pausedState.coverage) {
        setTooltipDisplay(tooltipInfo.noCoverage)
      } else if ((pausedState.ext) || (pausedState.domain)) {
        setTooltipDisplay(tooltipInfo.coveragePaused)
      } else {
        setTooltipDisplay(tooltipInfo.coverageActive)
      }
    } else {
      handleHideTooltip()
    }
  })
}

function initInfoHover () {
  button.info.addEventListener('mouseleave', (event) => {
    handleHideTooltip()
  })
}

/* Handle changes to running state */
function handleInit (init) {
  handleExtPaused(init.ext)
  handleDomainPaused(init.domain)
  handleLabelURL(init.host, init.url)
  handleCoverage(init.inject)
}

function pauseExt () {
  setExtPaused(true)
  communicateExtPaused(true)
  hidePauseBTN()
  displayPlayBTN()
  disableDomainToggle()
}

function unpauseExt () {
  setExtPaused(false)
  communicateExtPaused(false)
  hidePlayBTN()
  displayPauseBTN()
  if (!pausedState.coverage) {
    enableDomainToggle()
  }
}

function switchDomainToggle () {
  setDomainPaused(!button.domainToggle.checked)
  communicateDomainPaused(pausedState.domain)
}

function handleExtPaused (paused) {
  setExtPaused(paused)
  if (paused) {
    disableDomainToggle()
    hidePauseBTN()
  } else {
    hidePlayBTN()
  }
}

function handleDomainPaused (paused) {
  setDomainPaused(paused)
  if (paused) {
    setDomainToggle(false)
  }
}

function handleCoverage (coverage) {
  setCoveragePaused(!coverage)
  if (pausedState.coverage) {
    setDomainToggle(false)
    disableDomainToggle()
  }
}

/* Handle display changes */
function hidePlayBTN () {
  addClass(button.playExt, iconClass)
}

function hidePauseBTN () {
  addClass(button.pauseExt, iconClass)
}

function displayPlayBTN () {
  removeClass(button.playExt, iconClass)
}

function displayPauseBTN () {
  removeClass(button.pauseExt, iconClass)
}

function enableDomainToggle () {
  removeAttribute(button.domainToggle, 'disabled')
}

function disableDomainToggle () {
  addAttribute(button.domainToggle, 'disabled')
}

function setTooltipDisplay (message) {
  setTooltipIsDisplayed(true)
  setCurrentTooltipMsg(message)
  setFieldTooltip(message)
}

function handleHideTooltip () {
  setTooltipIsDisplayed(false)
  hideTooltip()
}

function handleLabelURL (currentHostName, currentURL) {
  if (currentHostName.length === 0) {
    displayLabelURL(currentURL)
  } else {
    currentHostName = currentHostName.replace('www.', '')
    displayLabelURL(currentHostName)
  }
}

function displayLabelURL (url) {
  if (url.length > labelChar.limit) {
    uiSwitch.label.textContent = url.slice(0, labelChar.adjust).concat('...')
  } else {
    uiSwitch.label.textContent = url
  }
}

/* Communicate state changes */
function communicateExtPaused (paused) {
  browser.runtime.sendMessage({
    re: 'extPaused',
    extPaused: paused
  })
}

function communicateDomainPaused (paused) {
  browser.runtime.sendMessage({
    re: 'domainPaused',
    domainPaused: paused
  })
}

function getPopupInitData () {
  browser.runtime.sendMessage({
    re: 'init'
  })
    .then(handleInit, handleError)
}

/* Update local state */
function setDomainToggle (checked) {
  button.domainToggle.checked = checked
}

function setDomainPaused (checked) {
  pausedState.domain = checked
}

function setExtPaused (checked) {
  pausedState.ext = checked
}

function setCoveragePaused (checked) {
  pausedState.coverage = checked
}

function setCurrentTooltipMsg (message) {
  tooltipState.currentMsg = message
}

function setTooltipIsDisplayed (checked) {
  tooltipState.isDisplayed = checked
}

/* Update HTML */
function addClass (node, className) {
  node.classList.add(className)
}

function removeClass (node, className) {
  node.classList.remove(className)
}

function addAttribute (node, attribute) {
  node.setAttribute(attribute, true)
}

function removeAttribute (node, attribute) {
  node.removeAttribute(attribute)
}

function setFieldTooltip (message) {
  uiSwitch.tooltip.setAttribute('data-tooltip', message)
}

function hideTooltip () {
  uiSwitch.tooltip.removeAttribute('data-tooltip', tooltipState.currentMsg)
}
