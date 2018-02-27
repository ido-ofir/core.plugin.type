module.exports = {
  name: 'object',
  identifier: 'name',
  schema: [
    {
      key: 'name',
      type: 'string',
      description: 'a unique name for this object'
    },
    {
      key: 'description',
      type: 'string',
      description: 'describes the purpose of this object'
    },
    {
      key: 'ofType',
      type: 'string',
      description: 'the type of the items in this object'
    },
    {
      key: 'properties',
      type: 'object',
      description: 'the properties of the object'
    }
  ],
  build(object, done){
    done(object.properties);
  },
  getDefaultValue(){
    return {};
  }
};
