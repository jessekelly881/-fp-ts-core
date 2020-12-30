/**
 * ```ts
 * type Either<E, A> = Left<E> | Right<A>
 * ```
 *
 * Represents a value of one of two possible types (a disjoint union).
 *
 * An instance of `Either` is either an instance of `Left` or `Right`.
 *
 * A common use of `Either` is as an alternative to `Option` for dealing with possible missing values. In this usage,
 * `None` is replaced with a `Left` which can contain useful information. `Right` takes the place of `Some`. Convention
 * dictates that `Left` is used for failure and `Right` is used for success.
 *
 * @since 3.0.0
 */
import { Alt2, Alt2C } from './Alt'
import { Applicative as ApplicativeHKT, Applicative2, Applicative2C } from './Applicative'
import { apFirst_, Apply2, apSecond_, apS_, apT_ } from './Apply'
import { Bifunctor2 } from './Bifunctor'
import { Compactable2C, Separated } from './Compactable'
import { Eq, fromEquals } from './Eq'
import { Extend2 } from './Extend'
import { Filterable2C } from './Filterable'
import { Foldable2 } from './Foldable'
import { FromEither2 } from './FromEither'
import { identity, Lazy, pipe, Predicate, Refinement } from './function'
import { bindTo_, Functor2, tupled_ } from './Functor'
import { HKT } from './HKT'
import { bind_, chainFirst_, Monad2 } from './Monad'
import { Monoid } from './Monoid'
import { Option } from './Option'
import { Pointed2 } from './Pointed'
import { Semigroup } from './Semigroup'
import { Show } from './Show'
import { Traversable2 } from './Traversable'
import { Witherable2C } from './Witherable'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 3.0.0
 */
export interface Left<E> {
  readonly _tag: 'Left'
  readonly left: E
}

/**
 * @category model
 * @since 3.0.0
 */
export interface Right<A> {
  readonly _tag: 'Right'
  readonly right: A
}

/**
 * @category model
 * @since 3.0.0
 */
export type Either<E, A> = Left<E> | Right<A>

// -------------------------------------------------------------------------------------
// guards
// -------------------------------------------------------------------------------------

/**
 * Returns `true` if the either is an instance of `Left`, `false` otherwise.
 *
 * @category guards
 * @since 3.0.0
 */
export const isLeft = <E, A>(ma: Either<E, A>): ma is Left<E> => ma._tag === 'Left'

/**
 * Returns `true` if the either is an instance of `Right`, `false` otherwise.
 *
 * @category guards
 * @since 3.0.0
 */
export const isRight = <E, A>(ma: Either<E, A>): ma is Right<A> => ma._tag === 'Right'

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
 * structure.
 *
 * @category constructors
 * @since 3.0.0
 */
export const left = <E, A = never>(e: E): Either<E, A> => ({ _tag: 'Left', left: e })

/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
 * of this structure.
 *
 * @category constructors
 * @since 3.0.0
 */
export const right = <A, E = never>(a: A): Either<E, A> => ({ _tag: 'Right', right: a })

/**
 * Takes a lazy default and a nullable value, if the value is not nully, turn it into a `Right`, if the value is nully use
 * the provided default as a `Left`.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 *
 * const parse = E.fromNullable(() => 'nully')
 *
 * assert.deepStrictEqual(parse(1), E.right(1))
 * assert.deepStrictEqual(parse(null), E.left('nully'))
 *
 * @category constructors
 * @since 3.0.0
 */
export const fromNullable = <E>(e: Lazy<E>) => <A>(a: A): Either<E, NonNullable<A>> =>
  a == null ? left(e()) : right(a as NonNullable<A>)

/**
 * Constructs a new `Either` from a function that might throw.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 *
 * const unsafeHead = <A>(as: ReadonlyArray<A>): A => {
 *   if (as.length > 0) {
 *     return as[0]
 *   } else {
 *     throw 'empty array'
 *   }
 * }
 *
 * const head = <A>(as: ReadonlyArray<A>): E.Either<unknown, A> =>
 *   E.tryCatch(() => unsafeHead(as))
 *
 * assert.deepStrictEqual(head([]), E.left('empty array'))
 * assert.deepStrictEqual(head([1, 2, 3]), E.right(1))
 *
 * @category constructors
 * @since 3.0.0
 */
