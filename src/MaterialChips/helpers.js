export const TYPES = {
  ESCAPE: [27],
  LEFT: [37],
  RIGHT: [39],
  BACKSPACE: [8],
  TAB: [9],
  DELETE_CODES: [46, 8],
}

export function acceptedKeycodes(code) {
  return code > 47 && code < 91
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
