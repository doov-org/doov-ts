import { ContextAccessor } from 'dsl/ContextAccessor';
import { Context } from 'dsl/Context';
import { Metadata } from 'dsl/meta/Metadata';
import { Getter, interceptGetter } from 'Getter';
import { interceptSetter, Setter } from 'Setter';
import { DslBuilder } from 'dsl/DslBuilder';
import { BooleanFunction } from 'dsl/lang/BooleanFunction';
import { FunctionMetadata } from 'dsl/meta/FunctionMetadata';
import { BinaryMetadata } from 'dsl/meta/BinaryMetadata';
import {
  EQ,
  FUNCTION,
  IS_NOT_NULL,
  IS_NULL,
  MATCH_ALL,
  MATCH_ANY,
  NONE_MATCH,
  NOT_EQ,
} from 'dsl/lang/DefaultOperators';
import { UnaryMetadata } from 'dsl/meta/UnaryMetadata';
import { ValueMetadata } from 'dsl/meta/ValueMetadata';
import { IterableMetadata } from 'dsl/meta/IterableMetadata';

export type FunctionConstructor<U, F extends Function<U>> = new (
  metadata: Metadata,
  getter: Getter<object, Context, U | null>,
  setter?: Setter<object, Context, U | null>
) => F;

export class Function<T> implements ContextAccessor<object, Context, T>, DslBuilder {
  get: Getter<object, Context, T | null>;
  set?: Setter<object, Context, T | null>;
  readonly metadata: Metadata;

  public constructor(
    metadata: Metadata,
    getter: Getter<object, Context, T | null>,
    setter?: Setter<object, Context, T | null>
  ) {
    this.metadata = metadata;
    this.get = interceptGetter(metadata, getter);
    this.set = setter ? interceptSetter(metadata, setter) : undefined;
  }

  public static function<T>(accessor: ContextAccessor<object, Context, T>): Function<T> {
    return new Function(accessor.metadata, accessor.get, accessor.set);
  }

  public static contextual<U>(metadata: Metadata, getter: Getter<object, Context, U | null>): Function<U> {
    return new Function(metadata, getter);
  }

  public static consumer<U>(metadata: Metadata, setter: Setter<object, Context, U | null>): Function<U> {
    return new Function(metadata, () => null, setter);
  }

  public static lift<U, F extends Function<U>>(constructor: FunctionConstructor<U, F>, value: U): F {
    return new constructor(new ValueMetadata(value), () => value);
  }

  public mapTo<U, F extends Function<U>>(constructor: FunctionConstructor<U, F>, f: { (v: T | null): U }): F {
    return new constructor(
      new BinaryMetadata(this.metadata, FUNCTION, new FunctionMetadata(f.toString())),
      (obj, ctx) => f(this.get(obj, ctx))
    );
  }

  public isNull(): BooleanFunction {
    return new BooleanFunction(new UnaryMetadata(this.metadata, IS_NULL), (obj, ctx) => this.get(obj, ctx) === null);
  }

  public isNotNull(): BooleanFunction {
    return new BooleanFunction(
      new UnaryMetadata(this.metadata, IS_NOT_NULL),
      (obj, ctx) => this.get(obj, ctx) !== null
    );
  }

  public eq(value: T | Function<T>): BooleanFunction {
    if (value instanceof Function) {
      return new BooleanFunction(
        new BinaryMetadata(this.metadata, EQ, value.metadata),
        (obj, ctx) => this.get(obj, ctx) === value.get(obj, ctx)
      );
    } else {
      return new BooleanFunction(
        new BinaryMetadata(this.metadata, EQ, new ValueMetadata(value)),
        (obj, ctx) => this.get(obj, ctx) === value
      );
    }
  }

  public notEq(value: T | Function<T>): BooleanFunction {
    if (value instanceof Function) {
      return new BooleanFunction(
        new BinaryMetadata(this.metadata, NOT_EQ, value.metadata),
        (obj, ctx) => this.get(obj, ctx) !== value.get(obj, ctx)
      );
    } else {
      return new BooleanFunction(
        new BinaryMetadata(this.metadata, NOT_EQ, new ValueMetadata(value)),
        (obj, ctx) => this.get(obj, ctx) !== value
      );
    }
  }

  public matchAll(...values: (T | Function<T>)[]): BooleanFunction {
    const metadata = values.map(value => (value instanceof Function ? value.metadata : new ValueMetadata(value)));
    return new BooleanFunction(
      new BinaryMetadata(this.metadata, MATCH_ALL, new IterableMetadata(metadata)),
      (obj, ctx) => {
        return values.every(value => {
          if (value instanceof Function) {
            return this.get(obj, ctx) === value.get(obj, ctx);
          } else {
            return this.get(obj, ctx) === value;
          }
        });
      }
    );
  }

  public noneMatch(...values: (T | Function<T>)[]): BooleanFunction {
    const metadata = values.map(value => (value instanceof Function ? value.metadata : new ValueMetadata(value)));
    return new BooleanFunction(
      new BinaryMetadata(this.metadata, NONE_MATCH, new IterableMetadata(metadata)),
      (obj, ctx) => {
        return values.every(value => {
          if (value instanceof Function) {
            return this.get(obj, ctx) !== value.get(obj, ctx);
          } else {
            return this.get(obj, ctx) !== value;
          }
        });
      }
    );
  }

  public matchAny(...values: (T | Function<T>)[]): BooleanFunction {
    const metadata = values.map(value => (value instanceof Function ? value.metadata : new ValueMetadata(value)));
    return new BooleanFunction(
      new BinaryMetadata(this.metadata, MATCH_ANY, new IterableMetadata(metadata)),
      (obj, ctx) => {
        return values.some(value => {
          if (value instanceof Function) {
            return this.get(obj, ctx) === value.get(obj, ctx);
          } else {
            return this.get(obj, ctx) === value;
          }
        });
      }
    );
  }
}

export function condition<T, F extends Function<T>, V>(
  left: F,
  right: T,
  predicate: { (left: T, right: T): V },
  nullCase: V
): Getter<object, Context, V>;
export function condition<T, F extends Function<T>, V>(
  left: F,
  right: F,
  predicate: { (left: T, right: T): V },
  nullCase: V
): Getter<object, Context, V>;
export function condition<T, F extends Function<T>, V>(
  left: F,
  right: T | F,
  predicate: { (left: T, right: T): V },
  nullCase: V
): Getter<object, Context, V> {
  if (right instanceof Function) {
    return (obj, ctx) => {
      const v = left.get(obj, ctx);
      if (v != null) {
        const searchString = right.get(obj, ctx);
        if (searchString != null) {
          return predicate(v, searchString);
        } else {
          return nullCase;
        }
      } else {
        return nullCase;
      }
    };
  } else {
    return (obj, ctx) => {
      const v = left.get(obj, ctx);
      if (v != null) {
        return predicate(v, right);
      } else {
        return nullCase;
      }
    };
  }
}