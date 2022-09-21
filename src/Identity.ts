/**
 * @since 3.0.0
 */
import type * as alt_ from './Alt'
import * as apply_ from './Apply'
import type * as applicative from './Applicative'
import * as chainable from './Chainable'
import * as chainableRec from './ChainableRec'
import type * as comonad from './Comonad'
import type { Either } from './Either'
import type { Eq } from './Eq'
import type * as foldable from './Foldable'
import { apply, flow, identity } from './function'
import * as functor from './Functor'
import type { HKT, Kind } from './HKT'
import * as _ from './internal'
import type * as monad from './Monad'
import type { Monoid } from './Monoid'
import type * as pointed from './Pointed'
import type { Show } from './Show'
import * as traversable from './Traversable'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 3.0.0
 */
export type Identity<A> = A

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 3.0.0
 */
export const map: <A, B>(f: (a: A) => B) => (fa: Identity<A>) => Identity<B> = identity

/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 3.0.0
 */
export const ap: <A>(fa: Identity<A>) => <B>(fab: Identity<(a: A) => B>) => Identity<B> = apply

/**
 * @category Pointed
 * @since 3.0.0
 */
export const of: <A>(a: A) => Identity<A> = identity

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Chainable
 * @since 3.0.0
 */
export const chain: <A, B>(f: (a: A) => Identity<B>) => (ma: Identity<A>) => Identity<B> = (f) => (ma) => f(ma)

/**
 * @category Extendable
 * @since 3.0.0
 */
export const extend: <A, B>(f: (wa: Identity<A>) => B) => (wa: Identity<A>) => B = (f) => (wa) => f(wa)

/**
 * @category Extract
 * @since 3.0.0
 */
export const extract: <A>(wa: Identity<A>) => A = identity

/**
 * Derivable from `Extendable`.
 *
 * @category derivable combinators
 * @since 3.0.0
 */
export const duplicate: <A>(ma: Identity<A>) => Identity<Identity<A>> = /*#__PURE__*/ extend(identity)

/**
 * Derivable from `Chainable`.
 *
 * @category derivable combinators
 * @since 3.0.0
 */
export const flatten: <A>(mma: Identity<Identity<A>>) => Identity<A> = /*#__PURE__*/ chain(identity)

/**
 * @category Foldable
 * @since 3.0.0
 */
export const reduce: <B, A>(b: B, f: (b: B, a: A) => B) => (fa: Identity<A>) => B = (b, f) => (fa) => f(b, fa)

/**
 * @category Foldable
 * @since 3.0.0
 */
export const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (fa: Identity<A>) => M = () => (f) => (fa) => f(fa)

/**
 * @category Foldable
 * @since 3.0.0
 */
export const reduceRight: <B, A>(b: B, f: (a: A, b: B) => B) => (fa: Identity<A>) => B = (b, f) => (fa) => f(fa, b)

/**
 * @category Traversable
 * @since 3.0.0
 */
export const traverse: <F extends HKT>(
  F: applicative.Applicative<F>
) => <A, S, R, W, E, B>(f: (a: A) => Kind<F, S, R, W, E, B>) => (ta: Identity<A>) => Kind<F, S, R, W, E, B> =
  (F) => (f) =>
    flow(f, F.map(identity))

/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 3.0.0
 */
export const alt: <B>(second: () => Identity<B>) => <A>(first: Identity<A>) => Identity<A | B> = () => identity

/**
 * @category ChainableRec
 * @since 3.0.0
 */
export const chainRec: <A, B>(f: (a: A) => Identity<Either<A, B>>) => (a: A) => B = chainableRec.tailRec

// -------------------------------------------------------------------------------------
// HKT
// -------------------------------------------------------------------------------------

/**
 * @category HKT
 * @since 3.0.0
 */
export interface IdentityF extends HKT {
  readonly type: Identity<this['Covariant1']>
}

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @category instances
 * @since 3.0.0
 */
export const getShow: <A>(S: Show<A>) => Show<Identity<A>> = identity

/**
 * @category instances
 * @since 3.0.0
 */
