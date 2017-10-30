####  Note that ** Handler ** is just for example here, and don't are required in others cases!
------

### Simple usage with label

```js

<Handler>
  <MaterialChips
    label="Label"
  />
</Handler>


```
------

### Some selected items

```js
const selected = [
  { label: 'Field 1', Email: 'Email' },
  { label: 'Field 2', Email: 'Email 2' },
  { label: 'Field 3', Email: 'Email 3' }
];

<Handler>
  <MaterialChips
    selected={selected}
    label="Label"
  />
</Handler>


```
------


### Horizontal translate

```js
const selected = [
  { label: 'big field some words', Email: 'Email' },
  { label: 'big field some words 2', Email: 'Email 2' },
  { label: 'big field some words 3', Email: 'Email 3' }
];

<div style={{ width: 400 }}>
  <Handler>
    <MaterialChips
      selected={selected}
      label="Label"
    />
  </Handler>
</div>
```
------

### Fuse search
Type: field

```js
const options = [
  { label: 'big field some words', Email: 'Email' },
  { label: 'big field some words 2', Email: 'Email 2' },
  { label: 'big field some words 3', Email: 'Email 3' },
  { label: 'big field some words 4', Email: 'Email 4' },
  { label: 'big field some words 5', Email: 'Email 5' },
  { label: 'big field some words 6', Email: 'Email 6' },
  { label: 'big field some words 7', Email: 'Email 7' },
];

<Handler>
  <MaterialChips
    options={options}
    label="Label"
  />
</Handler>
```
------

### Validators
validator should return true to break and show error message

```js
const validators = [
  { message: 'Lenght should be bigger than 3', validator: value => value.length < 3 },
  { message: 'Already exist', validator: (value, selected) => {
    const items = selected.map(item => item.Email)
    return items.includes(value)
  } }
];

<Handler>
  <MaterialChips
    validators={validators}
    label="Label"
  />
</Handler>

```
------

### Custom Chip Component

```js
const selected = [{ label: 'CUSTOM CHIP COMPONENT', Email: 'value' }];
const chipComponent = function({ chip }) { return ( <span style={{ border: '1px solid red' }}>{chip.label}</span> )};

<Handler>
  <MaterialChips
    selected={selected}
    chipComponent={chipComponent}
    label="Label"
  />
</Handler>

```
------

### Copy and paste

```js
const selected = [{ label: 'CUSTOM CHIP COMPONENT', Email: 'value' }];
const validators = [
  { message: 'Lenght should be bigger than 3', validator: value => value.length <= 3 },
  { message: 'should include @', validator: value => !value.includes('@') }
];

<div>
  <Handler>
    <MaterialChips
      label="Field 1"
      selected={selected}
      validators={validators}
    />
  </Handler>

  <Handler>
    <MaterialChips
      label="Field 2"
      validators={validators}
    />
  </Handler>

  <Handler>
    <MaterialChips
      disabled
      selected={[{ Email: 'email@disabled.com', label: 'disabled' }]}
      label="Field 2"
      validators={validators}
    />
  </Handler>
</div>

```
------

| Condition | Result |
| ------------- |-------------|
| Click on container | Enable some focus state |
| Click on chip | Set focus on that chip |
| Focus a chip | Verify if current chip focused are visible, if not, translate to fit in view |
| With chip focused, key press right | Focus next chip if avaiable, or focus input |
| With chip focused, key press left | Focus prev chip if avaiable, or do nothing |