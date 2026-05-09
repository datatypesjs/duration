import durationFragments, { DurationFragment } from "./fragments"

export type HumanReadableFormat = "long" | "short" | "clock"

// Allow any string at the type boundary (preserves the runtime
// "Unknown format" error path) while still giving autocomplete
// for the three known formats.
// eslint-disable-next-line @typescript-eslint/ban-types
type HumanReadableFormatInput = HumanReadableFormat | (string & {})

export default class Duration {
  _years?: number
  _months?: number
  _weeks?: number
  _days?: number
  _hours?: number
  _minutes?: number
  _seconds?: number
  _milliseconds?: number

  _start?: Date
  _end?: Date

  _isAccurate?: boolean
  _precision?: string

  constructor(durationString?: string) {
    if (!durationString) {
      return
    }

    if (typeof durationString !== "string") {
      console.error(
        'Type of argument must be "string" and not "' + typeof durationString +
          '"',
      )
    }

    const durationPattern = "^P" +
      "(?:([0-9]+)Y)?" + // Years
      "(?:([0-9]+)M)?" + // Months
      "(?:([0-9]+)W)?" + // Weeks
      "(?:([0-9]+)D)?" + // Days
      "T?" +
      "(?:([0-9]+)H)?" + // Hours
      "(?:([0-9]+)M)?" + // Minutes
      "(?:([0-9]+)?" + // Seconds
      "(?:\\.([0-9]{1,3}))?S)?" + // Milliseconds
      "$"

    const regex = new RegExp(durationPattern, "i")
    const durationArray = durationString.match(regex)

    if (!durationArray) {
      console.error(`"${durationString}" is an invalid duration string`)
    }

    if (!durationArray) return

    const fractionalMs = Number("0." + durationArray[8]) * 1000

    durationFragments.forEach((fragment, index) => {
      const value = index === 7
        ? fractionalMs
        : Number(durationArray[index + 1])

      if (typeof value === "number" && !Number.isNaN(value)) {
        this[`_${fragment}`] = value
      }
    })
  }

  get years() {
    return this._years
  }
  set years(years: number | undefined) {
    this._years = years
  }
  setYears(years: number | undefined) {
    this.years = years
    return this
  }

  get months() {
    return this._months
  }
  set months(months: number | undefined) {
    this._months = months
  }
  setMonths(months: number | undefined) {
    this.months = months
    return this
  }

  get weeks() {
    return this._weeks
  }
  set weeks(weeks: number | undefined) {
    this._weeks = weeks
  }
  setWeeks(weeks: number | undefined) {
    this.weeks = weeks
    return this
  }

  get days() {
    return this._days
  }
  set days(days: number | undefined) {
    this._days = days
  }
  setDays(days: number | undefined) {
    this.days = days
    return this
  }

  get hours() {
    return this._hours
  }
  set hours(hours: number | undefined) {
    this._hours = hours
  }
  setHours(hours: number | undefined) {
    this.hours = hours
    return this
  }

  get minutes() {
    return this._minutes
  }
  set minutes(minutes: number | undefined) {
    this._minutes = minutes
  }
  setMinutes(minutes: number | undefined) {
    this.minutes = minutes
    return this
  }

  get seconds() {
    return this._seconds
  }
  set seconds(seconds: number | undefined) {
    this._seconds = seconds
  }
  setSeconds(seconds: number | undefined) {
    this.seconds = seconds
    return this
  }

  get milliseconds() {
    return this._milliseconds
  }
  set milliseconds(milliseconds: number | undefined) {
    this._milliseconds = milliseconds
  }
  setMilliseconds(milliseconds: number | undefined) {
    this.milliseconds = milliseconds
    return this
  }

  // Interval bounds. When two of {start, end, duration components} are
  // known, the third is computed on demand. Setting start or end with
  // the other already known invalidates the duration components and
  // rebuilds them; reads of start/end derive from start/end + duration
  // when not explicitly stored.
  get start(): Date | undefined {
    if (this._start != null) return this._start
    if (this._end != null && this._hasDurationComponents()) {
      return new Date(this._end.getTime() - this.asMilliseconds)
    }
    return undefined
  }
  set start(date: Date | undefined) {
    this._start = date
    if (this._end != null) {
      this._rebuildDuration()
    }
  }
  setStart(date: Date | undefined) {
    this.start = date
    return this
  }

