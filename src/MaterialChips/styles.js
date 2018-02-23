const bottomLineColor = 'rgba(0, 0, 0, 0.42)'

const styles = theme => ({
  container: {
    position: 'relative',
    width: '100%',
    '&:focus': {
      outline: 'none',
    },
  },
  formControl: {
    transition: '.3s ease',
    display: 'flex',
    height: 43,
    marginBottom: theme.spacing.unit / 2,
  },
  inputContainer: {
    display: 'inline-flex',
    flex: '1 0 auto',
  },
  chipsWrapper: {
    overflowX: 'hidden',
    position: 'relative',
    flex: '1 0 auto',
  },
  chips: {
    position: 'absolute',
    minWidth: '100%',
    flexWrap: 'nowrap',
    marginTop: 15,
    transition: '.3s ease',
    display: 'inline-flex',
  },
  chipFocus: {
    '&$chip > svg': {
      color: theme.palette.primary[500],
    },
  },
  chip: {
    display: 'inline-flex',
    height: 20,
    margin: theme.spacing.unit / 4,
    '&:hover:not($chipFocus) > svg': {
      color: theme.palette.primary[400],
      '&:hover': {
        color: theme.palette.primary[500],
      },
    },
    '& > svg': {
      color: theme.palette.grey[700],
      width: 16,
    },
  },
  error: {
    marginBottom: theme.spacing.unit * 3,
  },
  errorText: {
    position: 'absolute',
    bottom: -15,
  },
  chipWrapper: {
    display: 'inline-flex',
    '&:last-child': {
      marginRight: (theme.spacing.unit / 3) * 2,
    },
  },
  input: {
    paddingTop: 2,
    fontSize: 13,
    flex: '1 0 auto',
  },
  disabled: {
    color: theme.palette.text.disabled,
  },
  inkbar: {
    '&:after': {
      backgroundColor: theme.palette.primary[theme.palette.type === 'light' ? 'A700' : 'A200'],
      left: 0,
      bottom: 0,
      // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
      content: '""',
      height: 2,
      position: 'absolute',
      right: 0,
      transform: 'scaleX(0)',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shorter,
        easing: theme.transitions.easing.easeOut,
      }),
    },
    '&$error:after': {
      backgroundColor: theme.palette.error.A400,
    },
    '&$focused:after': {
      transform: 'scaleX(1)',
    },
  },
  focused: {},
  underline: {
    '&:before': {
      backgroundColor: bottomLineColor,
      left: 0,
      bottom: 0,
      // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
      content: '""',
      height: 1,
      position: 'absolute',
      right: 0,
      transition: theme.transitions.create('background-color', {
        duration: theme.transitions.duration.shorter,
        easing: theme.transitions.easing.ease,
      }),
    },
    '&:hover:not($disabled):before': {
      backgroundColor: theme.palette.text.primary,
      height: 2,
    },
    '&$error:before': {
      backgroundColor: theme.palette.error.A400,
      transform: 'scaleX(1)', // error is always underlined in red
    },
    '&$disabled:before': {
      background: 'transparent',
      backgroundImage: `linear-gradient(to right, ${bottomLineColor} 33%, transparent 0%)`,
      backgroundPosition: 'left top',
      backgroundRepeat: 'repeat-x',
      backgroundSize: '5px 1px',
    },
  },
})

export default styles
