import durationFragments from './fragments'

export default class Duration {
	constructor (durationString) {
		if (!durationString) {
			return this
		}

		console.assert(
			typeof durationString === 'string',
			'Type of argument must be "string" and not "' +
			typeof durationString + '"'
		)

		let durationPattern =
			'^P' +
			'(?:(\\d+)Y)?' + // Years
			'(?:(\\d+)M)?' + // Months
			'(?:(\\d+)W)?' + // Weeks
			'(?:(\\d+)D)?' + // Days
			'T?' +
			'(?:(\\d+)H)?' + // Hours
			'(?:(\\d+)M)?' + // Minutes
			'(?:(\\d+)?' +   // Seconds
			'\\.?(\\d+)?S)?' + // Milliseconds
			'$'

		let regex = new RegExp(durationPattern, 'i')
		let durationArray = durationString.match(regex)

		console.assert(
			durationArray,
			`"${durationString}" is an invalid duration string`
		)

		durationFragments.forEach((fragment, index) => {
			let value = Number(durationArray[index + 1])

			if (typeof value === 'number' && !Number.isNaN(value)) {
				this._precision = fragment.replace(/s$/, '')
				this[fragment] = value
			}
		})
	}

	get years () { return this._years }
	set years (years) { this._years = years }
	setYears (years) { this.years = years; return this }

	get months () { return this._months }
	set months (months) { this._months = months }
	setMonths (months) { this.months = months; return this }

	get days () { return this._days }
	set days (days) { this._days = days }
	setDays (days) { this.days = days; return this }

	get hours () { return this._hours }
	set hours (hours) { this._hours = hours }
	setHours (hours) { this.hours = hours; return this }

	get minutes () { return this._minutes}
	set minutes (minutes) { this._minutes = minutes }
	setMinutes (minutes) { this.minutes = minutes; return this }

	get seconds () { return this._seconds}
	set seconds (seconds) { this._seconds = seconds }
	setSeconds (seconds) { this.seconds = seconds; return this  }

	get milliseconds () { return this._milliseconds }
	set milliseconds (milliseconds) { this._milliseconds = milliseconds }
	setMilliseconds (milliseconds) {
		this.milliseconds = milliseconds
		return this
	}


	get precision () { return this._precision }
	set precision (precision) {
		this._precision = precision
		return this
	}

	get isAccurate () {
		return (
			this.years == null &&
			this.months == null &&
			this.days == null
		)
	}

	get string () {
		return durationFragments
			.reduce(
				(string, fragment) => {
					if (this[fragment] == null) {
						return string
					}

					if (fragment === 'minutes' && !string.includes('t')) {
						string += 't'
					}

					string += this[fragment] + fragment.substr(0, 1)

					if (fragment === 'days') {
						string += 't'
					}
					if (fragment === 'milliseconds') {
						string.replace('s', '.' + this[fragment] + 's')
					}

					return string
				},
				'p'
			)
			.replace(/t$/, '')
			.toUpperCase()
	}

	toString () {
		return this.string
	}

	toObject () {
		return durationFragments.reduce(
			(object, fragment) => {
				if (this[fragment] != null)
					object[fragment] = this[fragment]
				return object
			},
			{
				string: this.string
			}
		)
	}

	toJSON () {
		return this.toObject()
	}

	normalize () {
		// Let all values bubble up as high as possible without changing
		// the accuracy
		// e.g 70000 ms = 1 minute and 10 seconds
		// Millisecond, second, hour & minute are considered accurate units
		// and therefore leap seconds are ignored

		if (this._milliseconds >= 1000) {
			this._seconds = this._seconds || 0
			this._seconds += Math.floor(this._milliseconds / 1000)
			this._milliseconds = this._milliseconds % 1000
		}

		if (this._seconds >= 60) {
			this._minutes = this._minutes || 0
			this._minutes += Math.floor(this._seconds / 60)
			this._seconds = this._seconds % 60
		}

		if (this._minutes >= 60) {
			this._hours = this._hours || 0
			this._hours += Math.floor(this._minutes / 60)
			this._minutes = this._minutes % 60
		}

		// 1 day has not always 24 hours (+- leap second),
		// 1 month has not always 31 days and 1 year has not always 365 days.
		// Therefore they can't bubble up

		// But 1 year always has 12 months
		if (this._months >= 12) {
			this._years = this._years || 0
			this._years += Math.floor(this._months / 12)
			this._months = this._months % 12
		}

		return this
	}
}
