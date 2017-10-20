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
  { label: 'big field width some words', Email: 'Email' },
  { label: 'big field width some words 2', Email: 'Email 2' },
  { label: 'big field width some words 3', Email: 'Email 3' }
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

```js
const options = [
  { label: 'big field width some words', Email: 'Email' },
  { label: 'big field width some words 2', Email: 'Email 2' },
  { label: 'big field width some words 3', Email: 'Email 3' }
];

<div style={{ width: 400 }}>
  <Handler>
    <MaterialChips
      options={options}
      label="Label"
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