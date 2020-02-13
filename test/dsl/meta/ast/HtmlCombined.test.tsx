import * as React from 'react';
import * as DOOV from '../../../../src/doov';
import { Model, User } from '../../../model';
import { mount, ReactWrapper } from 'enzyme';
import { GetHtml } from '../../../../src/dsl/meta/ast/HtmlRenderer';
import { BooleanFunction } from '../../../../src/dsl/lang/BooleanFunction';
import { SingleValidationRule } from '../../../../src/dsl/lang/SingleValidationRule';
import { HtmlSelector } from '../../../HtmlSelector';

let A, B, C: BooleanFunction;
let wrapper: ReactWrapper;
let rule: SingleValidationRule;

let model = new Model();
let user = new User(0);
user.links = ['some string', 'other string'];
model.user = user;

const zeroField = DOOV.number(DOOV.field('user', 'id'));
const links = DOOV.iterable(DOOV.field<string[], Model>('user', 'links'));
const stringField1 = DOOV.string(DOOV.field<string, Model>('user', 'links', 0));
const stringField2 = DOOV.string(DOOV.field<string, Model>('user', 'links', 1));

const getTextArray = (node: ReactWrapper) => node.text();

describe('combined tests', () => {
  it('reduce matchAll', () => {
    A = DOOV.lift(BooleanFunction, false);
    B = DOOV.lift(BooleanFunction, false);
    C = DOOV.lift(BooleanFunction, false);
    rule = DOOV.when(DOOV.matchAll(A, B, C)).validate() as SingleValidationRule;
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
  it('reduce and', () => {
    A = DOOV.lift(BooleanFunction, true);
    B = DOOV.lift(BooleanFunction, false);
    rule = DOOV.when(A.and(B)).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(rule.execute().value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['and']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['true', 'false']);
  });
  it('reduce zeroInt', () => {
    rule = DOOV.when(zeroField.notEq(0)).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(rule.execute(model).value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual(['user.id']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['0']);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['!=']);
  });
  it('reduce links', () => {
    rule = DOOV.when(links.contains('c')).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(rule.execute(model).value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual(['user.links']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['"c"']);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['contains']);
  });
  it('reduce undefined', () => {
    A = DOOV.date(DOOV.field('user', 'birth'));
    rule = DOOV.when(A.isUndefined()).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(rule.execute(model).value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual(['user.birth']);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['is undefined']);
  });
  it('matches regexp', () => {
    A = DOOV.date(DOOV.field('user', 'birth'));
    rule = DOOV.when(
      stringField1.matches('^some.*').or(stringField2.matches('^other.*'))
    ).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(rule.execute(model).value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual(['user.links.0', 'user.links.1']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['"^some.*"', '"^other.*"']);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['matches', 'or', 'matches']);
  });
});

afterEach(() => {
  console.log(rule.metadata.readable + '\n' + wrapper.html());
});
