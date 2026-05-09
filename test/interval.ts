import runTest from "ava"
import expect from "unexpected"
import Duration from "../source/index"

runTest("start + end rebuilds duration", () => {
  const duration = new Duration()
    .setStart(new Date("2024-01-01T00:00:00Z"))
    .setEnd(new Date("2024-01-01T03:30:00Z"))
  expect(duration.hours, "to equal", 3)
  expect(duration.minutes, "to equal", 30)
})

runTest("start + duration derives end", () => {
  const duration = new Duration("PT2H")
    .setStart(
      new Date("2024-01-01T00:00:00Z"),
    )
  expect(duration.end!.toISOString(), "to equal", "2024-01-01T02:00:00.000Z")
})

runTest("end + duration derives start", () => {
  const duration = new Duration("PT2H")
    .setEnd(new Date("2024-01-01T02:00:00Z"))
  expect(duration.start!.toISOString(), "to equal", "2024-01-01T00:00:00.000Z")
})

runTest("changing start rebuilds duration when end is set", () => {
  const duration = new Duration()
    .setStart(new Date("2024-01-01T00:00:00Z"))
    .setEnd(new Date("2024-01-01T05:00:00Z"))
  expect(duration.hours, "to equal", 5)

  duration.setStart(new Date("2024-01-01T01:00:00Z"))
  expect(duration.hours, "to equal", 4)
})

runTest("rebuild() recomputes duration from start and end", () => {
  const duration = new Duration("PT99H")
    .setStart(
      new Date("2024-01-01T00:00:00Z"),
    )
  duration._end = new Date("2024-01-01T01:00:00Z")
  duration.rebuild()
  expect(duration.hours, "to equal", 1)
  expect(duration.years, "to be undefined")
})

runTest("start is undefined without end or duration", () => {
  const duration = new Duration()
  expect(duration.start, "to be undefined")
  expect(duration.end, "to be undefined")
})

runTest("start + end produces correct ISO string", () => {
  const duration = new Duration()
    .setStart(new Date("2024-01-01T00:00:00Z"))
    .setEnd(new Date("2024-01-02T00:00:00Z"))
  expect(duration.asHours, "to equal", 24)
})
