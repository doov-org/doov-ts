import * as React from 'react';
import { Metadata } from '../Metadata';
import { HtmlClass } from './HtmlClass';
import { BinaryMetadata } from '../BinaryMetadata';
import {
  AND,
  ELSE,
  NOT,
  OR,
  SINGLE_MAPPING,
  THEN,
  TO,
  USING,
  VALIDATE,
  WHEN,
  FIELD_PROP,
  YEAR_OF,
  NB_OF_MONTHS_SINCE,
  MONTH_OF,
  DATE_OF,
  POSITION,
} from '../../lang/DefaultOperators';
import { Operator, OperatorReturnType } from '../../Operator';
import { ValueMetadata } from '../ValueMetadata';
import { Lang, opStrings } from './language/Localization';
import { ValidationRule } from '../../lang/ValidationRule';
import { FunctionMetadata } from '../../../doov';
export { Lang };

export interface HtmlProps {
  metadata: Metadata;
  parent?: Metadata;
  lang?: Lang;
  fields?: any;
}

interface HtmlPropsExtended extends HtmlProps {
  validations?: ValidationRule[];
  validation?: ValidationRule;
}

const andOr = [AND, OR];

const getStringFromLocale = function(key: string) {
  const stringValue = opStrings.getString(key, undefined, true);
  if (stringValue) return stringValue;
  else return key;
};

//const FieldsReadableContext = React.createContext({fieldsReadable: {} as any});

const When = (props: HtmlProps) => {
  const { metadata, parent, fields } = props;
  const pmdType = parent ? parent!.type : undefined;
  if (pmdType === 'MULTIPLE_MAPPING' || pmdType === 'CONDITIONAL_MAPPING') {
    return (
      <>
        <span className={HtmlClass.CSS_WHEN}>{getStringFromLocale(metadata.operator!.readable)}</span>
        <ul className={HtmlClass.CSS_UL_WHEN}>
          <GetHtml metadata={metadata.children!()[0]} parent={metadata} fields={fields} />
        </ul>
      </>
    );
  } else {
    return (
      <>
        <span className={HtmlClass.CSS_WHEN}>{getStringFromLocale(metadata.operator!.readable)}</span>
        <ul className={HtmlClass.CSS_UL_WHEN}>
          <GetHtml metadata={metadata.children!()[0]} parent={metadata} fields={fields} />
        </ul>
        <span className={HtmlClass.CSS_VALIDATE}>{getStringFromLocale(VALIDATE.readable)}</span>
      </>
    );
  }
};

const PrefixUnary = (props: HtmlProps) => {
  const { metadata, fields } = props;
  return (
    <>
      <span className={HtmlClass.CSS_OPERATOR}>{getStringFromLocale(metadata.operator!.readable)}</span>
      &nbsp;
      <GetHtml metadata={metadata.children!()[0]} parent={metadata} fields={fields} />
    </>
  );
};

const PostfixUnary = (props: HtmlProps) => {
  const { metadata, fields } = props;
  return (
    <>
      <GetHtml metadata={metadata.children!()[0]} parent={metadata} fields={fields} />
      &nbsp;
      <span className={HtmlClass.CSS_OPERATOR}>{getStringFromLocale(metadata.operator!.readable)}</span>
    </>
  );
};

const Unary = (props: HtmlProps) => {
  const prefixOp = [DATE_OF, MONTH_OF, YEAR_OF, NB_OF_MONTHS_SINCE, POSITION];
  const { metadata, parent, fields } = props;
  const op = metadata.operator as OperatorReturnType;
  const pmdOp = parent ? (parent.operator as OperatorReturnType) : undefined;
  const pmdType = parent ? parent.type : undefined;
  if ((pmdOp === AND || pmdOp === OR) && op === NOT) {
    return <PrefixUnary metadata={metadata} parent={parent} fields={fields} />;
  }
  if (pmdOp !== AND && pmdOp !== OR && op === NOT) {
    return (
      <li className={HtmlClass.CSS_LI_UNARY}>
        <PrefixUnary metadata={metadata} fields={fields} />
      </li>
    );
  }
  if (pmdType === 'NARY') {
    if (prefixOp.includes(op)) {
      return (
        <li className={HtmlClass.CSS_LI_LEAF}>
          <PrefixUnary metadata={metadata} parent={parent} fields={fields} />
        </li>
      );
    }
    return (
      <li className={HtmlClass.CSS_LI_LEAF}>
        <PostfixUnary metadata={metadata} parent={parent} fields={fields} />
      </li>
    );
  } else {
    if (prefixOp.includes(op)) return <PrefixUnary metadata={metadata} parent={parent} fields={fields} />;
    return <PostfixUnary metadata={metadata} parent={parent} fields={fields} />;
  }
};

