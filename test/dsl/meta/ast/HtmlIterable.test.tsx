import * as React from 'react';
import * as DOOV from '../../../../src/doov';
import { mount, ReactWrapper } from 'enzyme';
import { Model, User } from '../../../model';
import { GetHtml } from '../../../../src/dsl/meta/ast/HtmlRenderer';
//import { HtmlSelector } from '../../../HtmlSelector';
import { field, map } from '../../../../src/doov';
import { MappingRule } from '../../../../src/dsl/lang/MappingRule';

let wrapper: ReactWrapper;
let rule: MappingRule;

let model = new Model();
let user = new User(0);
user.links = [];
model.user = user;

const iterField = DOOV.iterable<string>(field('user', 'links'));

describe('test du iterable', () => {
  it('iterable 1', () => {
    const content = ['1', '2', '3'];
    rule = map(content).to(iterField);
    wrapper = mount(<GetHtml metadata={rule.metadata} />);
    /*expect(wrapper.find(HtmlSelector.ITERABLE_UL).text()).toEqual("'1' '2' '3'");
    expect(
      wrapper
        .find(HtmlSelector.ITERABLE_UL)
        .find('li')
        .childAt(0)
        .text()
    ).toEqual("'1'");
    expect(
      wrapper
        .find(HtmlSelector.ITERABLE_UL)
        .find('li')
        .childAt(1)
        .text()
    ).toEqual("'2'");
    expect(
      wrapper
        .find(HtmlSelector.ITERABLE_UL)
        .find('li')
        .childAt(2)
        .text()
    ).toEqual("'3'");*/
  });
});

afterEach(() => {
  console.log(rule.metadata.readable + '\n' + wrapper.html());
});
