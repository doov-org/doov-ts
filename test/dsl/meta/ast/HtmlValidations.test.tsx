import { GetHtml } from '../../../../src/dsl/meta/ast/HtmlRenderer';
import { HtmlSelector } from '../../../HtmlSelector';
import { BooleanFunction } from '../../../../src/dsl/lang/BooleanFunction';
import { ValidationRule, when } from '../../../../src/doov';
import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import * as DOOV from '../../../../src/doov';

let A, B: BooleanFunction;
let wrapper: ReactWrapper;
let rule: ValidationRule;

const bobField = DOOV.string(DOOV.field('user', 'name'));
const link0 = DOOV.string(DOOV.field('user', 'links', 0));

const getTextArray = (node: ReactWrapper) => node.text();

describe('tests of validations', () => {
  it('validations when false when false', () => {
    A = DOOV.lift(BooleanFunction, false);
    B = DOOV.lift(BooleanFunction, false);
    rule = DOOV.validations(when(A).validate(), when(B).validate());
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(2);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['false', 'false']);
    expect(wrapper.find('div').length).toEqual(2);
  });
  it('validations complex', () => {
    rule = DOOV.validations(
      DOOV.when(bobField.startsWith('B')).validate(),
      DOOV.when(link0.isDefined().and(bobField.contains('Bob'))).validate()
    );
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(2);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual([
      'starts with',
      'is defined',
      'and',
      'contains',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual([
      'user.name',
      'user.links.0',
      'user.name',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['"B"', '"Bob"']);
    expect(wrapper.find('div').length).toEqual(2);
  });
});

afterEach(() => {
  console.log(rule.metadata.readable + '\n' + wrapper.html());
});
