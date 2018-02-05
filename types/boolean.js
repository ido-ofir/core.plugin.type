module.exports = {
  name: 'boolean',
  identifier: 'name',
  schema: [
    {
      key: 'name',
      type: 'string',
      description: 'a unique name for this property'
    },
    {
      key: 'description',
      type: 'string',
      description: 'describes the meaning of this property'
    },
    {
      key: 'value',
      type: 'boolean',
      description: 'the boolean value of this property'
    }
  ],
  validate(value, core){
    return core.isBoolean(value);
  },
  build(def){
    return Boolean(def && def.value);
  }
};
