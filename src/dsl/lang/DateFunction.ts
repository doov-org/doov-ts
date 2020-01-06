import { ContextAccessor } from '../ContextAccessor';
import { Context } from '../Context';
import { BooleanFunction } from './BooleanFunction';
import { condition, Function } from './Function';
import { UnaryMetadata } from '../meta/UnaryMetadata';
import { ValueMetadata } from '../meta/ValueMetadata';
import {
  AFTER,
  AFTER_OR_EQUALS,
  AGE_AT,
  BEFORE,
  BEFORE_OR_EQUALS,
  DATE_OF,
  FORMAT_DAY_MONTH_YEAR,
  FORMAT_ISO,
  MAX,
  MIN,
  MINUS_DAYS,
  MINUS_MONTHS,
  MINUS_YEARS,
  MONTH_OF,
  NB_OF_MONTHS_BETWEEN,
  NB_OF_MONTHS_SINCE,
  NB_OF_YEARS_BETWEEN,
  PLUS_DAYS,
  PLUS_MONTHS,
  PLUS_YEARS,
  THIS_MONTH,
  THIS_YEAR,
  TODAY,
  TOMORROW,
  WITH_DAY_OF_MONTH,
  WITH_FIRST_DAY_OF_NEXT_YEAR,
  WITH_LAST_DAY_OF_LAST_YEAR,
  WITH_MONTH,
  WITH_YEAR,
  YEAR_OF,
} from './DefaultOperators';
import { BinaryMetadata } from '../meta/BinaryMetadata';
import { NumberFunction } from './NumberFunction';
import { StringFunction } from './StringFunction';
import {
  clone,
  formatddMMYYYY,
  formatYYYYMMdd,
  newUTCDate,
  now,
  numberOfFullMonthsBetween,
  numberOfFullYearsBetween,
  parse,
} from '../../DateUtils';
import { FunctionMetadata } from '../meta/FunctionMetadata';
import { nullOrUndefined } from '../../Utils';
import { NaryMetadata } from '../meta/NaryMetadata';

export class DateFunction extends Function<Date> {
  public static MAX_DATE = new Date(8640000000000000);
  public static MIN_DATE = new Date(-8640000000000000);

  protected equals(v1: Date | null | undefined, v2: Date | null | undefined): boolean {
    if (v1 && v2) {
      return v1.getTime() === v2.getTime();
    } else {
      return super.equals(v1, v2);
    }
  }

  public static date(accessor: ContextAccessor<object, Context, Date>): DateFunction {
    return new DateFunction(accessor.metadata, accessor.get, accessor.set);
  }

  public static dateIso(accessor: ContextAccessor<object, Context, string>): DateFunction {
    return new DateFunction(
      accessor.metadata,
      (obj, ctx) => {
        const yyyyMMdd = accessor.get(obj, ctx);
        if (nullOrUndefined(yyyyMMdd)) {
          return yyyyMMdd;
        } else {
          return parse(yyyyMMdd);
        }
      },
      (obj, val, ctx) => {
        if (nullOrUndefined(val)) {
          return accessor.set ? accessor.set(obj, val, ctx) : obj;
        } else {
          return accessor.set ? accessor.set(obj, formatYYYYMMdd(val), ctx) : obj;
        }
      }
    );
  }

  public static min(...values: (Date | DateFunction)[]): DateFunction {
    const metadata = values.map(value => (value instanceof DateFunction ? value.metadata : new ValueMetadata(value)));
    return new DateFunction(new NaryMetadata(metadata, MIN), (obj, ctx) => {
      const f = (l: Date, r: Date) => (l < r ? l : r);
      return values.reduce((previousValue: Date, currentValue) => {
        if (currentValue instanceof Function) {
          const value = currentValue.get(obj, ctx);
          if (value != null) {
            return f(value, previousValue);
          } else {
            return previousValue;
          }
        } else {
          return f(currentValue, previousValue);
        }
      }, DateFunction.MAX_DATE);
    });
  }

  public static max(...values: (Date | DateFunction)[]): DateFunction {
    const metadata = values.map(value => (value instanceof DateFunction ? value.metadata : new ValueMetadata(value)));
    return new DateFunction(new NaryMetadata(metadata, MAX), (obj, ctx) => {
      const f = (l: Date, r: Date) => (l > r ? l : r);
      return values.reduce((previousValue: Date, currentValue) => {
        if (currentValue instanceof Function) {
          const value = currentValue.get(obj, ctx);
          if (value != null) {
            return f(value, previousValue);
          } else {
            return previousValue;
          }
        } else {
          return f(currentValue, previousValue);
        }
      }, DateFunction.MIN_DATE);
    });
  }

