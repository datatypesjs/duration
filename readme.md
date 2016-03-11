# Duration

Full ISO 8601 compatible duration class.


## Installation

```bash
npm install --save @datatypes/duration
```


## Usage

```js
const duration = new Duration('P1DT10H37M15.345S')

const anHour = new Duration()
	.setMinutes(60)
	.normalize()
```


## Accuracy

The accuracy of a Duration object corresponds to the smallest defined quantity.

- `P1H` means "around 1 hour" long
	- accuracy: hour
- `P1H0M0.0S` means "exactly 60 * 60 * 1000 milliseconds" long
	- accuracy: millisecond
