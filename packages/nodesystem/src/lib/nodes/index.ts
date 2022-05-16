import BooleanNode from './Boolean';
import MathNode from './Math';
import NumberNode from './Number';
import DebugNode from './Debug';
import OutputNode from './Output';
import type NodeType from '../model/NodeType';
import type { NodeTypeData } from '../types';

const types: { [name: string]: NodeType | NodeTypeData } = {
  BooleanNode,
  MathNode,
  NumberNode,
  DebugNode,
  OutputNode,
};

export default types;