  public static thisYear(): NumberFunction {
    return new NumberFunction(new FunctionMetadata('clone().getFullYear()', undefined, THIS_YEAR), () => {
      return now().getFullYear();
    });
  }

  public static thisMonth(): NumberFunction {
    return new NumberFunction(new FunctionMetadata('clone().getMonth() + 1', undefined, THIS_MONTH), () => {
      return now().getMonth() + 1;
    });
  }

  public static today(): DateFunction {
    return new DateFunction(new FunctionMetadata('clone()', undefined, TODAY), () => {
      return now();
    });
  }

  public static tomorrow(): DateFunction {
    return new DateFunction(new FunctionMetadata('date.setDate(date.getDate() + 1)', undefined, TOMORROW), () => {
      const date = now();
      date.setDate(date.getDate() + 1);
      return date;
    });
  }

  public static dateFrom(yyyyMMdd: string): DateFunction {
    return new DateFunction(new FunctionMetadata('Date{' + yyyyMMdd + '}'), () => parse(yyyyMMdd));
  }

  public static newDate(year: number, month: number, day: number): DateFunction {
    return new DateFunction(new FunctionMetadata('Date{ Y:' + year + ' M:' + month + ' D:' + day + ' }'), () => {
      return newUTCDate(year, month, day);
    });
  }

  public static newLocalDate(year: number, month: number, day: number): DateFunction {
    return new DateFunction(new FunctionMetadata('Date{ Y:' + year + ' M:' + month + ' D:' + day + ' }'), () => {
      return new Date(year, month, day);
    });
  }

  public before(value: Date | DateFunction): BooleanFunction {
    const predicate = (left: Date, right: Date) => left < right;
    if (value instanceof DateFunction) {
      return new BooleanFunction(
        new BinaryMetadata(this.metadata, BEFORE, value.metadata),
        condition(this, value, predicate, false)
      );
    } else {
      return new BooleanFunction(
        new BinaryMetadata(this.metadata, BEFORE, new ValueMetadata(value)),
        condition(this, value, predicate, false)
      );
    }
  }

  public beforeOrEquals(value: Date | DateFunction): BooleanFunction {
    const predicate = (left: Date, right: Date) => left <= right;
    if (value instanceof DateFunction) {
      return new BooleanFunction(
        new BinaryMetadata(this.metadata, BEFORE_OR_EQUALS, value.metadata),
        condition(this, value, predicate, false)
      );
    } else {
      return new BooleanFunction(
        new BinaryMetadata(this.metadata, BEFORE_OR_EQUALS, new ValueMetadata(value)),
        condition(this, value, predicate, false)
      );
    }
  }

  public after(value: Date | DateFunction): BooleanFunction {
    const predicate = (left: Date, right: Date) => left > right;
    if (value instanceof DateFunction) {
      return new BooleanFunction(
        new BinaryMetadata(this.metadata, AFTER, value.metadata),
        condition(this, value, predicate, false)
      );
    } else {
      return new BooleanFunction(
        new BinaryMetadata(this.metadata, AFTER, new ValueMetadata(value)),
        condition(this, value, predicate, false)
      );
    }
  }

  public afterOrEquals(value: Date | DateFunction): BooleanFunction {
    const predicate = (left: Date, right: Date) => left >= right;
    if (value instanceof DateFunction) {
      return new BooleanFunction(
        new BinaryMetadata(this.metadata, AFTER_OR_EQUALS, value.metadata),
        condition(this, value, predicate, false)
      );
    } else {
      return new BooleanFunction(
        new BinaryMetadata(this.metadata, AFTER_OR_EQUALS, new ValueMetadata(value)),
        condition(this, value, predicate, false)
      );
    }
  }

  public between(minIncluded: Date | DateFunction, maxExcluded: Date | DateFunction): BooleanFunction {
    return this.afterOrEquals(minIncluded).and(this.before(maxExcluded));
  }

  public plusDays(value: number | NumberFunction): DateFunction {
    const f = (left: Date, right: number) => {
      const newDate = clone(left);
      newDate.setDate(left.getDate() + right);
      return newDate;
    };
    if (value instanceof NumberFunction) {
      return new DateFunction(
        new BinaryMetadata(this.metadata, PLUS_DAYS, value.metadata),
        condition(this, value, f, null)
      );
    } else {
      return new DateFunction(
        new BinaryMetadata(this.metadata, PLUS_DAYS, new ValueMetadata(value)),
        condition(this, value, f, null)
      );
    }
  }

