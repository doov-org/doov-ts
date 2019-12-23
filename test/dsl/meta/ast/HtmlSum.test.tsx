import * as React from 'react';
import * as DOOV from '../../../../src/doov';
import { mount, ReactWrapper } from 'enzyme';
import { Model, User } from '../../../model';
import { GetHtml } from '../../../../src/dsl/meta/ast/HtmlRenderer';
import { HtmlSelector } from '../../../HtmlSelector';
import { SingleValidationRule, sum } from '../../../../src/doov';
import { when } from '../../../../src/doov';

let wrapper: ReactWrapper;
let rule: SingleValidationRule;

let model = new Model();
let user = new User(1);
user.id2 = 1;
model.user = user;

const A = DOOV.number(DOOV.field<number, Model>('user', 'id'));
const B = DOOV.number(DOOV.field<number, Model>('user', 'id2'));

const getTextArray = (node: ReactWrapper) => node.text();

describe('tests of sum', () => {
  it('sum 1 1 greaterThan 1', () => {
    rule = when(sum(A, B).greaterThan(1)).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata.when.metadata} />);
    expect(rule.execute(model).value).toEqual(true);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(2);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['>']);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual(['user.id', 'user.id2']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['1']);
    expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).map(getTextArray)).toEqual(['sum']);
  });
  it('sum 1 1 greaterThan 3', () => {
    rule = when(sum(A, B).greaterThan(3)).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata.when.metadata} />);
    expect(rule.execute(model).value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(2);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['>']);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual(['user.id', 'user.id2']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['3']);
    expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).map(getTextArray)).toEqual(['sum']);
  });
  it('sum sum 1 sum 2 greaterThan 3', () => {
    rule = when(sum(sum(A), sum(B)).greaterThan(3)).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata.when.metadata} />);
    expect(rule.execute(model).value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(3);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(2);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(2);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['>']);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual(['user.id', 'user.id2']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['3']);
    expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).map(getTextArray)).toEqual(['sum', 'sum', 'sum']);
  });
});

afterEach(() => {
  console.log(rule.metadata.readable + '\n' + wrapper.html());
});
