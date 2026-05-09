declare module "unexpected" {
  interface Expect {
    (subject: unknown, ...args: unknown[]): unknown
    clone(): Expect
    addAssertion(...args: unknown[]): Expect
  }
  const expect: Expect
  export default expect
}
