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
}
