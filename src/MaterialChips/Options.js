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

function addBold(start, end, str) {
  return `${str.slice(0, start)}<b>${str.slice(start, end + 1)}</b>${str.slice(end + 1, str.length)}`
}

function showLabel({ item, matches }, { label }) {
  const match = matches.find(i => i.key === label)

  if (match) {
    return match.indices.reduce((acc, curr) => {
      acc.result = addBold(curr[0] + acc.count, curr[1] + acc.count, acc.result)
      acc.count += 7

      return acc
    }, { count: 0, result: match.value }).result
  }

  return item[label]
}

class Options extends Component {
  render() {
    const { classes, open, options, onSelect, fields } = this.props
    const containerOpen = open && options.length > 0
    const containerClasses = cx(classes.optionsContainer, containerOpen && classes.optionsContainerOpen)

    return (
      <Paper className={containerClasses} square>
        {options.map((item) => {
          const option = item.item
          return (
            <MenuItem key={option.label + option.Email} onClick={() => onSelect(option)}>
              <span
                dangerouslySetInnerHTML={{ __html: showLabel(item, fields) }}
              />
            </MenuItem>
          ) 
        })}
      </Paper>
    )
  }
}

export default withStyles(styles)(Options)