const BinaryBr = (props: HtmlProps) => {
  const right = (props.metadata as BinaryMetadata).right;
  const left = (props.metadata as BinaryMetadata).left;
  const op = props.metadata.operator as Operator;
  const fields = props.fields;
  return (
    <>
      <GetHtml metadata={left} parent={props.metadata} fields={fields} />
      <br />
      <span className={HtmlClass.CSS_OPERATOR}>{getStringFromLocale(op.readable)}</span>&nbsp;
      <GetHtml metadata={right} parent={props.metadata} fields={fields} />
    </>
  );
};

const BinarySpace = (props: HtmlProps) => {
  const right = (props.metadata as BinaryMetadata).right;
  const left = (props.metadata as BinaryMetadata).left;
  const op = props.metadata.operator as Operator;
  const fields = props.fields;
  return (
    <>
      <GetHtml metadata={left} parent={props.metadata} fields={fields} />
      &nbsp;<span className={HtmlClass.CSS_OPERATOR}>{getStringFromLocale(op.readable)}</span>&nbsp;
      <GetHtml metadata={right} parent={props.metadata} fields={fields} />
    </>
  );
};

const Binary = (props: HtmlProps) => {
  const { metadata, parent, fields } = props;
  const op = metadata.operator as OperatorReturnType;
  const pmdOp = parent ? parent.operator : null;
  const pmdType = parent ? parent.type : null;
  const isLeftChild = parent ? parent.children!()[0] === metadata : false;
  //const parentClone = [...(props.parent as Metadata[])];
  if (pmdOp === USING) {
    return <BinarySpace metadata={metadata} parent={parent} fields={fields} />;
  }
  if (pmdOp === NOT && andOr.includes(op)) {
    return (
      <ul className={HtmlClass.CSS_UL_BINARY}>
        <li className={HtmlClass.CSS_LI_BINARY}>
          <BinaryBr metadata={metadata} parent={parent} fields={fields} />
        </li>
      </ul>
    );
  }
  if (pmdOp && (pmdOp !== AND && pmdOp !== OR) && andOr.includes(op)) {
    return (
      <li className={HtmlClass.CSS_LI_BINARY}>
        <BinaryBr metadata={metadata} parent={parent} fields={fields} />
      </li>
    );
  }
  if ((pmdOp === AND && op === AND) || (pmdOp === OR && op === OR)) {
    return <BinaryBr metadata={metadata} parent={parent} fields={fields} />;
  }
  if (pmdOp === AND && op === OR && isLeftChild) {
    return <BinaryBr metadata={metadata} parent={parent} fields={fields} />;
  }
  if (pmdOp === OR && op === AND && isLeftChild) {
    return <BinarySpace metadata={metadata} parent={parent} fields={fields} />;
  }
  if (pmdType === 'BINARY' && andOr.includes(op)) {
    return (
      <ul className={HtmlClass.CSS_UL_BINARY}>
        <li className={HtmlClass.CSS_LI_BINARY}>
          <BinaryBr metadata={metadata} parent={parent} fields={fields} />
        </li>
      </ul>
    );
  }
  if (pmdType === 'BINARY' && !andOr.includes(op)) {
    return <BinarySpace metadata={metadata} parent={parent} fields={fields} />;
  }
  if (pmdType === 'NARY' && andOr.includes(op)) {
    return (
      <li className={HtmlClass.CSS_LI_BINARY}>
        <BinaryBr metadata={metadata} parent={parent} fields={fields} />
      </li>
    );
  }
  if (pmdType === 'NARY' && !andOr.includes(op)) {
    return (
      <li className={HtmlClass.CSS_LI_BINARY}>
        <BinarySpace metadata={metadata} parent={parent} fields={fields} />
      </li>
    );
  }
  if (pmdType === 'UNARY' && metadata.operator !== FIELD_PROP) {
    return (
      <ul className={HtmlClass.CSS_UL_UNARY}>
        <BinarySpace metadata={metadata} parent={parent} fields={fields} />
      </ul>
    );
  }
  if (andOr.includes(op)) {
    return (
      <li className={HtmlClass.CSS_LI_BINARY}>
        <BinaryBr metadata={metadata} parent={parent} fields={fields} />
      </li>
    );
  }
  return <BinarySpace metadata={metadata} parent={parent} fields={fields} />;
};