export const tryCatch = <A>(f: Lazy<A>): Either<unknown, A> => {
  try {
    return right(f())
  } catch (e) {
    return left(e)
  }
}

/**
 * Copied from https://github.com/Microsoft/TypeScript/issues/1897#issuecomment-338650717
 *
 * @since 3.0.0
 */
export type Json = boolean | number | string | null | JsonArray | JsonRecord

/**
 * @since 3.0.0
 */
export interface JsonRecord {
  readonly [key: string]: Json
}

/**
 * @since 3.0.0
 */
export interface JsonArray extends ReadonlyArray<Json> {}

/**
 * Converts a JavaScript Object Notation (JSON) string into an object.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe('{"a":1}', E.parseJSON), E.right({ a: 1 }))
 * assert.deepStrictEqual(pipe('{"a":}', E.parseJSON), E.left(new SyntaxError('Unexpected token } in JSON at position 5')))
 *
 * @category constructors
 * @since 3.0.0
 */
export const parseJSON = (s: string): Either<unknown, Json> => tryCatch(() => JSON.parse(s))

/**
 * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(pipe({ a: 1 }, E.stringifyJSON), E.right('{"a":1}'))
 * const circular: any = { ref: null }
 * circular.ref = circular
 * assert.deepStrictEqual(
 *   pipe(
 *     circular,
 *     E.stringifyJSON,
 *     E.mapLeft(e => String(e).includes('Converting circular structure to JSON'))
 *   ),
 *   E.left(true)
 * )
 *
 * @category constructors
 * @since 3.0.0
 */
export const stringifyJSON = (u: unknown): Either<unknown, string> => tryCatch(() => JSON.stringify(u))

/**
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     O.some(1),
 *     E.fromOption(() => 'error')
 *   ),
 *   E.right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     O.none,
 *     E.fromOption(() => 'error')
 *   ),
 *   E.left('error')
 * )
 *
 * @category constructors
 * @since 3.0.0
 */
export const fromOption = <E>(onNone: Lazy<E>) => <A>(ma: Option<A>): Either<E, A> =>
  ma._tag === 'None' ? left(onNone()) : right(ma.value)

/**
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     1,
 *     E.fromPredicate((n) => n > 0)
 *   ),
 *   E.right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     -1,
 *     E.fromPredicate((n) => n > 0)
 *   ),
 *   E.left(-1)
 * )
 *
 * @category constructors
 * @since 3.0.0
 */
export const fromPredicate: {
  <A, B extends A>(refinement: Refinement<A, B>): (a: A) => Either<A, B>
  <A>(predicate: Predicate<A>): (a: A) => Either<A, A>
} = <A>(predicate: Predicate<A>) => (a: A) => (predicate(a) ? right(a) : left(a))

// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------

/**
 * Takes two functions and an `Either` value, if the value is a `Left` the inner value is applied to the first function,
 * if the value is a `Right` the inner value is applied to the second function.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * const onLeft = (errors: ReadonlyArray<string>): string => `Errors: ${errors.join(', ')}`
 *
 * const onRight = (value: number): string => `Ok: ${value}`
 *
 * assert.strictEqual(
 *   pipe(
 *     E.right(1),
 *     E.fold(onLeft, onRight)
 *   ),
 *   'Ok: 1'
 * )
 * assert.strictEqual(
 *   pipe(
 *     E.left(['error 1', 'error 2']),
 *     E.fold(onLeft, onRight)
 *   ),
 *   'Errors: error 1, error 2'
 * )
 *
 * @category destructors
 * @since 3.0.0
 */
export const fold = <E, B, A>(onLeft: (e: E) => B, onRight: (a: A) => B) => (ma: Either<E, A>): B =>
  isLeft(ma) ? onLeft(ma.left) : onRight(ma.right)

