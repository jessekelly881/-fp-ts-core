import { pipe } from "@fp-ts/core/internal/Function"
import * as _ from "@fp-ts/core/Semigroupal"
import * as O from "./data/Option"
import * as U from "./util"

describe("Semigroupal", () => {
  it("zipWithComposition", () => {
    const sum = (a: number, b: number): number => a + b
    const zipWith = _.zipWithComposition(O.Semigroupal, O.Semigroupal)
    U.deepStrictEqual(pipe(O.none, zipWith(O.none, sum)), O.none)
    U.deepStrictEqual(pipe(O.some(O.none), zipWith(O.none, sum)), O.none)
    U.deepStrictEqual(pipe(O.some(O.some(1)), zipWith(O.none, sum)), O.none)
    U.deepStrictEqual(pipe(O.some(O.some(1)), zipWith(O.some(O.none), sum)), O.some(O.none))
    U.deepStrictEqual(pipe(O.some(O.none), zipWith(O.some(O.some(2)), sum)), O.some(O.none))
    U.deepStrictEqual(pipe(O.some(O.some(1)), zipWith(O.some(O.some(2)), sum)), O.some(O.some(3)))
  })

  it("zipManyComposition", () => {
    const zipMany = _.zipManyComposition(O.Semigroupal, O.Semigroupal)
    U.deepStrictEqual(pipe(O.none, zipMany([O.none])), O.none)
    U.deepStrictEqual(pipe(O.some(O.none), zipMany([O.none])), O.none)
    U.deepStrictEqual(pipe(O.some(O.none), zipMany([O.some(O.none)])), O.some(O.none))
    U.deepStrictEqual(pipe(O.some(O.none), zipMany([O.some(O.some("a"))])), O.some(O.none))
    U.deepStrictEqual(
      pipe(O.some(O.some(1)), zipMany([O.some(O.some(2))])),
      O.some(O.some([1, 2] as const))
    )
  })

  it("ap", () => {
    const ap = _.ap(O.Semigroupal)
    const double = (n: number) => n * 2
    U.deepStrictEqual(pipe(O.none, ap(O.none)), O.none)
    U.deepStrictEqual(pipe(O.none, ap(O.some(1))), O.none)
    U.deepStrictEqual(pipe(O.some(double), ap(O.none)), O.none)
    U.deepStrictEqual(pipe(O.some(double), ap(O.some(1))), O.some(2))
  })

  it("zip", () => {
    const zip = _.zip(O.Semigroupal)
    U.deepStrictEqual(pipe(O.none, zip(O.some(1))), O.none)
    U.deepStrictEqual(pipe(O.some(1), zip(O.none)), O.none)
    U.deepStrictEqual(pipe(O.some(1), zip(O.some("a"))), O.some([1, "a"] as const))
  })

  it("lift2", () => {
    const sum = _.lift2(O.Semigroupal)((a: number, b: number) => a + b)
    U.deepStrictEqual(sum(O.none, O.none), O.none)
    U.deepStrictEqual(sum(O.some(1), O.none), O.none)
    U.deepStrictEqual(sum(O.none, O.some(2)), O.none)
    U.deepStrictEqual(sum(O.some(1), O.some(2)), O.some(3))
  })

  it("lift3", () => {
    const sum = _.lift3(O.Semigroupal)((a: number, b: number, c: number) => a + b + c)
    U.deepStrictEqual(sum(O.none, O.none, O.none), O.none)
    U.deepStrictEqual(sum(O.some(1), O.none, O.none), O.none)
    U.deepStrictEqual(sum(O.none, O.some(2), O.none), O.none)
    U.deepStrictEqual(sum(O.none, O.none, O.some(3)), O.none)
    U.deepStrictEqual(sum(O.some(1), O.some(2), O.some(3)), O.some(6))
  })
})
