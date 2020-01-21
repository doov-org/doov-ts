import { OperatorReturnType } from '../Operator';

export const SINGLE_MAPPING: OperatorReturnType = { readable: 'single_mapping', returnType: 'OTHER' };
export const WHEN: OperatorReturnType = { readable: 'when', returnType: 'OTHER' };
export const VALIDATE: OperatorReturnType = { readable: 'validate', returnType: 'OTHER' };
export const NOT: OperatorReturnType = { readable: 'not', returnType: 'BOOL' };
export const AND: OperatorReturnType = { readable: 'and', returnType: 'BOOL' };
export const OR: OperatorReturnType = { readable: 'or', returnType: 'BOOL' };
export const THEN: OperatorReturnType = { readable: 'then', returnType: 'OTHER' };
export const ELSE: OperatorReturnType = { readable: 'else', returnType: 'OTHER' };
export const FUNCTION: OperatorReturnType = { readable: 'function', returnType: 'OTHER' };
export const HAS_VALUE: OperatorReturnType = { readable: 'has value', returnType: 'BOOL' };
export const IS_NULL: OperatorReturnType = { readable: 'is null', returnType: 'BOOL' };
export const IS_NOT_NULL: OperatorReturnType = { readable: 'is not null', returnType: 'BOOL' };
export const IS_DEFINED: OperatorReturnType = { readable: 'is defined', returnType: 'BOOL' };
export const IS_UNDEFINED: OperatorReturnType = { readable: 'is undefined', returnType: 'BOOL' };
export const EQ: OperatorReturnType = { readable: '=', returnType: 'BOOL' };
export const NOT_EQ: OperatorReturnType = { readable: '!=', returnType: 'BOOL' };
export const MATCH_ALL: OperatorReturnType = { readable: 'match all', returnType: 'BOOL' };
export const NONE_MATCH: OperatorReturnType = { readable: 'none match', returnType: 'BOOL' };
export const MATCH_ANY: OperatorReturnType = { readable: 'match any', returnType: 'BOOL' };
export const CONTAINS: OperatorReturnType = { readable: 'contains', returnType: 'BOOL' };
export const MATCHES: OperatorReturnType = { readable: 'matches', returnType: 'BOOL' };
export const STARTS_WITH: OperatorReturnType = { readable: 'starts with', returnType: 'BOOL' };
export const ENDS_WITH: OperatorReturnType = { readable: 'ends with', returnType: 'BOOL' };
export const LENGTH: OperatorReturnType = { readable: 'length', returnType: 'OTHER' };
export const AS_INT: OperatorReturnType = { readable: 'as integer', returnType: 'OTHER' };
export const TRIM: OperatorReturnType = { readable: 'trimmed', returnType: 'OTHER' };
export const UPPER_CASE: OperatorReturnType = { readable: 'upper case', returnType: 'OTHER' };
export const LOWER_CASE: OperatorReturnType = { readable: 'lower case', returnType: 'OTHER' };
export const CONCAT: OperatorReturnType = { readable: 'concat', returnType: 'OTHER' };
export const REPLACE_ALL: OperatorReturnType = { readable: 'replace all', returnType: 'OTHER' };
export const SUB_STRING: OperatorReturnType = { readable: 'sub string', returnType: 'OTHER' };
export const MIN: OperatorReturnType = { readable: 'min', returnType: 'OTHER' };
export const MAX: OperatorReturnType = { readable: 'max', returnType: 'OTHER' };
export const SUM: OperatorReturnType = { readable: 'sum', returnType: 'OTHER' };
export const COUNT: OperatorReturnType = { readable: 'count', returnType: 'OTHER' };
export const LESSER_THAN: OperatorReturnType = { readable: '<', returnType: 'BOOL' };
export const LESSER_OR_EQUALS: OperatorReturnType = { readable: '<=', returnType: 'BOOL' };
export const GREATER_THAN: OperatorReturnType = { readable: '>', returnType: 'BOOL' };
export const GREATER_OR_EQUALS: OperatorReturnType = { readable: '>=', returnType: 'BOOL' };
export const PLUS: OperatorReturnType = { readable: '+', returnType: 'OTHER' };
export const MINUS: OperatorReturnType = { readable: '-', returnType: 'OTHER' };
export const TIMES: OperatorReturnType = { readable: '*', returnType: 'OTHER' };
export const DIVIDE: OperatorReturnType = { readable: '/', returnType: 'OTHER' };
export const TO: OperatorReturnType = { readable: '->', returnType: 'OTHER' };
export const USING: OperatorReturnType = { readable: 'using', returnType: 'OTHER' };
export const MULTIPLE_INPUTS: OperatorReturnType = { readable: 'multiple inputs', returnType: 'OTHER' };

