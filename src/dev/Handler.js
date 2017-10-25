import React from 'react'

export default class Handler extends React.Component {
  state = { selected: this.props.children.props.selected || [] }

  onChange = selected => this.setState({ selected })

  render() {
    return (
      <div>
        {React.cloneElement(this.props.children, {
          onChange: this.onChange, selected: this.state.selected,
        })}
      </div>
    )
  }
}
