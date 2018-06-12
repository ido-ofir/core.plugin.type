module.exports = {
  name: 'boolean',
  identifier: 'name',
  displayField: 'name',
  schema: [
    {
      key: 'value',
      type: 'boolean',
      description: 'the boolean value of this property',
      defaultValue: true
    }
  ],
  validate(value, core){
    return core.isBoolean(value);
  },
  build(def, done){
    done(Boolean(def && def.value));
  },
  defaultValue: true
};
