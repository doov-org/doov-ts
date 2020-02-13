import * as React from 'react';
import * as DOOV from '../../../../src/doov';
import { mount, ReactWrapper } from 'enzyme';
import { Model, User } from '../../../model';
import { GetHtml } from '../../../../src/dsl/meta/ast/HtmlRenderer';
import { HtmlSelector } from '../../../HtmlSelector';
import { BooleanFunction } from '../../../../src/dsl/lang/BooleanFunction';
import { matchAll, SingleValidationRule, when } from '../../../../src/doov';

let A, B, C: BooleanFunction;
let wrapper: ReactWrapper;
let rule: SingleValidationRule;

let model = new Model();
let user = new User(0);
user.name = 'something';
user.birth = new Date(2019, 11, 11);
model.user = user;

const zeroField = DOOV.number(DOOV.field('user', 'id'));
const yesterdayField = DOOV.date(DOOV.field('user', 'birth'));
const somethingField = DOOV.string(DOOV.field('user', 'name'));

const getTextArray = (node: ReactWrapper) => node.text();

describe('tests of matchAll', () => {
  it('matchAll true true true', () => {
    A = DOOV.lift(BooleanFunction, true);
    B = DOOV.lift(BooleanFunction, true);
    C = DOOV.lift(BooleanFunction, true);
    rule = when(matchAll(A, B, C)).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(rule.execute().value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(3);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['true', 'true', 'true']);
    expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).map(getTextArray)).toEqual(['match all']);
  });
  it('matchAll true true false', () => {
    A = DOOV.lift(BooleanFunction, true);
    B = DOOV.lift(BooleanFunction, true);
    C = DOOV.lift(BooleanFunction, false);
    rule = when(matchAll(A, B, C)).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(rule.execute().value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(3);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['true', 'true', 'false']);
    expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).map(getTextArray)).toEqual(['match all']);
  });
  it('matchAll true false false', () => {
    A = DOOV.lift(BooleanFunction, true);
    B = DOOV.lift(BooleanFunction, false);
    C = DOOV.lift(BooleanFunction, false);
    rule = when(matchAll(A, B, C)).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(rule.execute().value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(3);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['true', 'false', 'false']);
    expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).map(getTextArray)).toEqual(['match all']);
  });
  it('matchAll false false false', () => {
    A = DOOV.lift(BooleanFunction, false);
    B = DOOV.lift(BooleanFunction, false);
    C = DOOV.lift(BooleanFunction, false);
    rule = when(matchAll(A, B, C)).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(rule.execute().value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(3);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['false', 'false', 'false']);
    expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).map(getTextArray)).toEqual(['match all']);
  });
  it('matchAll field false false false failure', () => {
    A = zeroField.greaterThan(4);
    B = yesterdayField.after(DOOV.DateFunction.today());
    C = somethingField.matches('^other.*');
    rule = when(matchAll(A, B, C)).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(rule.execute(model).value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(3);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['>', '>', 'today', 'matches']);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual([
      'user.id',
      'user.birth',
      'user.name',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['4', '"^other.*"']);
    expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).map(getTextArray)).toEqual(['match all']);
  });
});

afterEach(() => {
  console.log(rule.metadata.readable + '\n' + wrapper.html());
});