export const getEq: <A>(E: Eq<A>) => Eq<Identity<A>> = identity

/**
 * @category instances
 * @since 3.0.0
 */
export const Functor: functor.Functor<IdentityF> = {
  map
}

/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 3.0.0
 */
export const flap: <A>(a: A) => <B>(fab: Identity<(a: A) => B>) => B = /*#__PURE__*/ functor.flap(Functor)

/**
 * @category instances
 * @since 3.0.0
 */
export const Pointed: pointed.Pointed<IdentityF> = {
  of
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Apply: apply_.Apply<IdentityF> = {
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
export const apFirst: <B>(second: Identity<B>) => <A>(first: Identity<A>) => Identity<A> =
  /*#__PURE__*/ apply_.apFirst(Apply)

/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category derivable combinators
 * @since 3.0.0
 */
export const apSecond: <B>(second: Identity<B>) => <A>(first: Identity<A>) => Identity<B> =
  /*#__PURE__*/ apply_.apSecond(Apply)

/**
 * @category instances
 * @since 3.0.0
 */
export const Applicative: applicative.Applicative<IdentityF> = {
  map,
  ap,
  of
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Chain: chainable.Chainable<IdentityF> = {
  map,
  chain
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Monad: monad.Monad<IdentityF> = {
  map,
  of,
  chain
}

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chainable`.
 *
 * @category derivable combinators
 * @since 3.0.0
 */
export const chainFirst: <A, B>(f: (a: A) => Identity<B>) => (first: Identity<A>) => Identity<A> =
  /*#__PURE__*/ chainable.chainFirst(Chain)

/**
 * @category instances
 * @since 3.0.0
 */
export const ChainRec: chainableRec.ChainableRec<IdentityF> = {
  chainRec
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Foldable: foldable.Foldable<IdentityF> = {
  reduce,
  foldMap,
  reduceRight
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Traversable: traversable.Traversable<IdentityF> = {
  traverse
}

/**
 * @since 3.0.0
 */
export const sequence: <F extends HKT>(
  F: applicative.Applicative<F>
) => <S, R, W, E, A>(fas: Identity<Kind<F, S, R, W, E, A>>) => Kind<F, S, R, W, E, Identity<A>> =
  /*#__PURE__*/ traversable.sequence<IdentityF>(Traversable)

/**
 * @category instances
 * @since 3.0.0
 */
export const Alt: alt_.Alt<IdentityF> = {
  map,
  alt
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Comonad: comonad.Comonad<IdentityF> = {
  map,
  extend,
  extract
}

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const Do: Identity<{}> = /*#__PURE__*/ of(_.emptyRecord)

/**
 * @since 3.0.0
 */
export const bindTo: <N extends string>(name: N) => <A>(fa: Identity<A>) => { readonly [K in N]: A } =
  /*#__PURE__*/ functor.bindTo(Functor)

const let_: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (fa: A) => { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B } = /*#__PURE__*/ functor.let(Functor)

export {
  /**
   * @since 3.0.0
   */
  let_ as let
}

/**
 * @since 3.0.0
 */
export const bind: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Identity<B>
) => (ma: Identity<A>) => { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B } =
  /*#__PURE__*/ chainable.bind(Chain)

// -------------------------------------------------------------------------------------
// sequence S
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const apS: <N extends string, A, B>(
  name: Exclude<N, keyof A>,
  fb: Identity<B>
) => (fa: Identity<A>) => { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B } =
  /*#__PURE__*/ apply_.apS(Apply)

// -------------------------------------------------------------------------------------
// sequence T
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const ApT: Identity<readonly []> = /*#__PURE__*/ of(_.emptyReadonlyArray)

/**
 * @since 3.0.0
 */
export const tupled: <A>(fa: Identity<A>) => readonly [A] = /*#__PURE__*/ functor.tupled(Functor)

/**
 * @since 3.0.0
 */
export const apT: <B>(fb: B) => <A extends ReadonlyArray<unknown>>(fas: A) => readonly [...A, B] =
  /*#__PURE__*/ apply_.apT(Apply)
