import React, { Component } from 'react'
import cx from 'classnames'
import Paper from 'material-ui/Paper'
import { MenuItem } from 'material-ui/Menu'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  optionsContainer: {
    display: 'none',
  },
  optionsContainerOpen: {
    position: 'absolute',
    display: 'block',
    zIndex: 90,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    top: '100%',
    marginTop: -8,
    right: 0,
  },
})

class Options extends Component {
  render() {
    const { classes, open, options, onSelect } = this.props
    const containerOpen = open && options.length > 0
    const containerClasses = cx(classes.optionsContainer, containerOpen && classes.optionsContainerOpen)

    return (
      <Paper className={containerClasses} square>
        {options.map(option => (
          <MenuItem key={option.label} onClick={() => onSelect(option)}>
            {option.label}
          </MenuItem>
        ))}
      </Paper>
    )
  }
}

export default withStyles(styles)(Options)
