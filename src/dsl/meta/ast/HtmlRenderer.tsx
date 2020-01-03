import * as React from 'react';
import { Metadata } from '../Metadata';
import { HtmlClass } from './HtmlClass';
import { BinaryMetadata } from '../BinaryMetadata';
import { AND, ELSE, NOT, OR, SINGLE_MAPPING, THEN, TO, USING, VALIDATE, WHEN } from '../../lang/DefaultOperators';
import { Operator, OperatorReturnType } from '../../Operator';
import { ValueMetadata } from '../ValueMetadata';
import { Lang, opStrings } from './language/Localization';

export interface HtmlProps {
  metadata: Metadata;
  parent?: Metadata;
  lang?: Lang;
}

const andOr = [AND, OR];

const getStringFromLocale = function(key: string) {
  const stringValue = opStrings.getString(key, undefined, true);
  if (stringValue) return stringValue;
  else return key;
};

const When = (props: HtmlProps) => {
  const { metadata, parent } = props;
  const pmdType = parent ? parent!.type : undefined;
  if (pmdType === 'MULTIPLE_MAPPING' || pmdType === 'CONDITIONAL_MAPPING') {
    return (
      <>
        <span className={HtmlClass.CSS_WHEN}>{getStringFromLocale(metadata.operator!.readable)}</span>
        <ul className={HtmlClass.CSS_UL_WHEN}>
          <GetHtml metadata={metadata.children!()[0]} parent={metadata} />
        </ul>
      </>
    );
  } else {
    return (
      <>
        <span className={HtmlClass.CSS_WHEN}>{getStringFromLocale(metadata.operator!.readable)}</span>
        <ul className={HtmlClass.CSS_UL_WHEN}>
          <GetHtml metadata={metadata.children!()[0]} parent={metadata} />
        </ul>
        <span className={HtmlClass.CSS_VALIDATE}>{getStringFromLocale(VALIDATE.readable)}</span>
      </>
    );
  }
};

const PrefixUnary = (props: HtmlProps) => {
  const { metadata } = props;
  return (
    <>
      <span className={HtmlClass.CSS_OPERATOR}>{getStringFromLocale(metadata.operator!.readable)}</span>
      &nbsp;
      <GetHtml metadata={metadata.children!()[0]} parent={metadata} />
    </>
  );
};

const PostfixUnary = (props: HtmlProps) => {
  const { metadata } = props;
  return (
    <>
      <GetHtml metadata={metadata.children!()[0]} parent={metadata} />
      &nbsp;
      <span className={HtmlClass.CSS_OPERATOR}>{getStringFromLocale(metadata.operator!.readable)}</span>
    </>
  );
};

const Unary = (props: HtmlProps) => {
  const { metadata, parent } = props;
  const op = metadata.operator as OperatorReturnType;
  const pmdOp = parent ? (parent.operator as OperatorReturnType) : undefined;
  const pmdType = parent ? parent.type : undefined;
  if ((pmdOp === AND || pmdOp === OR) && op === NOT) {
    return <PrefixUnary metadata={metadata} parent={parent} />;
  }
  if (pmdOp !== AND && pmdOp !== OR && op === NOT) {
    return (
      <li className={HtmlClass.CSS_LI_UNARY}>
        <PrefixUnary metadata={metadata} />
      </li>
    );
  }
  if (pmdType === 'NARY') {
    return (
      <li className={HtmlClass.CSS_LI_LEAF}>
        <PostfixUnary metadata={metadata} parent={parent} />
      </li>
    );
  } else {
    return <PostfixUnary metadata={metadata} parent={parent} />;
  }
};

const BinaryBr = (props: HtmlProps) => {
  const right = (props.metadata as BinaryMetadata).right;
  const left = (props.metadata as BinaryMetadata).left;
  const op = props.metadata.operator as Operator;
  return (
    <>
      <GetHtml metadata={left} parent={props.metadata} />
      <br />
      <span className={HtmlClass.CSS_OPERATOR}>{getStringFromLocale(op.readable)}</span>&nbsp;
      <GetHtml metadata={right} parent={props.metadata} />
    </>
  );
};

const BinarySpace = (props: HtmlProps) => {
  const right = (props.metadata as BinaryMetadata).right;
  const left = (props.metadata as BinaryMetadata).left;
  const op = props.metadata.operator as Operator;
  return (
    <>
      <GetHtml metadata={left} parent={props.metadata} />
      &nbsp;<span className={HtmlClass.CSS_OPERATOR}>{getStringFromLocale(op.readable)}</span>&nbsp;
      <GetHtml metadata={right} parent={props.metadata} />
    </>
  );
};

