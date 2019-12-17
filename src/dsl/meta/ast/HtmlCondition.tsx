import * as React from 'react';
import { Metadata } from '../Metadata';
import { HtmlClass } from './HtmlSelector';
import { BinaryMetadata } from '../BinaryMetadata';
import { TypeConverterMetadata } from '../TypeConverterMetadata';
import { AND, NOT, OR, USING, VALIDATE } from '../../lang/DefaultOperators';
import { Operator, OperatorReturnType } from '../../Operator';

export interface HtmlProps {
  metadata: Metadata;
  parent?: Metadata;
}

const andOr = [AND, OR];

const When = (props: HtmlProps) => {
  const { metadata, parent } = props;
  const pmdType = parent ? parent!.type : undefined;
  if (pmdType === 'MULTIPLE_MAPPING') {
    return (
      <>
        <span className={HtmlClass.CSS_WHEN}>{metadata.operator!.readable}</span>
        <ul className={HtmlClass.CSS_UL_WHEN}>
          <GetHtml metadata={metadata.children!()[0]} parent={metadata} />
        </ul>
      </>
    );
  } else {
    return (
      <>
        <span className={HtmlClass.CSS_WHEN}>{metadata.operator!.readable}</span>
        <ul className={HtmlClass.CSS_UL_WHEN}>
          <GetHtml metadata={metadata.children!()[0]} parent={metadata} />
        </ul>
        <span className={HtmlClass.CSS_VALIDATE}>{VALIDATE.readable}</span>
      </>
    );
  }
};

const PrefixUnary = (props: HtmlProps) => {
  const { metadata } = props;
  return (
    <>
      <span className={HtmlClass.CSS_OPERATOR}>{metadata.operator!.readable}</span>
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
      <span className={HtmlClass.CSS_OPERATOR}>{metadata.operator!.readable}</span>
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
  } else if ((pmdOp !== AND || pmdOp !== OR) && op === NOT) {
    return (
      <li className={HtmlClass.CSS_LI_UNARY}>
        <PrefixUnary metadata={metadata} />
      </li>
    );
  } else if (pmdType === 'NARY') {
    return (
      <li className={HtmlClass.CSS_LI_LEAF}>
        <PostfixUnary metadata={metadata} />
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
  const op = metadata.operator as OperatorReturnType;
  const pmdOp = parent ? parent.operator : null;
  const pmdType = parent ? parent.type : null;
  const isLeftChild = parent ? parent.children!()[0] === metadata : false;
  //const parentClone = [...(props.parent as Metadata[])];
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
  const { metadata, parent } = props;
  const mdType = metadata.type;
  const pmdType = parent ? parent!.type : undefined;
  let res;
  switch (mdType) {
    case 'VALUE':
      res = <span className={HtmlClass.CSS_VALUE}>{props.metadata.readable}</span>;
      break;
    case 'FIELD':
      res = <span className={HtmlClass.CSS_FIELD}>{props.metadata.readable}</span>;
      break;
    case 'FUNCTION':
      if (metadata.operator) res = <span className={HtmlClass.CSS_OPERATOR}>{metadata.operator!.readable}</span>;
      else res = <span className={HtmlClass.CSS_OPERATOR}>{metadata.readable}</span>;
      break;
    default:
      res = <span>TO WORK ON</span>;
  }
  if (pmdType === 'NARY') {
    return <li className={HtmlClass.CSS_LI_LEAF}>{res}</li>;
  } else {
    return res;
  }
};

/*const Function = (props: { metadata: Metadata }) => {
  let { metadata } = props; // is it css_value or css_operator ?
  if (metadata.operator) return <span className={HtmlClass.CSS_OPERATOR}>{props.metadata.operator!.readable}</span>;
  else return <span className={HtmlClass.CSS_OPERATOR}>{props.metadata.readable}</span>;
};*/

const Nary = (props: HtmlProps) => {
  const { metadata, parent } = props;
  //const pmdType = parent ? parent.type : undefined;
  const pmdRT = parent ? (parent.operator as OperatorReturnType).returnType : undefined;
  const childComponents = metadata.children!().map((e, index) => (
    <GetHtml key={index} metadata={e} parent={metadata} />
  ));
  if (pmdRT === 'BOOL') {
    return (
      <>
        <span className={HtmlClass.CSS_NARY}>{metadata.operator!.readable}</span>
        <ol className={HtmlClass.CSS_OL_NARY}>{childComponents}</ol>
      </>
    );
  } else {
    // d'autres cas sont à ajouter
    return (
      <>
        <li className={HtmlClass.CSS_LI_NARY}>
          <span className={HtmlClass.CSS_NARY}>{metadata.operator!.readable}</span>
          <ol className={HtmlClass.CSS_OL_NARY}>{childComponents}</ol>
        </li>
      </>
    );
  }
};

const TypeConverter = (props: HtmlProps) => {
  const { metadata } = props;
  metadata as TypeConverterMetadata;
  return (
    <>
      &nbsp;
      <span className={HtmlClass.CSS_TYPE_CONVERTER}>
        <span className={HtmlClass.CSS_OPERATOR}>{USING.readable}</span>
        &nbps;
        <span className={HtmlClass.CSS_VALUE}>&apos;{metadata.readable}&apos;</span>
      </span>
    </>
  );
};

export const GetHtml = (props: HtmlProps) => {
  let res = <br />;
  const { metadata, parent } = props;
  switch (metadata.type) {
    case 'UNARY':
      return <Unary metadata={metadata} parent={parent} />;
    case 'BINARY':
      return <Binary metadata={metadata} parent={parent} />;
    case 'NARY':
    case 'MULTIPLE_MAPPING':
    case 'CONDITIONAL_MAPPING':
      return <Nary metadata={metadata} parent={parent} />;
    case 'WHEN':
      return <When metadata={metadata} parent={parent} />;
    case 'VALUE':
    case 'FIELD':
    case 'FUNCTION':
      return <Leaf metadata={metadata} parent={parent} />;
    case 'ITERABLE_VALUE':
      res = <br />;
      break;
    case 'ITERABLE':
      res = <br />;
      break;
    case 'SINGLE_MAPPING':
      res = <br />;
      break;
    case 'TYPE_CONVERTER':
      return <TypeConverter metadata={metadata} />;
    case 'VALIDATION':
    case 'MULTIPLE_VALIDATIONS':
      res = <br />; // vérifier si c'est bien le même case
      break;
  }
  //parent.pop();
  return res;
};
