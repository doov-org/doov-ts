import * as React from 'react';
import { Metadata } from '../Metadata';
import { HtmlClass } from './HtmlSelector';
import { BinaryMetadata } from '../BinaryMetadata';
import { AND, OR } from '../../lang/DefaultOperators';
import { Operator } from '../../Operator';

export interface HtmlProps {
  metadata: Metadata;
  parent?: Metadata;
}

const BinaryBr = (props: HtmlProps) => {
  const right = (props.metadata as BinaryMetadata).right;
  const left = (props.metadata as BinaryMetadata).left;
  const op = props.metadata.operator as Operator;
  return (
    <>
      <GetHtml metadata={left} parent={props.metadata} />
      <br />
      <span className={HtmlClass.CSS_OPERATOR}>{op.readable}</span>&nbsp;
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
      &nbsp;<span className={HtmlClass.CSS_OPERATOR}>{op.readable}</span>&nbsp;
      <GetHtml metadata={right} parent={props.metadata} />
    </>
  );
};

const Binary = (props: HtmlProps) => {
  const { metadata, parent } = props;
  const op = metadata.operator as Operator;
  const pmdOp = parent ? parent.operator : null;
  const pmdType = parent ? parent.type : null;
  const isLeftChild = parent ? parent.children!()[0] === metadata : false;
  //const parentClone = [...(props.parent as Metadata[])];
  const andOr = [AND, OR];
  if (pmdOp && (pmdOp !== AND && pmdOp !== OR) && andOr.includes(op)) {
    return (
      <li className={HtmlClass.CSS_LI_BINARY}>
        <BinaryBr metadata={metadata} parent={parent} />
      </li>
    );
  } else if ((pmdOp === AND && op === AND) || (pmdOp === OR && op === OR)) {
    return <BinaryBr metadata={metadata} parent={parent} />;
  } else if (pmdOp === AND && op === OR && isLeftChild) {
    return <BinaryBr metadata={metadata} parent={parent} />;
  } else if (pmdOp === OR && op === AND && isLeftChild) {
    return <BinarySpace metadata={metadata} parent={parent} />;
  } else if (pmdType === 'BINARY' && andOr.includes(op)) {
    return (
      <ul className={HtmlClass.CSS_UL_BINARY}>
        <li className={HtmlClass.CSS_LI_BINARY}>
          <BinaryBr metadata={metadata} parent={parent} />
        </li>
      </ul>
    );
  } else if (pmdType === 'BINARY' && !andOr.includes(op)) {
    return <BinarySpace metadata={metadata} parent={parent} />;
  } else if (pmdType === 'NARY' && andOr.includes(op)) {
    return (
      <li className={HtmlClass.CSS_LI_BINARY}>
        <BinaryBr metadata={metadata} parent={parent} />
      </li>
    );
  } else if (pmdType === 'NARY' && !andOr.includes(op)) {
    return (
      <li className={HtmlClass.CSS_LI_BINARY}>
        <BinarySpace metadata={metadata} parent={parent} />
      </li>
    );
  } else if (pmdType === 'UNARY') {
    return (
      <ul className={HtmlClass.CSS_UL_UNARY}>
        <BinarySpace metadata={metadata} parent={parent} />
      </ul>
    );
  } else if (andOr.includes(op)) {
    return (
      <li className={HtmlClass.CSS_LI_BINARY}>
        <BinaryBr metadata={metadata} parent={parent} />
      </li>
    );
  } else {
    return <BinarySpace metadata={metadata} parent={parent} />;
  }
};

const Leaf = (props: HtmlProps) => {
  let mdtype = props.metadata.type;
  switch (mdtype) {
    case 'VALUE':
      return <span className={HtmlClass.CSS_VALUE}>{props.metadata.readable}</span>;
    case 'FIELD':
      return <span className={HtmlClass.CSS_FIELD}>{props.metadata.readable}</span>;
    default:
      return <span>TO WORK ON</span>;
  }
};

const Function = (props: { metadata: Metadata }) => {
  let { metadata } = props; // is it css_value or css_operator ?
  if (metadata.operator) return <span className={HtmlClass.CSS_OPERATOR}>{props.metadata.operator!.readable}</span>;
  else return <span className={HtmlClass.CSS_OPERATOR}>{props.metadata.readable}</span>;
};

const Nary = (props: HtmlProps) => {
  const { metadata } = props;
  const childComponents = metadata.children!().map((e, index) => (
    <GetHtml key={index} metadata={e} parent={metadata} />
  ));
  return (
    <>
      <span className={HtmlClass.CSS_NARY}>{metadata.operator!.readable}</span>
      <ol className={HtmlClass.CSS_OL_NARY}>{childComponents}</ol>
    </>
  );
};

export const GetHtml = (props: HtmlProps) => {
  let res;
  let { metadata, parent } = props;
  switch (metadata.type) {
    case 'UNARY':
      res = <br />;
      break;
    case 'BINARY':
      return <Binary metadata={metadata} parent={parent} />;
      break;
    case 'NARY':
      return <Nary metadata={metadata} parent={parent} />;
      break;
    case 'WHEN':
      res = <br />;
      break;
    case 'VALIDATION':
      res = <br />;
      break;
    case 'VALUE':
    case 'FIELD':
      return <Leaf metadata={metadata} parent={parent} />;
      break;
    case 'ITERABLE_VALUE':
      res = <br />;
      break;
    case 'ITERABLE':
      res = <br />;
      break;
    case 'SINGLE_MAPPING':
      res = <br />;
      break;
    case 'MULTIPLE_MAPPING':
      res = <br />;
      break;
    case 'CONDITIONAL_MAPPING':
      res = <br />;
      break;
    case 'FUNCTION':
      return <Function metadata={metadata} />;
      break;
    case 'TYPE_CONVERTER':
      res = <br />;
      break;
    case 'MULTIPLE_VALIDATIONS':
      res = <br />;
      break;
    default:
      res = <br />;
  }
  //parent.pop();
  return res;
};
