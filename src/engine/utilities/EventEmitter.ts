/* eslint-disable @typescript-eslint/ban-types */

/**
 * A simple event emitter class that allows functions to listen for events
 */
export class EventEmitter {
  private listeners: { [key: string]: Function[] } = {};

  protected listenerCount(event: string) {
    return this.listeners[event] ? this.listeners[event].length : 0;
  }

  public on(event: string, listener: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(listener);

    return () => this.off(event, listener);
  }

  public off(event: string, listener: Function) {
    if (!this.listeners[event]) {
      return;
    }

    const index = this.listeners[event].indexOf(listener);

    if (index === -1) {
      return;
    }

    this.listeners[event].splice(index, 1);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public emit(event: string, ...args: any[]) {
    if (!this.listeners[event]) {
      return;
    }

    this.listeners[event].forEach((listener) => listener(...args));
  }
}
