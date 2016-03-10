import runTest from 'ava'
import expect from 'unexpected'
import Duration from '../source/index.js'

runTest('precision of P7D is day', test => {
	const duration = new Duration('P7D')
	expect(duration.precision, 'to equal', 'day')
})

runTest('precision of P7D0H is hour', test => {
	const duration = new Duration('P7D0H')
	expect(duration.precision, 'to equal', 'hour')
})
