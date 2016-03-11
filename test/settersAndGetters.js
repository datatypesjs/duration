import runTest from 'ava'
import expect from 'unexpected'
import Duration from '../source/index.js'

runTest('get milliseconds', test => {
	const duration = new Duration('P0.345S')
	expect(duration.milliseconds, 'to equal', 345)
})

runTest('set milliseconds', test => {
	const duration = new Duration()
	duration.milliseconds = 345
	expect(duration.milliseconds, 'to equal', 345)
})

runTest('setMilliseconds()', test => {
	const duration = new Duration().setMilliseconds(345)
	expect(duration.milliseconds, 'to equal', 345)
})
