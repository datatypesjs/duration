import runTest from 'ava'
import expect from 'unexpected'
import Duration from '../source/index'


runTest('asMilliseconds for accurate duration', test => {
	const duration = new Duration('PT1H30M')
	expect(duration.asMilliseconds, 'to equal', 90 * 60 * 1000)
})

runTest('asSeconds for accurate duration', test => {
	const duration = new Duration('PT1H30M')
	expect(duration.asSeconds, 'to equal', 90 * 60)
})

runTest('asMinutes for accurate duration', test => {
	const duration = new Duration('PT1H30M')
	expect(duration.asMinutes, 'to equal', 90)
})

runTest('asHours returns fraction', test => {
	const duration = new Duration('PT1H30M')
	expect(duration.asHours, 'to equal', 1.5)
})

runTest('asMinutes includes milliseconds', test => {
	const duration = new Duration().setMinutes(1).setMilliseconds(30000)
	expect(duration.asMinutes, 'to equal', 1.5)
})

runTest('asDays for P2D', test => {
	const duration = new Duration('P2D')
	expect(duration.asDays, 'to equal', 2)
})

runTest('asHours for P2D', test => {
	const duration = new Duration('P2D')
	expect(duration.asHours, 'to equal', 48)
})

runTest('asWeeks for P14D', test => {
	const duration = new Duration('P14D')
	expect(duration.asWeeks, 'to equal', 2)
})

runTest('asMonths approximates 30 days', test => {
	const duration = new Duration('P60D')
	expect(duration.asMonths, 'to equal', 2)
})

runTest('asYears approximates 365 days', test => {
	const duration = new Duration('P730D')
	expect(duration.asYears, 'to equal', 2)
})

runTest('asMilliseconds on empty duration is 0', test => {
	const duration = new Duration()
	expect(duration.asMilliseconds, 'to equal', 0)
})
