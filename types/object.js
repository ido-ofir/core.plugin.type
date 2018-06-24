module.exports = {
  name: 'object',
  schema: [
    {
      key: 'ofType',
      type: 'ref.type',
      description: 'the type of the properties of this object',
      defaultValue: ''
    },
    {
      key: 'properties',
      type: 'schema',
      description: 'the properties of the object',
      defaultValue: []
    }
  ],
  build(object, done){
     var core = this;
     core.type.buildObject(object, function(built){
       done(built.properties || {});
     });
  },
  defaultValue: {}
};