const Value = (props: HtmlProps) => {
  const { metadata, parent } = props;
  const pmdType = parent ? parent!.type : undefined;
  const value = (metadata as ValueMetadata).value;
  let res;
  if (value instanceof Array) {
    res = (
      <ul className={HtmlClass.CSS_UL_ITERABLE}>
        {value.map((e, index) => (
          <li key={index}>
            <span className={HtmlClass.CSS_VALUE}>{getStringFromLocale(JSON.stringify(e))}</span>
          </li>
        ))}
      </ul>
    );
  } else if (value && (value as object).hasOwnProperty('id')) {
    res = <span className={HtmlClass.CSS_VALUE}>{getStringFromLocale(JSON.parse(metadata.readable).id)}</span>;
  } else res = <span className={HtmlClass.CSS_VALUE}>{getStringFromLocale(metadata.readable)}</span>;
  if (pmdType === 'NARY') {
    return <li className={HtmlClass.CSS_LI_LEAF}>{res}</li>;
  } else {
    return res;
  }
};

const Field = (props: HtmlProps) => {
  const { metadata, parent, fields } = props;
  const pmdType = parent ? parent!.type : undefined;
  let res;
  if (fields) {
    res = <span className={HtmlClass.CSS_FIELD}>{fields[metadata.readable]}</span>;
  } else res = <span className={HtmlClass.CSS_FIELD}>{metadata.readable}</span>;
  if (pmdType === 'NARY') {
    return <li className={HtmlClass.CSS_LI_LEAF}>{res}</li>;
  } else {
    return res;
  }
};

const Function = (props: HtmlProps) => {
  const { metadata, parent } = props;
  const pmdType = parent ? parent!.type : undefined;
  const functionMeta = metadata as FunctionMetadata;
  let res;
  if (functionMeta.operator) {
    res = <span className={HtmlClass.CSS_OPERATOR}>{getStringFromLocale(functionMeta.operator.readable)}</span>;
  } //function with operator
  else res = <span className={HtmlClass.CSS_OPERATOR}>{getStringFromLocale(metadata.readable)}</span>;
  if (pmdType === 'NARY') {
    return <li className={HtmlClass.CSS_LI_LEAF}>{res}</li>;
  } else {
    return res;
  }
};

const ConditionalMapping = (props: HtmlProps) => {
  const { metadata, parent, fields } = props;
  const pmdType = parent ? parent.type : undefined;
  const pmdOp = parent ? parent.operator : undefined;
  const whenMeta = metadata.children!()[0];
  const thenMeta = metadata.children!()[1];
  const elseMeta = metadata.children!()[2] ? metadata.children!()[2] : undefined;
  if (pmdType === 'MULTIPLE_MAPPING' && pmdOp !== THEN && pmdOp !== ELSE) {
    return (
      <li className={HtmlClass.CSS_LI_NARY}>
        <GetHtml metadata={whenMeta} parent={metadata} fields={fields} />
        <GetHtml metadata={thenMeta} parent={metadata} fields={fields} />
        {elseMeta && <GetHtml metadata={elseMeta} parent={metadata} fields={fields} />}
      </li>
    );
  }
  return (
    <div className={HtmlClass.CSS_SINGLE_MAPPING}>
      <GetHtml metadata={whenMeta} parent={metadata} fields={fields} />
      <GetHtml metadata={thenMeta} parent={metadata} fields={fields} />
      {elseMeta && <GetHtml metadata={elseMeta} parent={metadata} fields={fields} />}
    </div>
  );
};

