const durationFragments = [
	'years',
	'months',
	'weeks',
	'days',
	'hours',
	'minutes',
	'seconds',
	'milliseconds',
] as const

export type DurationFragment = (typeof durationFragments)[number]

export default durationFragments
