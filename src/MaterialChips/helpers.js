export const TYPES = {
  ESCAPE: [27],
  LEFT: [37],
  RIGHT: [39],
  CTRL: [17],
  C: [67],
  UP: [38],
  DOWN: [40],
  BACKSPACE: [8],
  TAB: [9],
  DELETE_CODES: [46, 8],
}

export function acceptedCharCodes(code) {
  return code > 64 && code < 123
}

export function validate(value, validators, selected) {
  if (!validators || validators.length === 0) {
    return false
  }

  return validators.reduce((acc, curr) => {
    if (!acc && curr.validator(value, selected)) {
      return curr.message
    }

    return acc
  }, false)
}


export function mimicFuseSearch(options) {
  return options.map(option => ({
    matches: [],
    item: option,
  }))
}

export function keysWatcher(handleKeyDown, handleCopy) {
  let ctrlPressed = false

  return {
    onKeyDown(e) {
      if (TYPES.CTRL.includes(e.keyCode)) {
        ctrlPressed = true
      }

      if (ctrlPressed && TYPES.C.includes(e.keyCode)) {
        handleCopy(e)
      }

      handleKeyDown(e)
    },
    onKeyUp(e) {
      if (TYPES.CTRL.includes(e.keyCode)) {
        ctrlPressed = false
      }
    },
  }
}
