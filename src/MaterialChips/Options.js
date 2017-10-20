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

function showLabel({ item, matches }) {
  const match = matches.find(i => i.key === 'label')

  if (match) {
    // let count = 0
    const result = match.value

    // match.indices.forEach((indice) => {
    //   let a = result.substr(0, indice[0])
    //   let mid = result.substr(0, indece[0])
    // })

    return result
  }

  return item.Email
}

class Options extends Component {
  render() {
    const { classes, open, options, onSelect } = this.props
    const containerOpen = open
    const containerClasses = cx(classes.optionsContainer, containerOpen && classes.optionsContainerOpen)

    return (
      <Paper className={containerClasses} square>
        {options.map((item) => {
          const option = item.item
          return (
            <MenuItem key={option.label + option.Email} onClick={() => onSelect(option)}>
              {showLabel(item)}
            </MenuItem>
          ) 
        })}
        {options.length === 0 && 'no results'} 
      </Paper>
    )
  }
}

export default withStyles(styles)(Options)
