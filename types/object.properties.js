module.exports = {
  name: 'object.properties',
  extends: 'array',
  schema: [
    {
      key: 'ofType',
      type: 'ref.type',
      description: '"object.properties" is an array of "object.property" items',
      defaultValue: 'object.property'
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
