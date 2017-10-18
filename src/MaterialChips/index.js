import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'
import { withStyles } from 'material-ui/styles'
import Chip from 'material-ui/Chip'
import cx from 'classnames'

// import { makeContact } from 'helpers/helpers'
const makeContact = contact => contact
import Options from './Options'
import { TYPES, acceptedKeycodes, validate, defaultValidators } from './helpers'
import styles from './styles'

/**
 * material-ui based, chips autocomplete
 *
 * @version 1.0.0
 * @author [Rodrigo Nehring](https://github.com/rodrigonehring)
*/
class MaterialChips extends Component {

  static propTypes = {
    /** Callback fired when user type something in input, return input string */
    onSearch: PropTypes.func,

    /** Callback fired when user add or remove one chip, return arrayOf selected items after change  */
    onChange: PropTypes.func,

    /** Must receive state from props */
    selected: PropTypes.arrayOf(PropTypes.object),

    /** To show in autocomplete  */
    options: PropTypes.arrayOf(PropTypes.object),

    /** Keycodes to watch when user keydown, to fire internal add method */
    submitKeyCodes: PropTypes.arrayOf(PropTypes.number),

    /** label for input */
    label: PropTypes.string,

    /** auto open autocomplete options on focus container */
    openOnFocus: PropTypes.bool,

    /** disable delete button on chips */
    chipsDisabled: PropTypes.bool,

    /** disable input field */
    inputDisabled: PropTypes.bool,

    /** clear input text after add an item */
    clearAfterAdd: PropTypes.bool,

    /** Custom fields names */
    fields: PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),

    /** Props wich will be passed directly to component */
    inputProps: PropTypes.object,