  public minusDays(value: number | NumberFunction): DateFunction {
    const f = (left: Date, right: number) => {
      const newDate = clone(left);
      newDate.setDate(newDate.getDate() - right);
      return newDate;
    };
    if (value instanceof NumberFunction) {
      return new DateFunction(
        new BinaryMetadata(this.metadata, MINUS_DAYS, value.metadata),
        condition(this, value, f, null)
      );
    } else {
      return new DateFunction(
        new BinaryMetadata(this.metadata, MINUS_DAYS, new ValueMetadata(value)),
        condition(this, value, f, null)
      );
    }
  }

  public plusMonths(value: number | NumberFunction): DateFunction {
    const f = (left: Date, right: number) => {
      const newDate = clone(left);
      newDate.setMonth(newDate.getMonth() + right);
      return newDate;
    };
    if (value instanceof NumberFunction) {
      return new DateFunction(
        new BinaryMetadata(this.metadata, PLUS_MONTHS, value.metadata),
        condition(this, value, f, null)
      );
    } else {
      return new DateFunction(
        new BinaryMetadata(this.metadata, PLUS_MONTHS, new ValueMetadata(value)),
        condition(this, value, f, null)
      );
    }
  }

  public minusMonths(value: number | NumberFunction): DateFunction {
    const f = (left: Date, right: number) => {
      const newDate = clone(left);
      newDate.setMonth(newDate.getMonth() - right);
      return newDate;
    };
    if (value instanceof NumberFunction) {
      return new DateFunction(
        new BinaryMetadata(this.metadata, MINUS_MONTHS, value.metadata),
        condition(this, value, f, null)
      );
    } else {
      return new DateFunction(
        new BinaryMetadata(this.metadata, MINUS_MONTHS, new ValueMetadata(value)),
        condition(this, value, f, null)
      );
    }
  }

  public plusYears(value: number | NumberFunction): DateFunction {
    const f = (left: Date, right: number) => {
      const newDate = clone(left);
      newDate.setFullYear(newDate.getFullYear() + right);
      return newDate;
    };
    if (value instanceof NumberFunction) {
      return new DateFunction(
        new BinaryMetadata(this.metadata, PLUS_YEARS, value.metadata),
        condition(this, value, f, null)
      );
    } else {
      return new DateFunction(
        new BinaryMetadata(this.metadata, PLUS_YEARS, new ValueMetadata(value)),
        condition(this, value, f, null)
      );
    }
  }

  public minusYears(value: number | NumberFunction): DateFunction {
    const f = (left: Date, right: number) => {
      const newDate = clone(left);
      newDate.setFullYear(newDate.getFullYear() - right);
      return newDate;
    };
    if (value instanceof NumberFunction) {
      return new DateFunction(
        new BinaryMetadata(this.metadata, MINUS_YEARS, value.metadata),
        condition(this, value, f, null)
      );
    } else {
      return new DateFunction(
        new BinaryMetadata(this.metadata, MINUS_YEARS, new ValueMetadata(value)),
        condition(this, value, f, null)
      );
    }
  }

  /**
   * Different from {@link Date#toISOString}
   */
  public formatISO(): StringFunction {
    return new StringFunction(
      new UnaryMetadata(this.metadata, FORMAT_ISO),
      condition(this, undefined, (left: Date) => formatYYYYMMdd(left), null)
    );
  }

  public dayMonthYear(): StringFunction {
    return new StringFunction(
      new UnaryMetadata(this.metadata, FORMAT_DAY_MONTH_YEAR),
      condition(this, undefined, (left: Date) => formatddMMYYYY(left), null)
    );
  }

  public static nbFullMonthsSince(value: DateFunction): NumberFunction {
    return new NumberFunction(
      new UnaryMetadata(value.metadata, NB_OF_MONTHS_SINCE),
      condition(value, undefined, (left: Date) => numberOfFullMonthsBetween(left), null)
    );
  }

  public static nbFullMonthsBetween(value: DateFunction, value2: Date | DateFunction): NumberFunction {
    if (value2 instanceof DateFunction) {
      return new NumberFunction(
        new NaryMetadata([value.metadata, value2.metadata], NB_OF_MONTHS_BETWEEN),
        condition(value, value2, (left: Date, right: Date) => numberOfFullMonthsBetween(left, right), null)
      );
    } else {
      return new NumberFunction(
        new NaryMetadata([value.metadata, new ValueMetadata(value2)], NB_OF_MONTHS_BETWEEN),
        condition(value, value2, numberOfFullMonthsBetween, null)
      );
    }
  }

