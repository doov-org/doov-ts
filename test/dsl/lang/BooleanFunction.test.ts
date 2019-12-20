import { Model, User } from '../../model';
import { BooleanFunction } from '../../../src/dsl/lang/BooleanFunction';
import { DefaultContext } from '../../../src/dsl/DefaultContext';
import * as DOOV from '../../../src/doov';

let model: Model;
let user: User;

const trueFunction = DOOV.lift(BooleanFunction, true);
const falseFunction = DOOV.lift(BooleanFunction, false);
const nullField = DOOV.lift(BooleanFunction, null as any);
const trueField = DOOV.boolean(DOOV.field<boolean, Model>('user', 'b'));
const undefinedField = DOOV.boolean(DOOV.field<boolean, Model>('user', 'a'));
const falsyField = DOOV.boolean(DOOV.field<boolean, Model>('user', 'birth'));

beforeEach(() => {
  model = new Model();
  user = new User(1);
  user.name = 'test';
  user.b = true;
  user.birth = undefined;
  model.user = user;
});

describe('boolean function', () => {
  it('get eq', () => {
    expect(trueField.get(model)).toEqual(true);
    expect(trueField.isNotNull().get(model)).toEqual(true);
    expect(trueField.eq(true).get(model)).toEqual(true);
    const b = trueField
      .isNotNull()
      .and(trueField.eq(true))
      .get(model);
    expect(b).toEqual(true);
  });

  it('and true true', () => {
    expect(trueField.and(trueFunction).get(model)).toEqual(true);
  });

  it('and true false', () => {
    expect(trueField.and(falseFunction).get(model)).toEqual(false);
  });

  it('and false true', () => {
    expect(falseFunction.and(trueFunction).get(model)).toEqual(false);
  });

  it('or true true', () => {
    expect(trueField.or(true).get(model)).toEqual(true);
  });

  it('or true false', () => {
    expect(trueField.or(false).get(model)).toEqual(true);
  });

  it('or false false ', () => {
    expect(falseFunction.or(false).get(model, new DefaultContext(true))).toEqual(false);
  });

  it('or false true function', () => {
    expect(falseFunction.or(trueField).get(model)).toEqual(true);
  });

  it('not true', () => {
    expect(trueFunction.not().get(model)).toEqual(false);
  });
  it('not false', () => {
    expect(falseFunction.not().get(model)).toEqual(true);
  });
});

describe('boolean function with left null', () => {
  it('get eq', () => {
    expect(nullField.get(model)).toBeNull();
    expect(nullField.isNull().get(model)).toEqual(true);
    expect(nullField.eq(true).get(model)).toEqual(false);
    expect(nullField.eq(false).get(model)).toEqual(false);
    const b = trueField
      .isNotNull()
      .and(nullField)
      .get(model);
    expect(b).toEqual(false);
  });

  it('undefined', () => {
    expect(undefinedField.get(model)).toBeUndefined();
  });

  it('null', () => {
    expect(nullField.get(model)).toBeNull();
  });

  it('and null true', () => {
    expect(nullField.and(trueFunction).get(model)).toEqual(false);
  });

  it('and null false', () => {
    expect(nullField.and(falseFunction).get(model)).toEqual(false);
  });

  it('and true null', () => {
    expect(trueFunction.and(nullField).get(model)).toEqual(false);
  });

  it('or null true', () => {
    expect(nullField.or(true).get(model)).toEqual(false);
  });

  it('or null false', () => {
    expect(nullField.or(false).get(model)).toEqual(false);
  });

  it('or null true function', () => {
    expect(nullField.or(trueField).get(model)).toEqual(false);
  });

  it('not null', () => {
    expect(nullField.not().get(model)).toEqual(false);
  });
});

describe('boolean function with short circuit', () => {
  it('boolean get eq', () => {
    expect(trueField.get(model, new DefaultContext(true))).toEqual(true);
    expect(trueField.isNotNull().get(model, new DefaultContext(true))).toEqual(true);
    expect(trueField.eq(true).get(model, new DefaultContext(true))).toEqual(true);
    const b = trueField
      .isNotNull()
      .and(trueField.eq(true))
      .get(model, new DefaultContext(true));
    expect(b).toEqual(true);
  });

  it('and true true', () => {
    expect(trueField.and(trueFunction).get(model, new DefaultContext(true))).toEqual(true);
  });

  it('and true false', () => {
    expect(trueField.and(falseFunction).get(model, new DefaultContext(true))).toEqual(false);
  });

  it('and false true', () => {
    expect(falseFunction.and(trueFunction).get(model, new DefaultContext(true))).toEqual(false);
  });

  it('or true true', () => {
    expect(trueField.or(true).get(model, new DefaultContext(true))).toEqual(true);
  });

  it('or true false', () => {
    expect(trueField.or(false).get(model, new DefaultContext(true))).toEqual(true);
  });

  it('or false false ', () => {
    expect(falseFunction.or(false).get(model, new DefaultContext(true))).toEqual(false);
  });

  it('or false true function', () => {
    expect(falseFunction.or(trueField).get(model, new DefaultContext(true))).toEqual(true);
  });

  it('not true', () => {
    expect(trueFunction.not().get(model, new DefaultContext(true))).toEqual(false);
  });
  it('not false', () => {
    expect(falseFunction.not().get(model, new DefaultContext(true))).toEqual(true);
  });
});

describe('boolean function with left null with short circuit', () => {
  it('get eq', () => {
    expect(nullField.get(model, new DefaultContext(true))).toBeNull();
    expect(nullField.isNull().get(model, new DefaultContext(true))).toEqual(true);
    expect(nullField.eq(true).get(model, new DefaultContext(true))).toEqual(false);
    expect(nullField.eq(false).get(model, new DefaultContext(true))).toEqual(false);
    const b = trueField
      .isNotNull()
      .and(nullField)
      .get(model, new DefaultContext(true));
    expect(b).toEqual(false);
  });

  it('null', () => {
    expect(nullField.get(model, new DefaultContext(true))).toBeNull();
  });

  it('and null true', () => {
    expect(nullField.and(trueFunction).get(model, new DefaultContext(true))).toEqual(false);
  });

  it('and null false', () => {
    expect(nullField.and(falseFunction).get(model, new DefaultContext(true))).toEqual(false);
  });

  it('and true null', () => {
    expect(trueFunction.and(nullField).get(model, new DefaultContext(true))).toEqual(false);
  });

  it('or null true', () => {
    expect(nullField.or(true).get(model, new DefaultContext(true))).toEqual(false);
  });

  it('or null false', () => {
    expect(nullField.or(false).get(model, new DefaultContext(true))).toEqual(false);
  });

  it('or null true function', () => {
    expect(nullField.or(trueField).get(model, new DefaultContext(true))).toEqual(false);
  });

  it('not null', () => {
    expect(nullField.not().get(model, new DefaultContext(true))).toEqual(false);
  });

  it('is falsy', () => {
    expect(falsyField.isFalsy().get(model, new DefaultContext(true))).toEqual(true);
    expect(
      trueFunction
        .not()
        .isFalsy()
        .get(model, new DefaultContext(true))
    ).toEqual(true);
  });

  it('is truthy', () => {
    const context = new DefaultContext(true);
    expect(trueFunction.isTruthy().get(model, new DefaultContext(true))).toEqual(true);
    expect(
      falsyField
        .not()
        .isTruthy()
        .get(model, context)
    ).toEqual(true);
  });
});