/**
 * Less strict version of [`getOrElse`](#getOrElse).
 *
 * @category destructors
 * @since 3.0.0
 */
export const getOrElseW = <E, B>(onLeft: (e: E) => B) => <A>(ma: Either<E, A>): A | B =>
  isLeft(ma) ? onLeft(ma.left) : ma.right

/**
 * Returns the wrapped value if it's a `Right` or a default value if is a `Left`.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(1),
 *     E.getOrElse(() => 0)
 *   ),
 *   1
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.left('error'),
 *     E.getOrElse(() => 0)
 *   ),
 *   0
 * )
 *
 * @category destructors
 * @since 3.0.0
 */
export const getOrElse: <E, A>(onLeft: (e: E) => A) => (ma: Either<E, A>) => A = getOrElseW

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 3.0.0
 */
export const fromNullableK = <E>(
  e: Lazy<E>
): (<A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => B | null | undefined
) => (...a: A) => Either<E, NonNullable<B>>) => {
  const from = fromNullable(e)
  return (f) => (...a) => from(f(...a))
}

/**
 * @category combinators
 * @since 3.0.0
 */
export const chainNullableK = <E>(
  e: Lazy<E>
): (<A, B>(f: (a: A) => B | null | undefined) => (ma: Either<E, A>) => Either<E, NonNullable<B>>) => {
  const from = fromNullableK(e)
  return (f) => chain(from(f))
}

/**
 * Returns a `Right` if is a `Left` (and vice versa).
 *
 * @category combinators
 * @since 3.0.0
 */
export const swap = <E, A>(ma: Either<E, A>): Either<A, E> => (isLeft(ma) ? right(ma.left) : left(ma.right))

/**
 * Useful for recovering from errors.
 *
 * @category combinators
 * @since 3.0.0
 */
export const orElse = <E1, E2, A>(onLeft: (e: E1) => Either<E2, A>) => (ma: Either<E1, A>): Either<E2, A> =>
  isLeft(ma) ? onLeft(ma.left) : ma

/**
 * Less strict version of [`filterOrElse`](#filterOrElse).
 *
 * @category combinators
 * @since 3.0.0
 */
export const filterOrElseW: {
  <A, B extends A, E2>(refinement: Refinement<A, B>, onFalse: (a: A) => E2): <E1>(
    ma: Either<E1, A>
  ) => Either<E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <E1>(ma: Either<E1, A>) => Either<E1 | E2, A>
} = <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): (<E1>(ma: Either<E1, A>) => Either<E1 | E2, A>) =>
  chainW((a) => (predicate(a) ? right(a) : left(onFalse(a))))

/**
 * @example
 * import * as E from 'fp-ts/Either'
 * import { pipe } from 'fp-ts/function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(1),
 *     E.filterOrElse(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   E.right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(-1),
 *     E.filterOrElse(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   E.left('error')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.left('a'),
 *     E.filterOrElse(
 *       (n) => n > 0,
 *       () => 'error'
 *     )
 *   ),
 *   E.left('a')
 * )
 *
 * @category combinators
 * @since 3.0.0
 */
export const filterOrElse: {
  <A, B extends A, E>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (ma: Either<E, A>) => Either<E, B>
  <A, E>(predicate: Predicate<A>, onFalse: (a: A) => E): (ma: Either<E, A>) => Either<E, A>
} = filterOrElseW

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 3.0.0
 */
export const map: Functor2<URI>['map'] = (f) => (fa) => (isLeft(fa) ? fa : right(f(fa.right)))

/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category Bifunctor
 * @since 3.0.0
 */
export const bimap: Bifunctor2<URI>['bimap'] = (f, g) => (fa) => (isLeft(fa) ? left(f(fa.left)) : right(g(fa.right)))

/**
 * Map a function over the first type argument of a bifunctor.
 *
 * @category Bifunctor
 * @since 3.0.0
 */
export const mapLeft: Bifunctor2<URI>['mapLeft'] = (f) => (fa) => (isLeft(fa) ? left(f(fa.left)) : fa)

