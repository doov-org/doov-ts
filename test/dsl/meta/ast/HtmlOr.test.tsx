import * as React from 'react';
import { BooleanFunction } from '../../../../src/dsl/lang/BooleanFunction';
//import { Result } from '../../../../src/dsl/Result';
import * as DOOV from '../../../../src/doov';
import { SingleValidationRule, when } from '../../../../src/doov';
import { mount, ReactWrapper } from 'enzyme';
import { HtmlValidationRule } from '../../../../src/dsl/meta/ast/HtmlValidationRule';
import { HtmlSelector } from '../../../../src/dsl/meta/ast/HtmlSelector';
import { Model, User } from '../../../model';

let A, B, C, D: BooleanFunction;
let rule: SingleValidationRule;
let wrapper: ReactWrapper;
//let result: Result;

let model = new Model();
let user = new User(0);
user.name = 'Bob';
user.birth = new Date(2019, 11, 11);
user.b = false;
model.user = user;

let getTextArray = (node: ReactWrapper) => node.text();

describe('test du or', function() {
  it('or true false complex', () => {
    A = DOOV.lift(BooleanFunction, true);
    B = DOOV.lift(BooleanFunction, false);
    C = DOOV.lift(BooleanFunction, true);
    rule = when(A.or(B.or(C))).validate() as SingleValidationRule;
    wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    expect(rule.execute().value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['or', 'or']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['true', 'false', 'true']);
  });
  it('or false true complex', () => {
    A = DOOV.lift(BooleanFunction, false);
    B = DOOV.lift(BooleanFunction, true);
    C = DOOV.lift(BooleanFunction, true);
    rule = when(A.or(B.and(C))).validate() as SingleValidationRule;
    wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    expect(rule.execute().value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(2);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['or', 'and']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['false', 'true', 'true']);
  });
  it('or false false', () => {
    A = DOOV.lift(BooleanFunction, false);
    B = DOOV.lift(BooleanFunction, false);
    rule = when(A.or(B)).validate() as SingleValidationRule;
    wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    expect(rule.execute().value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['or']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['false', 'false']);
  });
  it('or false false complex', () => {
    A = DOOV.lift(BooleanFunction, false);
    B = DOOV.lift(BooleanFunction, false);
    C = DOOV.lift(BooleanFunction, true);
    rule = when(A.or(B.and(C))).validate() as SingleValidationRule;
    wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    expect(rule.execute().value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(2);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['or', 'and']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['false', 'false', 'true']);
  });
  it('or true false', () => {
    A = DOOV.lift(BooleanFunction, true);
    B = DOOV.lift(BooleanFunction, false);
    rule = when(A.or(B)).validate() as SingleValidationRule;
    wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    expect(rule.execute().value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['or']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['true', 'false']);
  });
  it('or false true', () => {
    A = DOOV.lift(BooleanFunction, false);
    B = DOOV.lift(BooleanFunction, true);
    rule = when(A.or(B)).validate() as SingleValidationRule;
    wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    expect(rule.execute().value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['or']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['false', 'true']);
  });
  it('or true true', () => {
    A = DOOV.lift(BooleanFunction, true);
    B = DOOV.lift(BooleanFunction, true);
    rule = when(A.or(B)).validate() as SingleValidationRule;
    wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    expect(rule.execute().value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['or']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['true', 'true']);
  });
  it('or field true true', () => {
    const zeroField = DOOV.number(DOOV.field('user', 'id'));
    const yesterdayField = DOOV.date(DOOV.field('user', 'birth'));
    A = zeroField.lesserThan(4);
    B = yesterdayField.before(DOOV.DateFunction.today());
    rule = when(A.or(B)).validate() as SingleValidationRule;
    wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    expect(rule.execute(model).value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['<', 'or', '<', 'today']);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual(['user.id', 'user.birth']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['4']);
  });
  it('or or or', () => {
    const zeroField = DOOV.number(DOOV.field('user', 'id'));
    const yesterdayField = DOOV.date(DOOV.field('user', 'birth'));
    const bobField = DOOV.string(DOOV.field('user', 'name'));
    const falseField = DOOV.boolean(DOOV.field('user', 'b'));
    A = zeroField.lesserThan(4);
    B = yesterdayField.before(DOOV.DateFunction.today());
    C = bobField.startsWith('B');
    D = falseField.eq(false);
    const rule = when(
      A.or(B)
        .or(C)
        .or(D)
    ).validate() as SingleValidationRule;
    wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    expect(rule.execute(model).value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual([
      '<',
      'or',
      '<',
      'today',
      'or',
      'starts with',
      'or',
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
