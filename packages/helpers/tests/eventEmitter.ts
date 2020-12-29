import { test } from 'uvu';
import * as assert from 'uvu/assert';
import EventEmitter from '../src/EventEmitter';

test('instantiates', () => {
  const e = new EventEmitter();
  assert.ok(e);
});

test('listener works', () => {
  let wasCalled = false;

  const e = new EventEmitter();

  e.on('test', () => {
    wasCalled = true;
  });

  e.emit('test');

  assert.equal(wasCalled, true);
});

test('emitting with data works', () => {
  let receivedData = 'false';

  const e = new EventEmitter();

  e.on('test', (data) => {
    receivedData = data;
  });

  e.emit('test', 'send_data');

  assert.equal(receivedData, 'send_data');
});

test('emitting once with data works', () => {
  let receivedData = 'false';

  const e = new EventEmitter();

  e.once('test', (data) => {
    receivedData = data;
  });

  e.emit('test', 'send_data_first');
  e.emit('test', 'send_data_second');

  assert.equal(receivedData, 'send_data_first');
});

test('removing listeners works', () => {
  let receivedData = 'false';

  const e = new EventEmitter();

  const removeListener = e.on('test', (data) => {
    receivedData = data;
  });

  e.emit('test', 'send_data_first');
  removeListener();
  e.emit('test', 'send_data_second');

  assert.equal(receivedData, 'send_data_first');
});

test.run();
