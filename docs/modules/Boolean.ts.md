---
title: Boolean.ts
nav_order: 2
parent: Modules
---

## Boolean overview

This module provides utility functions and type class instances for working with the `boolean` type in TypeScript.
It includes functions for basic boolean operations, as well as type class instances for
`Equivalence`, `Order`, `Semigroup`, and `Monoid`.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [and](#and)
  - [not](#not)
  - [or](#or)
- [guards](#guards)
  - [isBoolean](#isboolean)
- [instances](#instances)
  - [Equivalence](#equivalence)
  - [MonoidAll](#monoidall)
  - [MonoidAny](#monoidany)
  - [Order](#order)
  - [SemigroupAll](#semigroupall)
  - [SemigroupAny](#semigroupany)
- [pattern matching](#pattern-matching)
  - [match](#match)
- [utils](#utils)
  - [all](#all)
  - [any](#any)

---

# combinators

## and

**Signature**

```ts
export declare const and: (that: boolean) => (self: boolean) => boolean
```

Added in v1.0.0

## not

**Signature**

```ts
export declare const not: (self: boolean) => boolean
```

Added in v1.0.0

## or

**Signature**

```ts
export declare const or: (that: boolean) => (self: boolean) => boolean
```

Added in v1.0.0

# guards

## isBoolean

**Signature**

```ts
export declare const isBoolean: any
```

Added in v1.0.0

# instances

## Equivalence

**Signature**

```ts
export declare const Equivalence: any
```

Added in v1.0.0

## MonoidAll

`boolean` monoid under conjunction.

The `empty` value is `true`.

**Signature**

```ts
export declare const MonoidAll: any
```

Added in v1.0.0

## MonoidAny

`boolean` monoid under disjunction.

The `empty` value is `false`.

**Signature**

```ts
export declare const MonoidAny: any
```

Added in v1.0.0

## Order

**Signature**

```ts
export declare const Order: any
```

Added in v1.0.0

## SemigroupAll

`boolean` semigroup under conjunction.

**Signature**

```ts
export declare const SemigroupAll: any
```

**Example**

```ts
import { SemigroupAll } from '@fp-ts/core/Boolean'
import { pipe } from '@fp-ts/core/Function'

assert.deepStrictEqual(SemigroupAll.combine(true, true), true)
assert.deepStrictEqual(SemigroupAll.combine(true, false), false)
```

Added in v1.0.0

## SemigroupAny

`boolean` semigroup under disjunction.

**Signature**

```ts
export declare const SemigroupAny: any
```

**Example**

```ts
import { SemigroupAny } from '@fp-ts/core/Boolean'
import { pipe } from '@fp-ts/core/Function'

assert.deepStrictEqual(SemigroupAny.combine(true, true), true)
assert.deepStrictEqual(SemigroupAny.combine(true, false), true)
assert.deepStrictEqual(SemigroupAny.combine(false, false), false)
```

Added in v1.0.0

# pattern matching

## match

Defines the match over a boolean value.
Takes two thunks `onTrue`, `onFalse` and a `boolean` value.
If `value` is `false`, `onFalse()` is returned, otherwise `onTrue()`.

**Signature**

```ts
export declare const match: <A, B = A>(onFalse: any, onTrue: any) => (value: boolean) => A | B
```

**Example**

```ts
import { some, map } from '@fp-ts/core/Option'
import { pipe } from '@fp-ts/core/Function'
import { match } from '@fp-ts/core/Boolean'

assert.deepStrictEqual(
  pipe(
    some(true),
    map(
      match(
        () => 'false',
        () => 'true'
      )
    )
  ),
  some('true')
)
```

Added in v1.0.0

# utils

## all

**Signature**

```ts
export declare const all: any
```

Added in v1.0.0

## any

**Signature**

```ts
export declare const any: any
```

Added in v1.0.0