import { Model, User } from '../../model';
import { StringFunction } from '../../../src/dsl/lang/StringFunction';
import * as DOOV from '../../../src/doov';
import { Function } from '../../../src/dsl/lang/Function';
import { NumberFunction } from '../../../src/dsl/lang/NumberFunction';
import { fieldsOf } from '../../../src/dsl/meta/MetadataUtils';
import { path } from '../../../src/Paths';
import { nullOrUndefined } from '../../../src/Utils';
import { biConverter } from '../../../src/doov';

let model: Model;
let user: User;

const id = DOOV.number(DOOV.field<number, Model>('user', 'id'));
const name = DOOV.string(DOOV.field<string, Model>('user', 'name'));
const link1 = DOOV.string(DOOV.field<string, Model>('user', 'links', 0));
const link2 = DOOV.string(DOOV.field<string, Model>('user', 'links', 1));

const reverse = DOOV.converter((obj, input: Function<string>) => {
  const value = input.get(obj);
  return !nullOrUndefined(value)
    ? value
        .split('')
        .reverse()
        .join('')
    : value;
}, 'reverse');

const underline = DOOV.converter((obj, input: Function<string>) => {
  const value = input.get(obj);
  return !nullOrUndefined(value) ? '_' + value + '_' : value;
}, 'underline');

const plusOne = DOOV.converter((obj, input: Function<number>) => {
  const value = input.get(obj);
  return (!nullOrUndefined(value) ? value : 0) + 1;
}, 'plusOne');

const plusOneSecond = DOOV.biConverter((obj, _: Function<any>, input2: Function<number>) => {
  const value = input2.get(obj);
  return (!nullOrUndefined(value) ? value : 0) + 1;
}, 'plusOneSecond');

const plusOneFirst = DOOV.naryConverter((obj, inputs, ctx) => {
  const in2 = inputs[1].get(obj, ctx);
  return (!nullOrUndefined(in2) ? in2 : 0) + 1;
}, 'plusOneFirst');

beforeEach(() => {
  model = new Model();
  user = new User(1);
  user.name = 'test';
  user.b = true;
  model.user = user;
});

describe('mappings', () => {
  const mappings = DOOV.mappings(
    DOOV.map(id.mapTo(StringFunction, v => 'link of ' + v)).to(link1),
    DOOV.map(name).to(link2)
  );

  it('execute mapping', () => {
    model = mappings.execute(model);
    expect(link1.get(model)).toEqual('link of 1');
    expect(link2.get(model)).toEqual('test');
  });

  it('metadata fields', () => {
    console.log(mappings.metadata.readable);
    const fields = fieldsOf(mappings.metadata);
    expect(fields).toContainEqual(path(id.metadata.readable));
    expect(fields).toContainEqual(path(link1.metadata.readable));
    expect(fields).toContainEqual(path(link2.metadata.readable));
    expect(fields).toContainEqual(path(name.metadata.readable));
  });
});

describe('conditional mapping then', () => {
  const mappings = DOOV.when(name.matches('^t.+')).then(
    DOOV.map(id.mapTo(StringFunction, v => 'link of ' + v)).to(link1),
    DOOV.map(name).to(link2)
  );

  it('execute mapping', () => {
    model = mappings.execute(model);
    expect(link1.get(model)).toEqual('link of 1');
    expect(link2.get(model)).toEqual('test');
    model = link1.set!(model, null);
    model = link2.set!(model, null);
    model = name.set!(model, 'other');
    model = mappings.execute(model);
    expect(link1.get(model)).toBeNull();
    expect(link2.get(model)).toBeNull();
  });

  it('metadata fields', () => {
    console.log(mappings.metadata.readable);
    const fields = fieldsOf(mappings.metadata);
    expect(fields).toContainEqual(path(id.metadata.readable));
    expect(fields).toContainEqual(path(link1.metadata.readable));
    expect(fields).toContainEqual(path(link2.metadata.readable));
    expect(fields).toContainEqual(path(name.metadata.readable));
  });
});

