import { test, expect } from 'vitest';
import EventEmitter from '../src/EventEmitter';

test('instantiates', () => {
  const e = new EventEmitter();
  expect(e).toBeTruthy();
});

test('listener works', () => {
  let wasCalled = false;

  const e = new EventEmitter();

  e.on('test', () => {
    wasCalled = true;
  });

  e.emit('test');

  expect(wasCalled).toBeTruthy();
});

test('emitting with data works', () => {
  const e = new EventEmitter();

  e.on('test', (data: string) => {
    expect(data).toBe('send_data');
  });

  e.emit('test', 'send_data');
});

test('emitting once with data works', () => {
  const e = new EventEmitter();

  e.once('test', (data: string) => {
    expect(data, 'send_data_first');
  });

  e.emit('test', 'send_data_first');
  e.emit('test', 'send_data_second');
});

test('removing listeners works', () => {
  const e = new EventEmitter();

  const removeListener = e.on('test', (data: string) => {
    expect(data).toBe('send_data_first');
  });

  e.emit('test', 'send_data_first');
  removeListener();
  e.emit('test', 'send_data_second');
});
