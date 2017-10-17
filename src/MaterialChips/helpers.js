// import validateEmail from 'helpers/checkEmail';
const validateEmail = () => true;

export const TYPES = {
  ESCAPE: [27],
  LEFT: [37],
  RIGHT: [39],
  BACKSPACE: [8],
  TAB: [9],
  DELETE_CODES: [46, 8]
};

export function acceptedKeycodes(code) {
  return code > 47 && code < 91;
}

export function validate(value, validators, selected) {
  let error;

  // with for can break loop
  for (let i = 0; i < validators.length; i++) {
    const current = validators[i];
    if (current.validator(value, selected)) {
      error = current.message;
      break;
    }
  }

  return error;
}

// por ordem de prioridade
export const defaultValidators = [
  // { message: 'Precisa ter length maior que 3', validator: (value) => value && value.length < 2 },
  { message: 'Verifique o(s) e-mail(s) informado(s)', validator: value => !validateEmail(value) },
  { message: 'Já existe este email na lista', validator: (value, selected) => {
    const items = selected.map(item => item.Email);
    return items.includes(value);
  } }
];
