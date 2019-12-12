import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { HtmlValidationRule } from '../../../../src/dsl/meta/ast/HtmlValidationRule';
import { BooleanFunction } from '../../../../src/dsl/lang/BooleanFunction';
import * as DOOV from '../../../../src/doov';
import { count, NumberFunction, SingleValidationRule, StringFunction, when } from '../../../../src/doov';
import { HtmlSelector } from '../../../../src/dsl/meta/ast/HtmlSelector';
import { Model, User } from '../../../model';
//import { HtmlSelector } from "../../../../src/dsl/meta/ast/HtmlSelector";

let A, B, C, D: BooleanFunction;

let model = new Model();
let user = new User(0);
user.name = 'Bob';
user.birth = new Date(2019, 12, 11);
user.b = false;
model.user = user;

let getTextArray = (node: ReactWrapper) => node.text();

describe('test du and', () => {
  it('and false false', () => {
    A = DOOV.lift(BooleanFunction, false);
    B = DOOV.lift(BooleanFunction, false);
    const rule = when(A.and(B)).validate() as SingleValidationRule;
    //const meta = rule.metadata.when.metadata;
    //console.log(meta.readable);
    const wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    console.log(wrapper.html());
    expect(rule.execute().value).toEqual(false);
    //expect(wrapper.find('h1.yo').length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).map()).toEqual();
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['and']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['false', 'false']);
  });

  it('and true false', () => {
    A = DOOV.lift(BooleanFunction, true);
    B = DOOV.lift(BooleanFunction, false);
    const rule = when(A.and(B)).validate() as SingleValidationRule;
    const wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    expect(rule.execute().value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).map( ??? ).length).toEqual(2);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['and']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['true', 'false']);
  });

  it('and false true', () => {
    A = DOOV.lift(BooleanFunction, false);
    B = DOOV.lift(BooleanFunction, true);
    const rule = when(A.and(B)).validate() as SingleValidationRule;
    const wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    expect(rule.execute().value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).map( ??? ).length).toEqual(2);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['and']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['false', 'true']);
  });

  it('and true true', () => {
    A = DOOV.lift(BooleanFunction, true);
    B = DOOV.lift(BooleanFunction, true);
    const rule = when(A.and(B)).validate() as SingleValidationRule;
    const wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    expect(rule.execute().value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).map( ??? ).length).toEqual(2);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['and']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['true', 'true']);
  });

  it('and field true true failure', () => {
    //const fieldZero = DOOV.number(DOOV.field('zero'));
    const zero = DOOV.lift(NumberFunction, 0);
    const yesterday = DOOV.DateFunction.today().minusDays(1);
    A = zero.lesserThan(4);
    B = yesterday.before(DOOV.DateFunction.today());
    const rule = when(A.and(B)).validate() as SingleValidationRule;
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
    //expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).map( ??? ).length).toEqual(2);
    //expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map( ??? ).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map( ??? );
    //expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(???).length).toEqual(0);
  });

  it('and and and', () => {
    const zeroField = DOOV.number(DOOV.field('user', 'id'));
    const yesterdayField = DOOV.date(DOOV.field('user', 'birth'));
    const bobField = DOOV.string(DOOV.field('user', 'name'));
    const falseField = DOOV.boolean(DOOV.field('user', 'b'));
    //const zero = DOOV.lift(NumberFunction, 0);
    //const yesterday = DOOV.DateFunction.today().minusDays(1);
    //const bob = DOOV.lift(StringFunction, 'bob');
    //const isFalse = DOOV.lift(BooleanFunction, false);
    A = zeroField.lesserThan(4);
    B = yesterdayField.before(DOOV.DateFunction.today());
    C = bobField.startsWith('B');
    D = falseField.eq(false);
    const rule = when(
      A.and(B)
        .and(C)
        .and(D)
    ).validate() as SingleValidationRule;
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
    //expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).map( ??? ).length).toEqual(2);
    //expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map( ??? ).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(???).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).map( ??? ).length);
  });

  it('and and count', () => {
    const zero = DOOV.lift(NumberFunction, 0);
    const yesterday = DOOV.DateFunction.today().minusDays(1);
    const bob = DOOV.lift(StringFunction, 'Bob');
    const isFalse = DOOV.lift(BooleanFunction, false);
    A = zero.lesserThan(4);
    B = yesterday.before(DOOV.DateFunction.today());
    C = bob.startsWith('B');
    D = isFalse.eq(false);
    const rule = when(A.and(B.and(count(C, D).greaterThan(1)))).validate() as SingleValidationRule;
    const wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    expect(rule.execute().value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(3);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).map( ??? ).length).toEqual(2);
    //expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map( ??? ).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(???).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).map( ??? ).length);
  });

  it('and or and', () => {
    //const z = DOOV.number(DOOV.field('zero'));
    const zero = DOOV.lift(NumberFunction, 0);
    const yesterday = DOOV.DateFunction.today().minusDays(1);
    const bob = DOOV.lift(StringFunction, 'Bob');
    const isFalse = DOOV.lift(BooleanFunction, false);
    A = zero.lesserThan(4);
    B = yesterday.before(DOOV.DateFunction.today());
    C = bob.startsWith('B');
    D = isFalse.eq(false);
    const rule = when(A.and(B).or(C.and(D))).validate() as SingleValidationRule;
    const wrapper = mount(<HtmlValidationRule metadata={rule.metadata} />);
    expect(rule.execute().value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(2);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.PERCENTAGE_VALUE_DIV).map( ??? ).length).toEqual(2);
    //expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map( ??? ).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(???).length).toEqual(0);
    //expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).map( ??? ).length).toEqual(0);
  });
});
