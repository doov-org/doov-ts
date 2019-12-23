import * as React from 'react';
import * as DOOV from '../../../../src/doov';
import { mount, ReactWrapper } from 'enzyme';
import { Model, User } from '../../../model';
import { GetHtml } from '../../../../src/dsl/meta/ast/HtmlRenderer';
import { HtmlSelector } from '../../../HtmlSelector';
import { biConverter, converter, map, mappings, when } from '../../../../src/doov';
import { MappingRule } from '../../../../src/dsl/lang/MappingRule';

let wrapper: ReactWrapper;
let rule: MappingRule;

const dateValue = new Date(2000, 0, 1);
const dateString = JSON.stringify(dateValue);

let model = new Model();
let user = new User(0);
user.name = 'Bob';
user.name2 = 'Alice';
user.birth = dateValue;
user.today = new Date(2019, 0, 1);
user.b = false;
model.user = user;

const intField = DOOV.number(DOOV.field<number, Model>('user', 'id'));
const boolField = DOOV.boolean(DOOV.field<boolean, Model>('user', 'b'));
const dateField = DOOV.date(DOOV.field<Date, Model>('user', 'birth'));
const dateField2 = DOOV.date(DOOV.field<Date, Model>('user', 'today'));
const stringField = DOOV.string(DOOV.field<string, Model>('user', 'name'));
const stringField2 = DOOV.string(DOOV.field<string, Model>('user', 'name2'));

const getTextArray = (node: ReactWrapper) => node.text();

describe('tests of mapping', () => {
  it('map to int field ', () => {
    rule = map(18).to(intField);
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_WHEN_SPAN).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_THEN_SPAN).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_ELSE_SPAN).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_SINGLE_MAPPING_SPAN).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['single_mapping', '->']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['18']);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual(['user.id']);
    expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).length).toEqual(0);
  });
  it('map to boolean field ', () => {
    rule = map(true).to(boolField);
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_WHEN_SPAN).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_THEN_SPAN).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_ELSE_SPAN).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_SINGLE_MAPPING_SPAN).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['single_mapping', '->']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['true']);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual(['user.b']);
    expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).length).toEqual(0);
  });
  it('map to date field ', () => {
    rule = map(dateValue).to(dateField);
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_WHEN_SPAN).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_THEN_SPAN).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_ELSE_SPAN).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_SINGLE_MAPPING_SPAN).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['single_mapping', '->']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual([dateString]);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual(['user.birth']);
    expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).length).toEqual(0);
  });
  it('mappings to int field boolean field and date field', () => {
    rule = mappings(map(18).to(intField), map(true).to(boolField), map(dateValue).to(dateField));
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(3);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_WHEN_SPAN).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_THEN_SPAN).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_ELSE_SPAN).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_SINGLE_MAPPING_SPAN).length).toEqual(3);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual([
      'single_mapping',
      '->',
      'single_mapping',
      '->',
      'single_mapping',
      '->',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['18', 'true', dateString]);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual(['user.id', 'user.b', 'user.birth']);
    expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).length).toEqual(0);
  });
  it('mapping date to stringfield with converter', () => {
    rule = map(dateValue)
      .using(converter(d => d.toString(), 'date to string'))
      .to(stringField);
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_WHEN_SPAN).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_THEN_SPAN).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_ELSE_SPAN).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_SINGLE_MAPPING_SPAN).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual(['single_mapping', 'using', '->']);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual([dateString, "'date to string'"]);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual(['user.name']);
    expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).length).toEqual(0);
  });
  it('mapping 2 stringfields to stringfield2 with converter', () => {
    rule = map(stringField, stringField2)
      .using(biConverter((s1, s2) => s1 + ' ' + s2, 'combine names'))
      .to(stringField2);
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_WHEN_SPAN).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_THEN_SPAN).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_ELSE_SPAN).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_SINGLE_MAPPING_SPAN).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual([
      'single_mapping',
      'and',
      'using',
      '->',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(["'combine names'"]);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual([
      'user.name',
      'user.name2',
      'user.name2',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).length).toEqual(0);
  });
  it('conditional mapping to booleanField', () => {
    rule = when(dateField.ageAt(dateField2).greaterOrEquals(18))
      .then(map(true).to(boolField))
      .otherwise(map(false).to(boolField));
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_WHEN_SPAN).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.TOKEN_THEN_SPAN).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.TOKEN_ELSE_SPAN).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.TOKEN_SINGLE_MAPPING_SPAN).length).toEqual(2);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual([
      'age at',
      '>=',
      'single_mapping',
      '->',
      'single_mapping',
      '->',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['18', 'true', 'false']);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual([
      'user.birth',
      'user.today',
      'user.b',
      'user.b',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).length).toEqual(0);
  });
  it('conditional multiple mapping to booleanField', () => {
    rule = when(dateField.ageAt(dateField2).greaterOrEquals(18)).then(
      mappings(map(true).to(boolField), map(true).to(boolField))
    );
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(wrapper.find(HtmlSelector.NARY_OL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARY_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.NARY_LI).length).toEqual(2);
    expect(wrapper.find(HtmlSelector.LEAF_LI).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.WHEN_UL).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.BINARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.BINARYCHILD_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.UNARY_UL).length).toEqual(0);
    expect(wrapper.find(HtmlSelector.TOKEN_WHEN_SPAN).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.TOKEN_THEN_SPAN).length).toEqual(1);
    expect(wrapper.find(HtmlSelector.TOKEN_SINGLE_MAPPING_SPAN).length).toEqual(2);
    expect(wrapper.find(HtmlSelector.TOKEN_OPERATOR_SPAN).map(getTextArray)).toEqual([
      'age at',
      '>=',
      'single_mapping',
      '->',
      'single_mapping',
      '->',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_VALUE_SPAN).map(getTextArray)).toEqual(['18', 'true', 'true']);
    expect(wrapper.find(HtmlSelector.TOKEN_FIELD_SPAN).map(getTextArray)).toEqual([
      'user.birth',
      'user.today',
      'user.b',
      'user.b',
    ]);
    expect(wrapper.find(HtmlSelector.TOKEN_NARY_SPAN).length).toEqual(0);
  });
});

afterEach(() => {
  console.log(rule.metadata.readable + '\n' + wrapper.html());
});
