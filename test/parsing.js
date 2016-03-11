import runTest from 'ava'
import expect from 'unexpected'
import Duration from '../source/index.js'

runTest('P7Y', test => {
	expect(
		new Duration(test.title).toObject(),
		'to equal',
		{
			string: test.title,
			years: 7,
			isAccurate: false,
		}
	)
})

runTest('P7M', test => {
	expect(
		new Duration(test.title).toObject(),
		'to equal',
		{
			string: test.title,
			months: 7,
			isAccurate: false,
		}
	)
})

runTest('P7W', test => {
	expect(
		new Duration(test.title).toObject(),
		'to equal',
		{
			string: test.title,
			weeks: 7,
			isAccurate: false,
		}
	)
})

runTest('P7D', test => {
	expect(
		new Duration(test.title).toObject(),
		'to equal',
		{
			string: test.title,
			days: 7,
			isAccurate: false,
		}
	)
})

runTest('P7H', test => {
	expect(
		new Duration(test.title).toObject(),
		'to equal',
		{
			string: 'PT7H',
			hours: 7,
			isAccurate: true,
		}
	)
})

runTest('PT7M', test => {
	expect(
		new Duration(test.title).toObject(),
		'to equal',
		{
			string: test.title,
			minutes: 7,
			isAccurate: true,
		}
	)
})

// Test that M doesn't get parsed as months without time separator
// but leading hour
runTest('P7H30M', test => {
	const duration = new Duration(test.title)
	const referenceObject = {
		string: 'PT7H30M',
		hours: 7,
		minutes: 30,
		isAccurate: true,
	}

	expect(duration.object, 'to equal', referenceObject)
})

runTest('P7S', test => {
	expect(
		new Duration(test.title).toObject(),
		'to equal',
		{
			string: 'PT7S',
			seconds: 7,
			isAccurate: true,
		}
	)
})

runTest('P7.345S', test => {
	expect(
		new Duration(test.title).toObject(),
		'to equal',
		{
			string: 'PT7.345S',
			seconds: 7,
			milliseconds: 345,
			isAccurate: true,
		}
	)
})


runTest('P7.3S', test => {
	expect(
		new Duration(test.title).toObject(),
		'to equal',
		{
			string: 'PT7.300S',
			seconds: 7,
			milliseconds: 300,
			isAccurate: true,
		}
	)
})

runTest('P7Y5M', test => {
	expect(
		new Duration(test.title).toObject(),
		'to equal',
		{
			string: test.title,
			years: 7,
			months: 5,
			isAccurate: false,
		}
	)
})

runTest('P3Y6M4DT12H30M5S', test => {
	expect(
		new Duration(test.title).toObject(),
		'to equal',
		{
			string: test.title,
			years: 3,
			months: 6,
			days: 4,
			hours: 12,
			minutes: 30,
			seconds: 5,
			isAccurate: false,
		}
	)
})