const Nary = (props: HtmlProps) => {
  const { metadata, parent, fields } = props;
  const pmdRT = parent ? (parent.operator ? (parent.operator as OperatorReturnType).returnType : undefined) : undefined;
  const pmdType = parent ? parent.type : undefined;
  const childComponents = metadata.children!().map((e, index) => (
    <GetHtml key={index} metadata={e} parent={metadata} fields={fields} />
  ));
  if (pmdRT === 'BOOL') {
    return (
      <>
        <span className={HtmlClass.CSS_NARY}>{getStringFromLocale(metadata.operator!.readable)}</span>
        <ol className={HtmlClass.CSS_OL_NARY}>{childComponents}</ol>
      </>
    );
  }
  if (metadata.type === 'MULTIPLE_MAPPING') {
    if (metadata.operator === THEN) {
      return (
        <>
          <span className={HtmlClass.CSS_THEN}>{getStringFromLocale(THEN.readable)}</span>
          <ul className={HtmlClass.CSS_OL_NARY}>{childComponents}</ul>
        </>
      );
    }
    if (metadata.operator === ELSE) {
      return (
        <>
          <span className={HtmlClass.CSS_ELSE}>{getStringFromLocale(ELSE.readable)}</span>
          <ul className={HtmlClass.CSS_OL_NARY}>{childComponents}</ul>
        </>
      );
    }
    if (metadata.children!().filter(e => e.operator === WHEN).length == 1) {
      return <div className={HtmlClass.CSS_SINGLE_MAPPING}>{childComponents}</div>;
    } else {
      return <ul className={HtmlClass.CSS_OL_MAPPING_NARY}>{childComponents}</ul>; // cohérence nom de la classe
    }
  } else if (pmdType === 'WHEN') {
    return (
      <li className={HtmlClass.CSS_LI_NARY}>
        <span className={HtmlClass.CSS_NARY}>{getStringFromLocale(metadata.operator!.readable)}</span>
        <ol className={HtmlClass.CSS_OL_NARY}>{childComponents}</ol>
      </li>
    );
  }
  return (
    <ul>
      <li className={HtmlClass.CSS_LI_NARY}>
        <span className={HtmlClass.CSS_NARY}>{getStringFromLocale(metadata.operator!.readable)}</span>
        <ol className={HtmlClass.CSS_OL_NARY}>{childComponents}</ol>
      </li>
    </ul>
  );
  /*  return (
    <li className={HtmlClass.CSS_LI_NARY}>
      <span className={HtmlClass.CSS_NARY}>{getStringFromLocale(metadata.operator!.readable)}</span>
      <ol className={HtmlClass.CSS_OL_NARY}>{childComponents}</ol>
    </li>);*/
};

const Iterable = (props: HtmlProps) => {
  const { metadata, fields } = props;
  const childComponents = metadata.children!().map((e, index) => (
    <li key={index}>
      <GetHtml metadata={e} parent={metadata} fields={fields} />
    </li>
  ));
  return <ul className={HtmlClass.CSS_UL_ITERABLE}>{childComponents}</ul>;
};

