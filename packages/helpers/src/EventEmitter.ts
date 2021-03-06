import throttle from './throttle';

export default class EventEmitter {
  private cbs: { [key: string]: ((data?: unknown) => unknown)[] } = {};
  private cbsOnce: { [key: string]: ((data?: unknown) => unknown)[] } = {};

  /**
   * Emit an event with optional data to all the listeners
   * @param {string} event Name of the event to emit
   * @param data Data to send along
   */
  public emit(event: string, data?: unknown) {
    if (event in this.cbs) {
      this.cbs[event].forEach((c) => c(data));
    }
    if (event in this.cbsOnce) {
      this.cbsOnce[event].forEach((c) => c(data));
      delete this.cbsOnce[event];
    }
  }

  /**
   * Register a new listener on the EventEmitter
   * @param {string} event Name of the event to listen to
   * @param {function} cb Listener, gets called everytime the event is emitted
   * @param {number} [throttleTimer=0] The listener can be throttled
   * @returns {function} Returns a function which removes the listener when called
   */
  public on(event: string, cb: (data?: unknown) => unknown, throttleTimer = 0) {
    if (throttleTimer > 0) cb = throttle(cb, throttleTimer);
    const cbs = Object.assign(this.cbs, {
      [event]: [...(this.cbs[event] || []), cb],
    });
    this.cbs = cbs;
    return () => {
      cbs[event].splice(cbs[event].indexOf(cb), 1);
    };
  }

  /**
   * Register a special listener which only gets called once
   * @param {string} event Name of the event to listen to
   * @param {function} cb Listener, gets called everytime the event is emitted
   * @returns {function} Returns a function which removes the listener when called
   */
  public once(event: string, cb: (data: unknown) => unknown) {
    this.cbsOnce[event] = [...(this.cbsOnce[event] || []), cb];
    return () => {
      this.cbsOnce[event].splice(this.cbsOnce[event].indexOf(cb), 1);
    };
  }
}