/**
 * Less strict version of [`ap`](#ap).
 *
 * @category Apply
 * @since 3.0.0
 */
export const apW: <E2, A>(fa: Either<E2, A>) => <E1, B>(fab: Either<E1, (a: A) => B>) => Either<E1 | E2, B> = (fa) => (
  fab
) => (isLeft(fab) ? fab : isLeft(fa) ? fa : right(fab.right(fa.right)))

/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 3.0.0
 */
export const ap: Apply2<URI>['ap'] = apW

/**
 * @category Pointed
 * @since 3.0.0
 */
export const of: Pointed2<URI>['of'] = right

/**
 * Less strict version of [`chain`](#chain).
 *
 * @category Monad
 * @since 3.0.0
 */
export const chainW = <A, E2, B>(f: (a: A) => Either<E2, B>) => <E1>(ma: Either<E1, A>): Either<E1 | E2, B> =>
  isLeft(ma) ? ma : f(ma.right)

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 3.0.0
 */
export const chain: Monad2<URI>['chain'] = chainW

/**
 * The `flatten` function is the conventional monad join operator. It is used to remove one level of monadic structure, projecting its bound argument into the outer level.
 *
 * Derivable from `Monad`.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(E.flatten(E.right(E.right('a'))), E.right('a'))
 * assert.deepStrictEqual(E.flatten(E.right(E.left('e'))), E.left('e'))
 * assert.deepStrictEqual(E.flatten(E.left('e')), E.left('e'))
 *
 * @category derivable combinators
 * @since 3.0.0
 */
export const flatten: <E, A>(mma: Either<E, Either<E, A>>) => Either<E, A> =
  /*#__PURE__*/
  chain(identity)

/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 3.0.0
 */
export const altW: <E2, B>(second: Lazy<Either<E2, B>>) => <E1, A>(first: Either<E1, A>) => Either<E1 | E2, A | B> = (
  that
) => (fa) => (isLeft(fa) ? that() : fa)

/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 3.0.0
 */
export const alt: Alt2<URI>['alt'] = altW

/**
 * @category Extend
 * @since 3.0.0
 */
export const extend: Extend2<URI>['extend'] = (f) => (wa) => (isLeft(wa) ? wa : right(f(wa)))

/**
 * Derivable from `Extend`.
 *
 * @category derivable combinators
 * @since 3.0.0
 */
export const duplicate: <E, A>(ma: Either<E, A>) => Either<E, Either<E, A>> =
  /*#__PURE__*/
  extend(identity)

/**
 * Left-associative fold of a structure.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 *
 * const startWith = 'prefix'
 * const concat = (a: string, b: string) => `${a}:${b}`
 *
 * assert.deepStrictEqual(
 *   pipe(E.right('a'), E.reduce(startWith, concat)),
 *   'prefix:a',
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(E.left('e'), E.reduce(startWith, concat)),
 *   'prefix',
 * )
 *
 * @category Foldable
 * @since 3.0.0
 */
export const reduce: Foldable2<URI>['reduce'] = (b, f) => (fa) => (isLeft(fa) ? b : f(b, fa.right))

/**
 * Map each element of the structure to a monoid, and combine the results.
 *
 * @example
 * import { pipe } from 'fp-ts/function';
 * import * as E from 'fp-ts/Either'
 * import { monoidString } from 'fp-ts/Monoid'
 *
 * const yell = (a: string) => `${a}!`
 *
 * assert.deepStrictEqual(
 *   pipe(E.right('a'), E.foldMap(monoidString)(yell)),
 *   'a!',
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(E.left('e'), E.foldMap(monoidString)(yell)),
 *   monoidString.empty,
 * )
 *
 * @category Foldable
 * @since 3.0.0
 */
export const foldMap: Foldable2<URI>['foldMap'] = (M) => (f) => (fa) => (isLeft(fa) ? M.empty : f(fa.right))

