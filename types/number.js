module.exports = {
  name: 'number',
  schema: [
    {
      key: 'value',
      type: 'number',
      description: 'the numeric value of this property',
      defaultValue: 0
    }
  ],
  validate(value, core){
    return core.isNumber(value);
  },
  build(def, done){
    return done(Number(def && def.value));
  },
  defaultValue: 1
};
