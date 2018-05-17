import React from 'react'
import PropTypes from 'prop-types'
import Chip from '@material-ui/core/Chip'


function ChipComponent(props) {
  const chipProps = Object.assign({}, props)
  delete chipProps.chip

  return (
    <Chip
      {...chipProps}
    />
  )
}

ChipComponent.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  onDelete: PropTypes.func,
  chip: PropTypes.object,
}

export default ChipComponent