/**
 * Right-associative fold of a structure.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 *
 * const startWith = 'postfix'
 * const concat = (a: string, b: string) => `${a}:${b}`
 *
 * assert.deepStrictEqual(
 *   pipe(E.right('a'), E.reduceRight(startWith, concat)),
 *   'a:postfix',
 * )
 *
 * assert.deepStrictEqual(
 *   pipe(E.left('e'), E.reduceRight(startWith, concat)),
 *   'postfix',
 * )
 *
 * @category Foldable
 * @since 3.0.0
 */
export const reduceRight: Foldable2<URI>['reduceRight'] = (b, f) => (fa) => (isLeft(fa) ? b : f(fa.right, b))

/**
 * Map each element of a structure to an action, evaluate these actions from left to right, and collect the results.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as A from 'fp-ts/ReadonlyArray'
 * import * as E from 'fp-ts/Either'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(['a']), E.traverse(O.Applicative)(A.head)),
 *   O.some(E.right('a')),
 *  )
 *
 * assert.deepStrictEqual(
 *   pipe(E.right([]), E.traverse(O.Applicative)(A.head)),
 *   O.none,
 * )
 *
 * @category Traversable
 * @since 3.0.0
 */
export const traverse: Traversable2<URI>['traverse'] = <F>(F: ApplicativeHKT<F>) => <A, B>(f: (a: A) => HKT<F, B>) => <
  E
>(
  ta: Either<E, A>
): HKT<F, Either<E, B>> => (isLeft(ta) ? F.of(left(ta.left)) : pipe(f(ta.right), F.map(right)))

/**
 * Evaluate each monadic action in the structure from left to right, and collect the results.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as E from 'fp-ts/Either'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(O.some('a')), E.sequence(O.Applicative)),
 *   O.some(E.right('a')),
 *  )
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(O.none), E.sequence(O.Applicative)),
 *   O.none
 * )
 *
 * @category Traversable
 * @since 3.0.0
 */
export const sequence: Traversable2<URI>['sequence'] = <F>(F: ApplicativeHKT<F>) => <E, A>(
  ma: Either<E, HKT<F, A>>
): HKT<F, Either<E, A>> => (isLeft(ma) ? F.of(left(ma.left)) : pipe(ma.right, F.map(right)))

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @category instances
 * @since 3.0.0
 */
export const URI = 'Either'

/**
 * @category instances
 * @since 3.0.0
 */
export type URI = typeof URI

declare module './HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: Either<E, A>
  }
}

/**
 * @category instances
 * @since 3.0.0
 */
export const getShow = <E, A>(SE: Show<E>, SA: Show<A>): Show<Either<E, A>> => ({
  show: (ma) => (isLeft(ma) ? `left(${SE.show(ma.left)})` : `right(${SA.show(ma.right)})`)
})

/**
 * @category instances
 * @since 3.0.0
 */
export const getEq = <E, A>(EE: Eq<E>, EA: Eq<A>): Eq<Either<E, A>> =>
  fromEquals((second) => (first) =>
    isLeft(first)
      ? isLeft(second) && EE.equals(second.left)(first.left)
      : isRight(second) && EA.equals(second.right)(first.right)
  )

/**
 * Semigroup returning the left-most non-`Left` value. If both operands are `Right`s then the inner values are
 * concatenated using the provided `Semigroup`
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { semigroupSum } from 'fp-ts/Semigroup'
 * import { pipe } from 'fp-ts/function'
 *
 * const S = E.getSemigroup<number, string>(semigroupSum)
 * assert.deepStrictEqual(pipe(E.left('a'), S.concat(E.left('b'))), E.left('a'))
 * assert.deepStrictEqual(pipe(E.left('a'), S.concat(E.right(2))), E.right(2))
 * assert.deepStrictEqual(pipe(E.right(1), S.concat(E.left('b'))), E.right(1))
 * assert.deepStrictEqual(pipe(E.right(1), S.concat(E.right(2))), E.right(3))
 *
 * @category instances
 * @since 3.0.0
 */
export const getSemigroup = <A, E>(S: Semigroup<A>): Semigroup<Either<E, A>> => ({
  concat: (second) => (first) =>
    isLeft(second) ? first : isLeft(first) ? second : right(S.concat(second.right)(first.right))
})