  get end(): Date | undefined {
    if (this._end != null) return this._end
    if (this._start != null && this._hasDurationComponents()) {
      return new Date(this._start.getTime() + this.asMilliseconds)
    }
    return undefined
  }
  set end(date: Date | undefined) {
    this._end = date
    if (this._start != null) {
      this._rebuildDuration()
    }
  }
  setEnd(date: Date | undefined) {
    this.end = date
    return this
  }

  _hasDurationComponents(): boolean {
    return durationFragments.some((fragment) => {
      const value = this[`_${fragment}`]
      return typeof value === "number" && !Number.isNaN(value)
    })
  }

  _rebuildDuration() {
    durationFragments.forEach((fragment) => {
      delete this[`_${fragment}`]
    })
    this._milliseconds = this._end!.getTime() - this._start!.getTime()
    this.normalize()
  }

  rebuild() {
    if (this._start != null && this._end != null) {
      this._rebuildDuration()
    }
    return this
  }

  // Conversions to a single unit (including fraction).
  // Months are approximated as 30 days and years as 365 days
  // (matches the assumptions used by `unsafeNormalize`).
  get asMilliseconds(): number {
    const msPerSecond = 1000
    const msPerMinute = 60 * msPerSecond
    const msPerHour = 60 * msPerMinute
    const msPerDay = 24 * msPerHour
    const msPerWeek = 7 * msPerDay
    const msPerMonth = 30 * msPerDay
    const msPerYear = 365 * msPerDay

    return (
      (this._milliseconds || 0) +
      (this._seconds || 0) * msPerSecond +
      (this._minutes || 0) * msPerMinute +
      (this._hours || 0) * msPerHour +
      (this._days || 0) * msPerDay +
      (this._weeks || 0) * msPerWeek +
      (this._months || 0) * msPerMonth +
      (this._years || 0) * msPerYear
    )
  }

  get asSeconds() {
    return this.asMilliseconds / 1000
  }
  get asMinutes() {
    return this.asMilliseconds / (1000 * 60)
  }
  get asHours() {
    return this.asMilliseconds / (1000 * 60 * 60)
  }
  get asDays() {
    return this.asMilliseconds / (1000 * 60 * 60 * 24)
  }
  get asWeeks() {
    return this.asDays / 7
  }
  get asMonths() {
    return this.asDays / 30
  }
  get asYears() {
    return this.asDays / 365
  }

  get precision(): string | undefined {
    let precision: string | undefined

    // Clone array as .reverse() is in place
    Array.from(durationFragments)
      .reverse()
      .some((fragment) => {
        const value = this[fragment]

        if (typeof value === "number" && !Number.isNaN(value)) {
          precision = fragment.replace(/s$/, "")
          return true
        }
        return false
      })

    return precision
  }
  set precision(precision: string | undefined) {
    this._precision = precision
  }

  get isAccurate(): boolean {
    if (Object.prototype.hasOwnProperty.call(this, "_isAccurate")) {
      return this._isAccurate as boolean
    }
    else {
      // Millisecond, second, hour & minute are considered accurate units
      // by ignoring leap seconds (also check out this.normalize)
      return this.years == null && this.months == null && this.weeks == null &&
        this.days == null
    }
  }
  set isAccurate(value: boolean | undefined) {
    if (value === undefined) {
      delete this._isAccurate
    }
    this._isAccurate = value
  }

  get string(): string {
    return durationFragments
      .reduce<string>((string, fragment, fragmentIndex) => {
        const value = this[fragment]
        if (typeof value !== "number" || Number.isNaN(value)) {
          return string
        }

        // fragmentIndex > 3 means smaller than day
        if (!string.includes("T") && fragmentIndex > 3) {
          string += "T"
        }

        if (fragment === "milliseconds") {
          string = string.replace(/s$/, `.${this.milliseconds}S`)
        }
        else {
          string += value + fragment.substr(0, 1)
        }

        return string
      }, "p")
      .toUpperCase()
  }
  toString() {
    return this.string
  }
  toJSON() {
    return this.string
  }

