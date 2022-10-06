---
title: AsyncThese.ts
nav_order: 8
parent: Modules
---

## AsyncThese overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [both](#both)
  - [fail](#fail)
  - [sleep](#sleep)
  - [succeed](#succeed)
- [conversions](#conversions)
  - [failAsync](#failasync)
  - [failSync](#failsync)
  - [fromAsync](#fromasync)
  - [fromNullable](#fromnullable)
  - [fromOption](#fromoption)
  - [fromResult](#fromresult)
  - [fromSync](#fromsync)
  - [fromSyncResult](#fromsyncresult)
  - [fromThese](#fromthese)
- [error handling](#error-handling)
  - [mapError](#maperror)
- [instances](#instances)
  - [Bifunctor](#bifunctor)
  - [FromAsync](#fromasync)
  - [FromIdentity](#fromidentity)
  - [FromResult](#fromresult)
  - [FromSync](#fromsync)
  - [FromThese](#fromthese)
  - [Functor](#functor)
  - [getApplicative](#getapplicative)
  - [getApply](#getapply)
  - [getFlattenable](#getflattenable)
  - [getMonad](#getmonad)
- [lifting](#lifting)
  - [liftAsync](#liftasync)
  - [liftNullable](#liftnullable)
  - [liftOption](#liftoption)
  - [liftPredicate](#liftpredicate)
  - [liftResult](#liftresult)
  - [liftSync](#liftsync)
  - [liftThese](#liftthese)
- [logging](#logging)
  - [log](#log)
  - [logError](#logerror)
- [mapping](#mapping)
  - [as](#as)
  - [flap](#flap)
  - [map](#map)
  - [mapBoth](#mapboth)
  - [unit](#unit)
- [model](#model)
  - [AsyncThese (interface)](#asyncthese-interface)
- [pattern matching](#pattern-matching)
  - [match](#match)
  - [matchAsync](#matchasync)
- [traversing](#traversing)
  - [sequenceReadonlyArray](#sequencereadonlyarray)
  - [sequenceReadonlyArrayPar](#sequencereadonlyarraypar)
  - [traverseNonEmptyReadonlyArray](#traversenonemptyreadonlyarray)
  - [traverseNonEmptyReadonlyArrayPar](#traversenonemptyreadonlyarraypar)
  - [traverseNonEmptyReadonlyArrayWithIndex](#traversenonemptyreadonlyarraywithindex)
  - [traverseNonEmptyReadonlyArrayWithIndexPar](#traversenonemptyreadonlyarraywithindexpar)
  - [traverseReadonlyArray](#traversereadonlyarray)
  - [traverseReadonlyArrayPar](#traversereadonlyarraypar)
  - [traverseReadonlyArrayWithIndex](#traversereadonlyarraywithindex)
  - [traverseReadonlyArrayWithIndexPar](#traversereadonlyarraywithindexpar)
- [tuple sequencing](#tuple-sequencing)
  - [Zip](#zip)
- [type lambdas](#type-lambdas)
  - [AsyncTheseTypeLambda (interface)](#asyncthesetypelambda-interface)
- [utils](#utils)
  - [swap](#swap)
  - [toTuple2](#totuple2)

---

# constructors

## both

**Signature**

```ts
export declare const both: <E, A>(e: E, a: A) => AsyncThese<E, A>
```

Added in v3.0.0

## fail

**Signature**

```ts
export declare const fail: <E>(e: E) => AsyncThese<E, never>
```

Added in v3.0.0

## sleep

Returns an effect that suspends for the specified `duration` (in millis).

**Signature**

```ts
export declare const sleep: (duration: number) => AsyncThese<never, void>
```

Added in v3.0.0

## succeed

**Signature**

```ts
export declare const succeed: <A>(a: A) => AsyncThese<never, A>
```

Added in v3.0.0

# conversions

## failAsync

**Signature**

```ts
export declare const failAsync: <E>(me: async.Async<E>) => AsyncThese<E, never>
```

Added in v3.0.0

## failSync

**Signature**

```ts
export declare const failSync: <E>(me: Sync<E>) => AsyncThese<E, never>
```

Added in v3.0.0

## fromAsync

**Signature**

```ts
export declare const fromAsync: <A>(ma: async.Async<A>) => AsyncThese<never, A>
```

Added in v3.0.0

## fromNullable

**Signature**

```ts
export declare const fromNullable: <E>(onNullable: E) => <A>(a: A) => AsyncThese<E, NonNullable<A>>
```

Added in v3.0.0

## fromOption

**Signature**

```ts
export declare const fromOption: <E>(onNone: E) => <A>(fa: Option<A>) => AsyncThese<E, A>
```

Added in v3.0.0

## fromResult

**Signature**

```ts
export declare const fromResult: <E, A>(fa: Result<E, A>) => AsyncThese<E, A>
```

Added in v3.0.0

## fromSync

**Signature**

```ts
export declare const fromSync: <A>(ma: Sync<A>) => AsyncThese<never, A>
```

Added in v3.0.0

## fromSyncResult

**Signature**

```ts
export declare const fromSyncResult: <E, A>(fa: SyncResult<E, A>) => AsyncThese<E, A>
```

Added in v3.0.0

## fromThese

**Signature**

```ts
export declare const fromThese: <E, A>(fa: these.These<E, A>) => AsyncThese<E, A>
```

Added in v3.0.0

# error handling

## mapError

Returns an effect with its error channel mapped using the specified
function. This can be used to lift a "smaller" error into a "larger" error.

**Signature**

```ts
export declare const mapError: <E, G>(f: (e: E) => G) => <A>(self: AsyncThese<E, A>) => AsyncThese<G, A>
```

Added in v3.0.0

# instances

## Bifunctor

**Signature**

```ts
export declare const Bifunctor: bifunctor.Bifunctor<AsyncTheseTypeLambda>
```

Added in v3.0.0

## FromAsync

**Signature**

```ts
export declare const FromAsync: fromAsync_.FromAsync<AsyncTheseTypeLambda>
```

Added in v3.0.0

## FromIdentity

**Signature**

```ts
export declare const FromIdentity: fromIdentity.FromIdentity<AsyncTheseTypeLambda>
```

Added in v3.0.0

## FromResult

**Signature**

```ts
export declare const FromResult: fromResult_.FromResult<AsyncTheseTypeLambda>
```

Added in v3.0.0

## FromSync

**Signature**

```ts
export declare const FromSync: fromSync_.FromSync<AsyncTheseTypeLambda>
```

Added in v3.0.0

## FromThese

**Signature**

```ts
export declare const FromThese: fromThese_.FromThese<AsyncTheseTypeLambda>
```

Added in v3.0.0

## Functor

**Signature**

```ts
export declare const Functor: functor.Functor<AsyncTheseTypeLambda>
```

Added in v3.0.0

## getApplicative

**Signature**

```ts
export declare const getApplicative: <E>(
  Apply: Apply<async.AsyncTypeLambda>,
  Semigroup: Semigroup<E>
) => Applicative<ValidatedT<AsyncTheseTypeLambda, E>>
```

Added in v3.0.0

## getApply

**Signature**

```ts
export declare const getApply: <E>(
  Apply: Apply<async.AsyncTypeLambda>,
  Semigroup: Semigroup<E>
) => Apply<ValidatedT<AsyncTheseTypeLambda, E>>
```

Added in v3.0.0

## getFlattenable

**Signature**

```ts
export declare const getFlattenable: <E>(S: Semigroup<E>) => Flattenable<ValidatedT<AsyncTheseTypeLambda, E>>
```

Added in v3.0.0

## getMonad

**Signature**

```ts
export declare const getMonad: <E>(S: Semigroup<E>) => Monad<ValidatedT<AsyncTheseTypeLambda, E>>
```

Added in v3.0.0

# lifting

## liftAsync

**Signature**

```ts
export declare const liftAsync: <A extends readonly unknown[], B>(
  f: (...a: A) => async.Async<B>
) => (...a: A) => AsyncThese<never, B>
```

Added in v3.0.0

## liftNullable

**Signature**

```ts
export declare const liftNullable: <A extends readonly unknown[], B, E>(
  f: (...a: A) => B | null | undefined,
  onNullable: E
) => (...a: A) => AsyncThese<E, NonNullable<B>>
```

Added in v3.0.0

## liftOption

**Signature**

```ts
export declare const liftOption: <A extends readonly unknown[], B, E>(
  f: (...a: A) => Option<B>,
  onNone: E
) => (...a: A) => AsyncThese<E, B>
```

Added in v3.0.0

## liftPredicate

**Signature**

```ts
export declare const liftPredicate: {
  <C extends A, B extends A, E, A = C>(refinement: Refinement<A, B>, onFalse: E): (c: C) => AsyncThese<E, B>
  <B extends A, E, A = B>(predicate: Predicate<A>, onFalse: E): (b: B) => AsyncThese<E, B>
}
```

Added in v3.0.0

## liftResult

**Signature**

```ts
export declare const liftResult: <A extends readonly unknown[], E, B>(
  f: (...a: A) => Result<E, B>
) => (...a: A) => AsyncThese<E, B>
```

Added in v3.0.0

## liftSync

**Signature**

```ts
export declare const liftSync: <A extends readonly unknown[], B>(
  f: (...a: A) => Sync<B>
) => <E>(...a: A) => AsyncThese<E, B>
```

Added in v3.0.0

## liftThese

**Signature**

```ts
export declare const liftThese: <A extends readonly unknown[], E, B>(
  f: (...a: A) => these.These<E, B>
) => (...a: A) => AsyncThese<E, B>
```

Added in v3.0.0

# logging

## log

**Signature**

```ts
export declare const log: <A extends readonly unknown[]>(...x: A) => AsyncThese<never, void>
```

Added in v3.0.0

## logError

**Signature**

```ts
export declare const logError: <A extends readonly unknown[]>(...x: A) => AsyncThese<never, void>
```

Added in v3.0.0

# mapping

## as

Maps the success value of this effect to the specified constant value.

**Signature**

```ts
export declare const as: <B>(b: B) => <E>(self: AsyncThese<E, unknown>) => AsyncThese<E, B>
```

Added in v3.0.0

## flap

**Signature**

```ts
export declare const flap: <A>(a: A) => <E, B>(fab: AsyncThese<E, (a: A) => B>) => AsyncThese<E, B>
```

Added in v3.0.0

## map

Returns an effect whose success is mapped by the specified `f` function.

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: AsyncThese<E, A>) => AsyncThese<E, B>
```

Added in v3.0.0

## mapBoth

Returns an effect whose failure and success channels have been mapped by
the specified pair of functions, `f` and `g`.

**Signature**

```ts
export declare const mapBoth: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => (self: AsyncThese<E, A>) => AsyncThese<G, B>
```

Added in v3.0.0

## unit

Returns the effect resulting from mapping the success of this effect to unit.

**Signature**

```ts
export declare const unit: <E>(self: AsyncThese<E, unknown>) => AsyncThese<E, void>
```

Added in v3.0.0

# model

## AsyncThese (interface)

**Signature**

```ts
export interface AsyncThese<E, A> extends Async<These<E, A>> {}
```

Added in v3.0.0

# pattern matching

## match

**Signature**

```ts
export declare const match: <E, B, A, C = B, D = B>(
  onError: (e: E) => B,
  onSuccess: (a: A) => C,
  onBoth: (e: E, a: A) => D
) => (self: AsyncThese<E, A>) => async.Async<B | C | D>
```

Added in v3.0.0

## matchAsync

**Signature**

```ts
export declare const matchAsync: <E, B, A, C = B, D = B>(
  onError: (e: E) => async.Async<B>,
  onSuccess: (a: A) => async.Async<C>,
  onBoth: (e: E, a: A) => async.Async<D>
) => (self: AsyncThese<E, A>) => async.Async<B | C | D>
```

Added in v3.0.0

# traversing

## sequenceReadonlyArray

Equivalent to `ReadonlyArray#sequence(getApplicative(T.Applicative, S))`.

**Signature**

```ts
export declare const sequenceReadonlyArray: <E>(
  S: Semigroup<E>
) => <A>(arr: readonly AsyncThese<E, A>[]) => AsyncThese<E, readonly A[]>
```

Added in v3.0.0

## sequenceReadonlyArrayPar

Equivalent to `ReadonlyArray#sequence(getApplicative(T.ApplicativePar, S))`.

**Signature**

```ts
export declare const sequenceReadonlyArrayPar: <E>(
  S: Semigroup<E>
) => <A>(arr: readonly AsyncThese<E, A>[]) => AsyncThese<E, readonly A[]>
```

Added in v3.0.0

## traverseNonEmptyReadonlyArray

Equivalent to `NonEmptyReadonlyArray#traverse(getApply(T.Apply, S))`.

**Signature**

```ts
export declare const traverseNonEmptyReadonlyArray: <E>(
  S: Semigroup<E>
) => <A, B>(f: (a: A) => AsyncThese<E, B>) => (as: readonly [A, ...A[]]) => AsyncThese<E, readonly [B, ...B[]]>
```

Added in v3.0.0

## traverseNonEmptyReadonlyArrayPar

Equivalent to `NonEmptyReadonlyArray#traverse(getApply(T.ApplyPar, S))`.

**Signature**

```ts
export declare const traverseNonEmptyReadonlyArrayPar: <E>(
  S: Semigroup<E>
) => <A, B>(f: (a: A) => AsyncThese<E, B>) => (as: readonly [A, ...A[]]) => AsyncThese<E, readonly [B, ...B[]]>
```

Added in v3.0.0

## traverseNonEmptyReadonlyArrayWithIndex

Equivalent to `NonEmptyReadonlyArray#traverseWithIndex(getApply(T.Apply, S))`.

**Signature**

```ts
export declare const traverseNonEmptyReadonlyArrayWithIndex: <E>(
  S: Semigroup<E>
) => <A, B>(
  f: (index: number, a: A) => AsyncThese<E, B>
) => (as: readonly [A, ...A[]]) => AsyncThese<E, readonly [B, ...B[]]>
```

Added in v3.0.0

## traverseNonEmptyReadonlyArrayWithIndexPar

Equivalent to `NonEmptyReadonlyArray#traverseWithIndex(getApply(T.ApplyPar, S))`.

**Signature**

```ts
export declare const traverseNonEmptyReadonlyArrayWithIndexPar: <E>(
  S: Semigroup<E>
) => <A, B>(
  f: (index: number, a: A) => AsyncThese<E, B>
) => (as: readonly [A, ...A[]]) => AsyncThese<E, readonly [B, ...B[]]>
```

Added in v3.0.0

## traverseReadonlyArray

Equivalent to `ReadonlyArray#traverse(getApplicative(T.Applicative, S))`.

**Signature**

```ts
export declare const traverseReadonlyArray: <E>(
  S: Semigroup<E>
) => <A, B>(f: (a: A) => AsyncThese<E, B>) => (as: readonly A[]) => AsyncThese<E, readonly B[]>
```

Added in v3.0.0

## traverseReadonlyArrayPar

Equivalent to `ReadonlyArray#traverse(getApplicative(T.ApplicativePar, S))`.

**Signature**

```ts
export declare const traverseReadonlyArrayPar: <E>(
  S: Semigroup<E>
) => <A, B>(f: (a: A) => AsyncThese<E, B>) => (as: readonly A[]) => AsyncThese<E, readonly B[]>
```

Added in v3.0.0

## traverseReadonlyArrayWithIndex

Equivalent to `ReadonlyArray#traverseWithIndex(getApplicative(T.Applicative, S))`.

**Signature**

```ts
export declare const traverseReadonlyArrayWithIndex: <E>(
  S: Semigroup<E>
) => <A, B>(f: (index: number, a: A) => AsyncThese<E, B>) => (as: readonly A[]) => AsyncThese<E, readonly B[]>
```

Added in v3.0.0

## traverseReadonlyArrayWithIndexPar

Equivalent to `ReadonlyArray#traverseWithIndex(getApplicative(T.ApplicativePar, S))`.

**Signature**

```ts
export declare const traverseReadonlyArrayWithIndexPar: <E>(
  S: Semigroup<E>
) => <A, B>(f: (index: number, a: A) => AsyncThese<E, B>) => (as: readonly A[]) => AsyncThese<E, readonly B[]>
```

Added in v3.0.0

# tuple sequencing

## Zip

**Signature**

```ts
export declare const Zip: AsyncThese<never, readonly []>
```

Added in v3.0.0

# type lambdas

## AsyncTheseTypeLambda (interface)

**Signature**

```ts
export interface AsyncTheseTypeLambda extends TypeLambda {
  readonly type: AsyncThese<this['Out2'], this['Out1']>
}
```

Added in v3.0.0

# utils

## swap

**Signature**

```ts
export declare const swap: <E, A>(self: async.Async<these.These<E, A>>) => async.Async<these.These<A, E>>
```

Added in v3.0.0

## toTuple2

**Signature**

```ts
export declare const toTuple2: <E, A>(e: E, a: A) => (fa: AsyncThese<E, A>) => async.Async<readonly [E, A]>
```

Added in v3.0.0