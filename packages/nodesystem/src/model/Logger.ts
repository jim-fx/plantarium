import type { NodeSystem } from '..';

let longestModuleName = 0;
class dummyClass {
  system: NodeSystem;
}

export default class Logger {
  module: unknown;
  name: string;
  level: number;
  length: number;
  isGrouped = false;
  constructor(
    module: dummyClass | NodeSystem,
    logLevel: number = 'system' in module ? module.system.log.level : 2,
  ) {
    this.module = module;
    this.name = module.constructor.name;
    this.length = this.name.length;
    longestModuleName = Math.max(longestModuleName, this.length);
    this.level = logLevel;
  }

  private getModuleName() {
    return this.isGrouped
      ? ''
      : `[${this.name.padEnd(longestModuleName, ' ')}]:`;
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
      // tslint:disable-next-line
      this.handle(console.info, message, args);
    }
  }
  // level: 2
  log(message: string | unknown, ...args: unknown[]): void {
    if (this.level >= 2) {
      // tslint:disable-next-line
      this.handle(console.log, message, args);
    }
  }
  // level: 1
  warn(message: string | unknown, ...args: unknown[]): void {
    if (this.level >= 1) {
      // tslint:disable-next-line
      this.handle(console.warn, message, args);
    }
  }
  // level: 0
  error(message: string | unknown, ...args: unknown[]) {
    if (this.level >= 0) {
      // tslint:disable-next-line
      this.handle(console.error, message, args);
    }
  }

  group(message: string) {
    // tslint:disable-next-line
    if (this.level >= 0) {
      // tslint:disable-next-line
      this.handle(console.groupCollapsed, message);
      this.isGrouped = true;
    }
  }

  groupEnd() {
    // tslint:disable-next-line
    console.groupEnd();
    this.isGrouped = false;
  }
}
