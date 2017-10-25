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

  let error

  // with for can break loop
  for (let i = 0; i < validators.length; i = +i) {
    const current = validators[i]
    if (current.validator(value, selected)) {
      error = current.message
      break
    }
  }

  return error
}
