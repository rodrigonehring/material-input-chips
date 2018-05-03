import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'
import { withStyles } from 'material-ui/styles'
import cx from 'classnames'
import Fuse from 'fuse.js'
import copy from 'copy-to-clipboard'

import Chip from './Chip'
import createOptions from './Options'
import { TYPES, acceptedCharCodes, validate, mimicFuseSearch, keysWatcher } from './helpers'
import styles from './styles'


/**
 * material-ui@next based, chips autocomplete
 *
 * @version 1.4.2
 * @author [Rodrigo Nehring](https://github.com/rodrigonehring)
*/
class MaterialChips extends Component {
  static propTypes = {
    /** disable delete button on chips */
    chipsDisabled: PropTypes.bool,

    /** Classes from material-ui withStyles() */
    classes: PropTypes.object,

    /** clear input text after add an item */
    clearAfterAdd: PropTypes.bool,

    /** react component to render a chip */
    chipComponent: PropTypes.func,

    /** Disable input */
    disabled: PropTypes.bool,

    /** Custom fields names */
    fields: PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),

    /** To mimic a select field */
    fixedOptions: PropTypes.bool,

    /** disable input field */
    inputDisabled: PropTypes.bool,

    /** Props which will be passed directly to Input component */
    InputProps: PropTypes.object,

    /** Props which will be passed directly to InputLabel component */
    InputLabelProps: PropTypes.object,

    /** label for input */
    label: PropTypes.string,

    /** Should return a new chip, receive fields filled   */
    makeChip: PropTypes.func,

    /** Callback fired when user add or remove one chip,
     * return arrayOf selected items after change  */
    onChange: PropTypes.func,

    /** Callback fired when user type something in input, return input string */
    onSearch: PropTypes.func,

    /** auto open autocomplete options on focus container */
    openOnFocus: PropTypes.bool,

    /** To show in autocomplete  */
    options: PropTypes.arrayOf(PropTypes.object),

    /** fn(theme) => ({ optionsContainer, optionsContainerOpen }) to override options styles */
    optionsClasses: PropTypes.func,

    /** Must receive state from props */
    selected: PropTypes.arrayOf(PropTypes.object),

    /** Keycodes to watch when user keydown, to fire internal add method */
    submitKeyCodes: PropTypes.arrayOf(PropTypes.number),

