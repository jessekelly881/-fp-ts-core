/**
 * @since 1.0.0
 */
import type * as associative from "@fp-ts/core/typeclass/Associative"
import * as monoid from "@fp-ts/core/typeclass/Monoid"

/**
 * @category data
 * @since 1.0.0
 */
export type TotalOrdering = -1 | 0 | 1

/**
 * @since 1.0.0
 */
export const reverse = (
  totalOrdering: TotalOrdering
): TotalOrdering => (totalOrdering === -1 ? 1 : totalOrdering === 1 ? -1 : 0)

/**
 * @category pattern matching
 * @since 1.0.0
 */
export const match = <A, B, C = B>(
  onLessThan: () => A,
  onEqual: () => B,
  onGreaterThan: () => C
) =>
  (totalOrdering: TotalOrdering): A | B | C =>
    totalOrdering === -1 ? onLessThan() : totalOrdering === 0 ? onEqual() : onGreaterThan()

/**
 * @category instances
 * @since 1.0.0
 */
export const Associative: associative.Associative<TotalOrdering> = {
  combine: (that) => (self) => self !== 0 ? self : that,
  combineMany: (collection) =>
    (self) => {
      let ordering = self
      if (ordering !== 0) {
        return ordering
      }
      for (ordering of collection) {
        if (ordering !== 0) {
          return ordering
        }
      }
      return ordering
    }
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Monoid: monoid.Monoid<TotalOrdering> = monoid.fromAssociative(Associative, 0)