describe('conditional mapping otherwise', () => {
  const mappings = DOOV.when(name.matches('!^t.+'))
    .then(DOOV.map(id.mapTo(StringFunction, v => 'link of ' + v)).to(link1), DOOV.map(name).to(link2))
    .otherwise(DOOV.map(link2).to(name), DOOV.map(link1.mapTo(NumberFunction, v => (v ? parseInt(v) : 0))).to(id));

  it('execute mapping', () => {
    model = link1.set!(model, '4');
    model = link2.set!(model, 'other');
    model = mappings.execute(model);
    expect(name.get(model)).toEqual('other');
    expect(id.get(model)).toEqual(4);
  });

  it('metadata fields', () => {
    console.log(mappings.metadata.readable);
    const fields = fieldsOf(mappings.metadata);
    expect(fields).toContainEqual(path(id.metadata.readable));
    expect(fields).toContainEqual(path(link1.metadata.readable));
    expect(fields).toContainEqual(path(link2.metadata.readable));
    expect(fields).toContainEqual(path(name.metadata.readable));
  });
});

describe('type converter mapping', () => {
  const mappings = DOOV.mappings(
    DOOV.map(name)
      .using(reverse)
      .using(underline)
      .to(name),
    DOOV.map(name, id)
      .using((obj, input, input2) => input.get(obj) + ':' + input2.get(obj))
      .using(reverse)
      .to(link2),
    DOOV.map(id.mapTo(StringFunction, v => '' + v)).to(link1)
  );

  it('execute mapping', () => {
    model = mappings.execute(model);
    expect(name.get(model)).toEqual('_tset_');
    expect(id.get(model)).toEqual(1);
    expect(link2.get(model)).toEqual('1:_test_');
    expect(link1.get(model)).toEqual('1');
  });

  it('metadata fields', () => {
    for (let child of mappings.metadata.children()) {
      console.log(child.readable);
    }
    const fields = fieldsOf(mappings.metadata);
    expect(fields).toContainEqual(path(id.metadata.readable));
    expect(fields).toContainEqual(path(link1.metadata.readable));
    expect(fields).toContainEqual(path(link2.metadata.readable));
    expect(fields).toContainEqual(path(name.metadata.readable));
  });
});

describe('type bi converter mapping', () => {
  const mappings = DOOV.mappings(
    DOOV.map(name, id)
      .using((obj, input, input2) => input.get(obj) + ':' + input2.get(obj))
      .to(link2),
    DOOV.map(id.mapTo(StringFunction, v => '' + v)).to(link1),
    DOOV.map(name, id)
      .using(plusOneSecond)
      .using(plusOne)
      .to(id)
  );

  it('execute mapping', () => {
    model = mappings.execute(model);
    expect(name.get(model)).toEqual('test');
    expect(id.get(model)).toEqual(3);
    expect(link2.get(model)).toEqual('test:1');
    expect(link1.get(model)).toEqual('1');
  });

  it('metadata fields', () => {
    for (let child of mappings.metadata.children()) {
      console.log(child.readable);
    }
    const fields = fieldsOf(mappings.metadata);
    expect(fields).toContainEqual(path(id.metadata.readable));
    expect(fields).toContainEqual(path(link1.metadata.readable));
    expect(fields).toContainEqual(path(link2.metadata.readable));
    expect(fields).toContainEqual(path(name.metadata.readable));
  });
});

