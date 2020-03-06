import { Readable } from './Readable';

export interface Operator extends Readable {
  readable: string;
}

export interface OperatorReturnType extends Operator {
  returnType: ReturnType;
}

export type ReturnType = 'BOOL' | 'OTHER';