    /** Array of validators, will be executed to verify if input can be a chip */
    validators: PropTypes.arrayOf(PropTypes.shape({ message: PropTypes.string, validator: PropTypes.func })),
  }

  static defaultProps = {
    label: '',
    openOnFocus: false,
    chipsDisabled: false,
    inputDisabled: false,
    inputProps: {},
    options: [],
    validators: defaultValidators,
    submitKeyCodes: [ 13, 9, 191 ],
    clearAfterAdd: true,
    fields: { label: 'label', value: 'Email' },
    selected: [],
  }

  state = {
    containerFocus: false,
    inputFocus: false,
    optionsFocus: false,
    chipFocus: null,
    optionsOpen: false,
    translateX: 0,
    input: '',
  }

  chipRefs = {}

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.disabled && nextProps.disabled) {
      this.reset()
    }
  }

  // reset when click outside component
  handleClickOutside = (event) => {
    if (this.containerRef && !this.containerRef.contains(event.target)) {
      this.reset()
    }
  }

  reset = () => {
    setTimeout(() => {
      this.setState({
        input: '',
        error: false,
        containerFocus: false,
        inputFocus: false,
        optionsFocus: false,
        chipFocus: null,
        optionsOpen: false,
      })
    })
  }

  handleInputChange = ({ target }) => {

    if (target.value.length > 3) {
      this.setState({
        error: null,
        input: target.value,
        optionsOpen: true,
      })

      if (this.props.onSearch) {
        this.props.onSearch(target.value)
      }

      return this.input.focus()
    }

    this.setState({
      error: null,
      input: target.value,
    })
  }

  watchKeyCodes = (e) => {
    const { inputFocus, input: inputValue, chipFocus, optionsOpen } = this.state
    const { selected } = this.props

    // se não está selecionado, e digitou alguma tecla "NORMAL", seleciona o input
    if (!inputFocus && acceptedKeycodes(e.keyCode)) {
      this.input.focus()
    }

    // se options está aberto e aberta 'ESC', fechar
    if (optionsOpen && TYPES.ESCAPE.includes(e.keyCode)) {
      return this.setState({
        optionsOpen: false,
      })
    }

    // se input está selecionado e não está vazio
    if (inputFocus && inputValue.length > 0) {

      // verifica se é alguma tecla de submissão
      if (this.props.submitKeyCodes.includes(e.keyCode)) {
        this.addItem(inputValue)
        e.preventDefault()
      }
    
    // se input está selecionado e está vazio
    } else if (inputFocus && inputValue.length === 0) {

      // ser for um TAB, limpa algumas coisas
      if (TYPES.TAB.includes(e.keyCode)) {
        return this.setState({
          chipFocus: null,
          inputFocus: false,
          containerFocus: false,
        })
      }

      // se for um BACKSPACE, deleta última item da lista
      if (TYPES.BACKSPACE.includes(e.keyCode) && selected.length > 0) {
        return this.deleteItem(selected[selected.length - 1])()
      }

      if (TYPES.LEFT.includes(e.keyCode)) {
        e.preventDefault()
        this.focusChip(selected.length - 1)
      }

    // se está com focus em um chip
    } else if (!inputFocus && chipFocus !== null) {

      // movimentar focus ao apartar left right
      if (TYPES.RIGHT.includes(e.keyCode)) {
        e.preventDefault()
        if (selected.length === (chipFocus + 1)) {
          this.input.focus()
        } else {
          this.focusChip(chipFocus + 1)
        }
      }

      // movimentar focus ao apartar left right
      if (TYPES.LEFT.includes(e.keyCode) && chipFocus !== 0) {
        e.preventDefault()
        this.focusChip(chipFocus - 1)
      }

      // deleta item selecionado
      if (TYPES.DELETE_CODES.includes(e.keyCode)) {
        this.deleteItem(selected[chipFocus])()

        // seleciona anterior
        if (selected.length > 1 && chipFocus !== 0) {
          this.focusChip(chipFocus - 1)
        } else if (chipFocus === 0 && selected.length > 1) {
          this.input.focus()
        }
      }
    }
  }

  focusChip = (index) => {
    const ref = this.chipRefs[index]
    const selector = ref.querySelector(':scope [role="button"]')
    selector && selector.focus()
  }

  makeItem = (newValue) => {
    const { value, label } = this.props.fields
    
    const contact = makeContact({
      [value]: newValue,
      [label]: newValue,
    })

    return contact
  }

  onChange = (selected) => {
    this.props.onChange && this.props.onChange(selected)
  }

  addItem = (value) => {
    const error = validate(value, this.props.validators, this.props.selected)
    const item = this.makeItem(value)
    const { selected } = this.props

    if (error) {
      return this.setState({ error })
    }

    this.setState(
      state => ({
        error,
        input: this.props.clearAfterAdd ? '' : state.input,
      }),
      () => {
        this.onChange([ ...selected, item ])
        setTimeout(() => this.alignInput(), 100)
      }
    )
  }

  deleteItem = chip => () => {
    const { selected, fields } = this.props

    this.setState(
      {chipFocus: null },
      () => {
        this.onChange(selected.filter(item => item[fields.value] !== chip[fields.value]))
        this.calculatePosition()
      }
    )

    if (selected.length === 1) {
      this.reset()
    }
  }

  handleContainerFocus = () => {
    if (!this.props.disabled) {
      this.setState(state => ({
        optionsOpen: state.optionsOpen || this.props.openOnFocus,
        containerFocus: true,
      }), () => {
        if (this.state.chipFocus === null) {
          return this.input.focus()
        }

        this.calculatePosition()
      })
    }
  }

  resetScroll = () => {
    this.chipsWrapper.scrollLeft = 0
  }

  handleInputFocus = () => {
    this.resetScroll()
    this.setState({ inputFocus: true, chipFocus: null }, () => this.calculatePosition())
  }

  handleInputBlur = () => {
    this.setState({ inputFocus: false }, () => this.calculatePosition())
  }

  handleContainerBlur = () => {
    this.setState({
      chipFocus: null,
      containerFocus: false,
    }, () => this.calculatePosition())
  }

  handleChipFocus = index => () => {
    console.log('handleChipFocus')
    this.resetScroll()
    if (!this.props.chipsDisabled) {
      this.setState({
        chipFocus: index,
      }, () => this.calculatePosition())
    }
  }

  selectOption = (option) => {
    this.setState({ input: '' })
    this.onChange([ ...this.props.selected, option ])
  }

  filterOptionsSelected = () => {
    const { options, selected, fields } = this.props
    const selectedValues = selected.map(item => item[fields.value])

    return options.filter(option => !selectedValues.includes(option[fields.value]))
  }

  registerRef = name => (ref) => {
    this[name] = ref
  }

  calculateChipPosition = () => {
    const containerWidth = this.containerRef.clientWidth
    const { chipFocus, translateX } = this.state
    const ref = this.chipRefs[chipFocus]

    const pos = this.chipPos(containerWidth, ref.clientWidth, ref.offsetLeft, translateX)

    if (pos !== null && pos < 0) {
      this.setState({ translateX: pos })
    }
  }

  chipPos = (containerWidth, chipWidth, chipOffset, translateX) => {
    if (chipOffset + chipWidth > containerWidth + translateX) {
      return - (chipOffset - (containerWidth - chipWidth))
    }

    return null
  }

  alignInput = () => {
    const containerWidth = this.containerRef.clientWidth
    const translateX = - (this.inputContainer.offsetLeft - (containerWidth - this.inputContainer.clientWidth))
    this.setState({ translateX })
  }

  calculatePosition = () => {
    const { selected } = this.props
    const { chipFocus, inputFocus } = this.state

    if (selected.length === 0) {
      return this.setState({ translateX: 0 })
    }

    if (inputFocus) {
      return this.alignInput()
    }

    if (chipFocus !== null) {

      if (chipFocus === 0) {
        return this.setState({ translateX: 0 })
      }

      return this.calculateChipPosition()
    }

    if (!inputFocus && !chipFocus !== null) {
      this.setState({ translateX: 0 })
    }
  }

  renderChips() {
    const { classes, fields, chipsDisabled, selected } = this.props
    const { chipFocus } = this.state

    const chipActions = (chip) => {
      if (chipsDisabled) {
        return {}
      }

      return {
        onRequestDelete: this.deleteItem(chip),
      }
    }

    return selected.map((chip, index) => {
      return (
        <div
          ref={(ref) => { this.chipRefs[index] = ref }}
          onFocus={this.handleChipFocus(index)}
          key={`chip-${chip[fields.value]}-${index}`}
          className={classes.chipWrapper}
        >
          <Chip
            label={chip[fields.label]}
            className={cx(classes.chip, index === chipFocus && classes.chipFocus)}
            {...chipActions(chip)}
          />
        </div>
      )
      
    })
  }
  
  render() {
    const { classes, disabled, selected, label, inputDisabled } = this.props
    const { input, error, containerFocus, chipFocus, optionsOpen, inputFocus } = this.state
    const labelShrinked = (selected.length > 0) || (input.length > 0) || containerFocus
    const labelFocused = containerFocus || chipFocus || inputFocus

    const formClasses = cx(
      classes.inkbar,
      classes.underline,
      containerFocus && classes.focused,
      error && error.length > 0 && classes.error,
      disabled && classes.disabled,
      classes.formControl
    )

    return (
      <div
        className={classes.container}
        ref={this.registerRef('containerRef')}
        onFocus={this.handleContainerFocus}
        onBlur={this.handleContainerBlur}
        onKeyDown={this.watchKeyCodes}
        tabIndex={-1}
      >
        
        <FormControl className={formClasses} error={error && error.length > 0} fullWidth margin="dense">

          <InputLabel shrink={labelShrinked} margin="dense" focused={labelFocused}>
            {label}
          </InputLabel>

          <div className={classes.chipsWrapper} ref={this.registerRef('chipsWrapper')}>
            <div className={classes.chips} ref={this.registerRef('chips')} style={{ transform: `translateX(${this.state.translateX}px)` }}>

              {this.renderChips()}
              
              <div ref={this.registerRef('inputContainer')} className={classes.inputContainer}>
                <Input
                  className={classes.input}
                  onBlur={this.handleInputBlur}
                  onFocus={this.handleInputFocus}
                  onChange={this.handleInputChange}
                  disabled={disabled || inputDisabled}
                  disableUnderline
                  margin="dense"
                  inputRef={this.registerRef('input')}
                  value={input}
                />
              </div>
              
            </div>
          </div>
          
          { error &&
            <FormHelperText className={classes.errorText}>
              {error}
            </FormHelperText>
          }
        </FormControl>

        <Options
          open={optionsOpen}
          options={this.filterOptionsSelected()}
          onSelect={this.selectOption}
        />
        
      </div>
    )
  }
}

export default withStyles(styles)(MaterialChips)