/**
 * Semigroup returning the left-most `Left` value. If both operands are `Right`s then the inner values
 * are concatenated using the provided `Semigroup`
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { semigroupSum } from 'fp-ts/Semigroup'
 * import { pipe } from 'fp-ts/function'
 *
 * const S = E.getApplySemigroup<number, string>(semigroupSum)
 * assert.deepStrictEqual(pipe(E.left('a'), S.concat(E.left('b'))), E.left('a'))
 * assert.deepStrictEqual(pipe(E.left('a'), S.concat(E.right(2))), E.left('a'))
 * assert.deepStrictEqual(pipe(E.right(1), S.concat(E.left('b'))), E.left('b'))
 * assert.deepStrictEqual(pipe(E.right(1), S.concat(E.right(2))), E.right(3))
 *
 * @category instances
 * @since 3.0.0
 */
export const getApplySemigroup = <A, E>(S: Semigroup<A>): Semigroup<Either<E, A>> => ({
  concat: (second) => (first) =>
    isLeft(first) ? first : isLeft(second) ? second : right(S.concat(second.right)(first.right))
})

/**
 * @category instances
 * @since 3.0.0
 */
export const getApplyMonoid = <A, E>(M: Monoid<A>): Monoid<Either<E, A>> => ({
  concat: getApplySemigroup<A, E>(M).concat,
  empty: right(M.empty)
})

/**
 * Builds a `Compactable` instance for `Either` given `Monoid` for the left side.
 *
 * @category instances
 * @since 3.0.0
 */
export const getCompactable = <E>(M: Monoid<E>): Compactable2C<URI, E> => {
  const empty = left(M.empty)

  const compact: Compactable2C<URI, E>['compact'] = (ma) =>
    isLeft(ma) ? ma : ma.right._tag === 'None' ? empty : right(ma.right.value)

  const separate: Compactable2C<URI, E>['separate'] = (ma) =>
    isLeft(ma)
      ? { left: ma, right: ma }
      : isLeft(ma.right)
      ? { left: right(ma.right.left), right: empty }
      : { left: empty, right: right(ma.right.right) }

  return {
    URI,
    compact,
    separate
  }
}

/**
 * Builds a `Filterable` instance for `Either` given `Monoid` for the left side.
 *
 * @category instances
 * @since 3.0.0
 */
export const getFilterable = <E>(M: Monoid<E>): Filterable2C<URI, E> => {
  const empty = left(M.empty)

  const partitionMap = <A, B, C>(f: (a: A) => Either<B, C>) => (
    ma: Either<E, A>
  ): Separated<Either<E, B>, Either<E, C>> => {
    if (isLeft(ma)) {
      return { left: ma, right: ma }
    }
    const e = f(ma.right)
    return isLeft(e) ? { left: right(e.left), right: empty } : { left: empty, right: right(e.right) }
  }

  const partition = <A>(p: Predicate<A>) => (ma: Either<E, A>): Separated<Either<E, A>, Either<E, A>> => {
    return isLeft(ma)
      ? { left: ma, right: ma }
      : p(ma.right)
      ? { left: empty, right: right(ma.right) }
      : { left: right(ma.right), right: empty }
  }

  const filterMap = <A, B>(f: (a: A) => Option<B>) => (ma: Either<E, A>): Either<E, B> => {
    if (isLeft(ma)) {
      return ma
    }
    const ob = f(ma.right)
    return ob._tag === 'None' ? empty : right(ob.value)
  }

  const filter = <A>(predicate: Predicate<A>) => (ma: Either<E, A>): Either<E, A> =>
    isLeft(ma) ? ma : predicate(ma.right) ? ma : empty

  return {
    URI,
    filter,
    filterMap,
    partition,
    partitionMap
  }
}

/**
 * Builds `Witherable` instance for `Either` given `Monoid` for the left side
 *
 * @category instances
 * @since 3.0.0
 */
