/**
 * @since 3.0.0
 */
import type { TypeLambda, Kind, TypeClass } from '../HKT'

/**
 * @category model
 * @since 3.0.0
 */
export interface Invariant<F extends TypeLambda> extends TypeClass<F> {
  readonly imap: <S, T>(
    f: (s: S) => T,
    g: (t: T) => S
  ) => <R, O, E, A>(self: Kind<F, S, R, O, E, A>) => Kind<F, T, R, O, E, A>
}