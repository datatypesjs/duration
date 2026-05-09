import runTest from 'ava'
import expect from 'unexpected'
import Duration from '../source/index'


runTest('long format with multiple units', test => {
	const duration = new Duration('PT4H10M45S')
	expect(
		duration.toHumanReadable('long'),
		'to equal',
		'4 Hours, 10 Minutes, 45 Seconds'
	)
})

runTest('long format defaults', test => {
	const duration = new Duration('PT4H10M45S')
	expect(
		duration.toHumanReadable(),
		'to equal',
		'4 Hours, 10 Minutes, 45 Seconds'
	)
})

runTest('long format singular', test => {
	const duration = new Duration('PT1H1M1S')
	expect(
		duration.toHumanReadable('long'),
		'to equal',
		'1 Hour, 1 Minute, 1 Second'
	)
})

runTest('short format with multiple units', test => {
	const duration = new Duration('PT4H10M45S')
	expect(
		duration.toHumanReadable('short'),
		'to equal',
		'4 h, 10 m, 45 s'
	)
})

runTest('clock format combines days and time', test => {
	const duration = new Duration('P3DT4H33M23S')
	expect(
		duration.toHumanReadable('clock'),
		'to equal',
		'3 d, 04:33:23 h'
	)
})

runTest('clock format pads single digit values', test => {
	const duration = new Duration('PT4H3M5S')
	expect(
		duration.toHumanReadable('clock'),
		'to equal',
		'04:03:05 h'
	)
})

runTest('empty duration returns empty string', test => {
	const duration = new Duration()
	expect(duration.toHumanReadable(), 'to equal', '')
})

runTest('unknown format throws', test => {
	const duration = new Duration('PT5M')
	expect(
		() => duration.toHumanReadable('weird'),
		'to throw',
		'Unknown format "weird"'
	)
})