export const getWitherable = <E>(M: Monoid<E>): Witherable2C<URI, E> => {
  const C = getCompactable(M)

  const wither = <F>(
    F: ApplicativeHKT<F>
  ): (<A, B>(f: (a: A) => HKT<F, Option<B>>) => (ma: Either<E, A>) => HKT<F, Either<E, B>>) => {
    const traverseF = traverse(F)
    return (f) => (ma) => pipe(ma, traverseF(f), F.map(C.compact))
  }

  const wilt = <F>(
    F: ApplicativeHKT<F>
  ): (<A, B, C>(
    f: (a: A) => HKT<F, Either<B, C>>
  ) => (ma: Either<E, A>) => HKT<F, Separated<Either<E, B>, Either<E, C>>>) => {
    const traverseF = traverse(F)
    return (f) => (ma) => pipe(ma, traverseF(f), F.map(C.separate))
  }

  return {
    URI,
    wither,
    wilt
  }
}

/**
 * @category instances
 * @since 3.0.0
 */
export const getApplicativeValidation = <E>(S: Semigroup<E>): Applicative2C<URI, E> => ({
  URI,
  map,
  ap: (fa) => (fab) =>
    isLeft(fab) ? (isLeft(fa) ? left(S.concat(fa.left)(fab.left)) : fab) : isLeft(fa) ? fa : right(fab.right(fa.right)),
  of
})

/**
 * @category instances
 * @since 3.0.0
 */
export const getAltValidation = <E>(S: Semigroup<E>): Alt2C<URI, E> => ({
  URI,
  map,
  alt: (second) => (first) => {
    if (isRight(first)) {
      return first
    }
    const ea = second()
    return isLeft(ea) ? left(S.concat(ea.left)(first.left)) : ea
  }
})

/**
 * @category instances
 * @since 3.0.0
 */
export const getValidationSemigroup = <E, A>(SE: Semigroup<E>, SA: Semigroup<A>): Semigroup<Either<E, A>> => ({
  concat: (second) => (first) =>
    isLeft(first)
      ? isLeft(second)
        ? left(SE.concat(second.left)(first.left))
        : first
      : isLeft(second)
      ? second
      : right(SA.concat(second.right)(first.right))
})

/**
 * @category instances
 * @since 3.0.0
 */
export const getValidationMonoid = <E, A>(SE: Semigroup<E>, MA: Monoid<A>): Monoid<Either<E, A>> => ({
  concat: getValidationSemigroup(SE, MA).concat,
  empty: right(MA.empty)
})

/**
 * @category instances
 * @since 3.0.0
 */
