module.exports = {
  name: 'keyValue',
  displayField: 'key',
  schema: [
    {
      key: 'key',
      type: 'string',
      isRequired: true,
      defaultValue: 'key'
    },
    {
      key: 'value',
      type: 'any',
      defaultValue: ''
    }
  ],
  build(def){
    return def;
  }
};
