class cl { }


export default (baseClass: new (...args: unknown[]) => typeof cl, ...mixins: typeof cl[]) => {
  const copyProps = (target: unknown, source: unknown) => {
    // this function copies all properties and symbols, filtering out some special ones
    Object.getOwnPropertyNames(source)
      .concat(Object.getOwnPropertySymbols(source).map((s) => s.toString()))
      .forEach((prop) => {
        if (
          !prop.match(
            /^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/,
          )
        )
          Object.defineProperty(
            target,
            prop,
            Object.getOwnPropertyDescriptor(source, prop),
          );
      });
  };
  const base = class Base extends baseClass {
    constructor(...args: unknown[]) {
      super(...args);
      mixins.forEach((mixin) => copyProps(this, new mixin()));
    }
  };
  mixins.forEach((mixin) => {
    // outside contructor() to allow aggregation(A,B,C).staticFunction() to be called etc.
    copyProps(base.prototype, mixin.prototype);
    copyProps(base, mixin);
  });
  return base;
};
