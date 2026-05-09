import runTest from "ava"
import expect from "unexpected"
import Duration from "../source/index"

runTest("is accurate", () => {
  const duration = new Duration("P7H")
  expect(duration.isAccurate, "to be true")
})

runTest("is not accurate", () => {
  const duration = new Duration("P7Y")
  expect(duration.isAccurate, "to be false")
})
