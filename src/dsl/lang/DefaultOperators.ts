import { Operator } from '../Operator';

export const SINGLE_MAPPING: Operator = { readable: 'single_mapping' };
export const WHEN: Operator = { readable: 'when' };
export const VALIDATE: Operator = { readable: 'validate' };
export const NOT: Operator = { readable: 'not' };
export const AND: Operator = { readable: 'and' };
export const OR: Operator = { readable: 'or' };
export const IS_FALSY: Operator = { readable: 'is falsy' };
export const IS_TRUTHY: Operator = { readable: 'is truthy' };
export const THEN: Operator = { readable: 'then' };
export const ELSE: Operator = { readable: 'else' };
export const FUNCTION: Operator = { readable: 'function' };
export const HAS_VALUE: Operator = { readable: 'has value' };
export const IS_NULL: Operator = { readable: 'is null' };
export const IS_NOT_NULL: Operator = { readable: 'is not null' };
export const IS_DEFINED: Operator = { readable: 'is defined' };
export const IS_UNDEFINED: Operator = { readable: 'is undefined' };
export const EQ: Operator = { readable: '=' };
export const NOT_EQ: Operator = { readable: '!=' };
export const MATCH_ALL: Operator = { readable: 'match all' };
export const NONE_MATCH: Operator = { readable: 'none match' };
export const MATCH_ANY: Operator = { readable: 'match any' };
export const CONTAINS: Operator = { readable: 'contains' };
export const MATCHES: Operator = { readable: 'matches' };
export const STARTS_WITH: Operator = { readable: 'starts with' };
export const ENDS_WITH: Operator = { readable: 'ends with' };
export const LENGTH: Operator = { readable: 'length' };
export const AS_INT: Operator = { readable: 'as integer' };
export const TRIM: Operator = { readable: 'trimmed' };
export const UPPER_CASE: Operator = { readable: 'upper case' };
export const LOWER_CASE: Operator = { readable: 'lower case' };
export const CONCAT: Operator = { readable: 'concat' };
export const REPLACE_ALL: Operator = { readable: 'replace all' };
export const SUB_STRING: Operator = { readable: 'sub string' };
export const MIN: Operator = { readable: 'min' };
export const MAX: Operator = { readable: 'max' };
export const SUM: Operator = { readable: 'sum' };
export const COUNT: Operator = { readable: 'count' };
export const LESSER_THAN: Operator = { readable: '<' };
export const LESSER_OR_EQUALS: Operator = { readable: '<=' };
export const GREATER_THAN: Operator = { readable: '>' };
export const GREATER_OR_EQUALS: Operator = { readable: '>=' };
export const PLUS: Operator = { readable: '+' };
export const MINUS: Operator = { readable: '-' };
export const TIMES: Operator = { readable: '*' };
export const DIVIDE: Operator = { readable: '/' };
export const TO: Operator = { readable: '->' };
export const USING: Operator = { readable: 'using' };
export const MULTIPLE_INPUTS: Operator = { readable: 'multiple inputs' };

// Date
export const AFTER: Operator = { readable: '>' };
export const AFTER_OR_EQUALS: Operator = { readable: '>=' };
export const BEFORE: Operator = { readable: '<' };
export const BEFORE_OR_EQUALS: Operator = { readable: '<=' };
export const PLUS_DAYS: Operator = { readable: 'plus days' };
export const MINUS_DAYS: Operator = { readable: 'minus days' };
export const PLUS_MONTHS: Operator = { readable: 'plus months' };
export const MINUS_MONTHS: Operator = { readable: 'minus months' };
export const PLUS_YEARS: Operator = { readable: 'plus years' };
export const MINUS_YEARS: Operator = { readable: 'minus years' };
export const FORMAT_ISO: Operator = { readable: 'format iso' };
export const FORMAT_DAY_MONTH_YEAR: Operator = { readable: 'format day month year' };

export const THIS_YEAR: Operator = { readable: 'this year' };
export const THIS_MONTH: Operator = { readable: 'this month' };
export const TODAY: Operator = { readable: 'today' };
export const TOMORROW: Operator = { readable: 'tomorrow' };

export const WITH_DAY_OF_MONTH: Operator = { readable: 'with day of month' };
export const WITH_MONTH: Operator = { readable: 'with month' };
export const WITH_YEAR: Operator = { readable: 'with year' };
export const WITH_FIRST_DAY_OF_NEXT_YEAR: Operator = { readable: 'with first day of next year' };
export const WITH_LAST_DAY_OF_LAST_YEAR: Operator = { readable: 'with last day of last year' };
export const MONTH_OF: Operator = { readable: 'month of' };
export const YEAR_OF: Operator = { readable: 'year of' };
export const DATE_OF: Operator = { readable: 'date of' };
export const NB_OF_MONTHS_SINCE: Operator = { readable: 'number of months since' };
export const NB_OF_MONTHS_BETWEEN: Operator = { readable: 'number of months between' };
export const NB_OF_YEARS_BETWEEN: Operator = { readable: 'number of years between' };
export const AGE_AT: Operator = { readable: 'age at' };

// Iterable
export const CONTAINS_ALL: Operator = { readable: 'contains all' };
export const IS_EMPTY: Operator = { readable: 'is empty' };
export const IS_NOT_EMPTY: Operator = { readable: 'is not empty' };
export const HAS_SIZE: Operator = { readable: 'has size' };
export const HAS_NOT_SIZE: Operator = { readable: 'has not size' };

// field
export const POSITION: Operator = { readable: 'position of' };
export const TAGS: Operator = { readable: 'tags of' };
export const FUNCTIONS: Operator = { readable: 'functions' };