// Date
export const AFTER: OperatorReturnType = { readable: '>', returnType: 'BOOL' };
export const AFTER_OR_EQUALS: OperatorReturnType = { readable: '>=', returnType: 'BOOL' };
export const BEFORE: OperatorReturnType = { readable: '<', returnType: 'BOOL' };
export const BEFORE_OR_EQUALS: OperatorReturnType = { readable: '<=', returnType: 'BOOL' };
export const PLUS_DAYS: OperatorReturnType = { readable: 'plus days', returnType: 'OTHER' };
export const MINUS_DAYS: OperatorReturnType = { readable: 'minus days', returnType: 'OTHER' };
export const PLUS_MONTHS: OperatorReturnType = { readable: 'plus months', returnType: 'OTHER' };
export const MINUS_MONTHS: OperatorReturnType = { readable: 'minus months', returnType: 'OTHER' };
export const PLUS_YEARS: OperatorReturnType = { readable: 'plus years', returnType: 'OTHER' };
export const MINUS_YEARS: OperatorReturnType = { readable: 'minus years', returnType: 'OTHER' };
export const FORMAT_ISO: OperatorReturnType = { readable: 'format iso', returnType: 'OTHER' };
export const FORMAT_DAY_MONTH_YEAR: OperatorReturnType = { readable: 'format day month year', returnType: 'OTHER' };

export const THIS_YEAR: OperatorReturnType = { readable: 'this year', returnType: 'OTHER' };
export const THIS_MONTH: OperatorReturnType = { readable: 'this month', returnType: 'OTHER' };
export const TODAY: OperatorReturnType = { readable: 'today', returnType: 'OTHER' };
export const TOMORROW: OperatorReturnType = { readable: 'tomorrow', returnType: 'OTHER' };

export const WITH_DAY_OF_MONTH: OperatorReturnType = { readable: 'with day of month', returnType: 'OTHER' };
export const WITH_MONTH: OperatorReturnType = { readable: 'with month', returnType: 'OTHER' };
export const WITH_YEAR: OperatorReturnType = { readable: 'with year', returnType: 'OTHER' };
export const WITH_FIRST_DAY_OF_NEXT_YEAR: OperatorReturnType = {
  readable: 'with first day of next year',
  returnType: 'OTHER',
};
export const WITH_LAST_DAY_OF_LAST_YEAR: OperatorReturnType = {
  readable: 'with last day of last year',
  returnType: 'OTHER',
};
export const MONTH_OF: OperatorReturnType = { readable: 'month of', returnType: 'OTHER' };
export const YEAR_OF: OperatorReturnType = { readable: 'year of', returnType: 'OTHER' };
export const DATE_OF: OperatorReturnType = { readable: 'date of', returnType: 'OTHER' };
export const NB_OF_MONTHS_SINCE: OperatorReturnType = { readable: 'number of months since', returnType: 'OTHER' };
export const NB_OF_MONTHS_BETWEEN: OperatorReturnType = { readable: 'number of months between', returnType: 'OTHER' };
export const NB_OF_YEARS_BETWEEN: OperatorReturnType = { readable: 'number of years between', returnType: 'OTHER' };
export const AGE_AT: OperatorReturnType = { readable: 'age at', returnType: 'OTHER' };

// Iterable
export const CONTAINS_ALL: OperatorReturnType = { readable: 'contains all', returnType: 'BOOL' };
export const IS_EMPTY: OperatorReturnType = { readable: 'is empty', returnType: 'BOOL' };
export const IS_NOT_EMPTY: OperatorReturnType = { readable: 'is not empty', returnType: 'BOOL' };
export const HAS_SIZE: OperatorReturnType = { readable: 'has size', returnType: 'BOOL' };
export const HAS_NOT_SIZE: OperatorReturnType = { readable: 'has not size', returnType: 'BOOL' };

// field
export const POSITION: OperatorReturnType = { readable: 'position of', returnType: 'OTHER' };
export const TAGS: OperatorReturnType = { readable: 'tags of', returnType: 'OTHER' };
export const FUNCTIONS: OperatorReturnType = { readable: 'functions', returnType: 'OTHER' };
export const FIELD_PROP: OperatorReturnType = { readable: ':', returnType: 'OTHER' };