  public static nbFullYearsBetween(value: DateFunction, value2: Date | DateFunction): NumberFunction {
    if (value2 instanceof DateFunction) {
      return new NumberFunction(
        new NaryMetadata([value.metadata, value2.metadata], NB_OF_YEARS_BETWEEN),
        condition(value, value2, numberOfFullYearsBetween, null)
      );
    } else {
      return new NumberFunction(
        new NaryMetadata([value.metadata, new ValueMetadata(value2)], NB_OF_YEARS_BETWEEN),
        condition(value, value2, numberOfFullYearsBetween, null)
      );
    }
  }

  public withDayOfMonth(day: number | NumberFunction): DateFunction {
    const setDay = (left: Date, right: number) => {
      const newDate = clone(left);
      newDate.setDate(right);
      return newDate;
    };
    if (day instanceof NumberFunction) {
      return new DateFunction(
        new BinaryMetadata(this.metadata, WITH_DAY_OF_MONTH, day.metadata),
        condition(this, day, setDay, null)
      );
    } else {
      return new DateFunction(
        new BinaryMetadata(this.metadata, WITH_DAY_OF_MONTH, new ValueMetadata(day)),
        condition(this, day, setDay, null)
      );
    }
  }
  public withMonth(month: number | NumberFunction): DateFunction {
    const setMonth = (left: Date, right: number) => {
      const newDate = clone(left);
      newDate.setMonth(right);
      return newDate;
    };
    if (month instanceof NumberFunction) {
      return new DateFunction(
        new BinaryMetadata(this.metadata, WITH_MONTH, month.metadata),
        condition(this, month, setMonth, null)
      );
    } else {
      return new DateFunction(
        new BinaryMetadata(this.metadata, WITH_MONTH, new ValueMetadata(month)),
        condition(this, month, setMonth, null)
      );
    }
  }
  public withYear(year: number | NumberFunction): DateFunction {
    const setYear = (left: Date, right: number) => {
      const newDate = clone(left);
      newDate.setFullYear(right);
      return newDate;
    };
    if (year instanceof NumberFunction) {
      return new DateFunction(
        new BinaryMetadata(this.metadata, WITH_YEAR, year.metadata),
        condition(this, year, setYear, null)
      );
    } else {
      return new DateFunction(
        new BinaryMetadata(this.metadata, WITH_YEAR, new ValueMetadata(year)),
        condition(this, year, setYear, null)
      );
    }
  }
  public withFirstDayOfNextYear(): DateFunction {
    return new DateFunction(
      new UnaryMetadata(this.metadata, WITH_FIRST_DAY_OF_NEXT_YEAR),
      condition(
        this,
        undefined,
        (left: Date) => {
          const newDate = clone(left);
          newDate.setMonth(11);
          newDate.setDate(32);
          return newDate;
        },
        null
      )
    );
  }
  public withLastDayOfLastYear(): DateFunction {
    return new DateFunction(
      new UnaryMetadata(this.metadata, WITH_LAST_DAY_OF_LAST_YEAR),
      condition(
        this,
        undefined,
        (left: Date) => {
          const newDate = clone(left);
          newDate.setMonth(0);
          newDate.setDate(0);
          return newDate;
        },
        null
      )
    );
  }

  public monthOf(): NumberFunction {
    return new NumberFunction(
      new UnaryMetadata(this.metadata, MONTH_OF),
      condition(
        this,
        undefined,
        (left: Date) => {
          return left.getMonth();
        },
        null
      )
    );
  }

  public yearOf(): NumberFunction {
    return new NumberFunction(
      new UnaryMetadata(this.metadata, YEAR_OF),
      condition(
        this,
        undefined,
        (left: Date) => {
          return left.getFullYear();
        },
        null
      )
    );
  }

  public dateOf(): NumberFunction {
    return new NumberFunction(
      new UnaryMetadata(this.metadata, DATE_OF),
      condition(
        this,
        undefined,
        (left: Date) => {
          return left.getDate();
        },
        null
      )
    );
  }

  public ageAt(value: Date | DateFunction): NumberFunction {
    if (value instanceof DateFunction) {
      return new NumberFunction(
        new BinaryMetadata(this.metadata, AGE_AT, value.metadata),
        condition(this, value, numberOfFullYearsBetween, null)
      );
    } else {
      return new NumberFunction(
        new BinaryMetadata(this.metadata, AGE_AT, new ValueMetadata(value)),
        condition(this, value, numberOfFullYearsBetween, null)
      );
    }
  }
}
