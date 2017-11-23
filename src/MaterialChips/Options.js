import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import Paper from 'material-ui/Paper'
import { MenuItem } from 'material-ui/Menu'
import { withStyles } from 'material-ui/styles'
import deepmerge from 'deepmerge'

const styles = theme => ({
  optionsContainer: {
    display: 'none',
    maxHeight: 300,
    overflowY: 'auto',
  },
  optionsContainerOpen: {
    position: 'absolute',
    display: 'block',
    zIndex: 90,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    top: '100%',
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

const Options = ({ classes, open, options, onSelect, fields, focus }) => {
  const containerOpen = open && options.length > 0
  const containerClasses = cx(
    classes.optionsContainer,
    containerOpen && classes.optionsContainerOpen
  )

  return (
    <Paper className={containerClasses} square>
      {options.map((item, index) => {
        const option = item.item
        return (
          <MenuItem
            key={option.label + option.Email}
            onClick={() => onSelect(option)}
            classes={{
              root: classes.menuItemRoot,
              selected: classes.menuItemSelected,
            }}
            selected={focus === index}
          >
            <span
              dangerouslySetInnerHTML={{ __html: showLabel(item, fields) }} // eslint-disable-line
            />
          </MenuItem>
        )
      })}
    </Paper>
  )
}

Options.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object),
  onSelect: PropTypes.func,
  fields: PropTypes.object,
  focus: PropTypes.number,
}

export default (customStyles) => {
  if (customStyles) {
    return withStyles(theme => deepmerge(styles(theme), customStyles(theme)))(Options)
  }

  return withStyles(styles)(Options)
}
