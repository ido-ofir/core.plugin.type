module.exports = {
  name: 'number',
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
      type: 'number',
      description: 'the numeric value of this property'
    }
  ],
  validate(value, core){
    return core.isNumber(value);
  },
  build(def){
    return Number(def && def.value);
  },
  getDefaultValue(){
    return 1;
  }
};
