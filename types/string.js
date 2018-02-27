module.exports = {
  name: 'string',
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
      type: 'string',
      description: 'the string value of this property'
    }
  ],
  validate(value, core){
    return core.isString(value);
  },
  build(def){
    return String(def && def.value);
  },
  getDefaultValue(core){
    return '';
  }
};