const Binary = (props: HtmlProps) => {
  const { metadata, parent } = props;
  const op = metadata.operator as OperatorReturnType;
  const pmdOp = parent ? parent.operator : null;
  const pmdType = parent ? parent.type : null;
  const isLeftChild = parent ? parent.children!()[0] === metadata : false;
  //const parentClone = [...(props.parent as Metadata[])];
  if (pmdOp === USING) {
    return <BinarySpace metadata={metadata} parent={parent} />;
  }
  if (pmdOp && (pmdOp !== AND && pmdOp !== OR) && andOr.includes(op)) {
    return (
      <li className={HtmlClass.CSS_LI_BINARY}>
        <BinaryBr metadata={metadata} parent={parent} />
      </li>
    );
  }
  if ((pmdOp === AND && op === AND) || (pmdOp === OR && op === OR)) {
    return <BinaryBr metadata={metadata} parent={parent} />;
  }
  if (pmdOp === AND && op === OR && isLeftChild) {
    return <BinaryBr metadata={metadata} parent={parent} />;
  }
  if (pmdOp === OR && op === AND && isLeftChild) {
    return <BinarySpace metadata={metadata} parent={parent} />;
  }
  if (pmdType === 'BINARY' && andOr.includes(op)) {
    return (
      <ul className={HtmlClass.CSS_UL_BINARY}>
        <li className={HtmlClass.CSS_LI_BINARY}>
          <BinaryBr metadata={metadata} parent={parent} />
        </li>
      </ul>
    );
  }
  if (pmdType === 'BINARY' && !andOr.includes(op)) {
    return <BinarySpace metadata={metadata} parent={parent} />;
  }
  if (pmdType === 'NARY' && andOr.includes(op)) {
    return (
      <li className={HtmlClass.CSS_LI_BINARY}>
        <BinaryBr metadata={metadata} parent={parent} />
      </li>
    );
  }
  if (pmdType === 'NARY' && !andOr.includes(op)) {
    return (
      <li className={HtmlClass.CSS_LI_BINARY}>
        <BinarySpace metadata={metadata} parent={parent} />
      </li>
    );
  }
  if (pmdType === 'UNARY') {
    return (
      <ul className={HtmlClass.CSS_UL_UNARY}>
        <BinarySpace metadata={metadata} parent={parent} />
      </ul>
    );
  }
  if (andOr.includes(op)) {
    return (
      <li className={HtmlClass.CSS_LI_BINARY}>
        <BinaryBr metadata={metadata} parent={parent} />
      </li>
    );
  }
  return <BinarySpace metadata={metadata} parent={parent} />;
};

const Leaf = (props: HtmlProps) => {
  const { metadata, parent } = props;
  const mdType = metadata.type;
  const pmdType = parent ? parent!.type : undefined;
  let res;
  switch (mdType) {
    case 'VALUE':
      const value = (metadata as ValueMetadata).value;
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
      } else {
        res = <span className={HtmlClass.CSS_VALUE}>{getStringFromLocale(metadata.readable)}</span>;
      }
      break;
    case 'FIELD':
      res = <span className={HtmlClass.CSS_FIELD}>{metadata.readable}</span>;
      break;
    case 'FUNCTION':
      if (metadata.operator)
        res = <span className={HtmlClass.CSS_OPERATOR}>{getStringFromLocale(metadata.operator.readable)}</span>;
      else res = <span className={HtmlClass.CSS_OPERATOR}>{metadata.readable}</span>;
      break;
    default:
      res = <></>;
  }
  if (pmdType === 'NARY') {
    return <li className={HtmlClass.CSS_LI_LEAF}>{res}</li>;
  } else {
    return res;
  }
};

const ConditionalMapping = (props: HtmlProps) => {
  const { metadata } = props;
  const whenMeta = metadata.children!()[0];
  const thenMeta = metadata.children!()[1];
  const elseMeta = metadata.children!()[2] ? metadata.children!()[2] : undefined;
  return (
    <>
      <div className={HtmlClass.CSS_SINGLE_MAPPING}>
        <GetHtml metadata={whenMeta} parent={metadata} />
        <span className={HtmlClass.CSS_THEN}>{getStringFromLocale(THEN.readable)}</span>
        <GetHtml metadata={thenMeta} parent={metadata} />
        {elseMeta && (
          <>
            <span className={HtmlClass.CSS_ELSE}>{getStringFromLocale(ELSE.readable)}</span>
            <GetHtml metadata={elseMeta} parent={metadata} />
          </>
        )}
      </div>
    </>
  );
};

