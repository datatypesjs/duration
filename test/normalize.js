import runTest from 'ava'
import expect from 'unexpected'
import Duration from '../source/index.js'


runTest('let milliseconds bubble up', test => {
	const duration = new Duration()
		.setMilliseconds(7500)
		.normalize()
	const referenceDuration = new Duration('P7.500S')

	expect(duration.object, 'to equal', referenceDuration.object)
})


runTest('let seconds bubble up', test => {
	const duration = new Duration()
		.setSeconds(150)
		.normalize()
	const referenceDuration = new Duration('PT2M30S')

	expect(duration.object, 'to equal', referenceDuration.object)
})


runTest('let minutes bubble up', test => {
	const duration = new Duration()
		.setMinutes(150)
		.normalize()
	const referenceDuration = new Duration('P2H30M')

	expect(duration.object, 'to equal', referenceDuration.object)
})


runTest('let months bubble up', test => {
	const duration = new Duration()
		.setMonths(30)
		.normalize()
	const referenceDuration = new Duration('P2Y6M')

	expect(duration.object, 'to equal', referenceDuration.object)
})


// Unsafe normalize

runTest('let hours bubble up', test => {
	const duration = new Duration()
		.setHours(50)
		.unsafeNormalize()
	const referenceDuration = new Duration('P2D2H')

	expect(duration.object, 'to equal', referenceDuration.object)
})

runTest('remove months and let days bubble up', test => {
	const duration = new Duration()
		.setMonths(5)
		.setDays(500)
		.unsafeNormalize()
	const referenceDuration = new Duration('P1Y285D')

	expect(duration.object, 'to equal', referenceDuration.object)
})