const SingleMapping = (props: HtmlProps) => {
  const { metadata, parent, fields } = props;
  const pmdType = parent ? parent.type : undefined;
  const pmdOp = parent ? parent.operator : undefined;
  let res;
  res = (
    <>
      <span className={HtmlClass.CSS_SINGLE_MAPPING}>
        <span className={HtmlClass.CSS_OPERATOR}>{getStringFromLocale(SINGLE_MAPPING.readable)}</span>
        &nbsp;
        <GetHtml metadata={metadata.children!()[0]} parent={metadata} fields={fields} />
        &nbsp;
        <span className={HtmlClass.CSS_OPERATOR}>{getStringFromLocale(TO.readable)}</span>
        &nbsp;
        <GetHtml metadata={metadata.children!()[1]} parent={metadata} fields={fields} />
      </span>
      &nbsp;
    </>
  );
  if (pmdType === 'MULTIPLE_MAPPING' && pmdOp !== THEN && pmdOp !== ELSE)
    return <li className={HtmlClass.CSS_LI_NARY}>{res}</li>;
  else return res;
};

const TypeConverter = (props: HtmlProps) => {
  const { metadata } = props;
  return (
    <>
      <span className={HtmlClass.CSS_TYPE_CONVERTER}>
        <span className={HtmlClass.CSS_VALUE}>&apos;{getStringFromLocale(metadata.readable)}&apos;</span>
      </span>
    </>
  );
};

const Validation = (props: HtmlPropsExtended) => {
  const { metadata, validation, fields } = props;
  let span_error_empty;
  if (validation && validation.hasOwnProperty('errorType')) {
    let validationAny = validation as any;
    if (validationAny.errorType === 'ERROR') {
      span_error_empty = (
        <span className={HtmlClass.CSS_OPERATOR}>{validationAny.messageFunction.metadata.readable}</span>
      );
    } else if (validationAny.errorType === 'EMPTY') {
      span_error_empty = <span className={HtmlClass.CSS_VALUE}>{validationAny.messageFunction.metadata.readable}</span>;
    }
    return (
      <div className={HtmlClass.CSS_VALIDATION_RULE}>
        <GetHtml metadata={metadata.children!()[0]} fields={fields} />
        &nbsp;
        {span_error_empty}
      </div>
    );
  }
  return (
    <div className={HtmlClass.CSS_VALIDATION_RULE}>
      <GetHtml metadata={metadata.children!()[0]} fields={fields} />
    </div>
  );
};

const MultipleValidations = (props: HtmlPropsExtended) => {
  const { metadata, validations, fields } = props;
  const childComponents = metadata.children!().map((e, index) => (
    <GetHtml
      key={index}
      metadata={e}
      parent={metadata}
      validation={validations ? validations![index] : undefined}
      fields={fields}
    />
  ));
  return <>{childComponents}</>;
};

export const GetHtml = (props: HtmlPropsExtended) => {
  const { metadata, parent, lang, validations, validation, fields } = props;
  if (lang) opStrings.setLanguage(lang);
  switch (metadata.type) {
    case 'UNARY':
      return <Unary metadata={metadata} parent={parent} fields={fields} />;
    case 'BINARY':
      return <Binary metadata={metadata} parent={parent} fields={fields} />;
    case 'NARY':
    case 'MULTIPLE_MAPPING':
      return <Nary metadata={metadata} parent={parent} fields={fields} />;
    case 'CONDITIONAL_MAPPING':
      return <ConditionalMapping metadata={metadata} parent={parent} fields={fields} />;
    case 'WHEN':
      return <When metadata={metadata} parent={parent} fields={fields} />;
    case 'VALUE':
      return <Value metadata={metadata} parent={parent} />;
    case 'FIELD':
      return <Field metadata={metadata} parent={parent} fields={fields} />;
    case 'FUNCTION':
      return <Function metadata={metadata} parent={parent} />;
    case 'ITERABLE':
      return <Iterable metadata={metadata} fields={fields} />;
    case 'SINGLE_MAPPING':
      return <SingleMapping metadata={metadata} parent={parent} fields={fields} />;
    case 'TYPE_CONVERTER':
      return <TypeConverter metadata={metadata} />;
    case 'VALIDATION':
      return <Validation metadata={metadata} validation={validation} fields={fields} />;
    case 'MULTIPLE_VALIDATIONS':
      return <MultipleValidations metadata={metadata} parent={parent} validations={validations} fields={fields} />;
  }
};
