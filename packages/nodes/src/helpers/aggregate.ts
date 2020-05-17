export default (baseClass: any, ...mixins: any) => {
  const base = class Base extends baseClass {
    constructor(...args: any) {
      super(...args);
      mixins.forEach((mixin: any) => copyProps(this, new mixin()));
    }
  };
  const copyProps = (target: any, source: any) => {
    // this function copies all properties and symbols, filtering out some special ones
    Object.getOwnPropertyNames(source)
      // @ts-ignore this is dark magic
      .concat(Object.getOwnPropertySymbols(source))
      .forEach((prop: any) => {
        if (
          !prop.match(
            /^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/,
          )
        )
          Object.defineProperty(
            target,
            prop,
            // @ts-ignore this is dark magic
            Object.getOwnPropertyDescriptor(source, prop),
          );
      });
  };
  mixins.forEach((mixin: any) => {
    // outside contructor() to allow aggregation(A,B,C).staticFunction() to be called etc.
    copyProps(base.prototype, mixin.prototype);
    copyProps(base, mixin);
  });
  return base;
};
