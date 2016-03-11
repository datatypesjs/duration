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
			'(?:([0-9]+)Y)?' + // Years
			'(?:([0-9]+)M)?' + // Months
			'(?:([0-9]+)W)?' + // Weeks
			'(?:([0-9]+)D)?' + // Days
			'T?' +
			'(?:([0-9]+)H)?' + // Hours
			'(?:([0-9]+)M)?' + // Minutes
			'(?:([0-9]+)?' +   // Seconds
			'(?:\\.([0-9]{1,3}))?S)?' + // Milliseconds
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

	get weeks () { return this._weeks }
	set weeks (weeks) { this._weeks = weeks }
	setWeeks (weeks) { this.weeks = weeks; return this }

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
		if (this.hasOwnProperty('_isAccurate')) {
			return this._isAccurate
		}
		else {
			// Millisecond, second, hour & minute are considered accurate units
			// by ignoring leap seconds (also check out this.normalize)
			return (
				this.years == null &&
				this.months == null &&
				this.weeks == null &&
				this.days == null
			)
		}
	}
	set isAccurate (value) {
		if (value === undefined) {
			delete this._isAccurate
		}
		this._isAccurate = value
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
	toString () { return this.string }
	toJSON () { return this.string }


	get object () {
		return durationFragments.reduce(
			(object, fragment) => {
				if (this[fragment] != null)
					object[fragment] = this[fragment]
				return object
			},
			{
				string: this.string,
				isAccurate: this.isAccurate
			}
		)
	}
	toObject () { return this.object }


	normalize () {
		// Let all values bubble up as high as possible without changing
		// the accuracy
		// e.g 70000 ms = 1 minute and 10 seconds
		// Millisecond, second, hour & minute are considered accurate units
		// by ignoring leap seconds

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

	unsafeNormalize () {
		// Minimizes error by using ordinal dates and therefore
		// convertig surplus months to days and converting days to years

		this._isAccurate = false

		this.normalize()

		// Assmues that 1 day has 24 hours and 1 month has 30 days

		if (this._hours >= 24) {
			this._days = this._days || 0
			this._days += Math.floor(this._hours / 24)
			this._hours = this._hours % 24
		}

		if (this._months) {
			this._days += this._months * 30
			delete this._months
		}

		if (this._days >= 365) {
			this._years = this._years || 0
			this._years += Math.floor(this._days / 365)
			this._days = this._days % 365
		}

		return this
	}
}