export const Functor: Functor2<URI> = {
  URI,
  map
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Pointed: Pointed2<URI> = {
  URI,
  map,
  of
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Apply: Apply2<URI> = {
  URI,
  map,
  ap
}

/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category derivable combinators
 * @since 3.0.0
 */
export const apFirst =
  /*#__PURE__*/
  apFirst_(Apply)

/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category derivable combinators
 * @since 3.0.0
 */
export const apSecond =
  /*#__PURE__*/
  apSecond_(Apply)

/**
 * @category instances
 * @since 3.0.0
 */
export const Applicative: Applicative2<URI> = {
  URI,
  map,
  ap,
  of
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Monad: Monad2<URI> = {
  URI,
  map,
  of,
  chain
}

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Monad`.
 *
 * @category derivable combinators
 * @since 3.0.0
 */
export const chainFirst =
  /*#__PURE__*/
  chainFirst_(Monad)

/**
 * Less strict version of [`chainFirst`](#chainFirst)
 *
 * @category combinators
 * @since 3.0.0
 */
export const chainFirstW: <A, E2, B>(
  f: (a: A) => Either<E2, B>
) => <E1>(first: Either<E1, A>) => Either<E1 | E2, A> = chainFirst as any

/**
 * @category instances
 * @since 3.0.0
 */
export const Foldable: Foldable2<URI> = {
  URI,
  reduce,
  foldMap,
  reduceRight
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Traversable: Traversable2<URI> = {
  URI,
  map,
  traverse,
  sequence
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Bifunctor: Bifunctor2<URI> = {
  URI,
  bimap,
  mapLeft
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Alt: Alt2<URI> = {
  URI,
  map,
  alt
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Extend: Extend2<URI> = {
  URI,
  map,
  extend
}

/**
 * @category instances
 * @since 3.0.0
 */
export const FromEither: FromEither2<URI> = {
  URI,
  fromEither: identity
}

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * Tests whether a value is a member of a `Either`.
 *
 * @since 3.0.0
 */
export const elem = <A>(E: Eq<A>) => (a: A) => <E>(ma: Either<E, A>): boolean =>
  isLeft(ma) ? false : E.equals(ma.right)(a)

/**
 * Returns `false` if `Left` or returns the result of the application of the given predicate to the `Right` value.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 *
 * const f = E.exists((n: number) => n > 2)
 *
 * assert.strictEqual(f(E.left('a')), false)
 * assert.strictEqual(f(E.right(1)), false)
 * assert.strictEqual(f(E.right(3)), true)
 *
 * @since 3.0.0
 */
export const exists = <A>(predicate: Predicate<A>) => <E>(ma: Either<E, A>): boolean =>
  isLeft(ma) ? false : predicate(ma.right)

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const Do: Either<never, {}> =
  /*#__PURE__*/
  of({})

/**
 * @since 3.0.0
 */
export const bindTo =
  /*#__PURE__*/
  bindTo_(Functor)

/**
 * @since 3.0.0
 */
export const bind =
  /*#__PURE__*/
  bind_(Monad)

/**
 * Less strict version of [`bind`](#bind).
 *
 * @since 3.0.0
 */
export const bindW: <N extends string, A, E2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Either<E2, B>
) => <E1>(fa: Either<E1, A>) => Either<E1 | E2, { [K in keyof A | N]: K extends keyof A ? A[K] : B }> = bind as any

// -------------------------------------------------------------------------------------
// sequence S
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const apS =
  /*#__PURE__*/
  apS_(Applicative)

/**
 * Less strict version of [`apS`](#apS).
 *
 * @since 3.0.0
 */
export const apSW: <A, N extends string, E2, B>(
  name: Exclude<N, keyof A>,
  fb: Either<E2, B>
) => <E1>(fa: Either<E1, A>) => Either<E1 | E2, { [K in keyof A | N]: K extends keyof A ? A[K] : B }> = apS as any

// -------------------------------------------------------------------------------------
// sequence T
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const ApT: Either<never, readonly []> = of([])

/**
 * @since 3.0.0
 */
export const tupled =
  /*#__PURE__*/
  tupled_(Functor)

/**
 * @since 3.0.0
 */
export const apT =
  /*#__PURE__*/
  apT_(Applicative)

/**
 * Less strict version of [`apT`](#apT).
 *
 * @since 3.0.0
 */
export const apTW: <E2, B>(
  fb: Either<E2, B>
) => <E1, A extends ReadonlyArray<unknown>>(fas: Either<E1, A>) => Either<E1 | E2, readonly [...A, B]> = apT as any

// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------

/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @since 3.0.0
 */
export const traverseReadonlyArrayWithIndex = <A, E, B>(f: (index: number, a: A) => Either<E, B>) => (
  as: ReadonlyArray<A>
): Either<E, ReadonlyArray<B>> => {
  // tslint:disable-next-line: readonly-array
  const out: Array<B> = []
  for (let i = 0; i < as.length; i++) {
    const e = f(i, as[i])
    if (isLeft(e)) {
      return e
    }
    out.push(e.right)
  }
  return right(out)
}

/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @since 3.0.0
 */
export const traverseReadonlyArray: <A, E, B>(
  f: (a: A) => Either<E, B>
) => (as: ReadonlyArray<A>) => Either<E, ReadonlyArray<B>> = (f) => traverseReadonlyArrayWithIndex((_, a) => f(a))

/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @since 3.0.0
 */
export const sequenceReadonlyArray: <E, A>(as: ReadonlyArray<Either<E, A>>) => Either<E, ReadonlyArray<A>> =
  /*#__PURE__*/
  traverseReadonlyArray(identity)
