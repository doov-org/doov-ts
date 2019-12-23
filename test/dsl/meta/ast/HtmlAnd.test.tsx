import * as React from 'react';
import * as DOOV from '../../../../src/doov';
import { mount, ReactWrapper } from 'enzyme';
import { Model, User } from '../../../model';
import { GetHtml } from '../../../../src/dsl/meta/ast/HtmlRenderer';
import { HtmlSelector } from '../../../HtmlSelector';
import { BooleanFunction } from '../../../../src/dsl/lang/BooleanFunction';
import { count, SingleValidationRule, when } from '../../../../src/doov';

let A, B, C, D: BooleanFunction;
let wrapper: ReactWrapper;
let rule: SingleValidationRule;

let model = new Model();
let user = new User(0);
user.name = 'Bob';
user.birth = new Date(2019, 11, 11);
user.b = false;
model.user = user;

const zeroField = DOOV.number(DOOV.field('user', 'id'));
const yesterdayField = DOOV.date(DOOV.field('user', 'birth'));
const bobField = DOOV.string(DOOV.field('user', 'name'));
const falseField = DOOV.boolean(DOOV.field('user', 'b'));

const getTextArray = (node: ReactWrapper) => node.text();

describe('tests of and', () => {
  it('and false false', () => {
    A = DOOV.lift(BooleanFunction, false);
    B = DOOV.lift(BooleanFunction, false);
    rule = when(A.and(B)).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(rule.execute().value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['and']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['false', 'false']);
  });

  it('and true false', () => {
    A = DOOV.lift(BooleanFunction, true);
    B = DOOV.lift(BooleanFunction, false);
    rule = when(A.and(B)).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata.when.metadata} />);
    expect(rule.execute().value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['and']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['true', 'false']);
  });

  it('and false true', () => {
    A = DOOV.lift(BooleanFunction, false);
    B = DOOV.lift(BooleanFunction, true);
    rule = when(A.and(B)).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata.when.metadata} />);
    expect(rule.execute().value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['and']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['false', 'true']);
  });

  it('and true true', () => {
    A = DOOV.lift(BooleanFunction, true);
    B = DOOV.lift(BooleanFunction, true);
    rule = when(A.and(B)).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata.when.metadata} />);
    expect(rule.execute().value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['and']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['true', 'true']);
  });

  it('and field true true failure', () => {
    A = zeroField.lesserThan(4);
    B = yesterdayField.before(DOOV.DateFunction.today());
    rule = when(A.and(B)).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata.when.metadata} />);
    expect(rule.execute(model).value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['<', 'and', '<', 'today']);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual(['user.id', 'user.birth']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['4']);
  });

  it('and and and', () => {
    A = zeroField.lesserThan(4);
    B = yesterdayField.before(DOOV.DateFunction.today());
    C = bobField.startsWith('B');
    D = falseField.eq(false);
    rule = when(
      A.and(B)
        .and(C)
        .and(D)
    ).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata.when.metadata} />);
    expect(rule.execute(model).value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual([
      '<',
      'and',
      '<',
      'today',
      'and',
      'starts with',
      'and',
      '=',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual([
      'user.id',
      'user.birth',
      'user.name',
      'user.b',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['4', '"B"', 'false']);
    //expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).map( ??? ).length);
  });

  it('and and count', () => {
    A = zeroField.lesserThan(4);
    B = yesterdayField.before(DOOV.DateFunction.today());
    C = bobField.startsWith('B');
    D = falseField.eq(false);
    rule = when(A.and(B.and(count(C, D).greaterThan(1)))).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata.when.metadata} />);
    expect(rule.execute(model).value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(3);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual([
      '<',
      'and',
      '<',
      'today',
      'and',
      'starts with',
      '=',
      '>',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual([
      'user.id',
      'user.birth',
      'user.name',
      'user.b',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['4', '"B"', 'false', '1']);
    expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).map(getTextArray)).toEqual(['count']);
  });

  it('and or and', () => {
    A = zeroField.lesserThan(4);
    B = yesterdayField.before(DOOV.DateFunction.today());
    C = bobField.startsWith('B');
    D = falseField.eq(false);
    rule = when(A.and(B).or(C.and(D))).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata.when.metadata} />);
    expect(rule.execute(model).value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(2);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual([
      '<',
      'and',
      '<',
      'today',
      'or',
      'starts with',
      'and',
      '=',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual([
      'user.id',
      'user.birth',
      'user.name',
      'user.b',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['4', '"B"', 'false']);
  });
});

afterEach(() => {
  console.log(rule.metadata.readable + '\n' + wrapper.html());
});
