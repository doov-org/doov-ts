import * as React from 'react';
import * as DOOV from '../../../../src/doov';
import { Model, User } from '../../../model';
import { mount, ReactWrapper } from 'enzyme';
import { GetHtml } from '../../../../src/dsl/meta/ast/HtmlRenderer';
import { SingleValidationRule } from '../../../../src/dsl/lang/SingleValidationRule';
import { HtmlSelector } from '../../../HtmlSelector';

let wrapper: ReactWrapper;
let rule: SingleValidationRule;

let model = new Model();
let user = new User(0);
user.name = 'Bob';
user.links = ['some string', 'other string'];
user.b = false;
model.user = user;

const zeroField = DOOV.number(DOOV.field('user', 'id'));
const nameField = DOOV.string(DOOV.field('user', 'name'));
const dateField = DOOV.date(DOOV.field('user', 'birth'));
const boolField = DOOV.boolean(DOOV.field('user', 'b'));

const getTextArray = (node: ReactWrapper) => node.text();

describe('more combined tests', () => {
  it('or and sum', () => {
    rule = DOOV.when(
      dateField
        .ageAt(dateField)
        .greaterOrEquals(0)
        .or(dateField.ageAt(dateField).greaterOrEquals(0))
        .and(DOOV.sum(zeroField, zeroField).lesserThan(0))
    ).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata.when.metadata} />);
    expect(rule.execute(model).value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(2);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual([
      'age at',
      '>=',
      'or',
      'age at',
      '>=',
      'and',
      '<',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual([
      'user.birth',
      'user.birth',
      'user.birth',
      'user.birth',
      'user.id',
      'user.id',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['0', '0', '0']);
    expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).map(getTextArray)).toEqual(['sum']);
  });
  it('and and and match any and and', () => {
    rule = DOOV.when(
      nameField
        .eq('Bob')
        .and(boolField.eq(false))
        .and(DOOV.matchAny(boolField.eq(true), boolField.not().and(zeroField.between(0, 1))))
        .and(zeroField.eq(1))
    ).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata.when.metadata} />);
    expect(rule.execute(model).value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(3);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual([
      '=',
      'and',
      '=',
      'and',
      '=',
      'not',
      'and',
      '>=',
      'and',
      '<',
      'and',
      '=',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual([
      'user.name',
      'user.b',
      'user.b',
      'user.b',
      'user.id',
      'user.id',
      'user.id',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual([
      '"Bob"',
      'false',
      'true',
      '0',
      '1',
      '1',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).map(getTextArray)).toEqual(['match any']);
  });
  it('or and and and', () => {
    rule = DOOV.when(
      zeroField
        .isNull()
        .or(zeroField.eq(0))
        .and(boolField.eq(false))
        .and(
          dateField
            .ageAt(dateField)
            .lesserThan(0)
            .and(dateField.ageAt(dateField).greaterOrEquals(0))
        )
    ).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata.when.metadata} />);
    expect(rule.execute(model).value).toEqual(false);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual([
      'is null',
      'or',
      '=',
      'and',
      '=',
      'and',
      'age at',
      '<',
      'and',
      'age at',
      '>=',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual([
      'user.id',
      'user.id',
      'user.b',
      'user.birth',
      'user.birth',
      'user.birth',
      'user.birth',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['0', 'false', '0', '0']);
    expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).length).toEqual(0);
  });
  it('date', () => {
    rule = DOOV.when(
      DOOV.DateFunction.today()
        .minusDays(2)
        .before(DOOV.DateFunction.tomorrow())
    ).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata.when.metadata} />);
  });
});

afterEach(() => {
  console.log(rule.metadata.readable + '\n' + wrapper.html());
});
