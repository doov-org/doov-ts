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
      <GetHtml metadata={left} parents={props.parents} />
      <br />
      <span className={HtmlClass.CSS_OPERATOR}>{op.readable}</span>&nbsp;
      <GetHtml metadata={right} parents={props.parents} />
    </>
  );
};

const BinarySpace = (props: HtmlProps) => {
  const right = (props.metadata as BinaryMetadata).right;
  const left = (props.metadata as BinaryMetadata).left;
  const op = props.metadata.operator as Operator;
  return (
    <>
      <GetHtml metadata={left} parents={props.parents} />
      &nbsp;<span className={HtmlClass.CSS_OPERATOR}>{op.readable}</span>&nbsp;
      <GetHtml metadata={right} parents={props.parents} />
    </>
  );
};

const Binary = (props: HtmlProps) => {
  const { metadata, parents } = props;
  const op = metadata.operator as Operator;
  const pmd = parents.length > 1 ? parents[parents.length - 2] : null;
  const pmdOp = pmd ? pmd.operator : null;
  const pmdType = pmd ? pmd.type : null;
  const isLeftChild = pmd ? pmd.children!()[0] === metadata : false;
  //const parentsClone = [...(props.parents as Metadata[])];
  const andOr = [AND, OR];
  let res;
  if ((pmdOp === AND || pmdOp === OR) && andOr.includes(op)) {
    res = (
      <li className={HtmlClass.CSS_LI_BINARY}>
        <BinaryBr metadata={metadata} parents={parents} />
      </li>
    );
  } else if ((pmdOp === AND && op === AND) || (pmdOp === OR && op === OR)) {
    res = <BinaryBr metadata={metadata} parents={parents} />;
  } else if (pmdOp === AND && op === OR && isLeftChild) {
    res = <BinaryBr metadata={metadata} parents={parents} />;
  } else if (pmdOp === OR && op === AND && isLeftChild) {
    res = <BinarySpace metadata={metadata} parents={parents} />;
  } else if (pmdType === 'BINARY' && andOr.includes(op)) {
    res = (
      <ul className={HtmlClass.CSS_UL_BINARY}>
        <li className={HtmlClass.CSS_LI_BINARY}>
          <BinaryBr metadata={metadata} parents={parents} />
        </li>
      </ul>
    );
  } else if (pmdType === 'BINARY' && !andOr.includes(op)) {
    res = <BinaryBr metadata={metadata} parents={parents} />;
  } else if (pmdType === 'NARY' && andOr.includes(op)) {
    res = (
      <li className={HtmlClass.CSS_LI_BINARY}>
        <BinaryBr metadata={metadata} parents={parents} />
      </li>
    );
  } else if (pmdType === 'NARY' && !andOr.includes(op)) {
    res = (
      <li className={HtmlClass.CSS_LI_BINARY}>
        <BinarySpace metadata={metadata} parents={parents} />
      </li>
    );
  } else if (pmdType === 'UNARY') {
    res = (
      <ul className={HtmlClass.CSS_UL_UNARY}>
        <BinarySpace metadata={metadata} parents={parents} />
      </ul>
    );
  } else if (andOr.includes(op)) {
    return (
      <li className={HtmlClass.CSS_LI_BINARY}>
        <BinaryBr metadata={metadata} parents={parents} />
      </li>
    );
  } else {
    res = <BinarySpace metadata={metadata} parents={parents} />;
  }
  return res;
};

const Leaf = (props: HtmlProps) => {
  return <span className={HtmlClass.CSS_VALUE}>{props.metadata.readable}</span>;
};

export const GetHtml = (props: HtmlProps) => {
  let res;
  let { metadata, parents } = props;
  let parentsCopy = [...parents, metadata];
  const readable = metadata.readable;
  console.log(readable);
  switch (metadata.type) {
    case 'UNARY':
      res = <br />;
      break;
    case 'BINARY':
      console.log('binary');
      res = <Binary metadata={metadata} parents={parentsCopy} />;
      break;
    case 'NARY':
      res = <br />;
      break;
    case 'WHEN':
      res = <br />;
      break;
    case 'VALIDATION':
      res = <br />;
      break;
    case 'VALUE':
      console.log('value');
      res = <Leaf metadata={metadata} parents={parentsCopy} />;
      break;
    case 'FIELD':
      res = <br />;
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
      res = <br />;
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
  //parents.pop();
  return res;
};
