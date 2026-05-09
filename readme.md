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


## Single-unit conversions

Convert the whole duration into a single unit (including the fraction).
Months are approximated as 30 days and years as 365 days, matching
`unsafeNormalize`.

```js
new Duration('PT1H30M').asMinutes  // 90
new Duration('PT1H30M').asHours    // 1.5
new Duration('P2D').asMilliseconds // 172800000
```

Available: `asMilliseconds`, `asSeconds`, `asMinutes`, `asHours`,
`asDays`, `asWeeks`, `asMonths`, `asYears`.


## Human-readable strings

```js
new Duration('PT4H10M45S').toHumanReadable()        // 'long' is the default
// '4 Hours, 10 Minutes, 45 Seconds'

new Duration('PT4H10M45S').toHumanReadable('short')
// '4 h, 10 m, 45 s'

new Duration('P3DT4H33M23S').toHumanReadable('clock')
// '3 d, 04:33:23 h'
```

`'long'` pluralizes labels based on the value. `'short'` uses `mo` for
months to avoid colliding with `m` for minutes. `'clock'` formats
hours/minutes/seconds as `hh:mm:ss h`, with units larger than a day
prepended as a comma-separated list.


## Intervals (start, end, duration)

A `Duration` can hold any two of `start`, `end`, and the duration
components — the third is derived on demand. Setting both `start` and
`end` rebuilds the duration components eagerly; setting one of them
together with a duration lets you read the missing bound.

```js
const span = new Duration()
	.setStart(new Date('2024-01-01T00:00:00Z'))
	.setEnd(new Date('2024-01-01T03:30:00Z'))
span.hours    // 3
span.minutes  // 30

const meeting = new Duration('PT2H')
	.setStart(new Date('2024-01-01T09:00:00Z'))
meeting.end   // Date 2024-01-01T11:00:00Z
```

Mutating `start` or `end` while the other is set re-derives the
duration components. `rebuild()` forces this explicitly.