const Nary = (props: HtmlProps) => {
  const { metadata, parent } = props;
  const pmdRT = parent ? (parent.operator ? (parent.operator as OperatorReturnType).returnType : undefined) : undefined;
  const childComponents = metadata.children!().map((e, index) => (
    <GetHtml key={index} metadata={e} parent={metadata} />
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
    if (metadata.children!().filter(e => e.operator === WHEN).length == 1) {
      return <div className={HtmlClass.CSS_SINGLE_MAPPING}>{childComponents}</div>;
    } else {
      return <ul className={HtmlClass.CSS_OL_MAPPING_NARY}>{childComponents}</ul>; // cohérence nom de la classe
    }
  } else {
    return (
      <li className={HtmlClass.CSS_LI_NARY}>
        <span className={HtmlClass.CSS_NARY}>{getStringFromLocale(metadata.operator!.readable)}</span>
        <ol className={HtmlClass.CSS_OL_NARY}>{childComponents}</ol>
      </li>
    );
  }
};

const Iterable = (props: HtmlProps) => {
  const metadata = props.metadata;
  const childComponents = metadata.children!().map((e, index) => (
    <li key={index}>
      <GetHtml metadata={e} parent={metadata} />
    </li>
  ));
  return <ul className={HtmlClass.CSS_UL_ITERABLE}>{childComponents}</ul>;
};

const SingleMapping = (props: HtmlProps) => {
  const { metadata, parent } = props;
  const pmdType = parent ? parent.type : undefined;
  const pmdOp = parent ? parent.operator : undefined;
  let res;
  res = (
    <>
      <span className={HtmlClass.CSS_SINGLE_MAPPING}>
        <span className={HtmlClass.CSS_OPERATOR}>{getStringFromLocale(SINGLE_MAPPING.readable)}</span>
        &nbsp;
        <GetHtml metadata={metadata.children!()[0]} parent={metadata} />
        &nbsp;
        <span className={HtmlClass.CSS_OPERATOR}>{getStringFromLocale(TO.readable)}</span>
        &nbsp;
        <GetHtml metadata={metadata.children!()[1]} parent={metadata} />
      </span>
      &nbsp;
    </>
  );
  if (pmdType === 'MULTIPLE_MAPPING' && (pmdOp !== THEN && pmdOp !== ELSE))
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

const Validation = (props: HtmlProps) => {
  const { metadata } = props;
  return (
    <div className={HtmlClass.CSS_VALIDATION_RULE}>
      <GetHtml metadata={metadata.children!()[0]} />
    </div>
  );
};

const MultipleValidations = (props: HtmlProps) => {
  const { metadata } = props;
  const childComponents = metadata.children!().map((e, index) => (
    <li key={index}>
      <GetHtml metadata={e} parent={metadata} />
    </li>
  ));
  return <ol className={HtmlClass.CSS_MULTIPLE_VALIDATIONS}>{childComponents}</ol>;
};

export const GetHtml = (props: HtmlProps) => {
  const { metadata, parent, lang } = props;
  if (lang) opStrings.setLanguage(lang);
  switch (metadata.type) {
    case 'UNARY':
      return <Unary metadata={metadata} parent={parent} />;
    case 'BINARY':
      return <Binary metadata={metadata} parent={parent} />;
    case 'NARY':
    case 'MULTIPLE_MAPPING':
      return <Nary metadata={metadata} parent={parent} />;
    case 'CONDITIONAL_MAPPING':
      return <ConditionalMapping metadata={metadata} parent={parent} />;
    case 'WHEN':
      return <When metadata={metadata} parent={parent} />;
    case 'VALUE':
    case 'FIELD':
    case 'FUNCTION':
      return <Leaf metadata={metadata} parent={parent} />;
    case 'ITERABLE':
      return <Iterable metadata={metadata} />;
    case 'SINGLE_MAPPING':
      return <SingleMapping metadata={metadata} parent={parent} />;
    case 'TYPE_CONVERTER':
      return <TypeConverter metadata={metadata} />;
    case 'VALIDATION':
      return <Validation metadata={metadata} />;
    case 'MULTIPLE_VALIDATIONS':
      return <MultipleValidations metadata={metadata} parent={parent} />;
  }
};
