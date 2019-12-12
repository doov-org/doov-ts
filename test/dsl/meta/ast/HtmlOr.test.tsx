import * as React from 'react';
import { BooleanFunction } from '../../../../src/dsl/lang/BooleanFunction';
//import { Result } from '../../../../src/dsl/Result';
import * as DOOV from '../../../../src/doov';
import { SingleValidationRule, when } from '../../../../src/doov';
import { mount } from 'enzyme';
import { HtmlValidationRule } from '../../../../src/dsl/meta/ast/HtmlValidationRule';
import { HtmlSelector } from '../../../../src/dsl/meta/ast/HtmlSelector';

let A, B, C: BooleanFunction;
//let result: Result;

describe('test du or', function() {
  it('or true false complex', () => {
    A = DOOV.lift(BooleanFunction, true);
    B = DOOV.lift(BooleanFunction, false);
    C = DOOV.lift(BooleanFunction, true);
    const rule = when(A.or(B.or(C))).validate() as SingleValidationRule;
    const wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    console.log(wrapper.html());
    expect(rule.execute().value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    /*      expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).length).toEqual(0);
      expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).length).toEqual(0);
      expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).length).toEqual(0);*/
  });
  it('or false true complex', () => {
    A = DOOV.lift(BooleanFunction, false);
    B = DOOV.lift(BooleanFunction, true);
    C = DOOV.lift(BooleanFunction, true);
    const rule = when(A.or(B.and(C))).validate() as SingleValidationRule;
    const wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    console.log(wrapper.html());
    expect(rule.execute().value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(2);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    /*      expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).length).toEqual(0);
              expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).length).toEqual(0);
              expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).length).toEqual(0);*/
  });
  it('or false false', () => {
    A = DOOV.lift(BooleanFunction, false);
    B = DOOV.lift(BooleanFunction, false);
    const rule = when(A.or(B)).validate() as SingleValidationRule;
    const wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    console.log(wrapper.html());
    expect(rule.execute().value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    /*      expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).length).toEqual(0);
                expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).length).toEqual(0);
                expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).length).toEqual(0);*/
  });
  it('or false true complex', () => {
    A = DOOV.lift(BooleanFunction, false);
    B = DOOV.lift(BooleanFunction, true);
    C = DOOV.lift(BooleanFunction, true);
    const rule = when(A.or(B.and(C))).validate() as SingleValidationRule;
    const wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    console.log(wrapper.html());
    expect(rule.execute().value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(2);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    /*      expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).length).toEqual(0);
                expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).length).toEqual(0);
                expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).length).toEqual(0);*/
  });
  it('or false false', () => {
    A = DOOV.lift(BooleanFunction, false);
    B = DOOV.lift(BooleanFunction, false);
    const rule = when(A.or(B)).validate() as SingleValidationRule;
    const wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    console.log(wrapper.html());
    expect(rule.execute().value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    /*      expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).length).toEqual(0);
                expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).length).toEqual(0);
                expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).length).toEqual(0);*/
  });
  it('or false false complex', () => {
    A = DOOV.lift(BooleanFunction, false);
    B = DOOV.lift(BooleanFunction, false);
    C = DOOV.lift(BooleanFunction, true);
    const rule = when(A.or(B.and(C))).validate() as SingleValidationRule;
    const wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    console.log(wrapper.html());
    expect(rule.execute().value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(2);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    /*      expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).length).toEqual(0);
                expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).length).toEqual(0);
                expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).length).toEqual(0);*/
  });
  it('or true false', () => {
    A = DOOV.lift(BooleanFunction, true);
    B = DOOV.lift(BooleanFunction, false);
    const rule = when(A.or(B)).validate() as SingleValidationRule;
    const wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    console.log(wrapper.html());
    expect(rule.execute().value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    /*      expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).length).toEqual(0);
                expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).length).toEqual(0);
                expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).length).toEqual(0);*/
  });
  it('or false true', () => {
    A = DOOV.lift(BooleanFunction, false);
    B = DOOV.lift(BooleanFunction, true);
    const rule = when(A.or(B)).validate() as SingleValidationRule;
    const wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    console.log(wrapper.html());
    expect(rule.execute().value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    /*      expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).length).toEqual(0);
                expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).length).toEqual(0);
                expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).length).toEqual(0);*/
  });
  it('or true true', () => {
    A = DOOV.lift(BooleanFunction, true);
    B = DOOV.lift(BooleanFunction, true);
    const rule = when(A.or(B)).validate() as SingleValidationRule;
    const wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    console.log(wrapper.html());
    expect(rule.execute().value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    /*      expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).length).toEqual(0);
                expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).length).toEqual(0);
                expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).length).toEqual(0);*/
  });
  it('or field true true', () => {});
  //it('or or or'), () => {});
});
