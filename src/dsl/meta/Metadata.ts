import { Readable } from '../Readable';
import { Operator } from '../Operator';

export type MetadataType =
  | 'WHEN'
  | 'VALIDATION'
  | 'VALUE'
  | 'FIELD'
  | 'ITERABLE'
  | 'UNARY'
  | 'BINARY'
  | 'NARY'
  | 'SINGLE_MAPPING'
  | 'MULTIPLE_MAPPING'
  | 'CONDITIONAL_MAPPING'
  | 'FUNCTION'
  | 'TYPE_CONVERTER'
  | 'MULTIPLE_VALIDATIONS';

export interface Metadata extends Readable {
  readonly type: MetadataType;
  readonly operator?: Operator;
  readonly readable: string;

  children?(): Metadata[];
}
