import * as React from 'react';
import * as DOOV from '../../../../src/doov';
import { mount, ReactWrapper } from 'enzyme';
import { Model, User } from '../../../model';
import { GetHtml } from '../../../../src/dsl/meta/ast/HtmlRenderer';
import { HtmlSelector } from '../../../HtmlSelector';
import { MappingRule } from '../../../../src/dsl/lang/MappingRule';
import { SingleValidationRule, StringFunction } from '../../../../src/doov';

let wrapper: ReactWrapper;
let rule: MappingRule;

let model = new Model();
let user = new User(0);
user.links = [];
model.user = user;

const iterField = DOOV.iterable(DOOV.field<string[], Model>('user', 'links'));
const someValue = DOOV.lift(StringFunction, 'gmail.com');

describe('tests of iterable', () => {
  it('mapping iterable value', () => {
    rule = DOOV.map(['google.com', 'yahoo.fr']).to(iterField);
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    expect(wrapper.find(HtmlSelector.ITERABLE_UL).text()).toEqual('"google.com""yahoo.fr"');
    expect(
      wrapper
        .find(HtmlSelector.ITERABLE_UL)
        .find('li')
        .at(0)
        .text()
    ).toEqual('"google.com"');
    expect(
      wrapper
        .find(HtmlSelector.ITERABLE_UL)
        .find('li')
        .at(1)
        .text()
    ).toEqual('"yahoo.fr"');
  });
  it('iterableFunction with noneMatch', () => {
    const rule = DOOV.when(someValue.noneMatch('google.com', 'yahoo.fr')).validate() as SingleValidationRule;
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    console.log(wrapper.html());
    expect(rule.execute().value).toEqual(true);
    expect(wrapper.find(HtmlSelector.ITERABLE_UL).text()).toEqual('"google.com""yahoo.fr"');
    expect(
      wrapper
        .find(HtmlSelector.ITERABLE_UL)
        .find('li')
        .at(0)
        .text()
    ).toEqual('"google.com"');
    expect(
      wrapper
        .find(HtmlSelector.ITERABLE_UL)
        .find('li')
        .at(1)
        .text()
    ).toEqual('"yahoo.fr"');
  });
});

afterEach(() => {
  if (rule) console.log(rule.metadata.readable + '\n' + wrapper.html());
});
