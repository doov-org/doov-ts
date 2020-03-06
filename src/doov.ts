import { Field } from './dsl/Field';
import { Context } from './dsl/Context';
import { ContextAccessor } from './dsl/ContextAccessor';
import { BooleanFunction } from './dsl/lang/BooleanFunction';
import { NumberFunction } from './dsl/lang/NumberFunction';
import { StringFunction } from './dsl/lang/StringFunction';
import { Function, FunctionConstructor } from './dsl/lang/Function';
import { StepWhen } from './dsl/lang/StepWhen';
import { StepMap } from './dsl/lang/StepMap';
import { MappingRule } from './dsl/lang/MappingRule';
import { Mappings } from './dsl/lang/Mappings';
import { NaryMetadata } from './dsl/meta/NaryMetadata';
import { UnaryMetadata } from './dsl/meta/UnaryMetadata';
import { DslBuilder } from './dsl/DslBuilder';
import { FieldMetadata } from './dsl/meta/FieldMetadata';
import { COUNT, FUNCTIONS, MATCH_ALL, MATCH_ANY, NONE_MATCH, POSITION, SUM, TAGS } from './dsl/lang/DefaultOperators';
import { BiStepMap } from './dsl/lang/BiStepMap';
import { BiConverterFunction, BiTypeConverter } from './dsl/lang/BiTypeConverter';
import { NaryConverterFunction, NaryTypeConverter } from './dsl/lang/NaryTypeConverter';
import { NaryStepMap } from './dsl/lang/NaryStepMap';
import { DateFunction } from './dsl/lang/DateFunction';
import { IterableFunction } from './dsl/lang/IterableFunction';
import { ConverterFunction, TypeConverter } from './dsl/lang/TypeConverter';
import { ValueMetadata } from './dsl/meta/ValueMetadata';
import { SingleMappingRule } from './dsl/lang/SingleMappingRule';
// Utils
import * as MetadataUtils from './dsl/meta/MetadataUtils';
import * as DateUtils from './DateUtils';
import * as Utils from './Utils';
import * as Paths from './Paths';
import { ValidationRule } from './dsl/lang/ValidationRule';
import { Validations } from './dsl/lang/Validations';

export function f<T>(accessor: ContextAccessor<object, Context, T>): Function<T> {
  return Function.function(accessor);
}

export function field<V, T extends object = object>(...path: (string | number)[]): Field<T, Context, V> {
  return Field.field(...path);
}

export function lift<U, F extends Function<U>>(constructor: FunctionConstructor<U, F>, value: U | null | undefined): F {
  return Function.lift(constructor, value);
}

export function iterable<T>(field: ContextAccessor<object, Context, T[]>): IterableFunction<T> {
  return IterableFunction.iterable(field);
}

export function boolean(field: ContextAccessor<object, Context, boolean>): BooleanFunction {
  return BooleanFunction.boolean(field);
}

export function string(field: ContextAccessor<object, Context, string>): StringFunction {
  return StringFunction.string(field);
}

export function number(field: ContextAccessor<object, Context, number>): NumberFunction {
  return NumberFunction.number(field);
}

export function date(field: ContextAccessor<object, Context, Date>): DateFunction {
  return DateFunction.date(field);
}

export function dateIso(field: ContextAccessor<object, Context, string>): DateFunction {
  return DateFunction.dateIso(field);
}

export function when(condition: BooleanFunction): StepWhen {
  return new StepWhen(condition);
}

export function map<T, U>(input: T | Function<T>): StepMap<T>;
export function map<T, U>(input: T | Function<T>, input2: U | Function<U>): BiStepMap<T, U>;
export function map<T, U>(input: T | Function<T>, input2?: U | Function<U>) {
  if (input2) {
    return new BiStepMap(
      input instanceof Function ? input : new Function(new ValueMetadata(input), _ => input),
      input2 instanceof Function ? input2 : new Function(new ValueMetadata(input2), _ => input2)
    );
  } else {
    return new StepMap(input instanceof Function ? input : new Function(new ValueMetadata(input), _ => input));
  }
}

export function mapNull(...output: Function<any>[]): SingleMappingRule<unknown> {
  if (output.length == 1) {
    return new SingleMappingRule(new Function<unknown>(new ValueMetadata(null), _ => null), output[0]);
  } else {
    return new SingleMappingRule(
      new Function<unknown>(new ValueMetadata(null), _ => null),
      Function.consumer(new NaryMetadata(output.map(value => value.metadata), FUNCTIONS), (obj, val, ctx) => {
        for (let out of output) {
          obj = out.set ? out.set(obj, val, ctx) : obj;
        }
        return obj;
      })
    );
  }
}

export function mapAll(...inputs: Function<any>[]): NaryStepMap {
  return new NaryStepMap(inputs);
}

export function converter<T, V>(converter: ConverterFunction<T, V>, description?: string): TypeConverter<T, V> {
  return new TypeConverter(converter, description);
}

export function biConverter<T, U, V>(
  converter: BiConverterFunction<T, U, V>,
  description?: string
): BiTypeConverter<T, U, V> {
  return new BiTypeConverter(converter, description);
}

