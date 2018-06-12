module.exports = {
  name: 'object.property',
  identifier: 'key',
  schema: [
    {
      key: 'key',
      type: 'string',
      description: 'the name of this property',
      isRequired: true,
      defaultValue: ''
    },{
      key: 'type',
      type: 'object.property.type',
      description: 'the type of this property',
      isRequired: true,
      defaultValue: 'boolean'
    },{
      key: 'description',
      type: 'string',
      description: 'the description of this property',
      defaultValue: 'No description'
    },{
      key: 'value',
      type: 'value',
      description: 'the value for this property',
      defaultValue: true
    }
  ],
  build(object, done){
     var core = this;
     core.buildObject(object, function(built){
       done(built.properties || {});
     });
  },
  defaultValue: {}
};
