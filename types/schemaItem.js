

module.exports = {
  name: 'schemaItem',
  schema: [
    {
      key: 'key',
      type: 'string',
      description: 'the name of this property',
      isRequired: true,
      defaultValue: ''
    },{
      key: 'type',
      type: 'type',
      description: 'the type of this property',
      isRequired: true,
      defaultValue: 'boolean'
    },{
      key: 'description',
      type: 'string',
      description: 'the description of this property',
      defaultValue: ''
    },{
      key: 'isRequired',
      type: 'boolean',
      description: 'should this property be required?',
      defaultValue: false
    },{
      key: 'defaultValue',
      type: 'any',
      description: 'initial value for this property',
      defaultValue: null
    },{
      key: 'params',
      type: 'object',
      description: 'a parameters data object for the selected type',
      defaultValue: null
    }
  ],
  build(def, done){
    done(def.defaultValue);
  }
};