export function naryConverter<V>(converter: NaryConverterFunction<V>, description?: string): NaryTypeConverter<V> {
  return new NaryTypeConverter(converter, description);
}

export function mappings(...mappings: MappingRule[]): Mappings {
  return new Mappings(...mappings);
}

export function validations(...validations: ValidationRule[]): Validations {
  return new Validations(...validations);
}

export function matchAny(...values: BooleanFunction[]): BooleanFunction {
  return new BooleanFunction(new NaryMetadata(values.map(value => value.metadata), MATCH_ANY), (obj, ctx) => {
    return values.some(value => {
      const v = value.get(obj, ctx);
      return v != null ? v : false;
    });
  });
}

export function matchAll(...values: BooleanFunction[]): BooleanFunction {
  return new BooleanFunction(new NaryMetadata(values.map(value => value.metadata), MATCH_ALL), (obj, ctx) => {
    return values.every(value => {
      const v = value.get(obj, ctx);
      return v != null ? v : false;
    });
  });
}

export function matchNone(...values: BooleanFunction[]): BooleanFunction {
  return new BooleanFunction(new NaryMetadata(values.map(value => value.metadata), NONE_MATCH), (obj, ctx) => {
    return values.every(value => {
      const v = value.get(obj, ctx);
      return v != null ? !v : false;
    });
  });
}

export function count(...values: BooleanFunction[]): NumberFunction {
  return new NumberFunction(new NaryMetadata(values.map(value => value.metadata), COUNT), (obj, ctx) => {
    return values.filter(value => {
      const v = value.get(obj, ctx);
      return v != null ? v : false;
    }).length;
  });
}

export function sum(...values: NumberFunction[]): NumberFunction {
  return new NumberFunction(new NaryMetadata(values.map(value => value.metadata), SUM), (obj, ctx) => {
    return values.reduce((previous, value) => {
      const v = value.get(obj, ctx);
      return v != null ? previous + v : previous;
    }, 0);
  });
}

export function tags(value: DslBuilder): IterableFunction<string> {
  return new IterableFunction(new UnaryMetadata(value.metadata, TAGS), () => {
    if (value.metadata instanceof FieldMetadata) {
      return value.metadata.tags;
    } else {
      return [];
    }
  });
}

export function position(value: DslBuilder): NumberFunction {
  return new NumberFunction(new UnaryMetadata(value.metadata, POSITION), () => {
    if (value.metadata instanceof FieldMetadata) {
      return value.metadata.position;
    } else {
      return;
    }
  });
}

// Functions
export { condition, Function } from './dsl/lang/Function';
export { BooleanFunction } from './dsl/lang/BooleanFunction';
export { NumberFunction } from './dsl/lang/NumberFunction';
export { StringFunction } from './dsl/lang/StringFunction';
export { DateFunction } from './dsl/lang/DateFunction';
export { IterableFunction } from './dsl/lang/IterableFunction';

export { TypeConverter } from './dsl/lang/TypeConverter';
export { BiTypeConverter } from './dsl/lang/BiTypeConverter';
export { NaryTypeConverter } from './dsl/lang/NaryTypeConverter';

export { DefaultContext } from './dsl/DefaultContext';
export { Field } from './dsl/Field';

export { StepWhen } from './dsl/lang/StepWhen';
export { ValidationRule } from './dsl/lang/ValidationRule';
export { SingleValidationRule } from './dsl/lang/SingleValidationRule';
export { Validations } from './dsl/lang/Validations';
export { Result } from './dsl/Result';
export { MappingRule } from './dsl/lang/MappingRule';

// Metadata
export { AbstractMetadata } from './dsl/meta/AbstractMetadata';
export { BinaryMetadata } from './dsl/meta/BinaryMetadata';
export { ConditionalMappingMetadata } from './dsl/meta/ConditionalMappingMetadata';
export { FieldMetadata } from './dsl/meta/FieldMetadata';
export { FunctionMetadata } from './dsl/meta/FunctionMetadata';
export { IterableMetadata } from './dsl/meta/IterableMetadata';
export { Metadata } from './dsl/meta/Metadata';
export { MultipleMappingsMetadata } from './dsl/meta/MultipleMappingsMetadata';
export { MultipleValidationsMetadata } from './dsl/meta/MultipleValidationsMetadata';
export { NaryMetadata } from './dsl/meta/NaryMetadata';
export { SingleMappingMetadata } from './dsl/meta/SingleMappingMetadata';
export { TypeConverterMetadata } from './dsl/meta/TypeConverterMetadata';
export { UnaryMetadata } from './dsl/meta/UnaryMetadata';
export { ValidationRuleMetadata } from './dsl/meta/ValidationRuleMetadata';
export { ValueMetadata } from './dsl/meta/ValueMetadata';
export { WhenMetadata } from './dsl/meta/WhenMetadata';

export { MetadataUtils };
export { DateUtils };
export { Utils };
export { Paths };

export * from './dsl/lang/DefaultOperators';