describe('nary type converter mapping', () => {
  const mappings = DOOV.mappings(
    DOOV.mapAll(name, id, link1)
      .using(
        (obj, inputs, ctx) =>
          (inputs[2].get(obj, ctx) as string) + ':' + inputs[1].get(obj, ctx) + ':' + inputs[0].get(obj, ctx)
      )
      .to(link2),
    DOOV.mapAll(name, id, link1)
      .using(plusOneFirst)
      .using(plusOne)
      .to(id)
  );

  it('execute mapping', () => {
    model = mappings.execute(model);
    expect(name.get(model)).toEqual('test');
    expect(id.get(model)).toEqual(3);
    expect(link2.get(model)).toEqual('undefined:1:test');
    expect(link1.get(model)).toEqual(undefined);
  });

  it('metadata fields', () => {
    for (let child of mappings.metadata.children()) {
      console.log(child.readable);
    }
    const fields = fieldsOf(mappings.metadata);
    expect(fields).toContainEqual(path(id.metadata.readable));
    expect(fields).toContainEqual(path(link1.metadata.readable));
    expect(fields).toContainEqual(path(link2.metadata.readable));
    expect(fields).toContainEqual(path(name.metadata.readable));
  });
});

describe('static value mapping', () => {
  const mappings = DOOV.mappings(
    DOOV.mapNull(link1),
    DOOV.map('google.com').to(link2),
    DOOV.map(3, 4)
      .using(plusOneSecond)
      .to(id),
    DOOV.map(id, 3)
      .using(plusOneSecond)
      .to(id),
    DOOV.map('amazon.com', link2)
      .using(biConverter((obj, input, input2, ctx) => input2.get(obj, ctx) + '?q=' + input.get(obj, ctx)))
      .to(link1)
  );

  it('execute mapping', () => {
    model = mappings.execute(model);
    expect(name.get(model)).toEqual('test');
    expect(id.get(model)).toEqual(4);
    expect(link2.get(model)).toEqual('google.com');
    expect(link1.get(model)).toEqual('google.com?q=amazon.com');
  });

  it('metadata fields', () => {
    for (let child of mappings.metadata.children()) {
      console.log(child.readable);
    }
    const fields = fieldsOf(mappings.metadata);
    expect(fields).toContainEqual(path(id.metadata.readable));
    expect(fields).toContainEqual(path(link2.metadata.readable));
  });
});

describe('mapping null in and out', () => {
  const mappings = DOOV.mappings(DOOV.mapNull(link1, link2), DOOV.map('2').to(Function.lift(StringFunction, '3')));

  it('execute mapping', () => {
    let emptyObject = Object.freeze({});
    const newObject = mappings.executeOn(model, emptyObject);
    expect(name.get(newObject)).toBeUndefined();
    expect(id.get(newObject)).toBeUndefined();
    expect(link2.get(newObject)).toBeNull();
    expect(link1.get(newObject)).toBeNull();
  });

  it('metadata fields', () => {
    for (let child of mappings.metadata.children()) {
      console.log(child.readable);
    }
    const fields = fieldsOf(mappings.metadata);
    expect(fields).toContainEqual(path(link1.metadata.readable));
    expect(fields).toContainEqual(path(link2.metadata.readable));
  });
});

describe('mapping conditional in and out', () => {
  const mappings = DOOV.mappings(
    DOOV.when(link1.isNotNull()).then(DOOV.mapNull(link1)),
    DOOV.when(link2.noneMatch('google.com', 'amazon.com').not())
      .then(DOOV.map(1).to(id))
      .otherwise(DOOV.map(0).to(id)),
    DOOV.when(link1.length().greaterThan(4)).then()
  );

  it('execute mapping', () => {
    let emptyObject = Object.freeze({});
    const newObject = mappings.executeOn(model, emptyObject);
    expect(name.get(newObject)).toBeUndefined();
    expect(id.get(newObject)).toEqual(0);
    expect(link2.get(newObject)).toBeUndefined();
    expect(link1.get(newObject)).toBeNull();
  });

  it('metadata fields', () => {
    for (let child of mappings.metadata.children()) {
      console.log(child.readable);
    }
    const fields = fieldsOf(mappings.metadata);
    expect(fields).toContainEqual(path(id.metadata.readable));
    expect(fields).toContainEqual(path(link2.metadata.readable));
  });
});