    /** Array of validators, will be executed to verify if input can be a chip */
    validators: PropTypes.arrayOf(PropTypes.shape({
      message: PropTypes.string, validator: PropTypes.func,
    })),
  }

  static defaultProps = {
    label: '',
    openOnFocus: false,
    chipsDisabled: false,
    inputDisabled: false,
    options: [],
    submitKeyCodes: [13, 9, 191],
    clearAfterAdd: true,
    fields: { label: 'label', value: 'value' },
    InputProps: {},
    InputLabelProps: {},
    makeChip: chip => chip,
    chipComponent: Chip,
    selected: [],
  }

  state = {
    containerFocus: false,
    inputFocus: false,
    chipFocus: null,
    optionsOpen: false,
    translateX: 0,
    input: '',
    options: [],
    optionsFocus: null,
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
    this.configureFuse()
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.disabled && nextProps.disabled) {
      this.reset()
    }

    if (this.props.selected !== nextProps.selected || this.props.options !== nextProps.options) {
      this.configureFuse(this.filterOptionsSelected(nextProps.options, nextProps.selected))
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  onChange = (selected) => {
    if (this.props.onChange) {
      this.props.onChange(selected)
    }
  }

  OptionsComponent = createOptions(this.props.optionsClasses)

  handleKeyPress = (e) => {
    const { inputFocus } = this.state

    // not selected, typed "normal" key, then select input
    if (!inputFocus && acceptedCharCodes(e.charCode)) {
      this.input.focus()
    }
  }

  haveOptionsKeys = e => []
    .concat(TYPES.UP).concat(TYPES.DOWN).concat(this.props.submitKeyCodes)
    .includes(e.keyCode)

  handleOptionsKeys = (e) => {
    e.preventDefault()
    const { optionsFocus, options } = this.state
    let nextPosition

    if (TYPES.UP.includes(e.keyCode)) {
      if (optionsFocus > 0) {
        nextPosition = optionsFocus - 1
      } else {
        nextPosition = null
      }
    } else if (TYPES.DOWN.concat(TYPES.TAB).includes(e.keyCode)) {
      if (optionsFocus === null) {
        nextPosition = 0
      } else if (optionsFocus !== options.length - 1) {
        nextPosition = optionsFocus + 1
      } else {
        nextPosition = null
      }
    } else if (this.props.submitKeyCodes.includes(e.keyCode) && typeof optionsFocus === 'number') {
      this.addItemObject(options[optionsFocus].item, true)
      return true
    }

    if (typeof nextPosition === 'number' || nextPosition === null) {
      this.setState({ optionsFocus: nextPosition })
      return true
    }
  }

  handleKeyDown = (e) => {
    const { inputFocus, input: inputValue, chipFocus, optionsOpen } = this.state
    const { selected } = this.props

    if (optionsOpen) {
      // key press ESC, close options
      if (TYPES.ESCAPE.includes(e.keyCode)) {
        return this.setState({
          optionsOpen: false,
          optionsFocus: null,
        })
      }

      if (this.haveOptionsKeys(e)) {
        const shouldStop = this.handleOptionsKeys(e)
        if (shouldStop) {
          return
        }
      }
    }

    if (inputFocus) {
      // input not empty
      if (inputValue.length > 0) {
        // verify keycode submission type
        if (this.props.submitKeyCodes.includes(e.keyCode)) {
          this.addItem(inputValue)
          e.preventDefault()
        }
      } else {
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
      }
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

  /*
  * Handle search stuff, with fuse.js
  */
  configureFuse = (list = this.props.options) => {
    if (this.props.fixedOptions) {
      return this.setState({
        options: mimicFuseSearch(list),
      })
    }

    this.fuse = new Fuse(list, {
      shouldSort: true,
      threshold: 0.4,
      includeScore: true,
      maxPatternLength: 32,
      minMatchCharLength: 3,
      includeMatches: true,
      matchAllTokens: true,
      distance: 100,
      keys: Object.values(this.props.fields),
      location: 0,
    })

    this.search()
  }

  search = (value = this.state.input) => {
    const { onSearch } = this.props
    const options = this.fuse.search(value)

    this.setState({ options, optionsOpen: options.length > 0 })

    if (onSearch) {
      onSearch(value)
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
        error: false,
        containerFocus: false,
        inputFocus: false,
        chipFocus: null,
        optionsOpen: false,
      })
    })
  }

  handleCopy = (e) => {
    const { selected } = this.props
    const { chipFocus } = this.state

    if (chipFocus !== null) {
      e.preventDefault()
      const currentChip = selected[chipFocus]
      copy(JSON.stringify(currentChip))
      this.input.focus()
      this.focusChip(chipFocus)
    }
  }

  handlePaste = (e) => {
    const { selected, fields, disabled } = this.props
    const clipboard = e.clipboardData.getData('Text')

    if (disabled || !this.state.containerFocus) {
      return
    }

    try {
      const item = JSON.parse(clipboard)

      if (!item[fields.value]) {
        throw new Error(`Don't contain ${fields.value}`)
      }

      const exist = selected.find(i => i[fields.value] === item[fields.value])

      if (exist) {
        e.preventDefault()
        this.setState(state => ({ input: state.input + item[fields.value] }))
        return
      }

      e.preventDefault()
      this.addItemObject(item, true)
    } catch (error) {
      const valid = !validate(clipboard, this.props.validators, this.props.selected)

      if (valid) {
        e.preventDefault()
        this.addItem(clipboard)
      }
    }
  }

  handleInputChange = ({ target }) => {
    if (target.value.length > 3) {
      this.setState({
        error: null,
        input: target.value,
      })

      this.search(target.value)

      return this.input.focus()
    } else if (target.value.length === 0) {
      return this.setState({
        error: null,
        input: '',
        optionsOpen: false,
      })
    }

    this.setState({
      error: null,
      input: target.value,
    })
  }

  chipRefs = {}

  focusChip = (index) => {
    const ref = this.chipRefs[index]
    const selector = ref.querySelector(':scope [role="button"]')
    if (selector) {
      selector.focus()
    }
  }

  makeItem = (newValue) => {
    const { fields, makeChip } = this.props

    return makeChip({
      [fields.value]: newValue,
      [fields.label]: newValue,
    })
  }

  addItemObject = (option, focus) => {
    const { selected, clearAfterAdd } = this.props

    if (clearAfterAdd) {
      this.setState(
        {
          input: '',
          optionsFocus: null,
        },
        () => this.onChange([...selected, option])
      )
    }

    if (focus) {
      this.input.focus()
    }
  }

  addItem = (value) => {
    const error = validate(value, this.props.validators, this.props.selected)
    const item = this.makeItem(value)
    const { selected, clearAfterAdd } = this.props

    if (error) {
      return this.setState({ error })
    }

    this.setState(
      state => ({
        error,
        input: clearAfterAdd ? '' : state.input,
      }),
      () => {
        this.onChange([...selected, item])
        setTimeout(() => this.alignInput(), 100)
      }
    )
  }

  deleteItem = chip => () => {
    const { selected, fields } = this.props

    this.setState(
      { chipFocus: null },
      () => {
        this.onChange(selected.filter(item => item[fields.value] !== chip[fields.value]))
        this.calculatePosition()
      }
    )
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
    this.resetScroll()
    if (!this.props.chipsDisabled) {
      this.setState({
        chipFocus: index,
      }, () => this.calculatePosition())
    }
  }

  filterOptionsSelected = (options, selected = this.props.selected) => {
    const { fields } = this.props
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
      return -(chipOffset - (containerWidth - chipWidth))
    }

    return null
  }

  alignInput = () => {
    const { offsetLeft, clientWidth } = this.inputContainer
    const containerWidth = this.containerRef.clientWidth
    const translateX = -(offsetLeft - (containerWidth - clientWidth))
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

    return selected.map((chip, index) => {
      const chipsProps = {
        chip,
        label: chip[fields.label],
        className: cx(classes.chip, index === chipFocus && classes.chipFocus),
        onClick: () => {
          // input need focus before to "onCopy" work
          this.input.focus()
          this.focusChip(index)
        },
      }

      if (!chipsDisabled) {
        chipsProps.onDelete = this.deleteItem(chip)
      }

      return (
        <div
          ref={(ref) => { this.chipRefs[index] = ref }}
          onFocus={this.handleChipFocus(index)}
          key={`chip-${chip[fields.value]}`}
          className={classes.chipWrapper}
        >
          {this.props.chipComponent(chipsProps)}
        </div>
      )
    })
  }

  render() {
    const {
      classes, disabled, selected, label,
      inputDisabled, InputProps, InputLabelProps,
    } = this.props
    const { input, error, containerFocus, chipFocus, optionsOpen, inputFocus } = this.state

    const labelShrinked = !!InputProps.placeholder || (selected.length > 0) || (input.length > 0)
    const labelFocused = containerFocus || chipFocus || inputFocus

    const formClasses = cx(
      classes.inkbar,
      classes.underline,
      containerFocus && classes.focused,
      error && error.length > 0 && classes.error,
      disabled && classes.disabled,
      classes.formControl
    )

    const mergedInputLabelProps = Object.assign({}, { shrink: labelShrinked }, InputLabelProps)

    return (
      <div
        className={classes.container}
        ref={this.registerRef('containerRef')}
        onFocus={this.handleContainerFocus}
        onBlur={this.handleContainerBlur}
        onKeyPress={this.handleKeyPress}
        tabIndex={-1}
        onPaste={this.handlePaste}
        {...keysWatcher(this.handleKeyDown, this.handleCopy)}
      >

        <FormControl className={formClasses} error={error && error.length > 0} fullWidth margin="dense">

          <InputLabel margin="dense" focused={labelFocused} {...mergedInputLabelProps}>
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
                  inputProps={Object.assign({}, { spellCheck: false }, InputProps)}
                />
              </div>

            </div>
          </div>

          {error &&
            <FormHelperText className={classes.errorText}>
              {error}
            </FormHelperText>
          }
        </FormControl>

        <this.OptionsComponent
          open={optionsOpen}
          options={this.state.options}
          focus={this.state.optionsFocus}
          onSelect={this.addItemObject}
          fields={this.props.fields}
          optionsClasses={this.props.optionsClasses}
        />

      </div>
    )
  }
}

export default withStyles(styles)(MaterialChips)
