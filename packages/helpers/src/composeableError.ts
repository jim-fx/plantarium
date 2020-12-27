export default class ComposableError extends Error {
  detail: unknown;
  meta: Record<string, unknown>;

  constructor(message, meta = {}) {
    super(message);
    this.detail = message;
    this.meta = meta;
  }
  static fromParent(parentError, code, message, meta) {
    return new ComposableError(
      message,
      Object.assign({ cause: parentError }, meta),
    );
  }
  getCause() {
    return this.meta.cause || undefined;
  }

  public unwrapChain(err = this) {
    return ComposableError.unwrapChain(err);
  }

  static unwrapChain = (err) => {
    const chain = [err];
    let nextError = err.getCause();
    while (nextError) {
      chain.push(nextError);
      nextError = nextError.getCause();
    }
    return chain;
  };
}