  toHumanReadable(format: HumanReadableFormatInput = "long"): string {
    const longLabels: Record<DurationFragment, [string, string]> = {
      years: ["Year", "Years"],
      months: ["Month", "Months"],
      weeks: ["Week", "Weeks"],
      days: ["Day", "Days"],
      hours: ["Hour", "Hours"],
      minutes: ["Minute", "Minutes"],
      seconds: ["Second", "Seconds"],
      milliseconds: ["Millisecond", "Milliseconds"],
    }
    const shortLabels: Record<DurationFragment, string> = {
      years: "y",
      months: "mo",
      weeks: "w",
      days: "d",
      hours: "h",
      minutes: "m",
      seconds: "s",
      milliseconds: "ms",
    }

    const setFragments = durationFragments.filter((fragment) => {
      const value = this[fragment]
      return typeof value === "number" && !Number.isNaN(value)
    })

    if (setFragments.length === 0) return ""

    if (format === "long") {
      return setFragments
        .map((fragment) => {
          const value = this[fragment]
          const [singular, plural] = longLabels[fragment]
          return `${value} ${value === 1 ? singular : plural}`
        })
        .join(", ")
    }

    if (format === "short") {
      return setFragments.map((fragment) =>
        `${this[fragment]} ${shortLabels[fragment]}`,
      )
        .join(", ")
    }

    if (format === "clock") {
      const bigUnits: DurationFragment[] = ["years", "months", "weeks", "days"]
      const bigParts = setFragments
        .filter((fragment) => bigUnits.includes(fragment))
        .map((fragment) => `${this[fragment]} ${shortLabels[fragment]}`)

      const hasTimeUnits = setFragments.some((fragment) =>
        (["hours", "minutes", "seconds"] as DurationFragment[]).includes(
          fragment,
        ),
      )

      const parts = bigParts.slice()
      if (hasTimeUnits) {
        function pad(number: number) {
          return String(number)
            .padStart(2, "0")
        }
        const time = `${pad(this._hours || 0)}:` +
          `${pad(this._minutes || 0)}:` +
          `${pad(this._seconds || 0)} h`
        parts.push(time)
      }
      return parts.join(", ")
    }

    throw new Error(`Unknown format "${format}"`)
  }

  get object(): Record<string, unknown> {
    return durationFragments.reduce<Record<string, unknown>>(
      (object, fragment) => {
        if (this[fragment] != null) object[fragment] = this[fragment]
        return object
      },
      {
        string: this.string,
        isAccurate: this.isAccurate,
      },
    )
  }
  toObject() {
    return this.object
  }

  normalize() {
    // Let all values bubble up as high as possible without changing
    // the accuracy
    // e.g 70000 ms = 1 minute and 10 seconds
    // Millisecond, second, hour & minute are considered accurate units
    // by ignoring leap seconds

    if ((this._milliseconds ?? 0) >= 1000) {
      this._seconds = this._seconds || 0
      this._seconds += Math.floor(this._milliseconds! / 1000)
      this._milliseconds = this._milliseconds! % 1000
    }

    if ((this._seconds ?? 0) >= 60) {
      this._minutes = this._minutes || 0
      this._minutes += Math.floor(this._seconds! / 60)
      this._seconds = this._seconds! % 60
    }

    if ((this._minutes ?? 0) >= 60) {
      this._hours = this._hours || 0
      this._hours += Math.floor(this._minutes! / 60)
      this._minutes = this._minutes! % 60
    }

    // 1 day has not always 24 hours (+- leap second),
    // 1 month has not always 31 days and 1 year has not always 365 days.
    // Therefore they can't bubble up

    // But 1 year always has 12 months
    if ((this._months ?? 0) >= 12) {
      this._years = this._years || 0
      this._years += Math.floor(this._months! / 12)
      this._months = this._months! % 12
    }

    return this
  }

  unsafeNormalize() {
    // Minimizes error by using ordinal dates and therefore
    // convertig surplus months to days and converting days to years

    this._isAccurate = false

    this.normalize()

    // Assmues that 1 day has 24 hours and 1 month has 30 days

    if ((this._hours ?? 0) >= 24) {
      this._days = this._days || 0
      this._days += Math.floor(this._hours! / 24)
      this._hours = this._hours! % 24
    }

    if (this._months) {
      this._days = (this._days || 0) + this._months * 30
      delete this._months
    }

    if ((this._days ?? 0) >= 365) {
      this._years = this._years || 0
      this._years += Math.floor(this._days! / 365)
      this._days = this._days! % 365
    }

    return this
  }
}
