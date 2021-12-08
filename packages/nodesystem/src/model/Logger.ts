/* eslint-disable no-console */
import { logger } from '@plantarium/helpers';
import type { NodeSystem } from '..';

let longestModuleName = 0;
class DummyClass {
  system: NodeSystem;
}

export default class Logger {
  module: unknown;
  name: string;
  level: number;
  length: number;
  isGrouped = false;
  output: ReturnType<typeof logger> = logger('logger');
  constructor(
    module: DummyClass | NodeSystem | object,
    logLevel: number = 'system' in module ? module.system.log.level : 2,
  ) {
    this.module = module;
    this.name = module.constructor.name;
    this.length = this.name.length;
    longestModuleName = Math.max(longestModuleName, this.length);
    this.level = logLevel;
    this.output = logger(this.getModuleName());
  }

  private getModuleName() {
    return this.isGrouped ? '' : `${this.name.padEnd(longestModuleName, ' ')}`;
  }

  private handle(
    func: (...args: unknown[]) => void,
    message: unknown,
    args?: unknown[],
  ) {
    if (args && args.length) {
      // tslint:disable-next-line
      console.groupCollapsed(`${this.getModuleName()} ${message}`);
      func(...args);
      // tslint:disable-next-line
      console.groupEnd();
    } else {
      func(`${this.getModuleName()} ${message}`);
    }
  }

  // level: 3
  info(message: unknown, ...args: unknown[]): void {
    if (this.level >= 3) {
      this.output(message, ...args);
    }
  }
  // level: 2
  log(message: string | unknown, ...args: unknown[]): void {
    if (this.level >= 2) {
      this.output(message, ...args);
    }
  }
  // level: 1
  warn(message: string | unknown, ...args: unknown[]): void {
    if (this.level >= 1) {
      this.output.warn(message, ...args);
    }
  }
  // level: 0
  error(message: Error, ...args: unknown[]) {
    if (this.level >= 0) {
      this.output.error(message);
      this.output(...args);
    }
  }

  group(message: string) {
    this.output.group(message);
    this.isGrouped = true;
  }

  groupEnd() {
    // tslint:disable-next-line
    console.groupEnd();
    this.isGrouped = false;
  }
}
