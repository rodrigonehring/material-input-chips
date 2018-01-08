# material-input-chips
This project provides a chip input field for material-ui@next. It is inspired by https://github.com/TeamWertarbyte/material-ui-chip-input.

## WORKING!

## Installation
```shell
npm i --save material-input-chips
```

## Usage

```jsx
import React from 'react'
import InputChips from 'material-input-chips'

class MyComponent extends React.Component {
  state = { selected: [] }

  render() {
    return (
      <InputChips
        selected={this.state.selected}
        onChange={(selected) => this.seState({ selected })}
      />
    )
  }
}
```
